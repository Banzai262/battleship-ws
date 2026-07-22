import type {Request} from "./MessageType.ts";
import type {ShipToPlace} from "../types/ShipToPlace.ts";

export interface CreateGameRequest extends Request {
    player_id: string;
}

export interface JoinGameRequest extends Request {
    player_id: string;
    code: string;
}

export interface GetStateRequest extends Request {}

export interface PlaceRandomRequest extends Request {
    override: boolean; // TODO toujours true pour le moment, anyway le backend le supporte pas
}

export interface FireRequest extends Request {
    row: number;
    col: number;
}

export interface ChatRequest extends Request {
    message: string;
}

export interface PlaceShipsRequest extends Request {
    ships: ShipToPlace[];
}