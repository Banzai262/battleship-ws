from enum import Enum

from src.engine.errors import ShipAlreadyPlaced, InvalidPlacement, Overlapping, OutsideShot, AlreadyShot
from src.engine.ships import Ship, Coordinate, standard_ships
from src.engine.shot import ShotResult, ShotOutcome


class CellState(Enum):
    EMPTY = 0
    SHIP = 1
    HIT = 2
    MISS = 3


"""
This class represents the board.

They keep track of shots and ships placement.
They can also render themselves
"""


class Board:
    def __init__(self, size=10):
        self.size = size
        self.ships = standard_ships()
        self.occupied: set[Coordinate] = set()
        self.shots_taken: set[Coordinate] = set()

    def place_ship(self, ship: Ship, start: Coordinate, horizontal: bool):
        if ship.is_placed():
            raise ShipAlreadyPlaced(f"Ship {ship.name} is already placed")

        positions = _compute_positions(start, ship.size, horizontal)

        for r, c in positions:
            if not (0 <= r < self.size and 0 <= c < self.size):
                raise InvalidPlacement(f"Ship {ship.name} does not fit at this position")

        if len(positions.intersection(self.occupied)) > 0:
            raise Overlapping(f"Ship {ship.name} cannot be placed here, as another ship occupies this space")

        ship.place(positions)
        self.occupied.update(positions)

    def receive_fire(self, coord: Coordinate) -> ShotResult:
        row, col = coord

        if not (0 <= row < self.size and 0 <= col < self.size):
            raise OutsideShot("Shot is outside the board")

        if coord in self.shots_taken:
            raise AlreadyShot("already shot")

        self.shots_taken.add(coord)

        if coord not in self.occupied:
            return ShotResult(outcome=ShotOutcome.MISS)

        for ship in self.ships:
            if ship.occupies(coord):
                ship.register_hit(coord)

                if ship.is_sunk():
                    return ShotResult(outcome=ShotOutcome.SUNK, ship=ship)

                return ShotResult(outcome=ShotOutcome.HIT, ship=ship)

        # Should never reach here
        return ShotResult(outcome=ShotOutcome.MISS)

    def all_ships_sunk(self) -> bool:
        return all(ship.is_sunk() for ship in self.ships)

    def render(self, reveal_ships: bool = False) -> list[list[CellState]]:
        grid = [[CellState.EMPTY for _ in range(self.size)] for _ in range(self.size)]

        # missed shots
        for coord in self.shots_taken:
            if coord not in self.occupied:
                r, c = coord
                grid[r][c] = CellState.MISS

        # hits
        for ship in self.ships:
            for r, c in ship.hits:
                grid[r][c] = CellState.HIT

        # ship (if required) will override MISS, but not HIT
        if reveal_ships:
            for ship in self.ships:
                for r, c in ship.positions:
                    if grid[r][c] == CellState.EMPTY:
                        grid[r][c] = CellState.SHIP

        return grid

    def render_ships(self) -> list:
        ships_status = []

        for ship in self.ships:
            ships_status.append(
                {
                    "name": ship.name,
                    "size": ship.size,
                    "placed": ship.is_placed(),
                    "sunk": ship.is_sunk(),
                    "positions": ship.positions,
                    "hits": ship.hits
                }
            )

        return ships_status

    def get_ship_by_name(self, name) -> Ship | None:
        return next((ship for ship in self.ships if ship.name.lower() == name.lower()), None)

    def all_ships_placed(self) -> bool:
        return len(self.occupied) == sum(ship.size for ship in self.ships)  # the sum of all ships' length


def _compute_positions(start: Coordinate, size: int, horizontal: bool) -> set[Coordinate]:
    row, col = start
    positions = {start}

    for i in range(size - 1):
        if horizontal:
            col += 1
        else:
            row += 1

        positions.add((row, col))

    return positions
