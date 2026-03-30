import { Request, Response } from "express";
import { convertVideoToAudio } from "../../shared/utils/video.js";
import { FileService } from "./file.service.js";
import { fileTranscriptionSchema, fileTranslationSchema } from "./file.schema.js";
import { AppError } from "../errors/AppError.js";
import { formatMinutes, getAudioDuration } from "../../shared/utils/audio.js";



export class FileController {
    static init = async (req: Request, res: Response) => {
        try {
            const ip = (req.headers['x-forwarded-for']?.toString().split(' ')[0] ||
                    req.socket.remoteAddress ||
                    'unknown').trim()
            const file = req.file
            const user = req.user
            if (!file) {
                return res.status(400).json({ error: 'No se recibio ningun archivo en el campo audio' })
            }
            
            const finalFilePath = await convertVideoToAudio(file)
            const {fileText, usedMinutes, audioDuration}= await FileService.getTranscriptionFromAudio(finalFilePath, user, ip)
            
            if (!fileText && !usedMinutes) return res.status(400).json({ error: 'Error al obtener transcripción' })

            const savedFile = await FileService.insertTranscription({ fileText, user, title: file.originalname, duration: audioDuration })
            
            return res.status(200).json({ fileText: savedFile, usedMinutes, user})
        } catch (error) {
            console.error('File transcription error:', error)
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({error: error.message})
            }
            if (error instanceof Error) {
                return res.status(500).json({ error: error.message })
            }
            return res.status(500).json({ error: 'Hubo un error al enviar el archivo' })
        }
    }

}


