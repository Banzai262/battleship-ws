interface Props {
    gameCode: string;
}

export default function WaitingPage({ gameCode }: Props) {
    return (
        <div>
            <h1>Game Created</h1>

            <p>Share this code with your opponent:</p>

            <h2>{gameCode}</h2>

            <p>Waiting for opponent...</p>
        </div>
    );
}

/*
TODO on pourra ajouter des fonctions genre QR code, copy to clipboard, etc
 */