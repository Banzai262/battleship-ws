import asyncio

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from backend.src.commands.command_parser import parse_command
from backend.src.commands.commands import PlaceRandom, FireCommand
from backend.src.engine.errors import ERROR_CODES
from backend.src.engine.game import GamePhase, PlayerId
from backend.src.engine.game_session import GameSession
from backend.src.shared.render import render_grid, render_ship_status
from backend.src.websockets.game_registry import GameRegistry
from backend.src.websockets.protocol.log_event import LogEvent, LogKind
from backend.src.websockets.protocol.message_types import RequestTypes, ResponseTypes
from backend.src.websockets.protocol.notifications import Notification
from backend.src.websockets.protocol.requests import CreateGameRequest, JoinGameRequest, GetStateRequest, \
    PlaceRandomRequest, FireRequest, ChatRequest
from backend.src.websockets.protocol.responses import CreateGameResponse, JoinGameResponse, ErrorResponse

app = FastAPI()
registry = GameRegistry()


@app.get("/status")
def status():
    return {
        "status": "ok",
        "active_games": len(registry.games)
    }


@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    print("New WebSocket connection")

    try:
        await ws.accept()

        await ws.send_text(
            "Welcome to Battleship-ws\n"
            "Type 'create' or 'join <code>'"
        )

        first_msg = await ws.receive_text()
        parts = first_msg.strip().split()

        match parts[0]:
            case "create":
                code, session = registry.create_game(dev_mode=False)
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

                    if result.get("reconnected"):
                        await session.broadcast(f"{player_id} is back")
                        await ws.send_text(f"Welcome back {player_id}, you have been reconnected")
                        break
                    elif result["status"] == "ok" and session.is_ready():
                        session.ready_event.set()
                        await session.broadcast("Both players connected. Ready to start the game.")
                        break
                    await ws.send_text(f"Name '{player_id}' is already used, please use a different name")

                await ws.send_text(f"Joined game {code}")

            case _:
                await ws.send_text("Invalid command. Please start again")
                return

        await session.ready_event.wait()

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
                    await session.disconnect_all(f"Game won by {session.game.winner}")
                    del registry.games[code]
                    break

                prompt = session.get_prompt(player_id)
                await ws.send_text(prompt)

                text = await ws.receive_text()

                match text:
                    case "quit" | "exit":
                        await ws.send_text("Exiting")
                        await session.broadcast(f"Player {player_id} exited the game.")
                        del registry.games[code]
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

            except WebSocketDisconnect:
                print(f"{player_id} disconnected")

                if session and player_id:
                    session.handle_disconnect(player_id)
                    await session.broadcast(f"{player_id} is disconnected")
                    await ws.close(reason="Client disconnected")

            except asyncio.CancelledError:
                print(f"{player_id} cancelled / disconnected")
                if session and player_id:
                    session.handle_disconnect(player_id)
                    await session.broadcast(f"{player_id} is disconnected")
                    await ws.close(reason="Client disconnected")

            except Exception as e:
                print(f"error {e}")
                if ws.client_state == ws.client_state.CONNECTED:
                    await ws.send_text(str(e))

    except Exception as e:
        print(f"error is {e}")
        if ws.client_state == ws.client_state.CONNECTED:
            await ws.send_text(str(e))


@app.websocket("/ws/json")
async def websocket_json(ws: WebSocket):
    await ws.accept()

    player_id: PlayerId | None = None
    session: GameSession | None = None
    code: str | None = None

    try:
        while True:
            data = await ws.receive_json()

            match data["type"]:
                case RequestTypes.CREATE:
                    request = CreateGameRequest(**data)
                    player_id = request.player_id

                    code, session = registry.create_game(dev_mode=False)
                    await session.join(request.player_id)
                    session.connections[request.player_id] = ws

                    response = CreateGameResponse(code=code)
                    await ws.send_json(response.model_dump(mode="json"))

                case RequestTypes.JOIN:
                    request = JoinGameRequest(**data)
                    player_id = request.player_id
                    code = request.code

                    session = registry.join_game(code)

                    await session.join(request.player_id)
                    session.connections[request.player_id] = ws

                    # TODO gérer statuts reconnected et ok

                    response = JoinGameResponse(code=code)
                    await ws.send_json(response.model_dump(mode="json"))

                    # TODO surement revoir le format de ça, pour envoyer un state plus complet
                    if session.is_ready():
                        await session.broadcast_json(
                            {"type": ResponseTypes.GAME_READY}
                        )

                # Receives
                # "type": "place",
                # "ship": "carrier"
                # "row": 0
                # "col": 2
                # "horizontal": true

                # Response
                # "type": "ship_placed",
                # "ship": "carrier"
                case "place":
                    pass

                case RequestTypes.PLACE_RANDOM:
                    request = PlaceRandomRequest(**data)

                    result = await session.handle_command(player_id, PlaceRandom(place_all=request.override))

                    if result["status"] == "error":
                        await ws.send_json(ErrorResponse(message=result["message"]).model_dump(mode="json"))
                        continue

                    notif = Notification(message="Your fleet has been deployed, waiting for other player")
                    await ws.send_json(notif.model_dump(mode="json"))

                    await session.broadcast_state()

                # Receives
                # "type": "fire",
                # "row": 0
                # "col": 2

                # Response
                # "type": "hit" | "missed" | "sunk",
                case RequestTypes.FIRE:
                    request = FireRequest(**data)

                    result = await session.handle_command(player_id, FireCommand((request.row, request.col)))

                    if result["status"] == "error":
                        await ws.send_json(ErrorResponse(message=result["message"]).model_dump(mode="json"))
                        continue

                    await session.broadcast_state(result["result"])

                case RequestTypes.GET_STATE:
                    request = GetStateRequest(**data)
                    response = session.build_state(player_id)

                    await ws.send_json(response.model_dump(mode="json"))

                case RequestTypes.CHAT:
                    request = ChatRequest(**data)
                    event = LogEvent(kind=LogKind.CHAT, message=f"🗨️ {player_id}: {request.message}")

                    await session.log_event(event)

    except Exception as e:
        await ws.send_json({
            "type": "error",
            "error_code": ERROR_CODES.get(type(e), "UNKNOWN_ERROR"),
            "message": str(e)
        })


@app.on_event("startup")
async def startup():
    asyncio.create_task(registry.cleanup_loop())


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
          place random (all)
          fire <row> <col>
          start
          view
          ships
          quit
                """)


async def display_ship_status(ws: WebSocket, data: str):
    await ws.send_text(f"\n{data}")
