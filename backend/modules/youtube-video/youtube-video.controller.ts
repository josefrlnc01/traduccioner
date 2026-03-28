import { Request, Response } from "express";
import { YoutubeVideoService } from "./youtube-video.service.js";
import { youtubeVideoTranscriptionSchema, youtubeVideoTranslationSchema } from "./youtube-video.schema.js";
import { RequestProps, DataOfId } from "./youtube-video.types.js";
import fs from "node:fs/promises"
import getVideoId from "get-video-id";
import { AppError } from "../errors/AppError.js";

export class YoutubeVideoController {
    static init = async (req: Request, res: Response) => {
        console.log('iniciando petición')
        const ip = (req.headers['x-forwarded-for']?.toString().split(' ')[0] ||
        req.socket.remoteAddress || 'unknown').trim()
        const { videoLink }: RequestProps = req.body
        const user = req.user

        //Guardado del link en archivo para usarlo posteriormente
        await fs.writeFile('link.json', JSON.stringify({ key: videoLink }))

        //Obtención de id del video de youtube
        const dataOfId: DataOfId = getVideoId(videoLink)
        const id = dataOfId.id

        if (!id || typeof id === 'undefined' || typeof id !== 'string') {
            const error = new Error('No se pudo procesar el id correctamente')
            return res.status(400).json({ error: error.message })
        }
        
        
        
        //Comprobación de longitud
        const isValid = await YoutubeVideoService.isValidLength(id)
        if (!isValid) {
            const message = "El vídeo es muy largo"
            return res.status(403).json(message)
        }   


        try {
            //Obtención de transcripción del vídeo ya convertido en audio
            const data = await YoutubeVideoService.getTranscriptionFromAudio(user, ip)
            if (!data) {
                const error = new Error('No se pudo obtener la transcripción del vídeo')
                return res.status(400).json({ error: error.message })
            }
            const { youtubeVideoText, usedMinutes, title, audioDuration } = data
            const savedYoutubeFile = await YoutubeVideoService.insertTranscription({ youtubeVideoText, user, title, duration: audioDuration})
            console.log('youtube file saved', savedYoutubeFile )
            return res.json({ youtubeVideoText: savedYoutubeFile, usedMinutes, user })
        } catch (err) {
            if (err instanceof AppError) {
                return res.status(err.statusCode).json({ error: err.message })
            }
            console.error('Error processing video:', err)
            return res.status(500).json({ error: 'Failed to process video' })
        }
    }


}
