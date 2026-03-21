import { Request, Response } from "express";
import { YoutubeVideoService } from "./youtube-video.service.js";
import { youtubeVideoTranscriptionSchema, youtubeVideoTranslationSchema } from "./youtube-video.schema.js";
import { RequestProps, DataOfId } from "./youtube-video.types.js";
import fs from "node:fs/promises"
import getVideoId from "get-video-id";
import { AppError } from "../errors/AppError.js";

export class YoutubeVideoController {
    static init = async (req: Request, res: Response) => {
        const ip = (req.headers['x-forwarded-for']?.toString().split(' ')[0] ||
        req.socket.remoteAddress || 'unknown').trim()
        
        const { videoLink }: RequestProps = req.body
        const user = req.user
        const lang = String(req.params.lang)

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
            const { youtubeVideoText, usedMinutes, title } = data
            await YoutubeVideoService.insertTranscription({ youtubeVideoText, user, title})
            /*Si el usuario no elige un lenguaje para traducir solo devolvemos la transcripción
            if (lang === 'not') {
                return res.json({ youtubeVideoText})
            }*/

            //Obtención de traducción del video
            
            return res.json({ youtubeVideoText, usedMinutes })
        } catch (err) {
            console.error('Error processing video:', err)
            return res.status(500).json({ error: 'Failed to process video' })
        }
    }


    static saveTranscription = async (req: Request, res: Response) => {
        try {
            const user = req.user
            const data = youtubeVideoTranscriptionSchema.parse(req.body)
            
            return res.status(201).send('Transcripción guardada correctamente')
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            return res.status(500).json({ error: 'Hubo un error al guardar el vídeo' })
        }
    }


    static saveTranslation = async (req: Request, res: Response) => {
        try {
            const user = req.user
            const data = youtubeVideoTranslationSchema.parse(req.body)
            console.log('data save translation', data)
            await YoutubeVideoService.insertTranslation({data, user})
            return res.status(201).send('Traducción guardada correctamente')
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({error: error.message})
            }
            return res.status(500).json({error: 'Hubo un error al guardar la traducción'})
        } 
    }


}