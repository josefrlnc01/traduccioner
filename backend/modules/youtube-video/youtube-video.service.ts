import path from "node:path";
import { AppError } from "../errors/AppError.js";
import { transcribeWhisperAudio } from "../transcription/whisper.service.js";
import YoutubeVideo from "./youtube-video.model.js";
import VideoStored from "./youtube-video.model.js";
import fs from 'node:fs/promises'
import { InsertTranscriptionProps, InsertTranslationProps } from "./youtube-video.types.js";
import ytDlp from 'yt-dlp-exec'
import { getVideoMinutes } from "../../shared/utils/video.js";
import { formatMinutes, getAudioDuration } from "../../shared/utils/audio.js";
import { IUser } from "../user/user.model.js";
import Quota from "../quota/quota.schema.js";
import {v4 as uuidv4} from 'uuid'

type YoutubeInfo = {
  title: string
}
export class YoutubeVideoService {
    static insertTranscription = async ({ youtubeVideoText, user, title, duration }: InsertTranscriptionProps) => {
        try {
            //Comprobación de documento existente
            const videoExists = await VideoStored.findOne({
                user: user._id,
                title: title
            })
            if (videoExists) {
                return null
            }

            const id = uuidv4()
            //Guardado
            await VideoStored.create({
                title: title,
                fileId: id,
                segments: youtubeVideoText,
                duration: duration,
                user: user._id
            })

        } catch (error: any) {
            console.error(error)
            if (error instanceof AppError) throw error
            return null
        }
    }


    static insertTranslation = async ({ data, user }: InsertTranslationProps) => {
        try {
            //Comprobación de documento existente
            const fileExists = await YoutubeVideo.findOne({
                user: user,
                translatedYoutubeVideo: data.translatedYoutubeVideo
            })

            if (fileExists) {
                throw new AppError('Este documento ya está guardado')
            }

            //Guardado
            const translation = new YoutubeVideo()

            translation.title = data.title
            translation.translatedYoutubeVideo = data.translatedYoutubeVideo
            translation.user = user._id
            await translation.save()
        } catch (error: any) {
            if (error instanceof AppError) throw error
            throw new Error('Hubo un error al guardar la traducción')
        }
    }

    static getVideoInfo = async (id: string) => {
        try {
            //Obtención de info de video para conocer duración
            const apiKey = process.env.GOOGLE_API_KEY
            const url = `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${apiKey}&part=contentDetails`
            const response = await fetch(url)
            if (response) {
                const data = await response.json()

                return (data)
            }
        } catch {
            throw new Error('Hubo un error al obtener la información del vídeo')
        }
    }


    static downloadAudio = async (link: string | null): Promise<YoutubeInfo> => {
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

            const info: YoutubeInfo = await ytDlp(url, {
                dumpSingleJson: true,  // devuelve toda la info del vídeo como JSON
                skipDownload: true       // sin descargar nada
            })
            const downloaded = await ytDlp(url, {
                output: base + '.%(ext)s', // Permite que yt-dlp use la extensión correcta
                format: 'bestaudio',
                audioFormat: 'mp3',
                extractAudio: true,
                ffmpegLocation: ffmpegPath
            })
            return { title: info.title }
        } catch (err) {
            console.error('Error downloading audio:', err)
            throw new Error('Hubo un error al descargar el video')
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



    static getTranscriptionFromAudio = async (user: IUser, ip: string) => {
        const backendDir = process.cwd()
        const base = path.join(backendDir, 'audio')
        const filepath = base + '.mp3'

        //Obtención del link mediante archivo creado previamente en controller para guardado de links
        const links = JSON.parse(await fs.readFile('link.json', 'utf-8')) as Record<string, unknown>
        const videoLink: string | null = (links.key as string) || null
        if (!videoLink) throw new Error("No se encontró el link del video")


        const minutes = await getAudioDuration(filepath)
        const formattedAudioDuration = formatMinutes(minutes)
        await Quota.findOneAndUpdate(
            { user: user._id, ip },
            {
                $inc: { usedMinutes: minutes.toFixed(2) }
            },
            { upsert: true, new: true }
        )
        const quota = await Quota.findOne({
            user: user._id, ip
        })

        if (quota?.usedMinutes! > 6) {
            throw new AppError('No dispones de minutos de transcripción gratuita suficientes', 429)
        }
        const {title} = await this.downloadAudio(videoLink)

        const youtubeVideoText = await transcribeWhisperAudio(filepath)
        if (!youtubeVideoText) throw new Error('No se pudo transcribir el audio')

        return { youtubeVideoText, usedMinutes: quota?.usedMinutes, title, audioDuration: formattedAudioDuration }
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
