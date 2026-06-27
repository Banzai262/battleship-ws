from pydantic import BaseModel


class CreateGameRequest(BaseModel):
    type: str  # TODO enum pour les types de request possibles?
    player_name: str


class CreateGameResponse(BaseModel):
    type: str = "game_created"  # TODO enum pour les types de response possibles
    code: str
