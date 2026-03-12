import { IUser } from "../user/user.model.js";
import VideoStored from "./youtube-video.model.js";
import { StoredSchema } from "./youtube-video.schema.js";

type InsertProps = {
    data: StoredSchema
    user: IUser
}

export async function insert({ data, user }: InsertProps) {
    try {
        const videoExists = await VideoStored.findOne({
            user: user._id,
            videoId: data.videoId
        })

        if (videoExists) {
            throw new Error('Este video ya está guardado')
        }

        const video = new VideoStored()
        video.videoId = data.videoId
        video.title = data.title
        video.youtubeVideoText = data.youtubeVideoText
        video.user = user._id

        await video.save()
    } catch (error:any) {
        console.error(error)
        if (error?.code === 1100) {
            throw new Error('Este video ya está guardado')
        }
        throw new Error('Hubo un error al guardar el vídeo')
    }
}


export async function getVideoLength (id:string) {
    try {
        const apiKey = process.env.GOOGLE_API_KEY
        const url = `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${apiKey}&part=contentDetails`
        const response = await fetch(url)
        if (response) {
            const data = await response.json()
            return (data)
        }
    } catch (error) {
        console.error(error)
    }
}


export async function getTitleAndLanguage (id:string) {
    try {
        const apiKey = process.env.GOOGLE_API_KEY
        const url = `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${apiKey}&part=snippet`
        const response = await fetch(url)
        if (!response.ok) return ''

        const data = await response.json()
        const videoInfo = data.items[0].snippet
        if (videoInfo) {
            console.log(videoInfo)
            
            const title:string = videoInfo.title
            const language: string = videoInfo.defaultLanguage
            return {title,language}
        }
    } catch (error) {
        console.error(error)
    }
}