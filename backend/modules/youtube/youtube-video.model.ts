import mongoose, {Document, Schema, Types} from "mongoose";


export interface IYoutubeVideo extends Document {
    videoId: string | null,
    title: string,
    text: string,
    translatedYoutubeVideo: string
    user: Types.ObjectId
}


const youtubeVideoSchema: Schema = new Schema({
    videoId: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
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

youtubeVideoSchema.index({id:1, videoId:1}, {unique: true})

const YoutubeVideo = mongoose.model<IYoutubeVideo>('YoutubeVideo', youtubeVideoSchema)

export default YoutubeVideo