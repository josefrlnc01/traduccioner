import type { Request, Response } from "express";
import { downloadAudio } from "../services/audioDownloader.ts";
import fs from 'node:fs/promises'
import { getSubtitlesFromVideo } from "../utils/getSubtitles.ts";


export class SubtitlesController {
    static obtainSubtitles = async (req: Request, res: Response) => {
        const id:string | string[] = req.params.id
        
        const links = JSON.parse(await fs.readFile('link.json', 'utf-8')) as Record<string, unknown>
        const link: string | null = (links.key as string) || null
        
        if (!link) {
            return res.status(400).json({message: 'Link no encontrado'})
        }
        
        const subtitles = await getSubtitlesFromVideo(link)
        if (!subtitles) {
            const audio = await downloadAudio(link)
            return res.json({message : 'Procesando audio...'})
        } else {
            return res.json(subtitles)
        }
    }
}