import type {ReactNode} from "react";
import Logo from "../Logo/Logo.tsx";

interface Props {
    children: ReactNode;
}

export default function AppLayout(props: Props) {
    return (
        <div className="app-layout">
            <Logo/>
            {props.children}
        </div>
    );
}