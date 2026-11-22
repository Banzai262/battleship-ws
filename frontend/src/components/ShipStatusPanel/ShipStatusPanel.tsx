import type {ShipStatus} from "../../models/ShipStatus.ts";
import "./ShipStatusPanel.css";
import {useTranslation} from "react-i18next";

interface Props {
    ships: ShipStatus[];
}

export default function ShipStatusPanel(props: Props) {
    const {t} = useTranslation();

    function getHealthBar(ship: ShipStatus): string {
        return "░".repeat(ship.size - ship.health) + "█".repeat(ship.health);
    }

    function getIcon(ship: ShipStatus): string {
        if (ship.sunk)
            return "🔴";

        if (ship.hits.length > 0)
            return "🟡";

        return "🟢";
    }

    return (
        <div className="ship-status-panel">

            <h3>{t("panels.shipStatus.title")}</h3>

            {props.ships.map(ship => (
                <div key={ship.name} className="ship-status-row">
                <span className="ship-status-icon" aria-hidden="true">
                    {getIcon(ship)}
                </span>

                    <span className="ship-status-name">
                    {ship.name}
                </span>

                    <span className="ship-status-health"
                          role="img"
                          aria-label={`${ship.health}/${ship.size}`}>
                    {getHealthBar(ship)}
                </span>
                </div>
            ))}

        </div>
    );
}