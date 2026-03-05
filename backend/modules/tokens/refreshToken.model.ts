import mongoose,{ Document, Schema, Types } from "mongoose";


interface IRefreshToken extends Document {
    token: string,
    user: Types.ObjectId
}

const refreshTokenSchema: Schema = new Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: Types.ObjectId,
        ref: 'User'
    }
})

const RefreshToken = mongoose.model<IRefreshToken>('RefreshToken', refreshTokenSchema)

export default RefreshToken