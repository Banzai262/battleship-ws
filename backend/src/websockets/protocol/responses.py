from backend.src.engine.board import CellState
from backend.src.engine.game import GamePhase, PlayerId
from backend.src.models.ship_status import ShipStatus
from backend.src.websockets.protocol.message_types import Response, ResponseTypes


class CreateGameResponse(Response):
    type: ResponseTypes = ResponseTypes.GAME_CREATED
    code: str


class JoinGameResponse(Response):
    type: ResponseTypes = ResponseTypes.JOINED
    code: str


class GetStateResponse(Response):
    type: ResponseTypes = ResponseTypes.STATE

    phase: GamePhase

    currentPlayer: PlayerId | None
    winner: str | None

    # TODO vraiment utile ?
    # you: PlayerState
    # opponent: PlayerState

    # TODO va surement changer pour un board dto qui contient le array de CellState et d'autres metadata propres au board
    yourBoard: list[list[CellState]]
    enemyBoard: list[list[CellState]]

    ships: list[ShipStatus]


class ErrorResponse(Response):
    type: ResponseTypes = ResponseTypes.ERROR
    message: str
