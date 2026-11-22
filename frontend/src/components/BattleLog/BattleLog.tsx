import "./BattleLog.css";
import type {LogEvent} from "../../protocol/LogEvent.ts";
import {useEffect, useRef, useState} from "react";
import {FaComments, FaPaperPlane, FaTimes} from "react-icons/fa";
import {Trans, useTranslation} from "react-i18next";
import {LogKind} from "../../types/LogKind.ts";

interface Props {
    entries: LogEvent[];
    onSendMessage: (message: string) => void;
}

export default function BattleLog(props: Props) {
    const logRef = useRef<HTMLDivElement>(null);
    const [message, setMessage] = useState("");

    // mobile drawer state (ignored on desktop, where CSS always shows the log)
    const [open, setOpen] = useState(false);
    const [seenChats, setSeenChats] = useState(0);

    const {t} = useTranslation();

    const chatCount = props.entries.filter(e => e.kind === LogKind.CHAT).length;
    const unread = open ? 0 : Math.max(0, chatCount - seenChats);

    // everything is considered read while the drawer is open
    useEffect(() => {
        if (open) {
            setSeenChats(chatCount);
        }
    }, [open, chatCount]);

    // scroll to the bottom on new entries, and when the drawer opens
    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [props.entries]);

    // Escape closes the drawer
    useEffect(() => {
        if (!open) {
            return;
        }

        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    function send() {
        const trimmed = message.trim();

        if (!trimmed) {
            return;
        }

        props.onSendMessage(trimmed);
        setMessage("");
    }

    return (
        <>
            <button
                className="battle-log-tab"
                onClick={() => setOpen(true)}
                aria-label={t("battlelog.open")}
                aria-expanded={open}
            >
                <FaComments/>
                {unread > 0 && <span className="battle-log-badge">{unread > 9 ? "9+" : unread}</span>}
            </button>

            <div
                className={`battle-log-backdrop ${open ? "open" : ""}`}
                onClick={() => setOpen(false)}
                aria-hidden="true"
            />

            <div className={`battle-log ${open ? "open" : ""}`}>
                <div className="battle-log-header">
                    <h2>{t("battlelog.title")}</h2>
                    <button
                        className="battle-log-close"
                        onClick={() => setOpen(false)}
                        aria-label={t("battlelog.close")}
                    >
                        <FaTimes/>
                    </button>
                </div>

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
                        enterKeyHint="send"
                        autoComplete="off"
                    />

                    <button onClick={send} aria-label={t("battlelog.send")}><FaPaperPlane/></button>
                </div>
            </div>
        </>
    );
}