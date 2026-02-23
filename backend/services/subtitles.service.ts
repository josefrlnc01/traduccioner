import fs from 'node:fs/promises'
import { downloadAudio } from './audio.service.ts'
import { transcribeWhisperAudio } from '../transcription/whisperTranscribe.ts'
import { getTitleAndLanguage } from '../api/youtubeApi.ts'



type VideoSubtitles = {
    subtitles: string
    title: string
}

export async function getSubtitlesFromVideo(id: string): Promise<VideoSubtitles> {
    const data = await getTitleAndLanguage(id)
    if (!data) {
        throw new Error("No se pudo encontrar información del video")
    }
    const { title, language } = data
    const links = JSON.parse(await fs.readFile('link.json', 'utf-8')) as Record<string, unknown>
    const videoLink: string | null = (links.key as string) || null
    if (!videoLink) throw new Error("No se encontró el link del video")

    await downloadAudio(videoLink)
    const subtitles = await transcribeWhisperAudio(language)
    console.log("Transcripción terminada")
    return { subtitles, title }

}