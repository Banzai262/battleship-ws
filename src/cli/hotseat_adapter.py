import os

from src.cli.render import render_grid
from src.commands.command_parser import parse_command
from src.engine.errors import CommandParseError
from src.engine.game import GamePhase
from src.engine.game_session import GameSession


def clear():
    os.system("cls" if os.name == "nt" else "clear")


# TODO peut-être render le UI un peu plus beau, avec le nom des colonnes
def hotseat(session: GameSession):
    players = ["Guillaume", "Mariko"]

    for pid in players:
        session.join(pid)

    current = 0

    while True:

        player_id = players[current]

        clear()  # marche pas

        view = session.get_view(player_id)
        prompt = session.get_prompt(player_id)

        print(f"=== {player_id} ===")
        print(prompt)
        print()

        display(view)

        if session.game.phase == GamePhase.FINISHED:
            input("Press Enter to exit")
            break

        try:
            raw = input("> ")

            if raw in {"quit", "exit"}:
                print("Alright cia bye")
                break

            if raw == "help":
                print("""
            Commands:
              place <ship> <row> <col> <h|v>
              fire <row> <col>
              start
              view
              quit
            """)
                continue

            command = parse_command(raw)
            response = session.handle_command(player_id, command)

            if response["status"] == "error":
                print(response["message"])
                input("Press Enter...")

            # switch player ONLY if the game/session allows it
            if session.game.current_turn != player_id:
                current = (current + 1) % 2

        except CommandParseError as e:
            print(f"Parse error: {e}")
            input("Press Enter...")


def display(view: dict):
    print("Your board:")
    print(render_grid(view["your_board"]))
    print("\nEnemy board:")
    print(render_grid(view["enemy_board"]))
    print()
