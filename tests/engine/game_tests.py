import unittest

from src.engine.errors import WrongPhase, PlayerAlreadyExists, PlayerCountError, MissingPlayer, TurnError
from src.engine.game import Game, GamePhase
from src.engine.ships import Ship
from src.engine.shot import ShotResult, ShotOutcome


class TestAddPlayer(unittest.TestCase):
    def test_add_player_when_incorrect_phase(self):
        with self.assertRaises(WrongPhase):
            game = Game()
            game.phase = GamePhase.IN_PROGRESS
            game.add_player("test")

    def test_add_player_with_existing_id(self):
        with self.assertRaises(PlayerAlreadyExists):
            game = Game()
            game.add_player("test")
            game.add_player("test")

    def test_add_more_than_two_players(self):
        with self.assertRaises(PlayerCountError):
            game = Game()
            game.add_player("test1")
            game.add_player("test2")
            game.add_player("test3")

    def test_add_player(self):
        game = Game()
        game.add_player("test")

        assert "test" in game.boards.keys()
        assert len(game.boards) == 1


class TestPlaceShip(unittest.TestCase):
    def test_place_ship_when_incorrect_phase(self):
        with self.assertRaises(WrongPhase):
            game = Game()
            game.add_player("test")

            game.phase = GamePhase.IN_PROGRESS
            game.place_ship("test", Ship("One", 2), (0, 0), True)

    def test_place_ship(self):
        game = Game()
        game.add_player("test")
        game.place_ship("test", Ship("One", 1), (0, 0), True)
        assert (0, 0) in game.boards["test"].occupied


class TestStart(unittest.TestCase):
    def test_start_when_incorrect_phase_should_raise(self):
        with self.assertRaises(WrongPhase):
            game = Game()
            game.phase = GamePhase.IN_PROGRESS
            game.start("test")

    def test_start_when_not_two_players_should_raise(self):
        with self.assertRaises(PlayerCountError):
            game = Game()
            game.add_player("test")
            game.start("test")

    def test_start_when_absent_player_should_raise(self):
        with self.assertRaises(MissingPlayer):
            game = Game()
            game.add_player("present")
            game.add_player("present2")
            game.start("absent")

    def test_start(self):
        game = Game()
        game.add_player("1")
        game.add_player("2")
        game.start("1")

        assert game.phase == GamePhase.IN_PROGRESS
        assert game.current_turn == "1"


class TestFire(unittest.TestCase):
    def test_fire_when_incorrect_phase_should_raise(self):
        with self.assertRaises(WrongPhase):
            game = _setup_game()
            game.phase = GamePhase.SETUP
            game.fire("p1", (0, 0))

    def test_fire_when_not_player_turn_should_raise(self):
        with self.assertRaises(TurnError):
            game = _setup_game()
            game.fire("p2", (0, 0))

    def test_turn_switching(self):
        game = _setup_game(start_game=False)

        destroyer = game.boards["p1"].get_ship_by_name("destroyer")
        cruiser = game.boards["p2"].get_ship_by_name("cruiser")
        game.place_ship("p1", destroyer, (0, 0), True)
        game.place_ship("p2", cruiser, (1, 1), False)

        game.start("p1")

        result = game.fire("p1", (1, 1))
        assert result.outcome == ShotOutcome.HIT
        assert game.current_turn == "p2"
        assert game.phase == GamePhase.IN_PROGRESS

    def test_win_condition(self):
        game = _setup_game(start_game=False)
        game.boards["p1"].ships = [game.boards["p1"].get_ship_by_name("cruiser")]
        game.boards["p2"].ships = [game.boards["p2"].get_ship_by_name("destroyer")]

        cruiser = game.boards["p1"].get_ship_by_name("cruiser")
        destroyer = game.boards["p2"].get_ship_by_name("destroyer")

        game.place_ship("p1", cruiser, (0, 0), True)
        game.place_ship("p2", destroyer, (1, 1), False)

        game.start("p1")

        result = game.fire("p1", (1, 1))
        assert result.outcome == ShotOutcome.HIT

        game.fire("p2", (0, 0))
        result = game.fire("p1", (2, 1))
        assert result.outcome == ShotOutcome.SUNK

        assert game.phase == GamePhase.FINISHED


def _setup_game(start_game=True) -> Game:
    game = Game()
    game.add_player("p1")
    game.add_player("p2")
    if start_game:
        game.start("p1")
    return game


if __name__ == "__main__":
    unittest.main()
