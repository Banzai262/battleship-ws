import "./BattleLog.css";
import type {LogEvent} from "../../protocol/LogEvent.ts";
import {useEffect, useRef, useState} from "react";
import {FaPaperPlane} from "react-icons/fa";
import {Trans, useTranslation} from "react-i18next";

interface Props {
    entries: LogEvent[];
    onSendMessage: (message: string) => void;
}

export default function BattleLog(props: Props) {
    const logRef = useRef<HTMLDivElement>(null);
    const [message, setMessage] = useState("");

    const {t} = useTranslation();

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
            <h2>{t("battlelog.title")}</h2>

            <div className="battle-log-content" ref={logRef}>
                {props.entries.map((entry, index) => (
                    <div key={index} className={`entry ${entry.kind.toLowerCase()}`}>
                        <Trans i18nKey={entry.messageKey} values={entry.interpolationData}/>
                    </div>
                ))}
            </div>

            <div className="chat-input">
                <input
                    type="text"
                    placeholder={t("battlelog.placeholder")}
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