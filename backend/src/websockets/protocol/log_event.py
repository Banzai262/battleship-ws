from enum import Enum

from backend.src.websockets.protocol.message_types import ResponseTypes, Response


class LogKind(str, Enum):
    SYSTEM = "system"
    COMBAT = "combat"
    CHAT = "chat"
    VICTORY = "victory"


class LogEvent(Response):
    type: ResponseTypes = ResponseTypes.LOG
    kind: LogKind
    message: str
