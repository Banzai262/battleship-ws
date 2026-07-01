from backend.src.websockets.protocol.message_types import Response, ResponseTypes


class Notification(Response):
    type: ResponseTypes = ResponseTypes.NOTIFICATION
    message: str
