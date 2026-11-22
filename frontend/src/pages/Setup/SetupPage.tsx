import type {GameState} from "../../types/GameState.ts";
import Board from "../../components/Board/Board.tsx";
import "./SetupPage.css";
import BattleLog from "../../components/BattleLog/BattleLog.tsx";
import type {LogEvent} from "../../protocol/LogEvent.ts";
import {useState} from "react";
import type {ShipStatus} from "../../models/ShipStatus.ts";
import type {ShipToPlace} from "../../types/ShipToPlace.ts";
import {PreviewValidationService} from "../../services/PreviewValidationService.ts";
import {CellState} from "../../types/CellState.ts";
import {Trans, useTranslation} from "react-i18next";
import {useMediaQuery} from "../../hooks/useMediaQuery.ts";

interface Props {
    state: GameState;
    logEntries: LogEvent[];
    onSendMessage: (message: string) => void;
    onRandomPlacement: () => void;
    onAllShipsReady: (ships: ShipToPlace[]) => void;
}

export default function SetupPage(props: Props) {
    const previewValidationService = new PreviewValidationService();

    const [selectedShip, setSelectedShip] = useState<ShipStatus | null>(null);
    const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal");

    const [preview, setPreview] = useState<{ row: number, col: number } | null>(null);
    const [placedShips, setPlacedShips] = useState<ShipToPlace[]>([]);

    const shipPreview = previewValidationService.getPreview(placedShips, preview?.row, preview?.col, orientation === "horizontal", selectedShip)

    const previewCells = preview && selectedShip ? shipPreview.positions : [];
    const occupiedCells = previewValidationService.computeOccupiedCells(placedShips);
    const previewValid = shipPreview.valid;

    const placedCount = placedShips.length;
    const allShipsPlaced = placedCount === props.state.ships.length;

    const [readyButtonClicked, setReadyButtonClicked] = useState<boolean>(false);

    const isTouch = useMediaQuery("(hover: none)");

    const {t} = useTranslation();

    function confirmPlacement() {
        if (!selectedShip || !preview) return;

        if (!previewValid) {
            alert(t("error.wrongPlacement")); // TODO notification service
            return;
        }

        setPlacedShips(old => [
            ...old.filter(p => p.ship.name !== selectedShip.name),
            {
                ship: selectedShip,
                row: preview.row,
                col: preview.col,
                horizontal: orientation === "horizontal"
            }
        ]);

        previewCells.forEach(cell => {
            props.state.yourBoard[cell[0]][cell[1]] = CellState.Ship;
        });

        setSelectedShip(null);
        setPreview(null);
    }

    function placeShips() {
        setReadyButtonClicked(true);
        props.onAllShipsReady(placedShips);
    }

    function placeShipsRandomly() {
        const placed: ShipToPlace[] = [];
        setPlacedShips([]);
        props.state.ships.forEach((ship) => {
            const toPlace: ShipToPlace = {
                ship: ship,
                row: 0,
                col: 0,
                horizontal: true
            };
            placed.push(toPlace);
        });

        setPlacedShips(placed);
        setReadyButtonClicked(true);
        props.onRandomPlacement();
    }

    return (
        <>
            <div className="setup-container">
                <div
                    className={`setup-banner ${
                        allShipsPlaced
                            ? "ready"
                            : selectedShip
                                ? "ship-selected"
                                : "no-selection"
                    }`}
                >
                    <p>
                        {allShipsPlaced && readyButtonClicked ? (
                            <>
                                ⚓{" "}
                                <Trans i18nKey="setup.banner.fleetDeployedAndWaiting" components={{1: <strong/>}}/>
                            </>
                        ) : allShipsPlaced ? (
                            <>
                                ⚓{" "}
                                <Trans i18nKey="setup.banner.fleetDeployed" components={{1: <strong/>, 2: <strong/>}}/>
                            </>
                        ) : selectedShip ? (
                            <>
                                🚢{" "}
                                <Trans i18nKey="setup.banner.shipSelected"
                                       values={{ship: selectedShip.name}}
                                       components={{
                                           1: <strong/>,
                                           2: <span className="valid-preview"/>,
                                           3: <strong/>
                                       }}
                                />
                            </>
                        ) : (
                            <>
                                ℹ️{" "}
                                <Trans i18nKey="setup.banner.selectShipInstructions" components={{1: <strong/>}}/>
                            </>
                        )}
                    </p>
                </div>

                <div className="setup-page">

                    <div className="ship-panel">
                        <h3>{t("setup.yourFleet")}</h3>

                        <div className="ship-list">
                        {props.state.ships.map(ship => {
                            const placed = placedShips.some(s => s.ship.name === ship.name);
                            const selected = selectedShip?.name === ship.name;

                            return (
                                <div key={ship.name}
                                     className={`ship-placeholder ${selected ? "selected" : ""} ${placed ? "placed" : ""}`}
                                     onClick={() => {
                                         if (!placed && !allShipsPlaced) {
                                             setSelectedShip(ship)
                                         }
                                     }}>
                                <span className="ship-icon">
                                    {placed ? "✓" : ""}
                                </span>
                                    <span>{ship.name}</span>
                                </div>
                            );
                        })}
                        </div>

                        <div className="fleet-status">
                            <div className="fleet-status-title">{t("setup.fleetStatus")}</div>

                            <div className={`fleet-status-value ${allShipsPlaced ? "complete" : ""}`}>
                                {allShipsPlaced
                                    ? `✓ ${placedCount} / ${props.state.ships.length} ${t("setup.shipsPlaced")}`
                                    : `${placedCount} / ${props.state.ships.length} ${t("setup.shipsPlaced")}`}
                            </div>
                        </div>

                        <div className="ship-actions">
                            {isTouch && (
                                <button className="confirm primary"
                                        onClick={confirmPlacement}
                                        disabled={!selectedShip || !preview || !previewValid}>
                                    {t("buttons.confirmPlacement")}
                                </button>
                            )}

                            <button onClick={() => setOrientation(o => o === "horizontal" ? "vertical" : "horizontal")}
                                    disabled={!selectedShip}>
                                {t("buttons.rotateShip")}
                            </button>
                            <button onClick={() => setSelectedShip(null)}
                                    disabled={!selectedShip}>
                                {t("buttons.unselectShip")}
                            </button>

                            <button onClick={placeShipsRandomly}
                                    disabled={allShipsPlaced}>
                                {t("buttons.placeRandomly")}
                            </button>
                            <button className="primary"
                                    onClick={placeShips}
                                    disabled={!allShipsPlaced || readyButtonClicked}>
                                {t("buttons.ready")}
                            </button>
                        </div>
                    </div>

                    <div className="panel">
                        <h2>{t("setup.placeYourShips")}</h2>

                        <Board board={props.state.yourBoard}
                               showCoordinates={true}
                               placements={placedShips}
                               previewCells={previewCells}
                               occupiedCells={occupiedCells}
                               previewValid={previewValid}
                               onMouseLeave={isTouch ? undefined : () => setPreview(null)}
                               onCellHover={isTouch ? undefined : (r, c) => setPreview({row: r, col: c})}
                               onCellClick={(r, c) => {
                                   if (!selectedShip) {
                                       return;
                                   }

                                   if (isTouch) {
                                       setPreview({row: r, col: c});   // tap = preview only
                                   } else {
                                       confirmPlacement();              // click = place, as before
                                   }
                               }}
                        />
                    </div>

                </div>
                <BattleLog entries={props.logEntries} onSendMessage={props.onSendMessage}/>
            </div>
        </>
    );
}
