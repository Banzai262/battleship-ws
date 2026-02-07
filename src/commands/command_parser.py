from src.commands.commands import Command, PlaceShipCommand, FireCommand, StartGameCommand
from src.engine.errors import CommandParseError


def parse_command(raw: str) -> Command:
    parts = raw.strip().split()

    if not parts:
        raise CommandParseError("Empty command")

    match parts[0].lower():
        case "place":
            if len(parts) != 5:
                raise CommandParseError(
                    "Usage of place command: place <ship name> <row number> <col number> <orientation (h|v)>")

            _, name, r, c, orientation = parts

            # potentiellement revoir comment je parse les coordonnées (index à 0, ou bien des lettres pour les colonnes)
            return PlaceShipCommand(
                ship_name=name,
                start=(int(r), int(c)),
                horizontal=orientation.lower() == "h"
            )

        case "fire":
            if len(parts) != 3:
                raise CommandParseError("Usage of fire command: fire <row number> <col number>")

            _, r, c = parts

            return FireCommand(
                coord=(int(r), int(c))
            )

        case "start":
            return StartGameCommand()

        case _:
            raise CommandParseError(f"Unknown command: {parts[0]}")
