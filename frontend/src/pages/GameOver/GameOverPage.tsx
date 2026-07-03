import type {ShipStatus} from "../../models/ShipStatus.ts";
import ShipStatusPanel from "../../components/ShipStatusPanel/ShipStatusPanel.tsx";
import "./GameOverPage.css";

interface Props {
    won: boolean;
    ships: ShipStatus[];
    onReplay: () => void;
    onBackHome: () => void;
}

export default function GameOverPage(props: Props) {
    return (
        <div className="game-over-page">

            <div className="game-over-header">
                <div className="game-over-icon">
                    {props.won ? "🏆" : "💀"}
                </div>

                <p>
                    {props.won
                        ? "You sank all enemy ships."
                        : "The enemy sank your fleet."}
                </p>
            </div>

            <div className="game-over-body">
                <ShipStatusPanel ships={props.ships}/>
            </div>

            <div className="game-over-actions">
                <button onClick={props.onReplay}>
                    Play Again (Coming Soon™)
                </button>

                <button onClick={props.onBackHome}>
                    Back to Home
                </button>
            </div>
        </div>
    );
}