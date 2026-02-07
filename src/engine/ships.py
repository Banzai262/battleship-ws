from dataclasses import field, dataclass

from src.engine.errors import InvalidPositions

# alias so when reading the code, the domain is easily understandable
Coordinate = tuple[int, int]

"""
This class represents the ships.

They know nothing about the board, they don't validate their placement.
They just know their length, and they know where they have been hit.
"""
@dataclass
class Ship:
    name: str
    size: int
    positions: set[Coordinate] = field(default_factory=set)
    hits: set[Coordinate] = field(default_factory=set)

    def place(self, positions: set[Coordinate]):
        if len(positions) != self.size:
            raise InvalidPositions("Number of positions does not match the size of the ship")

        self.positions = positions

    def occupies(self, coord: Coordinate) -> bool:
        return coord in self.positions

    def register_hit(self, coord: Coordinate) -> bool:
        if coord not in self.positions:
            return False

        self.hits.add(coord)
        return True

    def is_sunk(self) -> bool:
        return self.hits == self.positions

    def is_placed(self) -> bool:
        return len(self.positions) == self.size


def standard_ships() -> list[Ship]:
    return [
        Ship(name="Carrier", size=5),
        Ship(name="Battleship", size=4),
        Ship(name="Cruiser", size=3),
        Ship(name="Submarine", size=3),
        Ship(name="Destroyer", size=2),
    ]
