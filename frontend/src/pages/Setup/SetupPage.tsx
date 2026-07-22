import type {GameState} from "../../types/GameState.ts";
import Board from "../../components/Board/Board.tsx";
import "./SetupPage.css";
import BattleLog from "../../components/BattleLog/BattleLog.tsx";
import type {LogEvent} from "../../protocol/LogEvent.ts";
import {useState} from "react";
import type {ShipStatus} from "../../models/ShipStatus.ts";
import type {ShipToPlace} from "../../types/ShipToPlace.ts";
import {PreviewValidationService} from "../../services/PreviewValidationService.ts";

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
    const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal"); // TODO à voir

    const [preview, setPreview] = useState<{ row: number, col: number } | null>(null);
    const [placedShips, setPlacedShips] = useState<ShipToPlace[]>([]);

    const shipPreview = previewValidationService.getPreview(placedShips, preview?.row, preview?.col, orientation === "horizontal", selectedShip)

    const previewCells = preview && selectedShip ? shipPreview.positions : [];
    const occupiedCells = previewValidationService.computeOccupiedCells(placedShips);
    const previewValid = shipPreview.valid;

    const placedCount = placedShips.length;
    const allShipsPlaced = placedCount === props.state.ships.length;

    function placeShips() {
        props.onAllShipsReady(placedShips);
    }

    return (
        <>
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
                                     setSelectedShip(ship)
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
                        <button onClick={props.onRandomPlacement}>Place ships randomly</button>
                        {/*TODO voir pour ne pas hardcode le 5*/}
                        <button onClick={placeShips} disabled={placedShips.length !== 5}>Ready</button>
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

                               setSelectedShip(null);
                           }}
                    />
                </div>

            </div>
            <BattleLog entries={props.logEntries} onSendMessage={props.onSendMessage}/>
        </>
    );
}

/**
 * TODO Donc je vais implémenter un click to place sur les bateaux, parce que le drag n drop de html 5 est un peu du caca
 *
 * La logique est la suivante:
 * 1. Cliquer sur un bateau pour le selectionner
 * 2. On déplace la souris au-dessus du board. Ça va afficher un preview en vert ou rouge. Touche R pour la rotation.
 * 3. Quand le preview est vert, on peut cliquer pour placer le bateau à cet endroit. Le bateau devient comme grisé dans la liste à gauche.
 * 4. On fait ça pour tous les bateaux.
 * 5. Quand tout est placé, le bouton Ready ou Place se débloque.
 * 6. On fait le call au backend, qui place tous les ships d'une shot.
 *
 * Le bouton Random existe encore, et pour l'instant, il override les bateaux déjà placés. On verra plus tard pour changer ceci.
 *
 * On va envoyer un array de place ship command au backend, avec le nom, les coord de départ, et horizontal True ou False
 */


/*
TODO

PROCHAINES ÉTAPES:

gérer le preview qui est ici, ça doit ajouter toutes les cells, donc faut une liste (ou la longueur du ship?)

probablement qu'on envoit le preview dans le board
si la cell est dans le preview, on le render différemment

durant le preview, faut valider si le placement est bon pour highlighter de la bonne couleur (service de validation)
donc durant preview, en hoverant, ça render en vert pâle et pointillé si validation ok, sinon rouge pâle et pointillé
quand on clique pour placer, ça va être en vert plus foncé sans pointillés

quand on clique, faire toute la logique de setter un ShipToPlace

puis quand ready, la logique de caller le backend
 */