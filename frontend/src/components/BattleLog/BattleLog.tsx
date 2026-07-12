import "./BattleLog.css";
import type {LogEvent} from "../../protocol/LogEvent.ts";
import {useEffect, useRef, useState} from "react";
import {FaPaperPlane} from "react-icons/fa";

interface Props {
    entries: LogEvent[];
    onSendMessage: (message: string) => void;
}

export default function BattleLog(props: Props) {
    const logRef = useRef<HTMLDivElement>(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [props.entries]);

    function send() {
        const trimmed = message.trim();

        if (!trimmed) {
            return;
        }

        props.onSendMessage(trimmed);
        setMessage("");
    }

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

            <div className="chat-input">
                <input
                    type="text"
                    placeholder="Send a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            send();
                        }
                    }}
                />

                <button onClick={send}><FaPaperPlane/></button>
            </div>

        </div>
    );
}