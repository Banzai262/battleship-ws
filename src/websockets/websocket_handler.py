from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from src.commands.command_parser import parse_command
from src.engine.game import GamePhase
from src.shared.render import render_grid, render_ship_status
from src.websockets.game_registry import GameRegistry

app = FastAPI()
registry = GameRegistry()


@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    print("New WebSocket connection")

    await ws.accept()

    await ws.send_text(
        "Welcome to Battleship-ws\n"
        "Type 'create' or 'join <code>'"
    )

    try:
        first_msg = await ws.receive_text()
        parts = first_msg.strip().split()

        match parts[0]:
            case "create":
                code, session = registry.create_game(dev_mode=True)
                player_id = await ask_name(ws)
                await session.join(player_id)
                session.connections[player_id] = ws
                await ws.send_text(f"Game created\nCode: {code}")
                await ws.send_text("Waiting for opponent to join...")

            case "join":
                if len(parts) != 2:
                    await ws.send_text("Please enter the game code")
                    code = await ws.receive_text()
                else:
                    code = parts[1]
                session = registry.join_game(code)

                while True:
                    player_id = await ask_name(ws)
                    result = await session.join(player_id)
                    session.connections[player_id] = ws

                    # Session broadcasts state transition (event-driven)
                    if result["status"] == "ok" and session.is_ready():
                        session.ready_event.set()
                        await session.broadcast("Both players connected. Ready to start the game.")
                        break
                    await ws.send_text(f"Name '{player_id}' is already used, please use a different name")

                await ws.send_text(f"Joined game {code}")

            case _:
                await ws.send_text("Invalid command. Please start again")
                return

        await session.ready_event.wait()

        # todo bref voir le chat pour les possibles améliorations (pas de blocking, reconnection, etc)
        while True:
            try:
                view = session.get_view(player_id)
                await display(view, ws)
                await session.broadcast_events()

                if session.game.phase == GamePhase.FINISHED:
                    # todo potentiellement demander pour rejouer
                    await ws.send_text("Press Enter to exit")
                    await ws.receive_text()
                    await session.broadcast(f"{player_id} has exited")
                    del registry.games[code]
                    break

                prompt = session.get_prompt(player_id)
                await ws.send_text(prompt)

                text = await ws.receive_text()

                match text:
                    case "quit" | "exit":
                        await ws.send_text("Exiting")
                        await session.broadcast(f"Player {player_id} exited the game.")
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

                result = await session.handle_command(player_id, command)

                if result["status"] == "error":
                    await ws.send_text(f"Error: {result['message']}")

            except Exception as e:
                await ws.send_text(str(e))

    except WebSocketDisconnect:
        print("Disconnected")

    except Exception as e:
        await ws.send_text(str(e))


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
