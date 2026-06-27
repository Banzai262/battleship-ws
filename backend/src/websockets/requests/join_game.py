from pydantic import BaseModel


class JoinGameRequest(BaseModel):
    type: str  # TODO enum pour les types de request possibles?
    player_name: str
    code: str


class JoinGameResponse(BaseModel):
    type: str = "joined"  # TODO enum pour les types de response possibles
    code: str
