import mongoose, { Document, Schema, Types } from "mongoose";


export interface IYoutubeVideo extends Document {
    title: string,
    fileId: string,
    segments: {
        start: number,
        end: number,
        text: string
    }[],
    duration: string | null,
    translatedYoutubeVideo: string | null
    user: Types.ObjectId
}

//Esquema videos de youtube introducidos por el usuario
const youtubeVideoSchema: Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    fileId: {
        type: String,
        required: true
    },
    segments: [
        {
            start: { type: Number, required: true },
            end: { type: Number, required: true },
            text: { type: String, required: true }
        }
    ],
    duration: {
        type: String,
        required: false
    },
    translatedYoutubeVideo: {
        type: String,
        required: false
    },
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    }
})

//Modelo de videos de youtube
const YoutubeVideo = mongoose.model<IYoutubeVideo>('YoutubeVideo', youtubeVideoSchema)

export default YoutubeVideo