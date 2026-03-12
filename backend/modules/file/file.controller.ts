import { Request, Response } from "express";
import { transcribeWhisperAudio } from "../transcription/whisper.service.js";
import { convertVideoToAudio } from "../audio/audio.service.js";
import { translateText } from "../translation/translation.service.js";
import { createPath, insert } from "./file.service.js";


export class FileController {
    static init = async (req: Request, res: Response) => {
        try {
            const lang = String(req.params.lang)
            const file = req.file
            
            if (!file) {
                return res.status(400).json({ error: 'No se recibio ningun archivo en el campo audio' })
            }

            const filePath = await createPath(file)
            const finalFilePath = await convertVideoToAudio(filePath)
            const text = await transcribeWhisperAudio(finalFilePath)
            if (!text) return res.status(400).json({ error: 'Error al obtener transcripción' })
            if (lang === 'not') {
                return res.status(200).json({ text })
            }
            
            const translatedFile = await translateText(lang, text)
            console.log(translatedFile)
            return res.status(200).json({ text, translatedFile})
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Hubo un error al enviar el archivo' })
        }
    }

    static save = async (req: Request, res: Response) => {
        try {
            const {text, translatedFile} = req.body
            const user = req.user
            await insert({text, translatedFile, user})
            return res.status(201).send('Transcripción guardada correctamente')
        } catch (error) {
            console.error(error)
            return res.status(500).json({error: 'Hubo un error al guardar la transcripción'})
        }
    }
}


