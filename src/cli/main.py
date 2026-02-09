from src.cli.hotseat_adapter import hotseat
from src.engine.game_session import GameSession


def main():
    session = GameSession()
    hotseat(session)


if __name__ == "__main__":
    main()
