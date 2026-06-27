class ShipAlreadyPlaced(Exception):
    pass


class InvalidPlacement(Exception):
    pass


class Overlapping(Exception):
    pass


class AlreadyShot(Exception):
    pass


class OutsideShot(Exception):
    pass


class InvalidPositions(Exception):
    pass


class PlayerAlreadyExists(Exception):
    pass


class PlayerCountError(Exception):
    pass


class WrongPhase(Exception):
    pass


class TurnError(Exception):
    pass


class MissingPlayer(Exception):
    pass


class CommandParseError(Exception):
    pass


class CommandNotFoundError(Exception):
    pass


class InvalidShipName(Exception):
    pass


class InvalidCode(Exception):
    pass


class TooManyGames(Exception):
    pass


ERROR_CODES = {
    TooManyGames: "TOO_MANY_GAMES",
    InvalidCode: "INVALID_CODE",
    PlayerCountError: "PLAYER_COUNT_ERROR"
}