import fs from 'node:fs/promises'
import { downloadAudio } from '../services/audioDownloader.ts'
import { transcribeWhisperAudio } from '../transcription/whisperTranscribe.ts'
import { getTitleAndLanguage } from '../api/youtubeApi.ts'
import { translateText } from './translateText.ts'




export async function getSubtitlesFromVideo (link:string, id:string, lang:string): Promise<string>{
    try {
        const data = await getTitleAndLanguage(id)
        if (!data) {
            throw new Error("No se pudo encontrar información del video")
        }
            const {title, language} = data
            console.log(title)
            console.log(language)
            const links = JSON.parse(await fs.readFile('link.json', 'utf-8')) as Record<string, unknown>
            const videoLink: string | null = (links.key as string) || null
                
            if (videoLink) {
                await downloadAudio(videoLink)
                const text = await transcribeWhisperAudio(language)
                console.log("Transcripción terminada")
                return text 
            }
            return ''
    } catch (err) {
        console.error(err)
        return ''
    }
}