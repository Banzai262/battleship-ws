import type {Request} from "./MessageType.ts";

export interface CreateGameRequest extends Request {
    player_name: string;
}

export interface JoinGameRequest extends Request {
    player_name: string;
    code: string;
}