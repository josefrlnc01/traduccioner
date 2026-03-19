import mongoose, {Schema, Document} from 'mongoose'

export interface IUser extends Document {
    name: string,
    email: string,
    password: string | null,
    provider: string,
    minutesUsed: number,
    minutesResetAt: Date,
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
    minutesUsed: {
        type: Number,
        default: 0
    },
    minutesResetAt: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    confirmed: {
        type: Boolean,
        default: false
    }
})

//Modelo de usuario
const User = mongoose.model<IUser>('User', userSchema)

export default User