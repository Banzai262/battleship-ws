import dataclasses
from dataclasses import field, dataclass

Coordinates = tuple[int, int]


@dataclass
class Ship:
    name: str
    size: int
    positions: set[Coordinates] = field(default_factory=set)
    hits: set[Coordinates] = field(default_factory=set)

    def place(self, positions: set[Coordinates]):
        if len(positions) != self.size:
            raise ValueError("Number of positions does not match the size of the ship")

        self.positions = positions

    def occupies(self, coord: Coordinates) -> bool:
        return coord in self.positions

    def register_hit(self, coord: Coordinates) -> bool:
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
