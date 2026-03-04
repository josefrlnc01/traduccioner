import mongoose, {Schema, Document} from 'mongoose'
import z from 'zod'
export interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    confirmed: boolean
}

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
        required: true
    },
    confirmed: {
        type: Boolean,
        default: false
    }
})

export type UserType = z.infer<typeof userSchema>
const User = mongoose.model<IUser>('User', userSchema)

export default User