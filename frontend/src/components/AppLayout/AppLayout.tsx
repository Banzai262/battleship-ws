import type {ReactNode} from "react";
import Logo from "../Logo/Logo.tsx";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher.tsx";
import "./AppLayout.css";

interface Props {
    children: ReactNode;
}

export default function AppLayout(props: Props) {
    return (
        <div className="app-layout">
            <header className="app-layout__header">
                <div className="app-layout__logo">
                    <Logo/>
                </div>
                <div className="app-layout__lang">
                    <LanguageSwitcher/>
                </div>
            </header>

            <main className="app-layout__content">
                {props.children}
            </main>
        </div>
    );
}