from pydantic import BaseModel

from backend.src.engine.game import PlayerId
from backend.src.models.ship_status import ShipStatus
from backend.src.websockets.protocol.message_types import Request, RequestTypes


class ShipToPlace(BaseModel):
    ship: ShipStatus
    row: int
    col: int
    horizontal: bool


class CreateGameRequest(Request):
    type: RequestTypes = RequestTypes.CREATE
    player_id: PlayerId


class JoinGameRequest(Request):
    type: RequestTypes = RequestTypes.JOIN
    player_id: PlayerId
    code: str


class GetStateRequest(Request):
    type: RequestTypes = RequestTypes.GET_STATE


class PlaceRandomRequest(Request):
    type: RequestTypes = RequestTypes.PLACE_RANDOM
    override: bool


class FireRequest(Request):
    type: RequestTypes = RequestTypes.FIRE
    row: int
    col: int


class ChatRequest(Request):
    type: RequestTypes = RequestTypes.CHAT
    message: str


class PlaceShipsRequest(Request):
    type: RequestTypes = RequestTypes.PLACE
    ships: list[ShipToPlace]
