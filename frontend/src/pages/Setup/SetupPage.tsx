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

    const {t} = useTranslation();

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

    // TODO largeur des éléments (chat et banner)

    return (
        <>
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
                            <Trans i18nKey="setup.banner.fleetDeployedAndWaiting" components={{0: <strong/>}}/>
                        </>
                    ) : allShipsPlaced ? (
                        <>
                            ⚓ <strong>Your fleet is deployed!</strong> Review your ship placement, then
                            click <strong>{t("buttons.ready")}</strong> to signal you're ready for battle.
                        </>
                    ) : selectedShip ? (
                        <>
                            🚢{" "}
                            <Trans i18nKey="setup.banner.shipSelected"
                                   values={{ship: selectedShip.name}}
                                   components={{
                                       0: <strong/>,
                                       1: <span className="valid-preview"/>,
                                       2: <strong/>
                                   }}
                            />
                        </>
                    ) : (
                        <>
                            ℹ️ Select a ship from your fleet to begin placing it, or click
                            <strong> Place ships randomly</strong> to automatically deploy your fleet.
                        </>
                    )}
                </p>
            </div>

            <div className="setup-page">

                <div className="ship-panel">
                    <h3>Your fleet</h3>

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

                    <div className="fleet-status">
                        <div className="fleet-status-title">Fleet Status</div>

                        <div className={`fleet-status-value ${allShipsPlaced ? "complete" : ""}`}>
                            {allShipsPlaced
                                ? `✓ ${placedCount} / ${props.state.ships.length} ships placed`
                                : `${placedCount} / ${props.state.ships.length} ships placed`}
                        </div>
                    </div>

                    <div className="ship-actions">
                        <button onClick={() => setSelectedShip(null)} disabled={!selectedShip}>Unselect ship</button>
                        <button onClick={placeShipsRandomly} disabled={allShipsPlaced}>Place ships randomly</button>
                        <button onClick={placeShips} disabled={!allShipsPlaced || readyButtonClicked}>Ready</button>
                        {/*TODO add support for R to rotate later*/}
                        <button onClick={() => {
                            setOrientation(o => o === "horizontal" ? "vertical" : "horizontal");
                        }}
                                disabled={!selectedShip}>Rotate ship
                        </button>
                    </div>
                </div>

                <div className="panel">
                    <h2>Place your ships</h2>

                    <Board board={props.state.yourBoard}
                           disableCells={true}
                           showCoordinates={true}
                           placements={placedShips}
                           previewCells={previewCells}
                           occupiedCells={occupiedCells}
                           previewValid={previewValid}
                           onMouseLeave={() => setPreview(null)}
                           onCellHover={(r, c) => {
                               setPreview({row: r, col: c})
                           }}
                           onCellClick={(r, c) => {
                               if (!selectedShip) {
                                   return;
                               }

                               if (!previewValid) {
                                   // TODO at some point, notification service
                                   alert("Ship cannot be placed here");
                                   return;
                               }

                               setPlacedShips(old => [
                                   ...old.filter(p => p.ship.name !== selectedShip.name),
                                   {
                                       ship: selectedShip,
                                       row: r,
                                       col: c,
                                       horizontal: orientation === "horizontal"
                                   }
                               ]);

                               previewCells.forEach(cell => {
                                   props.state.yourBoard[cell[0]][cell[1]] = CellState.Ship;
                               });

                               setSelectedShip(null);
                           }}
                    />
                </div>

            </div>
            <BattleLog entries={props.logEntries} onSendMessage={props.onSendMessage}/>
        </>
    );
}
