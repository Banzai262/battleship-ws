from backend.src.websockets.protocol.message_types import Request, RequestTypes


class CreateGameRequest(Request):
    type: RequestTypes = RequestTypes.CREATE
    player_name: str


class JoinGameRequest(Request):
    type: RequestTypes = RequestTypes.JOIN
    player_name: str
    code: str
