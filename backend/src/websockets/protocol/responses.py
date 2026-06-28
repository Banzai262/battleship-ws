from backend.src.websockets.protocol.message_types import Response, ResponseTypes


class CreateGameResponse(Response):
    type: ResponseTypes = ResponseTypes.GAME_CREATED
    code: str


class JoinGameResponse(Response):
    type: ResponseTypes = ResponseTypes.JOINED
    code: str
