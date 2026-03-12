import { Request, Response } from "express";
import { insert } from "./youtube-video.service.js";
import { youtubeVideoSchema } from "./youtube-video.schema.js";
import { translateText } from "../translation/translation.service.js";
import { VideoService } from "../video/video.service.js";
import { DataOfId, RequestProps } from "../video/video.types.js";
import fs from "node:fs/promises"
import getVideoId from "get-video-id";
export class YoutubeVideoController {
    static init = async (req: Request, res: Response) => {
        const { videoLink }: RequestProps = req.body

        const lang = String(req.params.lang)

        await fs.writeFile('link.json', JSON.stringify({ key: videoLink }))

        const dataOfId: DataOfId = getVideoId(videoLink)
        const id = dataOfId.id

        if (!id || typeof id === 'undefined' || typeof id !== 'string') {
            const error = new Error('No se pudo procesar el id correctamente')
            return res.status(400).json({ error: error.message })
        }

        const isValid = await VideoService.isValidLength(id)
        if (!isValid) {
            const message = "El vídeo es muy largo"
            return res.status(403).json(message)
        }

        try {
            const data = await VideoService.getSubtitlesFromVideo(id)
            if (!data) {
                const error = new Error('No se pudo obtener la transcripción del vídeo')
                return res.status(400).json({ error: error.message })
            }
            const { subtitles, title } = data
            if (lang === 'not') {
                return res.json({ title, subtitles, id })
            }
            const translatedYoutubeVideo = await translateText(lang, subtitles)
            return res.json({ title, translatedYoutubeVideo, subtitles, id })
        } catch (err) {
            console.error('Error processing video:', err)
            return res.status(500).json({ error: 'Failed to process video' })
        }
    }


    static save = async (req: Request, res: Response) => {
        try {
            const user = req.user
            const data = youtubeVideoSchema.parse(req.body)
            await insert({ data, user })
            return res.status(201).send('Video guardado correctamente')
        } catch (error) {
            if (error instanceof Error) {
                return res.status(409).json({ error: error.message })
            }
            return res.status(500).json({ error: 'Hubo un error al guardar el vídeo' })
        }
    }
}