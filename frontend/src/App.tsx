import {BattleshipClient} from "./services/Websocket.ts";
import {useEffect, useState} from "react";
import CreateGamePage from "./pages/CreateGamePage.tsx";
import {Screens} from "./types/Screens.ts";
import WaitingPage from "./pages/WaitingPage.tsx";
import {ResponseTypes} from "./protocol/MessageType.ts";
import SetupPage from "./pages/SetupPage.tsx";
import type {GameState} from "./types/GameState.ts";
import {GamePhases} from "./types/GamePhase.ts";
import "./App.css";

const client = new BattleshipClient();

export default function App() {
    const [gameCode, setGameCode] = useState<string | null>(null);
    const [screen, setScreen] = useState(Screens.Create);
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [notification, setNotification] = useState<string | null>(null);

    let page;

    useEffect(() => {
        async function init() {
            await client.connect();


            client.onMessage((message) => {
                switch (message.type) {
                    // TODO surement some kind of toast rouge
                    case ResponseTypes.Error:
                        alert(message.message);
                        break;

                    case ResponseTypes.Notification:
                        // TODO toast bleu ou vert
                        setNotification(message.message);

                        setTimeout(() => {
                            setNotification(null);
                        }, 3000);
                        break;

                    case ResponseTypes.GameCreated:
                        setGameCode(message.code);
                        setScreen(Screens.Waiting);
                        break;

                    case ResponseTypes.GameReady:
                        client.getState();
                        break

                    case ResponseTypes.State:
                        setGameState(message);
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

    if (!gameState) {
        switch (screen) {
            case Screens.Create:
                page = (
                    <CreateGamePage
                        onCreate={(name) => client.createGame(name)}
                        onJoin={(name, code) => client.joinGame(name, code)}
                    />
                );
                break;

            case Screens.Waiting:
                page = (
                    <WaitingPage gameCode={gameCode!}/>
                );
                break
        }
    }

    switch (gameState?.phase) {
        case GamePhases.SETUP:
            page = (
                <SetupPage state={gameState!} onRandomPlacement={() => client.placeRandom()}/>
            );
            break;

        case GamePhases.IN_PROGRESS:
            // return <BattlePage state={gameState} />;
            return "TODO page de jeu"

        case GamePhases.FINISHED:
            // return <VictoryPage state={gameState} />;
            return "TODO page de fin de partie";
    }

    /**
     * TODO éventuellement dans un toast component (va falloir un toast service anyway pour faire pop des notifications partout
     *
     * <NotificationToast
     *     message={notification}
     * />
     *
     * {page}
     */
    return (
        <>
            {notification && (
                <div className="notification">
                    {notification}
                </div>
            )}

            {page}
        </>
    );
}

/**
 * TODO plan
 * Setup page
 * Two boards
 * Random placement DONE
 * Ship health panel
 * Manual placement
 * Click to place
 * Rotate button
 * Drag & drop
 * Ship dragging
 * Ship rotation
 * Collision preview
 * Battle page
 * Click enemy board to fire
 * Turn indicator
 * Animations
 * Hit
 * Miss
 * Ship sunk
 * Current player glow
 * Reconnect support
 * Restore state after refresh
 */