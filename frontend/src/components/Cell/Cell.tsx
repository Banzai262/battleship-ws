import {CellMap, CellState} from "../../types/CellState.ts";
import "./Cell.css";

interface Props {
    cell: CellState;
    disabled: boolean
    onClick?: () => void;
    onMouseEnter?: () => void;
}

export default function CellComponent({cell, disabled, onClick, onMouseEnter}: Props) {
    return (
        <button className={`cell ${disabled ? "disabled" : "clickable"}`}
                onClick={onClick}
                onMouseEnter={onMouseEnter}>
            {CellMap(cell)}
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