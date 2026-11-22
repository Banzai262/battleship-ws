import type {GameState} from "../../types/GameState.ts";
import Board from "../../components/Board/Board.tsx";
import "./BattlePage.css";
import ShipStatusPanel from "../../components/ShipStatusPanel/ShipStatusPanel.tsx";
import {useState} from "react";
import type {Coordinate} from "../../types/Coordinate.ts";
import TargetPanel from "../../components/TargetPanel/TargetPanel.tsx";
import EnemyFleetPanel from "../../components/EnemyFleetPanel/EnemyFleetPanel.tsx";
import BattleLog from "../../components/BattleLog/BattleLog.tsx";
import type {LogEvent} from "../../protocol/LogEvent.ts";
import {useTranslation} from "react-i18next";
import {useMediaQuery} from "../../hooks/useMediaQuery.ts";
import {CellState} from "../../types/CellState.ts";

interface Props {
    state: GameState;
    playerName: string;
    logEntries: LogEvent[];
    onSendMessage: (message: string) => void;
    onFire: (row: number, col: number) => void;
}

export default function BattlePage(props: Props) {
    const [hoveredCell, setHoveredCell] = useState<Coordinate | null>(null);
    const [selectedCell, setSelectedCell] = useState<Coordinate | null>(null);
    const isMyTurn = props.state.currentPlayer === props.playerName;
    const isTouch = useMediaQuery("(hover: none)");

    const {t} = useTranslation();

    const target = isMyTurn ? selectedCell : null;
    const targetLabel = target ? `${"ABCDEFGHIJ"[target[1]]}${target[0] + 1}` : "";

    function handleCellClick(row: number, col: number) {
        if (!isMyTurn) {
            return;
        }

        if (isTouch) {
            // ignore cases that were already fired at
            if (props.state.enemyBoard[row][col] !== CellState.Empty) {
                return;
            }
            setSelectedCell([row, col]);
        } else {
            props.onFire(row, col);
        }
    }

    function confirmFire() {
        if (!target) return;
        props.onFire(target[0], target[1]);
        setSelectedCell(null);
    }

    return (
        <div className="battle-page">
            <div className={`turn-banner ${isMyTurn ? "my-turn" : "opponent-turn"}`}>
                {isMyTurn ? t("battle.banner.yourTurn") : t("battle.banner.enemyTurn")}
            </div>

            <div className="battle-grid">
                <div className="panel panel--side panel--status">
                    <ShipStatusPanel ships={props.state.ships}/>
                </div>

                <div className="panel panel--yours">
                    <h2>{t("battle.boards.yours")}</h2>
                    <Board board={props.state.yourBoard} targetable={false} showCoordinates={true}/>
                </div>

                <div className="panel panel--side panel--target">
                    <TargetPanel
                        isMyTurn={isMyTurn}
                        hoveredCell={isTouch ? target : hoveredCell}
                        lastShotResult={props.state.lastShotResult}
                        lastPlayer={props.playerName === props.state.currentPlayer ? props.state.opponentName : props.playerName}
                    />

                    <EnemyFleetPanel shipsSunk={props.state.enemyShipsSunk} totalShips={props.state.ships.length} />
                </div>

                <div className="panel panel--enemy">
                    <h2>{t("battle.boards.enemy")}</h2>
                    <Board board={props.state.enemyBoard}
                           targetable={isMyTurn}
                           showCoordinates={true}
                           previewCells={isTouch && target ? [target] : undefined}
                           previewValid={true}
                           onCellClick={handleCellClick}
                           onCellHover={!isTouch && isMyTurn
                               ? (row, col) => setHoveredCell([row, col])
                               : undefined}
                           onMouseLeave={isTouch ? undefined : () => setHoveredCell(null)}
                    />
                </div>
            </div>

            {isTouch && isMyTurn && (
                <div className="fire-bar">
                    <button onClick={confirmFire} disabled={!target}>
                        {target ? t("battle.fireAt", {cell: targetLabel}) : t("battle.selectTarget")}
                    </button>
                </div>
            )}

            <BattleLog entries={props.logEntries} onSendMessage={props.onSendMessage}/>
        </div>
    );
}