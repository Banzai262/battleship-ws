import type {CreateGameRequest, JoinGameRequest} from "../types/Requests.ts";

export class BattleshipClient {
    private ws?: WebSocket;

    public connect(): Promise<void> {
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";

        const url = `${protocol}//${window.location.host.replace("54321", "12345")}/ws/json`;
        return new Promise<void>((resolve, reject) => {
            this.ws = new WebSocket(url);

            this.ws.onopen = () => {
                console.log("Connected");
                resolve();
            };
            this.ws.onerror = (event) => {
                reject(event);
            };
        })
    }

    public send(msg: object): void {
        this.ws?.send(JSON.stringify(msg));
    }

    public onMessage(callback: (data: any) => void): void {
        if (!this.ws) {
            throw new Error("WebSocket not connected");
        }

        this.ws!.onmessage = event => {
            callback(JSON.parse(event.data));
        }
    }

    public createGame(playerName: string): void {
        const request: CreateGameRequest = {
            type: "create",// TODO type dans une enum j'imagine
            player_name: playerName
        };

        this.send(request);
    }

    public joinGame(playerName: string, code: string): void {
        const request: JoinGameRequest = {
            type: "join",// TODO type dans une enum j'imagine
            player_name: playerName,
            code: code
        };

        this.send(request);
    }

    public disconnect() {
        this.ws?.close();
        this.ws = undefined;
    }
}