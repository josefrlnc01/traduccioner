import fs from 'node:fs/promises'
import { downloadAudio } from '../services/audioDownloader.ts'
import { transcribeWhisperAudio } from '../transcription/whisperTranscribe.ts'
import { getTitle } from '../api/youtubeApi.ts'
import { translateText } from './translateText.ts'




export async function getSubtitlesFromVideo (link:string, id:string, lang:string): Promise<string>{
    try {
        const data = await getTitle(id)
        if (!data) {
            throw new Error("No se pudo encontrar información del video")
        }
            const title = data
            const links = JSON.parse(await fs.readFile('link.json', 'utf-8')) as Record<string, unknown>
            const videoLink: string | null = (links.key as string) || null
                
            if (videoLink) {
                await downloadAudio(videoLink)
                const text = await transcribeWhisperAudio()
                console.log(text)
                return text 
            }
            return ''
    } catch (err) {
        console.error(err)
        return ''
    }
}