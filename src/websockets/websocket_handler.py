import asyncio

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from src.commands.command_parser import parse_command
from src.shared.render import render_grid, render_ship_status
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

        match parts[0]:
            case "create":
                code, session = registry.create_game()
                player_id = await ask_name(ws)
                session.join(player_id)
                await ws.send_text(f"Game created\nCode: {code}")

            case "join":
                if len(parts) != 2:
                    await ws.send_text("Please enter the game code")
                    code = await ws.receive_text()
                else:
                    code = parts[1]
                session = registry.join_game(code)

                while True:
                    player_id = await ask_name(ws)
                    result = session.join(player_id)

                    if result["status"] == "ok":
                        break
                    await ws.send_text(f"Name '{player_id}' is already used, please use a different name")

                await ws.send_text(f"Joined game {code}")

            case _:
                await ws.send_text("Invalid command. Please start again")
                return

        while len(session.players) < 2:
            await ws.send_text("Waiting for opponent to join...")
            await asyncio.sleep(2)

        await ws.send_text("Ready to start the game.")

        # todo arranger la loop pour l'affichage notamment
        # todo broadcast
        # todo bref voir le chat pour les possibles améliorations (pas de blocking, reconnection, etc)
        while True:
            try:
                view = session.get_view(player_id)
                await display(view, ws)

                text = await ws.receive_text()

                match text:
                    case "quit" | "exit":
                        await ws.send_text("Exiting")
                        # TODO broadcast que ce user a quitté
                        break
                    case "help":
                        await show_help(ws)
                        continue
                    case "ships":
                        await display_ship_status(ws, render_ship_status(session.get_ship_status(player_id)))
                        continue
                    case "view":
                        view = session.get_view(player_id)
                        await display(view, ws)
                        continue

                command = parse_command(text)

                result = session.handle_command(player_id, command)

                if result["status"] == "error":
                    await ws.send_text(f"Error: {result['message']}")

            except Exception as e:
                await ws.send_text(str(e))

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


async def show_help(ws: WebSocket):
    await ws.send_text("""
        Commands:
          place <ship> <row> <col> <h|v>
          fire <row> <col>
          start
          view
          ships
          quit
                """)


async def display_ship_status(ws: WebSocket, data: str):
    await ws.send_text(f"\n{data}")
