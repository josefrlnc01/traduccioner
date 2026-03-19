import path from "node:path";
import { AppError } from "../errors/AppError.js";
import { transcribeWhisperAudio } from "../transcription/whisper.service.js";
import { VideoSubtitles } from "../video/video.types.js";
import YoutubeVideo from "./youtube-video.model.js";
import VideoStored from "./youtube-video.model.js";
import fs from 'node:fs/promises'
import { InsertTranscriptionProps, InsertTranslationProps } from "./youtube-video.types.js";
import ytDlp from 'yt-dlp-exec'
import { getVideoMinutes } from "../../shared/utils/video.js";
import { getAudioDuration } from "../../shared/utils/audio.js";
import User, { IUser } from "../user/user.model.js";
import Quota from "../quota/quota.schema.js";

export class YoutubeVideoService {
    static insertTransciption = async ({ data, user }: InsertTranscriptionProps) => {
        try {
        //Comprobación de documento existente
        const videoExists = await VideoStored.findOne({
            user: user._id,
            youtubeVideoText: data.youtubeVideoText
        })

        if (videoExists) {
            throw new AppError('Este video ya está guardado', 409)
        }

        //Guardado
        const video = new VideoStored()
        video.title = data.title
        video.comment = data.comment
        video.youtubeVideoText = data.youtubeVideoText
        video.user = user._id

        await video.save()
    } catch (error:any) {
        if (error instanceof AppError) throw error
        throw new Error('Hubo un error al guardar el vídeo')
    }
    }


    static insertTranslation = async ({data, user}: InsertTranslationProps) => {
        try {
        //Comprobación de documento existente
        const fileExists = await YoutubeVideo.findOne({
            user: user,
            translatedYoutubeVideo: data.translatedYoutubeVideo
        })

        if (fileExists) {
            throw new AppError('Este documento ya está guardado')
        }
        console.log('data translation', data)

        //Guardado
        const translation = new YoutubeVideo()

        translation.title = data.title
        translation.comment = data.comment
        translation.translatedYoutubeVideo = data.translatedYoutubeVideo
        translation.user = user._id
        await translation.save()
    } catch (error: any) {
        if (error instanceof AppError) throw error
        throw new Error('Hubo un error al guardar la traducción')
    }
    }

    static getVideoInfo = async (id:string) => {
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



    static getTranscriptionFromAudio = async (user:IUser, ip: string): Promise<VideoSubtitles> => {
        const backendDir = process.cwd()
        const base = path.join(backendDir, 'audio')
        const filepath = base + '.mp3'
        const freshUser = await User.findOne({
            email: user.email
        })
        
        if (!freshUser) {
            throw new AppError('No se pudo verificar el usuario', 400)
        }

        //Obtención del link mediante archivo creado previamente en controller para guardado de links
        const links = JSON.parse(await fs.readFile('link.json', 'utf-8')) as Record<string, unknown>
        const videoLink: string | null = (links.key as string) || null
        if (!videoLink) throw new Error("No se encontró el link del video")

        await this.downloadAudio(videoLink)
        const youtubeVideoText = await transcribeWhisperAudio(filepath)
        if (!youtubeVideoText) throw new Error('No se pudo transcribir el audio')
        const minutes = await getAudioDuration(filepath)
        
        await Quota.findOneAndUpdate(
                {user: user._id, ip},
                {
                    $inc: {minutesUsed: minutes}
                },
                {upsert: true, new: true}
            )

        await freshUser.save()
        
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
