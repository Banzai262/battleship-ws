import asyncio
import secrets
import string

from src.engine.errors import InvalidCode, PlayerCountError, TooManyGames
from src.engine.game_session import GameSession


# TODO tests
class GameRegistry:
    def __init__(self):
        self.games: dict[str, GameSession] = {}
        self.max_number_of_games = 3

    def create_game(self, dev_mode) -> tuple[str, GameSession]:
        if len(self.games) >= self.max_number_of_games:
            raise TooManyGames(f"You cannot create a new game, the limit of {self.max_number_of_games} is reached.")
        code = generate_code()
        session = GameSession(dev_mode)
        self.games[code] = session
        return code, session

    def join_game(self, code: str) -> GameSession:
        if code not in self.games:
            raise InvalidCode(f"Game code {code} does not exist")

        session = self.games[code]

        if len(session.connected) >= 2:
            raise PlayerCountError("Required number of players reached")

        return session

    async def cleanup_loop(self):
        while True:
            await asyncio.sleep(60)

            expired_codes = [
                code for code, session in list(self.games.items())
                if session.is_expired()
            ]

            for code in expired_codes:
                session = self.games.get(code)
                if not session:
                    continue

                await session.broadcast("Disconnecting because of inactivity")
                await session.disconnect_all("Inactivity")

                del self.games[code]


def generate_code(length=6) -> str:
    alphabet = string.ascii_uppercase + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(length))
