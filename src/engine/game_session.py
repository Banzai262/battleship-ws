import asyncio
import random
import time
from enum import Enum

from fastapi import WebSocket
from src.commands.command_handler import CommandHandler
from src.commands.commands import Command, PlaceShipCommand, StartGameCommand, FireCommand
from src.engine.errors import PlayerCountError, TurnError
from src.engine.game import PlayerId, Game, GamePhase, GameEvent

"""
This class orchestrates player state and game flow.
"""


class PlayerState(Enum):
    PLACING_SHIPS = "placing_ships"
    WAITING = "waiting"
    YOUR_TURN = "your_turn"
    GAME_OVER = "game_over"


SETUP_TIMEOUT = 5 * 60  # 5 minutes
INACTIVE_TIMEOUT = 15 * 60  # 15 minutes


class GameSession:
    def __init__(self, dev=False):
        self.game = Game(dev=dev)
        self.handler = CommandHandler(self.game)
        self.players: list[PlayerId] = []
        self.ready: set[PlayerId] = set()
        self.connections: dict[PlayerId, WebSocket] = {}
        self.connected: set[PlayerId] = set()
        self.last_activity = time.time()
        self.ready_event = asyncio.Event()
        self.game_phase_at_disconnect = GamePhase.WAITING_PLAYERS

    async def join(self, player_id: PlayerId) -> dict:
        if player_id in self.players:
            if player_id not in self.connected:
                # reconnection
                self.connected.add(player_id)
                self.game.phase = self.game_phase_at_disconnect
                self.stamp()
                return {"status": "ok", "reconnected": True}
            return {"status": "error", "message": f"Player {player_id} already joined"}

        if len(self.players) >= 2:
            raise PlayerCountError("Two players have already joined")

        self.stamp()
        self.players.append(player_id)
        self.game.add_player(player_id)

        if self.is_ready():
            self.game.phase = GamePhase.SETUP
            # TODO pas au bon endroit
            await self.game.events.put({
                "type": GameEvent.PHASE_CHANGED,
                "message": "All players joined. Time to place your ships"
            })

        return {
            "status": "ok",
            "message": f"Joined as {player_id}",
        }

    async def handle_command(self, player_id: PlayerId, command: Command) -> dict:
        phase = self.game.phase
        self.stamp()

        try:
            if phase == GamePhase.SETUP:
                return await self._handle_setup(player_id, command)

            if phase == GamePhase.IN_PROGRESS:
                return await self._handle_play(player_id, command)

            return {"status": "error", "message": "Game is finished"}

        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }

    def handle_disconnect(self, player_id: PlayerId):
        self.connected.discard(player_id)
        del self.connections[player_id]
        self.game_phase_at_disconnect = self.game.phase
        self.game.phase = GamePhase.WAITING_PLAYERS

    async def disconnect_all(self, reason):
        for ws in list(self.connections.values()):
            await ws.close(reason=reason)

    def get_prompt(self, player_id: PlayerId) -> str:
        match self.game.phase:
            case GamePhase.SETUP:
                if self.game.boards[player_id].all_ships_placed():
                    return "Waiting for opponent to place their ships"
                return "Place your ships"

            case GamePhase.IN_PROGRESS:
                if self.game.current_turn == player_id:
                    return "Your turn"
                return "Waiting for opponent"

            case GamePhase.FINISHED:
                if self.game.winner == player_id:
                    return "Congrats, you won!"
                return "You lost"

    def stamp(self):
        self.last_activity = time.time()

    def is_expired(self) -> bool:
        now = time.time()

        if self.game.phase == GamePhase.WAITING_PLAYERS or self.game.phase == GamePhase.SETUP:
            return now - self.last_activity > SETUP_TIMEOUT

        return now - self.last_activity > INACTIVE_TIMEOUT

    async def broadcast(self, message: str):
        dead = []

        for player_id, ws in self.connections.items():
            try:
                await ws.send_text(message)
            except Exception:
                dead.append(player_id)

        for player_id in dead:
            del self.connections[player_id]

    async def broadcast_events(self):
        while not self.game.events.empty():
            event = await self.game.events.get()
            await self.broadcast(event["message"])

    def get_view(self, player_id: PlayerId) -> dict:
        return self.game.get_view(player_id)

    def get_ship_status(self, player_id: PlayerId) -> list:
        return self.game.get_ship_status(player_id)

    def is_ready(self) -> bool:
        return len(self.players) == 2

    async def _handle_setup(self, player_id: PlayerId, command: Command):
        if not isinstance(command, PlaceShipCommand):
            return {"status": "error", "message": "You must place ships first"}

        result = await self.handler.execute(player_id, command)

        if self.game.boards[player_id].all_ships_placed():
            await self.game.events.put({
                "type": GameEvent.SHIPS_PLACED,
                "message": f"{player_id} has placed all their ships"
            })
            self.ready.add(player_id)

        if len(self.ready) == 2:
            # start the game with a random player going first
            return await self.handler.execute(random.choice(self.players), StartGameCommand())

        return result

    async def _handle_play(self, player_id: PlayerId, command: Command) -> dict:
        if not isinstance(command, FireCommand):
            return {"status": "error", "message": "Invalid command"}  # todo raise?

        if self.game.current_turn != player_id:
            raise TurnError(f"It is not your turn, player {player_id}")

        result = await self.handler.execute(player_id, command)

        row, col = command.coord
        await self.game.events.put({
            "type": GameEvent.SHOT_RESULT,
            "message": f"{player_id} fired at {row}, {col}. Result is {result['result']}"
        })

        if self.game.phase != GamePhase.FINISHED:
            await self.game.events.put({
                "type": GameEvent.TURN_CHANGED,
                "message": f"{self.game.current_turn}, it's your turn now"
            })
        else:
            await self.game.events.put({
                "type": GameEvent.GAME_WON,
                "message": f"Player {self.game.winner} has won the game!"
            })

        return {
            "status": "ok",
            "result": result["result"],
            "winner": self.game.winner,
            "game_over": self.game.phase == GamePhase.FINISHED,
        }
