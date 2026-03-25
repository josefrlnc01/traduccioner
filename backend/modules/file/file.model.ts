import mongoose, {Document, Types, Schema} from "mongoose";

export interface IFileStored extends Document {
    title: string,
    fileId : string,
    segments: [
        {
            start: number,
            end: number,
            text: string
        }
    ],
    duration: string | null,
    translatedFile: string | null,
    origin: string,
    user: Types.ObjectId
}

//Esquema de videos/audios del dispositivo del usuario
const fileSchema: Schema = new Schema({
    title: {
        type: String,
        required: true
    },
    fileId: {
        type: String,
        required: true,
    },
    segments: [
        {
            start: {type: Number, required: true},
            end: {type: Number, required: true},
            text: {type: String, required: true}
        }
    ],
    duration:  {
        type: String,
        required: false
    },
    translatedFile: {
        type: String,
        required: false
    },
    origin: {
        type: String,
        default: 'file'
    },
    user: {
        type: Types.ObjectId,
        ref: 'User'
    }
})

//Modelo de video/audio del usuario
const FileModel = mongoose.model<IFileStored>('File', fileSchema)

export default FileModel