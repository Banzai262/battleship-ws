import asyncio

from src.cli.hotseat_adapter import hotseat
from src.engine.game_session import GameSession


async def main():
    session = GameSession(dev=True)
    await hotseat(session)


if __name__ == "__main__":
    asyncio.run(main())
