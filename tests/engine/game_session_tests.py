import unittest

from src.commands.commands import PlaceShipCommand, FireCommand
from src.engine.errors import PlayerCountError, TurnError
from src.engine.game import GamePhase, PlayerId
from src.engine.game_session import GameSession
from src.engine.ships import standard_ships


class TestJoin(unittest.TestCase):
    def test_cannot_join_two_times(self):
        session = GameSession()
        session.join("player")

        assert len(session.players) == 1
        assert "player" in session.players

        result = session.join("player")

        assert len(session.players) == 1
        assert result["message"] == "Player player already joined"

    def test_cannot_join_more_than_two_players(self):
        with self.assertRaises(PlayerCountError):
            session = GameSession()
            session.join("player1")
            session.join("player2")
            session.join("player3")

    def test_join(self):
        session = GameSession()
        session.join("player1")
        session.join("player2")

        assert len(session.players) == 2
        assert "player1" in session.players
        assert "player2" in session.players


class TestHandleCommand(unittest.TestCase):
    def test_handle_command_routes_to_setup_phase(self):
        session = GameSession()
        session.join("p1")
        session.join("p2")

        cmd = PlaceShipCommand(
            ship_name="destroyer",
            start=(0, 0),
            horizontal=True,
        )

        response = session.handle_command("p1", cmd)

        assert response["status"] == "ok"
        assert session.game.phase == GamePhase.SETUP

    def test_fire_not_allowed_during_setup(self):
        session = GameSession()
        session.join("p1")
        session.join("p2")

        response = session.handle_command("p1", FireCommand(coord=(0, 0)))

        assert response["status"] == "error"
        assert "place" in response["message"].lower()

    def test_engine_exception_is_captured(self):
        p1 = "p1"
        p2 = "p2"
        session = _start_session(p1, p2)

        cmd = PlaceShipCommand(
            ship_name="destroyer",
            start=(0, 0),
            horizontal=True,
        )

        # place once
        response1 = session.handle_command("p1", cmd)
        assert response1["status"] == "ok"

        # place again → ShipAlreadyPlaced
        response2 = session.handle_command("p1", cmd)

        assert response2["status"] == "error"
        assert "already placed" in response2["message"].lower()

    def test_game_starts_after_both_players_ready(self):
        p1 = "p1"
        p2 = "p2"
        session = _start_session(p1, p2)
        _place_all_ships(session, p1, p2)

        assert session.game.phase == GamePhase.IN_PROGRESS

    def test_wrong_player_cannot_play(self):
        p1 = "p1"
        p2 = "p2"
        session = _start_session(p1, p2)
        _place_all_ships(session, p1, p2)

        result = session.handle_command(p1 if session.game.current_turn == p2 else p2, FireCommand((0, 0)))

        assert result["status"] == "error"
        assert "turn" in result["message"]

    def test_valid_fire_switches_turn(self):
        p1 = "p1"
        p2 = "p2"
        session = _start_session(p1, p2)
        _place_all_ships(session, p1, p2)

        first_player = session.game.current_turn

        result = session.handle_command(first_player, FireCommand((0, 0)))

        assert result["status"] == "ok"
        assert session.game.current_turn != first_player

    def test_commands_rejected_after_game_finished(self):
        p1 = "p1"
        p2 = "p2"
        session = _start_session(p1, p2)
        _place_all_ships(session, p1, p2)

        first = p1 if session.game.current_turn == p1 else p2
        second = p1 if session.game.current_turn == p2 else p1

        _sink_all_ships(session, first, second)

        result = session.handle_command(second, FireCommand((9, 9)))

        assert result["status"] == "error"


def _start_session(p1: PlayerId, p2: PlayerId) -> GameSession:
    session = GameSession()
    session.join(p1)
    session.join(p2)
    return session


def _place_all_ships(gm: GameSession, p1: PlayerId, p2: PlayerId):
    ships = standard_ships()

    for i in range(len(ships)):
        gm.handle_command(p1, PlaceShipCommand(ships[i].name, (i, 0), True))
        gm.handle_command(p2, PlaceShipCommand(ships[i].name, (i, 0), True))


def _sink_all_ships(gm: GameSession, first_player: PlayerId, second_player: PlayerId):
    row = 0
    for ship in standard_ships():
        for col in range(ship.size):
            gm.handle_command(first_player, FireCommand((row, col)))

            if gm.game.phase != GamePhase.FINISHED:
                gm.handle_command(second_player, FireCommand((row, col)))
        row += 1


if __name__ == "__main__":
    unittest.main()
