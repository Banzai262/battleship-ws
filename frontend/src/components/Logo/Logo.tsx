import "./Logo.css";

interface Props {
    className?: string;
}

export default function Logo(props: Props) {
    return (
        <img
            src="/battleship.png"
            alt="Battleship"
            className={`logo ${props.className}`}/>
    );
}