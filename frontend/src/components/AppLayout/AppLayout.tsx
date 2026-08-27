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
            <LanguageSwitcher />
            <Logo/>
            {props.children}
        </div>
    );
}