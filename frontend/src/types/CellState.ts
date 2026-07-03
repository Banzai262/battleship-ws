export enum CellState {
    Empty = "0",
    Ship = "1",
    Hit = "2",
    Miss = "3",
}

export function CellMap(state: CellState): string {
    switch (state) {
        case CellState.Empty:
            return "🌊";
        case CellState.Ship:
            return "🚢";
        case CellState.Hit:
            return "🎯";
        case CellState.Miss:
            return "❌";
    }
}