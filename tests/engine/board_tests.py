import unittest

from src.engine.board import Board, CellState
from src.engine.errors import ShipAlreadyPlaced, InvalidPlacement, Overlapping, OutsideShot, AlreadyShot
from src.engine.ships import Ship
from src.engine.shot import ShotOutcome


class TestPlaceShip(unittest.TestCase):
    def test_cannot_place_ship_if_already_placed(self):
        with self.assertRaises(ShipAlreadyPlaced):
            ship = Ship("Test", 2)
            ship.place({(0, 0), (0, 1)})

            board = Board()
            board.place_ship(ship, (0, 0), True)

    def test_cannot_place_ship_if_does_not_fit(self):
        with self.assertRaises(InvalidPlacement):
            ship = Ship("Test", 2)
            board = Board(ships=[ship])
            board.place_ship(ship, (10, 10), True)

    def test_ships_cannot_overlap(self):
        with self.assertRaises(Overlapping):
            ship1 = Ship("One", 2)
            ship2 = Ship("Two", 2)

            board = Board(ships=[ship1, ship2])

            board.place_ship(ship1, (0, 0), True)
            board.place_ship(ship2, (0, 0), False)


class TestReceiveFire(unittest.TestCase):
    def test_if_shot_outside_board_should_raise(self):
        with self.assertRaises(OutsideShot):
            board = Board()
            board.receive_fire((10, 10))

    def test_cannot_fire_twice(self):
        with self.assertRaises(AlreadyShot):
            board = Board()
            board.receive_fire((1, 1))
            board.receive_fire((1, 1))

    def test_miss(self):
        board = Board()
        result = board.receive_fire((1, 1))

        assert result.outcome == ShotOutcome.MISS

    def test_hit_and_sink(self):
        ship = Ship("Test", 2)
        board = Board(ships=[ship])
        board.place_ship(ship, (0, 0), horizontal=True)

        result1 = board.receive_fire((0, 0))
        assert result1.outcome == ShotOutcome.HIT

        result2 = board.receive_fire((0, 1))
        assert result2.outcome == ShotOutcome.SUNK
        assert result2.ship == ship


class TestAllShipsSunk(unittest.TestCase):
    def test_all_ships_sunk(self):
        ship = Ship("One", 2)
        board = Board(ships=[ship])
        board.place_ship(ship, (0, 0), True)

        board.receive_fire((0, 0))
        assert not board.all_ships_sunk()

        board.receive_fire((0, 1))
        assert board.all_ships_sunk()


class TestRender(unittest.TestCase):
    def test_render_empty_board(self):
        board = Board(size=3)
        grid = board.render()

        assert all(cell == CellState.EMPTY for row in grid for cell in row)

    def test_render_hits_and_misses(self):
        ship = Ship("One", 1)
        board = Board(3, ships=[ship])
        board.place_ship(ship, (1, 1), horizontal=True)

        board.receive_fire((0, 0))  # miss
        board.receive_fire((1, 1))  # hit

        grid = board.render()

        assert grid[0][0] == CellState.MISS
        assert grid[1][1] == CellState.HIT

    def test_render_reveal_ships(self):
        ship = Ship("One", 1)
        board = Board(3, ships=[ship])
        board.place_ship(ship, (1, 1), horizontal=True)

        grid = board.render(reveal_ships=False)
        assert grid[1][1] == CellState.EMPTY

        grid = board.render(reveal_ships=True)
        assert grid[1][1] == CellState.SHIP


if __name__ == "__main__":
    unittest.main()
