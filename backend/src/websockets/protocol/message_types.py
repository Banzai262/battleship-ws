from enum import Enum

from pydantic import BaseModel


class RequestTypes(str, Enum):
    CREATE = "create"
    JOIN = "join"
    PLACE = "place"
    PLACE_RANDOM = "place_random"
    FIRE = "fire"
    GET_STATE = "get_state"


class ResponseTypes(str, Enum):
    GAME_CREATED = "game_created"
    GAME_READY = "game_ready"
    JOINED = "joined"
    STATE = "state"
    ERROR = "error"
    NOTIFICATION = "notification"
    LOG = "log"


class Request(BaseModel):
    type: RequestTypes


class Response(BaseModel):
    type: ResponseTypes
