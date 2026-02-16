# battleship-ws
Battleship game hosted on a server, playable by 2 players at the same time

### Connecting to a WebSocket on Windows

You can install a Websocket client on Windows by running this command: `npm install -g wscat`. Then, you can use `wscat` just like you would on linux or mac.

Run en faisant ` fastapi dev .\src\websockets\websocket_handler.py --host 0.0.0.0 --port 12345` (dev ou run)

### Améliorations possibles dans le futur (voir chatgpt pour comment faire)
* spectators
* reconnection**
* chat**
* move history
* server-side logging