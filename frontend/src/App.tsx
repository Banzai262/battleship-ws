import {BattleshipClient} from "./services/Websocket.ts";
import {useEffect, useState} from "react";
import CreateGamePage from "./pages/CreateGamePage.tsx";
import {Screens} from "./types/Screens.ts";
import WaitingPage from "./pages/WaitingPage.tsx";
import {ResponseTypes} from "./protocol/MessageType.ts";

const client = new BattleshipClient();

export default function App() {
    const [gameCode, setGameCode] = useState<string | null>(null);
    const [screen, setScreen] = useState(Screens.Create);

    useEffect(() => {
        async function init() {
            await client.connect();

            client.onMessage((message) => {
                switch (message.type) {
                    // TODO surement retravailler la gestion des erreurs
                    case ResponseTypes.Error:
                        alert(message.message);
                        break;

                    case ResponseTypes.GameCreated:
                        setGameCode(message.code);
                        setScreen(Screens.Waiting);
                        break;

                    case ResponseTypes.GameReady:
                    case ResponseTypes.Joined:
                        setScreen(Screens.Setup)
                        break;

                    default:
                        console.log(message);
                }
            });
        }

        init();

        return () => {
            client.disconnect();
        }
    }, []);

    switch (screen) {
        case Screens.Create:
            return (
                <CreateGamePage
                    onCreate={(name) => client.createGame(name)}
                    onJoin={(name, code) => client.joinGame(name, code)}
                />
            );

        case Screens.Waiting:
            return (
                <WaitingPage gameCode={gameCode!} />
            );

        case Screens.Setup:
            return (
                <div>
                    Setup screen. Va s'occuper du placement, drag and drop, random, rotation
                </div>
            );

        case Screens.Playing:
            return (
                <div>
                    Playing... S'occuper des tours et du click to fire
                </div>
            );

        case Screens.Finished:
            return (
                <div>
                    Game finished. Play again et return to lobby
                </div>
            );
    }
}

/*
TODO this is the plan

4. get state + setup ICI
5. faire les trucs qui manquent à partir de là
 */


/**
 * TODO éventuellement
 * type Screens =
 *     | "lobby"
 *     | "waiting"
 *     | "setup"
 *     | "playing"
 *     | "finished";
 *
 *     pour pouvoir faire const [screen, setScreen] = useState<Screens>("lobby");
 *
 *     et un truc du genre
 *
 *     switch (screen) {
 *     case Screens.Create:
 *         return <CreateGamePage />;
 *
 *     case Screens.Waiting:
 *         return <WaitingPage />;
 *
 *     case Screens.Setup:
 *         return <SetupPage />;
 *
 *     case Screens.Playing:
 *         return <GamePage />;
 *
 *     case Screens.Finished:
 *         return <GameOverPage />;
 * }
 *
 * on peut déduire le screen selon le state
 *
 * interface GameState {
 *     phase: "setup" | "in_progress" | "finished";
 *
 *     currentPlayer: string;
 *
 *     yourBoard: Cell[][];
 *
 *     enemyBoard: Cell[][];
 *
 *     ships: ShipStatus[];
 *
 *     winner?: string;
 * }
 */