import type { Request, Response } from "express";
import { isSecureLink } from "../utils/secureLink.ts";
import fs from 'node:fs/promises'

import { getSubtitlesFromVideo } from "../services/getSubtitles.ts";
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

    try {
        const subtitles = await getSubtitlesFromVideo(videoLink)
        console.log(subtitles)
        return res.json(subtitles || { message: 'No subtitles available' })
    } catch (err) {
        console.error('Error processing video:', err)
        return res.status(500).json({ error: 'Failed to process video' })
    }
    }



}