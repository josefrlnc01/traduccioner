import type { Request, Response } from "express";
import fs from 'node:fs/promises'
import getVideoId from 'get-video-id'
import { translateText } from "../translation/translation.service.js";
import type { RequestProps, DataOfId } from "../video/video.types.js";
import { VideoService } from "../video/video.service.js";



export class LinkController {
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
            const translatedText = await translateText(lang, subtitles)
            return res.json({ title, translatedText, subtitles, id })
        } catch (err) {
            console.error('Error processing video:', err)
            return res.status(500).json({ error: 'Failed to process video' })
        }
    }
}

