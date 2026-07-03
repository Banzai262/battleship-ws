import CellComponent from "../Cell/Cell.tsx";
import "./Board.css";
import type {CellState} from "../../types/CellState.ts";


interface Props {
    board: CellState[][];
    disableCells: boolean;
    showCoordinates: boolean;
    onCellClick?: (row: number, col: number) => void;
    onCellHover?: (row: number, col: number) => void;
    onMouseLeave?: () => void;
}

export default function Board(props: Props) {
    function renderCells() {
        return props.board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
                <CellComponent
                    key={`${rowIndex}-${colIndex}`}
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