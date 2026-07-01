import type {Response} from "./MessageType.ts";
import type {GamePhases} from "../types/GamePhase.ts";
import type {CellState} from "../types/CellState.ts";
import type {ShipStatus} from "../models/ShipStatus.ts";

export interface CreateGameResponse extends Response {
    code: string;
}

export interface JoinGameResponse extends Response {
    code: string;
}

export interface GetStateResponse extends Response {
    phase: GamePhases;
    currentPlayer?: string;
    winner?: string;
    yourBoard: CellState[][];
    enemyBoard: CellState[][];
    ships: ShipStatus[];
}

export interface ErrorResponse extends Response {
    message: string;
}
