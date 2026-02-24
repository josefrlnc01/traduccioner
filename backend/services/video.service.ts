import ytDlp from 'yt-dlp-exec'
import fs from 'node:fs/promises'
import path from 'node:path'
import { getVideoLength } from '../apis/youtube.js'
import { getVideoMinutes } from '../utils/getVideoMinutes.js'
import type { VideoSubtitles } from '../types/index.js'
import { getTitleAndLanguage } from '../apis/youtube.js'
import { transcribeWhisperAudio } from '../transcription/whisperTranscribe.js'

export class VideoService {
    static downloadAudio = async (link: string | null): Promise<string | null> => {
        try {
            const backendDir = process.cwd()
            const base = path.join(backendDir, 'audio')
            const filepath = base + '.mp3'
            const url = Array.isArray(link) ? link[0] : link

            const audio = await audioExists()

            if (audio) {
                fs.unlink(filepath)
            }

            await ytDlp(url, {
                output: base + '.%(ext)s', // Permite que yt-dlp use la extensión correcta
                format: 'bestaudio',
                audioFormat: 'mp3',
                extractAudio: true,
                ffmpegLocation: 'C:\\ffmpeg\\bin\\ffmpeg.exe'
            })

            return filepath
        } catch (err) {
            console.error('Error downloading audio:', err)
            return null
        }
    }


    static isValidLength = async (id: string) => {
        const videoInfo = await getVideoLength(id)
        const videoItems = videoInfo.items
        const videoDuration = videoItems[0].contentDetails.duration
        const minutes: string = getVideoMinutes(videoDuration)
        if (parseInt(minutes) >= 8) {
            const message = "El vídeo es muy largo"
            return false
        }
        return true
    }



    static getSubtitlesFromVideo = async (id: string): Promise<VideoSubtitles> => {
        const data = await getTitleAndLanguage(id)
        if (!data) {
            throw new Error("No se pudo encontrar información del video")
        }
        const { title, language } = data
        const links = JSON.parse(await fs.readFile('link.json', 'utf-8')) as Record<string, unknown>
        const videoLink: string | null = (links.key as string) || null
        if (!videoLink) throw new Error("No se encontró el link del video")

        await this.downloadAudio(videoLink)
        const subtitles = await transcribeWhisperAudio(language)
        return { subtitles, title }
    }

}

async function audioExists() {
    try {
        const backendDir = process.cwd()
        const base = path.join(backendDir, 'audio')
        const filepath = base + '.mp3'
        await fs.access(filepath)
        return true
    } catch {
        return false
    }
}