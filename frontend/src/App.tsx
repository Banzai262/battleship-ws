import {BattleshipClient} from "./services/Websocket.ts";
import {useEffect, useState} from "react";
import CreateGamePage from "./pages/CreateGame/CreateGamePage.tsx";
import {Screens} from "./types/Screens.ts";
import WaitingPage from "./pages/Waiting/WaitingPage.tsx";
import {ResponseTypes} from "./protocol/MessageType.ts";
import SetupPage from "./pages/Setup/SetupPage.tsx";
import type {GameState} from "./types/GameState.ts";
import {GamePhases} from "./types/GamePhase.ts";
import "./App.css";
import BattlePage from "./pages/Battle/BattlePage.tsx";
import GameOverPage from "./pages/GameOver/GameOverPage.tsx";
import AppLayout from "./components/AppLayout/AppLayout.tsx";
import type {LogEvent} from "./protocol/LogEvent.ts";

const client = new BattleshipClient();

export default function App() {
    const [playerName, setPlayerName] = useState("");
    const [gameCode, setGameCode] = useState<string | null>(null);
    const [screen, setScreen] = useState(Screens.Create);
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const [battleLog, setBattleLog] = useState<LogEvent[]>([]);

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

                    case ResponseTypes.Log:
                        setBattleLog(old => [...old, message]);
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
                    <AppLayout>
                        <CreateGamePage
                            onCreate={(name) => {
                                setPlayerName(name);
                                client.createGame(name)
                            }}
                            onJoin={(name, code) => {
                                setPlayerName(name);
                                client.joinGame(name, code)
                            }}
                        />
                    </AppLayout>
                );
                break;

            case Screens.Waiting:
                page = (
                    <AppLayout>
                        <WaitingPage gameCode={gameCode!}/>
                    </AppLayout>
                );
                break
        }
    }

    switch (gameState?.phase) {
        case GamePhases.SETUP:
            page = (
                <AppLayout>
                    <SetupPage state={gameState!} onRandomPlacement={() => client.placeRandom()}/>
                </AppLayout>
            );
            break;

        case GamePhases.IN_PROGRESS:
            return (
                <AppLayout>
                    <BattlePage state={gameState} playerName={playerName} logEntries={battleLog} onFire={(row, col) => {
                        client.fire(row, col)
                    }}/>
                </AppLayout>
            );

        case GamePhases.FINISHED:
            return (
                <AppLayout>
                    <GameOverPage
                        won={gameState.winner === playerName}
                        ships={gameState.ships}
                        logEntries={battleLog}
                        onReplay={() => {
                        }} onBackHome={() => {
                        client.disconnect();
                        window.location.reload();
                    }}/>
                </AppLayout>
            );
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