import random
from enum import Enum

from src.commands.command_handler import CommandHandler
from src.commands.commands import Command, PlaceShipCommand, StartGameCommand, FireCommand
from src.engine.errors import PlayerCountError, TurnError
from src.engine.game import PlayerId, Game, GamePhase

"""
This class orchestrates player state and game flow.
"""


class PlayerState(Enum):
    PLACING_SHIPS = "placing_ships"
    WAITING = "waiting"
    YOUR_TURN = "your_turn"
    GAME_OVER = "game_over"


class GameSession:
    def __init__(self):
        self.game = Game()
        self.handler = CommandHandler(self.game)
        self.players: list[PlayerId] = []
        self.ready: set[PlayerId] = set()

    def join(self, player_id: PlayerId) -> dict:
        if player_id in self.players:
            return {"status": "ok", "message": f"Player {player_id} already joined"}

        if len(self.players) >= 2:
            raise PlayerCountError("Two players have already joined")

        self.players.append(player_id)
        self.game.add_player(player_id)

        return {
            "status": "ok",
            "message": f"Joined as {player_id}",
        }

    def handle_command(self, player_id: PlayerId, command: Command) -> dict:
        phase = self.game.phase

        try:
            if phase == GamePhase.SETUP:
                return self._handle_setup(player_id, command)

            if phase == GamePhase.IN_PROGRESS:
                return self._handle_play(player_id, command)

            return {"status": "error", "message": "Game is finished"}

        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }

    def get_prompt(self, player_id: PlayerId) -> str:
        match self.game.phase:
            case GamePhase.SETUP:
                return "Place your ships"

            case GamePhase.IN_PROGRESS:
                if self.game.current_turn == player_id:
                    return "Your turn"
                return "Waiting for opponent"

            case GamePhase.FINISHED:
                if self.game.winner == player_id:
                    return "Congrats, you won!"
                return "You lost"

    def get_view(self, player_id: PlayerId) -> dict:
        return self.game.get_view(player_id)

    def get_ship_status(self, player_id: PlayerId) -> list:
        return self.game.get_ship_status(player_id)

    def _handle_setup(self, player_id: PlayerId, command: Command):
        if not isinstance(command, PlaceShipCommand):
            return {"status": "error", "message": "You must place ships first"}

        result = self.handler.execute(player_id, command)

        if self.game.boards[player_id].all_ships_placed():
            self.ready.add(player_id)

        if len(self.ready) == 2:
            # start the game with a random player going first
            return self.handler.execute(random.choice(self.players), StartGameCommand())

        return result

    def _handle_play(self, player_id: PlayerId, command: Command) -> dict:
        if not isinstance(command, FireCommand):
            return {"status": "error", "message": "Invalid command"}   # todo raise?

        if self.game.current_turn != player_id:
            raise TurnError(f"It is not your turn, player {player_id}")

        result = self.handler.execute(player_id, command)

        return {
            "status": "ok",
            "result": result["result"],
            "winner": self.game.winner,
            "game_over": self.game.phase == GamePhase.FINISHED,
        }
