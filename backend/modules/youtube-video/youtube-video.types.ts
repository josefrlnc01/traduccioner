import { IUser } from "../user/user.model.js"
import {  youtubeVideoTranscriptionSchema, youtubeVideoTranslationSchema } from "./youtube-video.schema.js"
import { TranscriptionFormatt } from "../transcription/whisper.service.js"
import z from 'zod'

export type InsertTranscriptionProps = {
    data: StoredTranscriptionSchema
    user: IUser
}

export type InsertTranslationProps = {
    data: StoredTranslationSchema,
    user: IUser
}


export type VideoSubtitles = {
    youtubeVideoText: TranscriptionFormatt[] | null,
    usedMinutes: number
}


export type RequestProps = {
    videoLink: string
    lang: string
}


export type DataOfId = {
    id: string | undefined;
    service: "youtube" | "vimeo" | "vine" | "videopress" | "microsoftstream" | "tiktok" | "dailymotion" | "loom" | undefined;
}

export type StoredTranscriptionSchema = z.infer<typeof youtubeVideoTranscriptionSchema>
export type StoredTranslationSchema = z.infer<typeof youtubeVideoTranslationSchema>