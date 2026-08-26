import type {Coordinate} from "../../types/Coordinate.ts";
import "./TargetPanel.css";
import {type ShotOutcome, ShotOutcomeMap} from "../../types/ShotOutcome.ts";
import {useTranslation} from "react-i18next";

interface Props {
    isMyTurn: boolean;
    hoveredCell: Coordinate | null;
    lastShotResult?: ShotOutcome;
    lastPlayer?: string;
}

export default function (props: Props) {
    const {t} = useTranslation();

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
            <h2>{t("panels.target.title")}</h2>

            {!props.isMyTurn ? (
                <>
                    <p>{t("panels.target.waiting")}</p>
                    <p>{t("panels.target.opponentIsChoosing")}</p>
                </>
            ) : (
                <>
                    <p>
                        <strong>{t("panels.target.target")}</strong>{" "}
                        {props.hoveredCell ? coordinateToString(props.hoveredCell) : "-"}
                    </p>

                    <p>{t("panels.target.clickToFire")}</p>
                </>
            )}

            <hr/>

            <p>
                <strong>{t("panels.target.lastShot")}</strong>
            </p>

            <p>{shotToDisplay()}</p>
        </div>
    );
}