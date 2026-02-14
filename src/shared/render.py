from src.engine.board import CellState

CELL_MAP = {
    CellState.EMPTY: "🌊",
    CellState.SHIP: "🚢",
    CellState.HIT: "🎯",
    CellState.MISS: "❌",
}


def render_grid(grid) -> str:
    lines = [f"    " + " ".join([" " + str(n) for n in range(0, 10)])]
    i = 0
    for row in grid:
        lines.append(f"  {i} " + " ".join(CELL_MAP[cell] for cell in row))
        i += 1
    return "\n".join(lines)


def render_ship_status(statuses) -> str:
    lines = []
    for status in statuses:
        line = f"Ship '{status['name']}. (size {status['size']}):"

        state = ""
        for coord in status["positions"]:
            if coord in status["hits"]:
                state += "🎯"
            else:
                state += "🚢"

        lines.append(f"{line} {state} (Placed: {status['placed']}) (Sunk: {status['sunk']})")

    return "\n".join(lines)
