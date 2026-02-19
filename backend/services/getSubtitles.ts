import fs from 'node:fs/promises'
import { downloadAudio } from '../services/audioDownloader.ts'
import { transcribeWhisperAudio } from '../transcription/whisperTranscribe.ts'
import { getTitle } from '../api/youtubeApi.ts'



export async function getSubtitlesFromVideo (link:string, id:string): Promise<Object>{
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
                return { message: 'Audio downloaded', text }
            }
            return {}
    } catch (err) {
        console.error(err)
        return {}
    }
}