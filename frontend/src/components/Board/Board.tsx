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
- quand un bateau a été placé, faudrait le voir dans le board avec le bon emoji
- faut un moyen de déselectionner
- quand un ship est selected, une bannière dans le top pour indiquer de le placer en cliquant
- message rouge quand on clique avec preview rouge?
- ship placés devrait pas être sélectable
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