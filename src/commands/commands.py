from dataclasses import dataclass
from typing import Union

from src.engine.ships import Coordinate


# example: place <ship name> <row number> <col number> <orientation (h|v)>
@dataclass(frozen=True)
class PlaceShipCommand:
    ship_name: str
    start: Coordinate
    horizontal: bool


# example: fire <row number> <col number>
@dataclass(frozen=True)
class FireCommand:
    coord: Coordinate


@dataclass(frozen=True)
class StartGameCommand:
    pass


Command = Union[PlaceShipCommand, FireCommand, StartGameCommand]
