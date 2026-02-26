export function getAbbreviateLanguage(lang: string | null) {
        switch (lang) {
            case "Español":
                return "es"
            case "Ingles":
                return "en"
            case "Frances":
                return "fr"
            case "Italiano":
                return "it"
            default:
                return ""
        }
    }
