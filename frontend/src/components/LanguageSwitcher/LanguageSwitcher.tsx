import "./LanguageSwitcher.css";
import {useTranslation} from "react-i18next";

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    return (
        <div className="language-switcher">
            <button className={i18n.language === "fr" ? "active" : ""} onClick={() => i18n.changeLanguage("fr")}>
                🇫🇷 FR
            </button>

            <button className={i18n.language === "en" ? "active" : ""} onClick={() => i18n.changeLanguage("en")}>
                🇬🇧 EN
            </button>
        </div>
    );
}

// TODO changer le style du switcher pour que ça fit plus
// aussi un drapeau queb genre 🇲🇶