from src.engine.board import CellState

CELL_MAP = {
    CellState.EMPTY: "🌊",
    CellState.SHIP: "🚢",
    CellState.HIT: "🎯",
    CellState.MISS: "❌",
}


def render_grid(grid) -> str:
    lines = []
    for row in grid:
        lines.append(" ".join(CELL_MAP[cell] for cell in row))
    return "\n".join(lines)


def render_ship_status(statuses) -> str:
    lines = []
    for status in statuses:
        line = f"Ship '{status['name']}. (size {status['size']}): "

        state = ""
        for coord in status["positions"]:
            if coord in status["hits"]:
                state += "🎯"
            else:
                state += "🚢"

        lines.append(line + state)

    return "\n".join(lines)
