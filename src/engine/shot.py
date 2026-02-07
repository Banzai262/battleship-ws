from dataclasses import dataclass
from enum import Enum
from typing import Optional

from src.engine.ships import Ship


class ShotOutcome(Enum):
    HIT = "hit"
    MISS = "miss"
    SUNK = "sunk"


@dataclass
class ShotResult:
    outcome: ShotOutcome
    ship: Optional[Ship] = None
