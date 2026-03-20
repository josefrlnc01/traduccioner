import mongoose, { Schema,Document, Types } from "mongoose";

export interface IQuota extends Document {
    user: Types.ObjectId,
    ip: string,
    requestCount: number,
    resetAt: Date,
    usedMinutes: number,
    minutesResetAt: Date
}

const quotaSchema: Schema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    requestCount: {
        type: Number,
        default: 0
    },
    usedMinutes: {
        type: Number,
        default: 0
    },
    minutesResetAt: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    resetAt: {
        type: Date,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
        expires: 0
    }
})

quotaSchema.index({user:1, ip:1}, {unique: true})

const Quota = mongoose.model<IQuota>('Quota', quotaSchema)

export default Quota