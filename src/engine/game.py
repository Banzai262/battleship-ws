from enum import Enum

from src.engine.board import Board
from src.engine.errors import PlayerAlreadyExists, PlayerCountError, WrongPhase, TurnError, MissingPlayer
from src.engine.ships import Coordinate, Ship
from src.engine.shot import ShotResult, ShotOutcome


class GamePhase(Enum):
    SETUP = "setup"
    IN_PROGRESS = "in_progress"
    FINISHED = "finished"


# Alias so that we know what the string represents
PlayerId = str

"""
This class coordinates the players, their board, the turns, and the win condition

It is UI-agnostic
"""


class Game:
    def __init__(self, size: int = 10):
        self.size = size
        self.boards: dict[PlayerId, Board] = {}
        self.phase = GamePhase.SETUP
        self.current_turn: PlayerId | None = None
        self.winner: PlayerId | None = None

    def add_player(self, player_id: PlayerId):
        if self.phase != GamePhase.SETUP:
            raise WrongPhase("Cannot add players after game start")

        if player_id in self.boards:
            raise PlayerAlreadyExists(f"Player {player_id} already exists")

        if len(self.boards) >= 2:
            raise PlayerCountError("Game already has two players")

        self.boards[player_id] = Board(self.size)

    def place_ship(self, player_id: PlayerId, ship: Ship, start: Coordinate, horizontal: bool, ):
        if self.phase != GamePhase.SETUP:
            raise WrongPhase("Cannot place ships after game start")

        self.boards[player_id].place_ship(ship, start, horizontal)

    def start(self, first_player: PlayerId):
        if self.phase != GamePhase.SETUP:
            raise WrongPhase("Game already started")

        if len(self.boards) != 2:
            raise PlayerCountError("Game needs two players")

        if first_player not in self.boards:
            raise MissingPlayer("Invalid starting player")

        self.phase = GamePhase.IN_PROGRESS
        self.current_turn = first_player

    def fire(self, player_id: PlayerId, coord: Coordinate) -> ShotResult:
        if self.phase != GamePhase.IN_PROGRESS:
            raise WrongPhase("Game is not in progress")

        if player_id != self.current_turn:
            raise TurnError("Not your turn")

        opponent = self._get_opponent(player_id)
        board = self.boards[opponent]

        result = board.receive_fire(coord)

        if result.outcome == ShotOutcome.SUNK:
            self._check_win(opponent)

        if self.phase != GamePhase.FINISHED:
            self.current_turn = opponent

        return result

    def get_view(self, player_id: PlayerId) -> dict:
        opponent = self._get_opponent(player_id)

        return {
            "phase": self.phase.value,
            "your_turn": self.current_turn == player_id,
            "winner": self.winner,
            "your_board": self.boards[player_id].render(reveal_ships=True),
            "enemy_board": self.boards[opponent].render(reveal_ships=False),
        }

    def _check_win(self, defending_player: PlayerId):
        board = self.boards[defending_player]

        if board.all_ships_sunk():
            self.phase = GamePhase.FINISHED
            self.winner = self._get_opponent(defending_player)

    def _get_opponent(self, player_id: PlayerId) -> PlayerId:
        for pid in self.boards.keys():
            if pid != player_id:
                return pid
        raise TurnError("Opponent not found")

