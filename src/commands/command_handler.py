from src.commands.commands import Command, PlaceShipCommand, FireCommand, StartGameCommand
from src.engine.errors import CommandNotFoundError, InvalidShipName
from src.engine.game import PlayerId, Game

"""
This command handler is independent from transport layer, so both CLI and websocket can use this
"""


class CommandHandler:
    def __init__(self, game: Game, player_id: PlayerId):
        self.game = game
        self.player_id = player_id

    def handle(self, command: Command) -> dict:
        match command:
            case PlaceShipCommand(ship_name, start, horizontal):
                ship = self.game.boards[self.player_id].get_ship_by_name(ship_name)

                if ship is None:
                    raise InvalidShipName(f"Ship with name {ship_name} does not exist")

                self.game.place_ship(self.player_id, ship, start, horizontal)
                return {"status": "ok"}

            case FireCommand(coord):
                result = self.game.fire(self.player_id, coord)
                return {"status": "ok", "result": result}  # todo valider

            case StartGameCommand():
                self.game.start(self.player_id)
                return {"status": "ok"}

            case _:
                raise CommandNotFoundError(f"Command of type {type(command)} does not exist")
