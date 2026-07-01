import type {GameState} from "../types/GameState.ts";
import Board from "../components/Board.tsx";
import "./SetupPage.css";

interface Props {
    state: GameState;

    onRandomPlacement: () => void;
}

export default function SetupPage({state, onRandomPlacement}: Props) {
    return (
        <div className="setup-page">
            <div className="ship-panel">
                <h3>Your fleet</h3>

                {/*TODO later*/}
                {/*<ShipStatus*/}
                {/*    ships={state.ships}*/}
                {/*/>*/}
                {state.ships.map(ship => (
                    <div key={ship.name} className="ship-placeholder">
                        {ship.name}
                    </div>
                ))}

                {/*on pourra aussi se fier à ces ships pour montrer la vie et autres effets visuels*/}

                <button onClick={onRandomPlacement}>
                    Place ships randomly
                </button>
            </div>

            <div className="board-panel">
                <h2>Place your ships</h2>

                <Board board={state.yourBoard}/>
            </div>
        </div>
    );
}