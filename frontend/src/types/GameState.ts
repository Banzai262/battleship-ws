import type {GamePhases} from "./GamePhase.ts";
import type {ShipStatus} from "../models/ShipStatus.ts";
import type {Cell} from "../models/Cell.ts";

export interface GameState {
    phase: GamePhases;

    // TODO pas besoin je pense (ou plus tard_
    // you: PlayerState;
    // opponent: PlayerState;

    yourBoard: Cell[][];
    enemyBoard: Cell[][];

    ships: ShipStatus[];

    currentPlayer: string;
    winner?: string;
}