import {
    type CreateGameRequest,
    type FireRequest,
    type GetStateRequest,
    type JoinGameRequest,
    type PlaceRandomRequest
} from "../protocol/Requests.ts";
import {RequestTypes} from "../protocol/MessageType.ts";

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
            type: RequestTypes.Create,
            player_id: playerName
        };

        this.send(request);
    }

    public joinGame(playerName: string, code: string): void {
        const request: JoinGameRequest = {
            type: RequestTypes.Join,
            player_id: playerName,
            code: code
        };

        this.send(request);
    }

    public getState(): void {
        const request: GetStateRequest = {
            type: RequestTypes.GetState,
        };

        this.send(request);
    }

    public placeRandom(): void {
        const request: PlaceRandomRequest = {
            type: RequestTypes.PlaceRandom,
            override: true,
        };

        this.send(request);
    }

    public fire(row: number, col: number): void {
        const request: FireRequest = {
            type: RequestTypes.Fire,
            row: row,
            col: col
        };

        this.send(request);
    }

    public disconnect() {
        this.ws?.close();
        this.ws = undefined;
    }
}