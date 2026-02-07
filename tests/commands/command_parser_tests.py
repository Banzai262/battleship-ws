import unittest

from src.commands.command_parser import parse_command
from src.commands.commands import PlaceShipCommand, FireCommand, StartGameCommand
from src.engine.errors import CommandParseError


class TestParseCommand(unittest.TestCase):
    def test_parse_incomplete_place_command_should_raise(self):
        with self.assertRaises(CommandParseError):
            parse_command("place wrong command")

    def test_parse_place(self):
        cmd = parse_command("place ship 1 2 h")

        assert isinstance(cmd, PlaceShipCommand)

    def test_parse_incomplete_fire_command_should_raise(self):
        with self.assertRaises(CommandParseError):
            parse_command("fire wrong")

    def test_fire_place(self):
        cmd = parse_command("fire 1 2")

        assert isinstance(cmd, FireCommand)

    def test_parse_start(self):
        cmd = parse_command("start")

        assert isinstance(cmd, StartGameCommand)
