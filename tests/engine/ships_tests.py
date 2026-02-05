import unittest

from src.engine.ships import Ship


class TestIsSunk(unittest.TestCase):
    def test_ship_is_sunk_after_all_hits(self):
        ship = Ship("test ship", 2)
        ship.place({(0, 0), (0, 1)})

        assert not ship.is_sunk()

        ship.register_hit((0, 0))
        ship.register_hit((0, 1))

        assert ship.is_sunk()


class TestRegisterHit(unittest.TestCase):
    def test_register_hit_if_coord_in_positions(self):
        ship = Ship("test ship", 2)
        ship.place({(0, 0), (0, 1)})

        hit1 = (0, 0)
        hit2 = (1, 0)

        assert ship.register_hit(hit1)
        assert not ship.register_hit(hit2)

# TODO add more tests


if __name__ == "__main__":
    unittest.main()
