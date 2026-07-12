import type {GameState} from "../../types/GameState.ts";
import Board from "../../components/Board/Board.tsx";
import "./SetupPage.css";
import BattleLog from "../../components/BattleLog/BattleLog.tsx";
import type {LogEvent} from "../../protocol/LogEvent.ts";

interface Props {
    state: GameState;
    logEntries: LogEvent[];
    onSendMessage: (message: string) => void;
    onRandomPlacement: () => void;
}

export default function SetupPage(props: Props) {
    return (
        <>
            <div className="setup-page">
                <div className="ship-panel">
                    <h3>Your fleet</h3>

                    {props.state.ships.map(ship => (
                        <div key={ship.name} className="ship-placeholder">
                            {ship.name}
                        </div>
                    ))}

                    <button onClick={props.onRandomPlacement}>
                        Place ships randomly
                    </button>
                </div>

                <div className="board-panel">
                    <h2>Place your ships</h2>

                    <Board board={props.state.yourBoard} disableCells={true} showCoordinates={false}/>
                </div>

            </div>
            <BattleLog entries={props.logEntries} onSendMessage={props.onSendMessage}/>
        </>
    );
}