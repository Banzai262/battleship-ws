interface Props {
    shipsSunk: number;
}

export default function EnemyFleetPanel (props: Props){
    return (
        <div className="enemy-fleet-panel">

            <hr/>

            <h2>Enemy fleet</h2>

            <div className="enemy-icons">
                {Array.from({ length: 5 }, (_, i) => (
                    <span key={i}>
                {i < props.shipsSunk ? "💥" : "⚪"}
            </span>
                ))}
            </div>

            <div className="enemy-counter">
                {props.shipsSunk} / 5 ships sunk
            </div>

        </div>
    );
}