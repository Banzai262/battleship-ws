import {useState} from "react";
import {useTranslation} from "react-i18next";

interface Props {
    onCreate: (playerName: string) => void;
    onJoin: (playerName: string, code: string) => void;
}

export default function CreateGamePage({onCreate, onJoin}: Props) {
    const [playerName, setPlayerName] = useState('');
    const [code, setCode] = useState('');

    const {t} = useTranslation();

    const hasName = playerName.trim().length > 0;
    const hasCode = code.trim().length > 0;

    return (
        <div className="create-game">
            <h2>{t("createGame.title")}</h2>

            <p>
                <input
                    type="text"
                    name="playerName"
                    placeholder={t("createGame.namePlaceholder")}
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    autoComplete="nickname"
                    enterKeyHint="done"
                />

                <button
                    onClick={() => onCreate(playerName)}
                    disabled={hasCode || !hasName}
                >
                    {t("buttons.createGame")}
                </button>
            </p>

            <p className="create-game__divider">{t("createGame.haveCode")}</p>

            <p>
                <input
                    type="text"
                    name="gameCode"
                    placeholder={t("createGame.codePlaceholder")}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    autoComplete="off"
                    autoCapitalize="characters"
                    autoCorrect="off"
                    spellCheck={false}
                    enterKeyHint="go"
                />

                <button
                    onClick={() => onJoin(playerName, code)}
                    disabled={!(code.trim() && playerName.trim())}
                >
                    {t("buttons.joinGame")}
                </button>
            </p>
        </div>
    );
}
