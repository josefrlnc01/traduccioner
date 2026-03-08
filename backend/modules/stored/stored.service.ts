import { IUser } from "../user/user.model.js";
import VideoStored, { IVideoStored } from "./stored.model.js";
import { StoredSchema } from "./stored.schema.js";

type InsertProps = {
    data: StoredSchema
    user: IUser
}
export async function insert({ data, user }: InsertProps) {
    try {
        const videoExists = await VideoStored.findById(user._id)
        console.log(videoExists)
        if (videoExists) {
            throw new Error('Este video ya está guardado')
        }

        const video = new VideoStored()
        video.videoId = data.videoId
        video.title = data.title
        video.text = data.text
        video.user = user._id
        await video.save()
    } catch {
        return null
    }
}