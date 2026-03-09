import { Request, Response } from "express";
import fs from 'node:fs/promises'
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { transcribeWhisperAudio } from "../transcription/whisper.service.js";
import { convertVideoToAudio } from "../audio/audio.service.js";
import { translateText } from "../translation/translation.service.js";
import { createFile } from "fs-extra";
import { createPath } from "./file.service.js";
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
            const translated = await translateText(lang, text)
            console.log(translated)
            return res.status(200).json({ text, translated})
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Hubo un error al enviar el archivo' })
        }
    }
}


