# battleship-ws: Multiplayer Backend Game (CLI & Websocket)

This project is a multiplayer implementation of the classic **Battleship** game, built primarily as a **backend and networking project**.

There is no UI or graphics of any kind. It plays directly from the terminal.

More precisely, the focus is on:
- clean game logic
- multiplayer state management
- async networking with websockets
- deployment behind a reverse proxy
- containerization and operational concerns

The game can be played locally via a CLI (hotseat mode) or remotely by two players over websockets. I deployed the remote version on my home server, behind a reverse proxy, so it can be demoed anytime.

---

## Features

### Game features
- Classic Battleship rules
- Standard ship set
- Ship placement validation
- Hit / miss / sunk detection
- Win condition detection

### Multiplayer features
- Game codes to join existing games
- Turn-based enforcement
- Players can issue commands at any time, but only valid turns are accepted
- Game phase notifications (setup, play, finished)
- Winner announcement
- Disconnection handling
- Player reconnection support

### Technical features
- UI-agnostic game engine
- CLI adapter for local play and testing
- WebSocket adapter for remote multiplayer
- Async, non-blocking server
- Game registry supporting multiple concurrent games
- Maximum number of concurrent games
- Automatic cleanup of inactive games
- Containerized deployment
- Reverse-proxy friendly (WebSocket support)

---

## Running the Game

The game can be run in **two different modes**, depending on your needs.

---

## 1. Local CLI Mode (Hotseat)

This mode runs entirely locally and is useful for:
- development
- testing
- understanding the game flow

Both players use the same terminal, taking turns.

The CLI will guide both players through ship placement and gameplay.

### Requirements
- Python 3.10+ (not tested on other versions, but it should work on more recent versions)
- Virtual environment strongly recommended

### Run

```bash
python -m src/cli/main.py
```

## 2. Running as a WebSocket Server (Multiplayer)

In this mode, the Battleship backend runs as a WebSocket server, allowing two players on different machines to play together in real time.

It can be run locally or in Docker.

---

### Requirements

- Python 3.10+ **or** Docker
- A WebSocket client (for example: `wscat`, but other clients should also work)
- (Optional) A reverse proxy for TLS and public access

---

### Run Locally (Without Docker)

Start the WebSocket server:

```bash
fastapi run .\src\websockets\websocket_handler.py --host 0.0.0.0 --port 12345
```

You can replace `run` by `dev` if you want the dev mode features (hot reload, ...)

### Run with Docker

You can simply run this command:

```bash
docker run -d -p 12345:12345 banzai262/battleship-ws
```

Or you can use this `docker-compose.yml`:

```yaml
services:
  battleship:
    image: banzai262/battleship-ws:latest
    container_name: battleship-ws
    restart: unless-stopped
    ports:
      - "12345:12345"
```

### Connecting to the server

When the server is running, you can connect to it with any websocket client:

```bash
wscat -c ws://<ip of the machine running the server>:12345/ws
```

---

## Architecture Overview

The project is designed as a lightweight, event-driven multiplayer backend, built around asynchronous communication.

At a high level, the system is composed of four main layers:

### WebSocket API Layer
The entry point of the application is a websocket server based on fastapi.  
This layer is responsible for:
- accepting client connections
- upgrading HTTP connections to websockets
- validating incoming messages
- broadcasting game events to connected players

All communication between clients and the server happens through structured websocket messages.

---

### Game Session Management
Each active game runs in its own isolated session.  
A session is responsible for:
- tracking connected players
- managing turn order
- validating moves
- emitting game state updates

Sessions are stored in memory and are created dynamically when players connect.

---

### Game Logic Layer
The core battleship rules are implemented independently of the networking layer.  
This includes:
- board representation
- ship placement validation
- hit/miss detection
- win conditions

This separation keeps the game rules testable and reusable.

---

### Networking & Deployment
The application can run:
- directly as a local websocket server
- inside a Docker container, optionally behind a reverse proxy

The battleship server itself remains protocol-agnostic and unaware of the external network setup.

---

## Next Steps / Possible Improvements
- In-game chat
- Automatic build pipeline
- Persistent game storage (Redis or database)
- Spectator mode
- Multiple simultaneous games per user
- Authentication (JWT or sessions)
- Simple web frontend (keeping the engine UI-agnostic)
- AI opponent
- Match history and statistics
- Rate limiting and abuse protection
- There are still a few bugs to iron out




