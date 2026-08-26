import "./EnemyFleetPanel.css";
import {Trans, useTranslation} from "react-i18next";

interface Props {
    shipsSunk: number;
}

export default function EnemyFleetPanel (props: Props){
    const {t} = useTranslation();

    return (
        <div className="enemy-fleet-panel">

            <hr/>

            <h2>{t("panels.enemyFleet.title")}</h2>

            <div className="enemy-icons">
                {Array.from({ length: 5 }, (_, i) => (
                    <span key={i}>
                {i < props.shipsSunk ? "💥" : "⚪"}
            </span>
                ))}
            </div>

            <div className="enemy-counter">
                <Trans i18nKey="panels.enemyFleet.shipsSunk" values={{sunk: props.shipsSunk}}/>
            </div>

        </div>
    );
}