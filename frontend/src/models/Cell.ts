import type {CellState} from "../types/CellState.ts";

export interface Cell {
    row: number;
    col: number;
    state: CellState;
}