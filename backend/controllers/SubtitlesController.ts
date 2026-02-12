import type { Request, Response } from "express";
import {getSubtitles, type SubtitleOutput} from 'youtube-captions-scraper'
import { downloadAudio } from "../services/audioDownloader.ts";
import fs from 'node:fs/promises'
export class SubtitlesController {
    static obtainSubtitles = async (req: Request, res: Response) => {
        const id = req.params.id
        
        const links = JSON.parse(await fs.readFile('link.json', 'utf-8')) as Record<string, unknown>
        const link: string | null = (links.key as string) || null
        let subtitles: SubtitleOutput | string = ''
        getSubtitles({
            videoID : `${id}`,
            lang : 'en'
        }).then(captions => {
            console.log(captions)
            subtitles = captions
        })
        if (subtitles.length === 0 && link) {
            const audio = await downloadAudio(link)
            console.log(audio)
            return res.json({message : 'Procesando audio...'})
        } else {
            return res.json(subtitles)
        }
    }
}