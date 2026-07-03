import type {Coordinate} from "../../types/Coordinate.ts";
import "./TargetPanel.css";
import {type ShotOutcome, ShotOutcomeMap} from "../../types/ShotOutcome.ts";

interface Props {
    isMyTurn: boolean;
    hoveredCell: Coordinate | null;
    lastShotResult?: ShotOutcome;
    lastPlayer?: string;
}

export default function (props: Props) {
    const shotToDisplay = (): string => {
        const result = ShotOutcomeMap(props.lastShotResult);

        if (result === "-") {
            return result;
        }

        return `${ShotOutcomeMap(props.lastShotResult)} by player ${props.lastPlayer}`
    }


    const coordinateToString = (coordinate: Coordinate): string => {
        const [row, col] = coordinate;

        const column = String.fromCharCode(65 + col);

        return `${column}${row + 1}`;
    }

    return (
        <div>
            <h2>Targeting</h2>

            {!props.isMyTurn ? (
                <>
                    <p>⏳ Waiting for opponent...</p>
                    <p>The opponent is choosing a target.</p>
                </>
            ) : (
                <>
                    <p>
                        <strong>Target:</strong>{" "}
                        {props.hoveredCell ? coordinateToString(props.hoveredCell) : "-"}
                    </p>

                    <p>Click on an enemy cell to fire.</p>
                </>
            )}

            <hr/>

            <p>
                <strong>Last shot:</strong>
            </p>

            <p>{shotToDisplay()}</p>
        </div>
    );
}