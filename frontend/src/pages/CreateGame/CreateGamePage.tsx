import {useState} from "react";

interface Props {
    onCreate: (playerName: string) => void;
    onJoin: (playerName: string, code: string) => void;
}

export default function CreateGamePage({onCreate, onJoin}: Props) {
    const [playerName, setPlayerName] = useState('');
    const [code, setCode] = useState('');
// TODO certainement revoir un peu la présentation

    return (
        <div>
            <h1>Battleship</h1>
            <p>
                TODO J'aimerais un genre de logo pour le nom Battleship, ou en tout cas un truc mieux
            </p>

            <p>
                <input
                    type="text"
                    placeholder="Player name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                />

                <button
                    onClick={() => onCreate(playerName)}
                    disabled={!(!code.trim() && playerName.trim())}
                >
                    Create Game
                </button>
            </p>

            <p>
                <text>
                    If you already have a game code, enter it below
                </text>
            </p>

            <p>
                <input
                    type="text"
                    placeholder="Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />

                <button
                    onClick={() => onJoin(playerName, code)}
                    disabled={!(code.trim() && playerName.trim())}
                >
                    Join Game
                </button>
            </p>
        </div>
    );
}