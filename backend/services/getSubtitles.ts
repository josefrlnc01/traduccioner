import {parseSync} from 'subtitle'
import ytdlp from 'yt-dlp-exec'
import axios from 'axios'
import fs from 'node:fs/promises'

import { downloadAudio } from '../services/audioDownloader.ts'
import { transcribeWhisperAudio } from '../transcription/whisperTranscribe.ts'
import { getLanguageAndTitle } from '../api/youtubeApi.ts'



export async function getSubtitlesFromVideo (link:string, id:string): Promise<Object>{

    try {
        const data = await getLanguageAndTitle(id)
        if (data) {
            const {language, title} = data
            
            const info = await ytdlp(link, {
                dumpSingleJson:true,
                skipDownload: true,
                writeSub: true,
                encoding:'UTF-8',
                subLang:language
            })
            const subtitles = (info.requested_subtitles as Record<string, any>)?.en?.url  

            if (!subtitles) {
                console.error('No subtitles found for the video')
                const links = JSON.parse(await fs.readFile('link.json', 'utf-8')) as Record<string, unknown>
                const videoLink: string | null = (links.key as string) || null
                
                if (videoLink) {
                    await downloadAudio(videoLink)
                    const text = await transcribeWhisperAudio(language)
                    return { message: 'Audio downloaded', text }
                }
                return {}
            }

            const response = await axios.get(subtitles)
            const parsed = parseSync(response.data)
            return parsed
        }

        return {}
        
    } catch (err) {
        console.error(err)
        return {}
    }

}