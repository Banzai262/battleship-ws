from src.engine.board import CellState

CELL_MAP = {
    CellState.EMPTY: "🌊",
    CellState.SHIP: "🚢",
    CellState.HIT: "🎯",
    CellState.MISS: "❌",
}


def render_grid(grid):
    lines = []
    for row in grid:
        lines.append(" ".join(CELL_MAP[cell] for cell in row))
    return "\n".join(lines)
