import type { Request, Response } from "express";
import { isSecureLink } from "../utils/secureLink.ts";
import fs from 'node:fs/promises'

import { getSubtitlesFromVideo } from "../services/getSubtitles.ts";
import { getVideoLength } from "../api/youtubeApi.ts";
import { getVideoMinutes } from "../utils/getVideoMinutes.ts";
type VideoLink = {
    videoLink : string
}

export class IdController {
    static obtainLink = async (req : Request, res : Response) => {
    const {videoLink}:VideoLink = req.body
    if (!videoLink) {
        const error = new Error('Debes introducir un link')
        return res.status(400).json({error : error.message})
    }
    
    await fs.writeFile('link.json', JSON.stringify({key : videoLink }))
    if (typeof videoLink !== 'string' || !isSecureLink(videoLink)) {
        const error = new Error('Debes introducir un link válido')
        return res.status(400).json({error : error.message})
    }
    //Obtenemos el link del enlace tratándo el enlace entero como un array
    const reg: RegExp = /\b\w+\b/g
    const arrayOfLink = videoLink.match(reg)
    let id = '' 
    if (videoLink && arrayOfLink) {
        for (let i = 0; i < arrayOfLink.length; i++) {
        if (arrayOfLink[i] === 'v') {
            
            id = arrayOfLink[i + 1]
        }
        if (arrayOfLink[i] === "v" && arrayOfLink[i + 1] === "h") {
            const part1 = arrayOfLink[i + 1]
            const part2 = arrayOfLink[i + 2]
            id = part1 + "-" + part2
        } 
    }
    }

    if (!id || typeof id === 'undefined') {
        const error = new Error('No se pudo procesar el id correctamente')
        return res.status(400).json({error : error.message})
    }
    
    const videoInfo = await getVideoLength(id)
            const videoItems = videoInfo.items
            const videoDuration = videoItems[0].contentDetails.duration
            const minutes:string = getVideoMinutes(videoDuration)
            if (parseInt(minutes) >= 8) {
                const message = "El vídeo es muy largo"
                return res.status(403).json(message)
            }
    try {
        const subtitles = await getSubtitlesFromVideo(videoLink)
        console.log(subtitles)
        return res.json({subtitles, id})
    } catch (err) {
        console.error('Error processing video:', err)
        return res.status(500).json({ error: 'Failed to process video' })
    }
    }

}