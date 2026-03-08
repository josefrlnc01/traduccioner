import { IUser } from "../user/user.model.js";
import VideoStored from "./stored.model.js";
import { StoredSchema } from "./stored.schema.js";

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
        video.text = data.text
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
