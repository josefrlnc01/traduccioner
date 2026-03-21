import mongoose, {Document, Schema, Types} from "mongoose";


export interface IYoutubeVideo extends Document {
    title: string,
    comment: string | null
    segments: [
        {
            start: number,
            end: number,
            text: string
        }
    ],
    translatedYoutubeVideo: string | null
    user: Types.ObjectId
}

//Esquema videos de youtube introducidos por el usuario
const youtubeVideoSchema: Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    comment : {
        type: String,
        required:  false
    },
    segments: [
        {
            start: {type: Number, required: true},
            end: {type: Number, required: true},
            text: {type: String, required: true}
        }
    ],
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