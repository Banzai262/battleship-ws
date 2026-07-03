import type {GamePhases} from "./GamePhase.ts";
import type {ShipStatus} from "../models/ShipStatus.ts";
import type {CellState} from "./CellState.ts";
import type {ShotOutcome} from "./ShotOutcome.ts";

export interface GameState {
    phase: GamePhases;

    // TODO pas besoin je pense (ou plus tard_
    // you: PlayerState;
    // opponent: PlayerState;

    // TODO pourrait être Cell, qui contiendrait cellstate et autres metadata
    yourBoard: CellState[][];
    enemyBoard: CellState[][];

    ships: ShipStatus[];

    currentPlayer: string;
    opponentName?: string;
    winner?: string;

    lastShotResult?: ShotOutcome;
}