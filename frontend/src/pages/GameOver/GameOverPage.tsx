import type {ShipStatus} from "../../models/ShipStatus.ts";
import ShipStatusPanel from "../../components/ShipStatusPanel/ShipStatusPanel.tsx";
import "./GameOverPage.css";
import BattleLog from "../../components/BattleLog/BattleLog.tsx";
import type {LogEvent} from "../../protocol/LogEvent.ts";
import {useTranslation} from "react-i18next";

interface Props {
    won: boolean;
    ships: ShipStatus[];
    logEntries: LogEvent[];
    onSendMessage: (message: string) => void;
    onReplay: () => void;
    onBackHome: () => void;
}

export default function GameOverPage(props: Props) {
    const {t} = useTranslation();

    return (
        <div className="game-over-page">

            <div className="game-over-header">
                <div className="game-over-icon">
                    {props.won ? "🏆" : "💀"}
                </div>

                <p>
                    {props.won
                        ? t("gameOver.banner.winner")
                        : t("gameOver.banner.loser")}
                </p>
            </div>

            <div className="game-over-body">
                <ShipStatusPanel ships={props.ships}/>
            </div>

            <div className="game-over-actions">
                <button onClick={props.onReplay}>
                    {t("buttons.playAgain")}
                </button>

                <button onClick={props.onBackHome}>
                    {t("buttons.homescreen")}
                </button>
            </div>

            <BattleLog entries={props.logEntries} onSendMessage={props.onSendMessage}/>
        </div>
    );
}