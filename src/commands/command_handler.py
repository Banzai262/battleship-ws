from src.commands.commands import Command, PlaceShipCommand, FireCommand, StartGameCommand
from src.engine.errors import CommandNotFoundError, InvalidShipName
from src.engine.game import PlayerId, Game

"""
The class translates commands to game methods
All required verification have been done previously before calling the handler
"""


class CommandHandler:
    def __init__(self, game: Game):
        self.game = game

    async def execute(self, player_id: PlayerId, command: Command) -> dict:
        match command:
            case PlaceShipCommand(ship_name, start, horizontal):
                ship = self.game.boards[player_id].get_ship_by_name(ship_name)

                if ship is None:
                    raise InvalidShipName(f"Ship with name {ship_name} does not exist")

                self.game.place_ship(player_id, ship, start, horizontal)
                return {"status": "ok", "type": "ship_placed"}

            case FireCommand(coord):
                result = await self.game.fire(player_id, coord)
                return {"status": "ok", "type": "shot", "result": result.outcome}  # todo valider

            case StartGameCommand():
                await self.game.start(player_id)
                return {"status": "ok", "type": "game_started"}

            case _:
                raise CommandNotFoundError(f"Command of type {type(command)} does not exist")
