import type {GameState} from "../../types/GameState.ts";
import Board from "../../components/Board/Board.tsx";
import "./BattlePage.css";
import ShipStatusPanel from "../../components/ShipStatusPanel/ShipStatusPanel.tsx";
import {useState} from "react";
import type {Coordinate} from "../../types/Coordinate.ts";
import TargetPanel from "../../components/TargetPanel/TargetPanel.tsx";

interface Props {
    state: GameState;
    playerName: string;
    onFire: (row: number, col: number) => void;
}

export default function BattlePage(props: Props) {
    const [hoveredCell, setHoveredCell] = useState<Coordinate | null>(null);
    const isMyTurn = props.state.currentPlayer === props.playerName;

    return (
        <div className="battle-page">

            {/*// TODO custom header (utilisé dans chaque page)*/}
            <h1>Battleship</h1>

            <div className={`turn-banner ${isMyTurn ? "my-turn" : "opponent-turn"}`}>
                {isMyTurn
                    ? "🟢 Your turn! Fire at the enemy board."
                    : "⏳ Waiting for your opponent..."}
            </div>

            <div className="battle-grid">
                <div className="panel">
                    <ShipStatusPanel ships={props.state.ships}/>
                </div>

                <div className="panel">
                    <h2>Your board</h2>
                    <Board board={props.state.yourBoard} disableCells={true} showCoordinates={false}/>
                </div>

                <div className="panel">
                    <TargetPanel
                        isMyTurn={isMyTurn}
                        hoveredCell={hoveredCell}
                        lastShotResult={props.state.lastShotResult}
                        lastPlayer={props.playerName === props.state.currentPlayer ? props.state.opponentName : props.playerName}
                    />
                </div>

                <div className="panel">
                    <h2>Enemy board</h2>
                    <Board board={props.state.enemyBoard}
                           disableCells={!isMyTurn}
                           showCoordinates={true}
                           onCellClick={isMyTurn ? props.onFire : undefined}
                           onCellHover={
                               isMyTurn
                                   ? (row, col) => setHoveredCell([row, col])
                                   : undefined
                           }
                           onMouseLeave={() => setHoveredCell(null)}
                    />
                </div>

            </div>
        </div>
    );
}