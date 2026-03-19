import mongoose, {Schema, Document} from 'mongoose'

export interface IUser extends Document {
    name: string,
    email: string,
    password: string | null,
    provider: string,
    confirmed: boolean
}

//Esquema de usuario
export const userSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    provider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    confirmed: {
        type: Boolean,
        default: false
    }
})

//Modelo de usuario
const User = mongoose.model<IUser>('User', userSchema)

export default User