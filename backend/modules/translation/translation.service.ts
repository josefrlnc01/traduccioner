import { v2 } from "@google-cloud/translate"
import { start } from "node:repl"
import { AppError } from "../errors/AppError.js"

const { Translate } = v2

const translate = new Translate({
    projectId: process.env.PROJECT_ID,
    keyFilename: process.env.FIREBASE_SERVICE_ACCOUNT_JSON  // Assuming the file is in the backend root
})

export class TranslationService {

    static translateText = async (lang: string | null = null, segments: { start: number, end: number, text: string }[]) => {
        try {
            if (!lang) throw new AppError('Debes especificar un lenguaje', 400)

            // Extract the language code if it contains additional parts (e.g., 'pl:1' -> 'pl')
            const languageCode = lang.split(':')[0]
            console.log('Translating to language:', languageCode)
            console.log('Number of segments:', segments.length)
            const totalTextLength = segments.reduce((sum, s) => sum + s.text.length, 0)
            console.log('Total text length:', totalTextLength)
            if (totalTextLength > 100000) {
                throw new AppError('El texto es demasiado largo para traducir', 400)
            }

            const translatedSegments = await Promise.all(
                segments.map(async (s) => {
                    if (!s.text || s.text.trim() === '') {
                        console.log('Skipping empty segment')
                        return {
                            start: s.start,
                            end: s.end,
                            text: ''
                        }
                    }
                    console.log('Translating segment:', s.text.substring(0, 50) + '...')
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

