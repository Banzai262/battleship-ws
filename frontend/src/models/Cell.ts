import type {CellState} from "../types/CellState.ts";

// TODO envoyer ceci du backend? au lieu de juste le cellstate?
export interface Cell {
    row: number;
    col: number;
    state: CellState;

    // TODO maybe later
    highlighted: boolean;
    last_shot: boolean;
}