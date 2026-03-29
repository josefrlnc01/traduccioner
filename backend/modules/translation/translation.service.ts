import { v2 } from "@google-cloud/translate"
import { start } from "node:repl"
import { AppError } from "../errors/AppError.js"

const { Translate } = v2

const translate = new Translate({
    projectId: process.env.PROJECT_ID,
    credentials: process.env.FIREBASE_SERVICE_ACCOUNT_JSON ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON) : undefined
})

export class TranslationService {

    static translateText = async (lang: string | null = null, segments: { start: number, end: number, text: string }[]) => {
        try {
            if (!lang) throw new AppError('Debes especificar un lenguaje', 400)

            // Extracción de código de lenguaje si tiene mas de una sigla
            const languageCode = lang.split(':')[0]
            
            const translatedSegments = await Promise.all(
                segments.map(async (s) => {
                    const [translation] = await translate.translate(s.text, languageCode)
                    return {
                        start: s.start,
                        end: s.end,
                        text: translation
                    }
                })
            )

            if (!translatedSegments) throw new AppError('No se pudo obtener la traducción', 400)
            return translatedSegments
        } catch (error) {
            console.error('Translation error:', error)
            if (error instanceof AppError) throw error
            throw new Error('Hubo un error durante la traducción')
        }
    }

}

