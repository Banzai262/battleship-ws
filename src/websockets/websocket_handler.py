import asyncio
import time

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from src.commands.command_parser import parse_command
from src.shared.render import render_grid
from src.websockets.game_registry import GameRegistry

app = FastAPI()
registry = GameRegistry()


@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    print("New WebSocket connection")

    await ws.accept()

    await ws.send_text(
        "Welcome to Battleship\n"
        "Type 'create' or 'join <code>'"
    )

    try:
        first_msg = await ws.receive_text()
        parts = first_msg.strip().split()

        if parts[0] == "create":
            code, session = registry.create_game()
            player_id = await ask_name(ws)
            session.join(player_id)
            await ws.send_text(f"Game created\nCode: {code}")

        elif parts[0] == "join" and len(parts) == 2:
            session = registry.join_game(parts[1])
            player_id = await ask_name(ws)
            session.join(player_id)
            await ws.send_text(f"Joined game {parts[1]}")

        else:
            await ws.send_text("Invalid command")
            return

        while len(session.players) < 2:
            await ws.send_text("Waiting for opponent to join...")
            await asyncio.sleep(2)

        await ws.send_text("Ready to start the game.")

        # todo arranger la loop pour l'affichage notamment
        # todo broadcast
        # todo les autres commandes (help, view)
        # todo bref voir le chat pour les possibles améliorations (pas de blocking, reconnection, etc)
        while True:
            view = session.get_view(player_id)
            await display(view, ws)

            text = await ws.receive_text()
            command = parse_command(text)

            result = session.handle_command(player_id, command)

            if result["status"] == "error":
                await ws.send_text(f"Error: {result['message']}")

    except WebSocketDisconnect:
        print("Disconnected")


async def ask_name(ws: WebSocket) -> str:
    await ws.send_text("What name do you want to use?")
    return await ws.receive_text()


async def display(view: dict, ws: WebSocket):
    await ws.send_text("Your board:")
    await ws.send_text("\n" + render_grid(view["your_board"]))
    await ws.send_text("\nEnemy board:")
    await ws.send_text("\n" + render_grid(view["enemy_board"]))
    await ws.send_text("\n")
