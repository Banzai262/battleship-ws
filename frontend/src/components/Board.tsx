import CellComponent from "./Cell.tsx";
import type {Cell} from "../models/Cell.ts";
import "./Board.css";


interface Props {
    board: Cell[][];
    onCellClick?: (row: number, col: number) => void;
}

export default function Board({ board, onCellClick }: Props) {
    return (
        <div className="board">
            {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <CellComponent
                        key={`${rowIndex}-${colIndex}`}
                        cell={cell}
                        onClick={() => onCellClick?.(rowIndex, colIndex)} // TODO plus tard le onCellClick
                    />
                ))
            )}
        </div>
    );
}