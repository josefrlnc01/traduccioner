import type { Request, Response } from "express";
import { isSecureLink } from "../utils/secureLink.ts";
import fs from 'node:fs/promises'
import getVideoId from 'get-video-id'
import { getSubtitlesFromVideo } from "../services/subtitles.service.ts";
import { getVideoLength } from "../api/youtubeApi.ts";
import { getVideoMinutes } from "../utils/getVideoMinutes.ts";
import { translateText } from "../utils/translateText.ts";
type RequestProps = {
    videoLink: string
    lang: string
}

export class MainController {
    static init = async (req: Request, res: Response) => {
        const { videoLink, lang }: RequestProps = req.body
        if (!videoLink || !lang) {
            const error = new Error('Debes introducir un link y un idioma para la traducción')
            return res.status(400).json({ error: error.message })
        }

        await fs.writeFile('link.json', JSON.stringify({ key: videoLink }))
        if (typeof videoLink !== 'string' || !isSecureLink(videoLink)) {
            const error = new Error('Debes introducir un link válido')
            return res.status(400).json({ error: error.message })
        }

        const dataOfId: {
            id: string | undefined;
            service: "youtube" | "vimeo" | "vine" | "videopress" | "microsoftstream" | "tiktok" | "dailymotion" | "loom" | undefined;
        } = getVideoId(videoLink)

        const id = dataOfId.id
        if (!id || typeof id === 'undefined' || typeof id !== 'string') {
            const error = new Error('No se pudo procesar el id correctamente')
            return res.status(400).json({ error: error.message })
        }
        const videoInfo = await getVideoLength(id)
        const videoItems = videoInfo.items
        const videoDuration = videoItems[0].contentDetails.duration
        const minutes: string = getVideoMinutes(videoDuration)
        if (parseInt(minutes) >= 8) {
            const message = "El vídeo es muy largo"
            return res.status(403).json(message)
        }

        try {
            const data = await getSubtitlesFromVideo(id)
            if (!data) return "Error al obtener datos del video"
            const { subtitles, title } = data
            const translatedText = await translateText(lang, subtitles)
            console.log(subtitles)
            console.log("\n")
            console.log(translatedText)
            return res.json({ title, subtitles, translatedText, id })
        } catch (err) {
            console.error('Error processing video:', err)
            return res.status(500).json({ error: 'Failed to process video' })
        }
    }

}