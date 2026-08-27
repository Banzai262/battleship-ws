import {useTranslation} from "react-i18next";

interface Props {
    gameCode: string;
}

export default function WaitingPage({ gameCode }: Props) {
    const {t} = useTranslation();

    return (
        <div>
            <h1>{t("waiting.title")}</h1>

            <p>{t("waiting.shareCode")}:</p>

            <h2>{gameCode}</h2>

            <p>{t("waiting.waitingForOpponent")}...</p>
        </div>
    );
}

/*
TODO on pourra ajouter des fonctions genre QR code, copy to clipboard, etc
 */