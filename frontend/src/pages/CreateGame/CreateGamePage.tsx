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
// TODO certainement revoir un peu la présentation et la taille des trucs quand on change la langue

    return (
        <div>
            <h2>{t("createGame.title")}</h2>

            <p>
                <input
                    type="text"
                    placeholder={t("createGame.namePlaceholder")}
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                />

                <button
                    onClick={() => onCreate(playerName)}
                    disabled={!(!code.trim() && playerName.trim())}
                >
                    {t("buttons.createGame")}
                </button>
            </p>

            <p>
                <text>
                    {t("createGame.haveCode")}
                </text>
            </p>

            <p>
                <input
                    type="text"
                    placeholder={t("createGame.codePlaceholder")}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
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