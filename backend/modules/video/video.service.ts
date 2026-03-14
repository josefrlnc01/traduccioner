import ytDlp from 'yt-dlp-exec'
import fs from 'node:fs/promises'
import path from 'node:path'
import { getVideoMinutes } from '../../shared/utils/video.js'
import type { VideoSubtitles } from './video.types.js'
import { YoutubeVideoService } from '../youtube-video/youtube-video.service.js'
import { transcribeWhisperAudio } from '../transcription/whisper.service.js'


export class VideoService {
    static downloadAudio = async (link: string | null): Promise<string | null> => {
        const ffmpegPath = process.env.NODE_ENV === 'production' ? process.env.FFMPEG_PATH : process.env.FFMPEG_PATH_LOCAL
        try {
            //Creación de dirección de archivo de audio de youtube descargado
            const backendDir = process.cwd()
            const base = path.join(backendDir, 'audio')
            const filepath = base + '.mp3'
            const url = Array.isArray(link) ? link[0] : link

            const audio = await audioExists()

            if (audio) {
                fs.unlink(filepath)
            }

            //Descarga del audio en la ruta especificada
            //Uso de ytDlp + ffmpeg
            await ytDlp(url, {
                output: base + '.%(ext)s', // Permite que yt-dlp use la extensión correcta
                format: 'bestaudio',
                audioFormat: 'mp3',
                extractAudio: true,
                ffmpegLocation: ffmpegPath
            })

            return filepath
        } catch (err) {
            console.error('Error downloading audio:', err)
            return null
        }
    }


    static isValidLength = async (id: string) => {
        const videoInfo = await YoutubeVideoService.getVideoInfo(id)
        const videoItems = videoInfo.items
        const videoDuration = videoItems[0].contentDetails.duration
        const minutes: string = getVideoMinutes(videoDuration)
        if (parseInt(minutes) >= 8) {
            const message = "El vídeo es muy largo"
            return false
        }
        return true
    }



    static getTranscriptionFromAudio = async (id: string): Promise<VideoSubtitles> => {
        const backendDir = process.cwd()
        const base = path.join(backendDir, 'audio')
        const filepath = base + '.mp3'

        //Obtención del link mediante archivo creado previamente en controller para guardado de links
        const links = JSON.parse(await fs.readFile('link.json', 'utf-8')) as Record<string, unknown>
        const videoLink: string | null = (links.key as string) || null
        if (!videoLink) throw new Error("No se encontró el link del video")

        await this.downloadAudio(videoLink)
        const youtubeVideoText = await transcribeWhisperAudio(filepath)
        console.log(youtubeVideoText)
        if (!youtubeVideoText) throw new Error('No se pudo transcribir el audio')
        return { youtubeVideoText }
    }

}

//Función comprobadora de archivo existente
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