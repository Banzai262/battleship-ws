import "./BattleLog.css";
import type {LogEvent} from "../../protocol/LogEvent.ts";
import {useEffect, useRef} from "react";

interface Props {
    entries: LogEvent[];
}

export default function BattleLog(props: Props) {
    const logRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [props.entries]);

    return (
        <div className="battle-log">
            <h2>Battle Log</h2>

            <div className="battle-log-content" ref={logRef}>
                {props.entries.map((entry, index) => (
                    <div key={index} className={`entry ${entry.kind.toLowerCase()}`}>
                        {entry.message}
                    </div>
                ))}
            </div>

        </div>
    );
}