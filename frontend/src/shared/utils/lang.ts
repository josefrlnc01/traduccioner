export function getAbbreviateLanguage(lang: string | null) {
        switch (lang) {
            case "Español":
                return "es"
            case "Inglés":
                return "en"
            case "Francés":
                return "fr"
            case "Italiano":
                return "it"
            default:
                return ""
        }
    }
