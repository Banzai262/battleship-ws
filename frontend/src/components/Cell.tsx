import type {Cell} from "../models/Cell.ts";
import {CellState} from "../types/CellState.ts";
import "./Cell.css";

interface Props {
    cell: Cell;
    onClick?: () => void;
}

export default function CellComponent({ cell, onClick }: Props) {
    return (
        <button className="cell" onClick={onClick}>
            {cell.state === CellState.Ship ? "🚢" : "~"}
        </button>
    );
}

// TODO later on va render l'eau, le ship, le hit, etc ici

/**
 * pour le rendering, les emojis c'est fine pour le prototype, mais plus tard...
 *
 * <button
 *     className={`cell ${cell.hasShip ? "ship" : "water"}`}
 *     onClick={onClick}
 * />
 *
 * et dans cell.css
 *
 * .cell {
 *     width: 40px;
 *     height: 40px;
 *     border: 1px solid #888;
 * }
 *
 * .water {
 *     background: #dbeafe;
 * }
 *
 * .ship {
 *     background: #6b7280;
 * }
 *
 * on aura juste à modifier le css avec les bons noms de classe, et le rendering sera taken care of
 */