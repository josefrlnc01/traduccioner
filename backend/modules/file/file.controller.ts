import { Request, Response } from "express";
import { transcribeWhisperAudio } from "../transcription/whisper.service.js";
import { convertVideoToAudio } from "../../shared/utils/video.js";
import { translateText } from "../translation/translation.service.js";
import { FileService } from "./file.service.js";
import { fileTranscriptionSchema, fileTranslationSchema } from "./file.schema.js";
import { AppError } from "../errors/AppError.js";
import { getAudioDuration } from "../../shared/utils/audio.js";


export class FileController {
    static init = async (req: Request, res: Response) => {
        try {
            const lang = String(req.params.lang)
            const file = req.file
            const user = req.user
            if (!file) {
                return res.status(400).json({ error: 'No se recibio ningun archivo en el campo audio' })
            }
            
            const finalFilePath = await convertVideoToAudio(file)
            const fileText = await FileService.incrementMinutes(finalFilePath, user)
            if (!fileText) return res.status(400).json({ error: 'Error al obtener transcripción' })
            if (lang === 'not') {
                return res.status(200).json({ fileText })
            }

            const translatedFile = await translateText(lang, fileText)
            console.log(translatedFile)
            return res.status(200).json({ fileText, translatedFile })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Hubo un error al enviar el archivo' })
        }
    }

    static saveTranscription = async (req: Request, res: Response) => {
        try {
            const data = fileTranscriptionSchema.parse(req.body)
            const user = req.user
            await FileService.insertTranscription({ data, user })
            return res.status(201).send('Transcripción guardada correctamente')
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({error: error.message})
            }
            return res.status(500).json({ error: 'Hubo un error al guardar la transcripción' })
        }
    }


    static saveTranslation = async (req: Request, res: Response) => {
        try {
            const data = fileTranslationSchema.parse(req.body)
            console.log('body', req.body)
            const user = req.user
            await FileService.insertTranslation({data, user})
            return res.status(201).send('Traducción guardada correctamente')
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({error: error.message})
            }
            return res.status(500).json({ error: 'Hubo un error al guardar la traducción' })
        }
    }
}


