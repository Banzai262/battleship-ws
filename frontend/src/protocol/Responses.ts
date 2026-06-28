import type {Response} from "./MessageType.ts";

export interface CreateGameResponse extends Response {
    code: string;
}

export interface JoinGameResponse extends Response {
    code: string;
}