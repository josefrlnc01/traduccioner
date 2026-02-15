import {parseSync} from 'subtitle'
import ytdlp from 'yt-dlp-exec'
import axios from 'axios'
import fs from 'node:fs/promises'

import { downloadAudio } from '../services/audioDownloader.ts'

export async function getSubtitlesFromVideo (link:string): Promise<Object>{

    try {
        const info = await ytdlp(link, {
            dumpSingleJson:true,
            skipDownload: true,
            writeSub: true,
            subLang:'en'
        })
        const subtitles = (info.requested_subtitles as Record<string, any>)?.en?.url  

        if (!subtitles) {
            console.error('No subtitles found for the video')
            const links = JSON.parse(await fs.readFile('link.json', 'utf-8')) as Record<string, unknown>
            const videoLink: string | null = (links.key as string) || null
            
            if (videoLink) {
                const audio = await downloadAudio(videoLink)
                return { message: 'Audio downloaded', audio }
            }
            return {}
        }

        const response = await axios.get(subtitles)
        const parsed = parseSync(response.data)
        return parsed
    } catch (err) {
        console.error(err)
        return {}
    }

}