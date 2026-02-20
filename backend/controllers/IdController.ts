import type { Request, Response } from "express";
import { isSecureLink } from "../utils/secureLink.ts";
import fs from 'node:fs/promises'
import getVideoId from 'get-video-id'
import { getSubtitlesFromVideo } from "../services/getSubtitles.ts";
import { getVideoLength } from "../api/youtubeApi.ts";
import { getVideoMinutes } from "../utils/getVideoMinutes.ts";
import { translateText } from "../services/translateText.ts";
type RequestProps = {
    videoLink : string
    lang : string
}

export class IdController {
    static obtainLink = async (req : Request, res : Response) => {
    const {videoLink, lang}:RequestProps = req.body
    if (!videoLink) {
        const error = new Error('Debes introducir un link')
        return res.status(400).json({error : error.message})
    }
    
    await fs.writeFile('link.json', JSON.stringify({key : videoLink }))
    if (typeof videoLink !== 'string' || !isSecureLink(videoLink)) {
        const error = new Error('Debes introducir un link válido')
        return res.status(400).json({error : error.message})
    }
    
    const id: {
    id: string | undefined;
    service: "youtube" | "vimeo" | "vine" | "videopress" | "microsoftstream" | "tiktok" | "dailymotion" | "loom" | undefined;
} = getVideoId(videoLink)
    

    if (!id || typeof id === 'undefined' || typeof id.id !== 'string') {
        const error = new Error('No se pudo procesar el id correctamente')
        return res.status(400).json({error : error.message})
    }
    const videoInfo = await getVideoLength(id.id)
    const videoItems = videoInfo.items
    const videoDuration = videoItems[0].contentDetails.duration
    const minutes:string = getVideoMinutes(videoDuration)
    if (parseInt(minutes) >= 8) {
        const message = "El vídeo es muy largo"
        return res.status(403).json(message)
    }

    try {
        const subtitles = await getSubtitlesFromVideo(videoLink, id.id, lang)
        const translate = await translateText(lang, subtitles)
        
        return res.json({translate, id})
    } catch (err) {
        console.error('Error processing video:', err)
        return res.status(500).json({ error: 'Failed to process video' })
    }
    }

}