import CellComponent from "../Cell/Cell.tsx";
import "./Board.css";
import type {CellState} from "../../types/CellState.ts";
import type {ShipToPlace} from "../../types/ShipToPlace.ts";
import type {Coordinate} from "../../types/Coordinate.ts";


interface Props {
    board: CellState[][]; // TODO surement devoir changer pour render les preview
    // highlightCells: Coordinate[]; // TODO ??
    previewCells?: Coordinate[];
    placements?: ShipToPlace[];
    occupiedCells?: Coordinate[];
    previewValid?: boolean;
    disableCells: boolean;
    showCoordinates: boolean;
    onCellClick?: (row: number, col: number) => void;
    onCellHover?: (row: number, col: number) => void;
    onMouseLeave?: () => void;
}

/*
on pourrait passer un previewShip object au board

interface PreviewShip {
    ship: ShipStatus;
    row: number;
    col: number;
    horizontal: boolean;
    valid: boolean;
}

et le board compute les cells
 */


/*
TODO problèmes avec le placement live
- implémenter le backend (done je crois, faut juste le caller)
- message rouge quand on clique avec preview rouge? (live y'a une alerte)
- le bouton ready a l,air broken (du moins avec le placement random, ça chie un peu live)
- faut un feedback quand on click sur ready
 */

export default function Board(props: Props) {
    function renderCells() {
        return props.board.map((row, rowIndex) =>
            row.map((cell, colIndex) =>
                (
                    <CellComponent
                        key={`${rowIndex}-${colIndex}`}
                        isPreview={props.previewCells?.some(c => c[0] === rowIndex && c[1] === colIndex) ? props.previewValid ? "valid" : "invalid" : undefined}
                        isPlaced={props.previewCells && props.occupiedCells ? props.occupiedCells.some(c => c[0] === rowIndex && c[1] === colIndex) : false}
                        disabled={props.disableCells}
                        cell={cell}
                        onClick={() => props.onCellClick?.(rowIndex, colIndex)}
                        onMouseEnter={() => props.onCellHover?.(rowIndex, colIndex)}
                    />
                ))
        );
    }

    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

    return (
        <div className="board-with-coordinates">
            <div className="corner"/>

            <div className="column-labels">
                {letters.map(letter =>
                    <div key={letter} className={`label ${props.showCoordinates ? "" : "hidden"}`}>{letter}</div>
                )}
            </div>

            <div className="corner"/>

            <div className="row-labels">
                {Array.from({length: 10}, (_, i) =>
                    <div key={i} className={`label ${props.showCoordinates ? "" : "hidden"}`}>{i + 1}</div>
                )}
            </div>

            <div className="board" onMouseLeave={props.onMouseLeave}>
                {renderCells()}
            </div>

            <div className="row-labels">
                {Array.from({length: 10}, (_, i) =>
                    <div key={i} className={`label ${props.showCoordinates ? "" : "hidden"}`}>{i + 1}</div>
                )}
            </div>

            <div className="corner"/>

            <div className="column-labels">
                {letters.map(letter =>
                    <div key={letter} className={`label ${props.showCoordinates ? "" : "hidden"}`}>{letter}</div>
                )}
            </div>

            <div className="corner"/>
        </div>
    );
}