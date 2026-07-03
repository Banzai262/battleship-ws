import type {ShipStatus} from "../../models/ShipStatus.ts";
import "./ShipStatusPanel.css";

interface Props {
    ships: ShipStatus[];
}

export default function ShipStatusPanel(props: Props) {
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
        <div className="ship-panel">

            <h2>Your fleet</h2>

            {props.ships.map(ship => (
                <div key={ship.name} className="ship-row">
                    <span className="ship-icon">
                        {getIcon(ship)}
                    </span>

                    <span className="ship-name">
                        {ship.name}
                    </span>

                    <span className="ship-health">
                        {getHealthBar(ship)}
                    </span>
                </div>
            ))}

        </div>
    );
}