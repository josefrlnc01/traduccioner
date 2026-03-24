import mongoose, { Schema,Document, Types } from "mongoose";

export interface IQuota extends Document {
    user: Types.ObjectId,
    ip: string,
    usedMinutes: number,
    createdAt: Date
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
    usedMinutes: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default:Date.now,
        expires: '30d'
    }
}, {timestamps: false})

quotaSchema.index({user:1, ip:1}, {unique: true})

const Quota = mongoose.model<IQuota>('Quota', quotaSchema)

export default Quota