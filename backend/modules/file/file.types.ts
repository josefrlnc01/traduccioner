import { TranscriptionFormatt } from "../transcription/whisper.service.js"
import { IUser } from "../user/user.model.js"
import { fileTranscriptionSchema, fileTranslationSchema } from "./file.schema.js"
import z from 'zod'
export type InsertFileTranscriptionProps = {
    fileText: TranscriptionFormatt[],
    user: IUser,
    title: string,
    duration: string
}

export type InsertFileTranslationProps = {
    data: StoredFileTranslationSchema,
    user: IUser
}


export type StoredFileTranscriptionSchema = z.infer<typeof fileTranscriptionSchema>

export type StoredFileTranslationSchema = z.infer<typeof fileTranslationSchema>