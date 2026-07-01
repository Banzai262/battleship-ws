from backend.src.engine.game import PlayerId
from backend.src.websockets.protocol.message_types import Request, RequestTypes


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
