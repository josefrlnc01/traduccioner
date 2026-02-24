import type { Request, Response } from "express";
import { isSecureLink } from "../utils/secureLink.js";
import fs from 'node:fs/promises'
import getVideoId from 'get-video-id'
import { translateText } from "../utils/translateText.js";
import type { DataOfId, RequestProps } from "../types/index.ts";
import { VideoService } from "../services/video.service.js";


export async function init(req: Request, res: Response) {
    const { videoLink, lang }: RequestProps = req.body

    if (!videoLink || !lang) {
        const error = new Error('Debes introducir un link y un idioma para la traducción')
        return res.status(400).json({ error: error.message })
    }


    if (typeof videoLink !== 'string' || !isSecureLink(videoLink)) {
        const error = new Error('Debes introducir un link válido')
        return res.status(400).json({ error: error.message })
    }

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
        if (!data) return "Error al obtener datos del video"
        const { subtitles, title } = data
        const translatedText = await translateText(lang, subtitles)
        return res.json({ title, translatedText, id })
    } catch (err) {
        console.error('Error processing video:', err)
        return res.status(500).json({ error: 'Failed to process video' })
    }
}

