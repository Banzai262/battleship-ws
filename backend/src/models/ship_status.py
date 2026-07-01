from pydantic import BaseModel

from backend.src.engine.ships import Coordinate


class ShipStatus(BaseModel):
    name: str
    size: int
    placed: bool
    sunk: bool
    positions: list[Coordinate]
    hits: list[Coordinate]
