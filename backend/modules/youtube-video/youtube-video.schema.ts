import z from "zod";
import { isSecureLink } from '../../shared/utils/link.js'

export const youtubeVideoTranscriptionSchema = z.object({
    segments: z.array(z.object({
        start: z.number(),
        end: z.number(),
        text: z.string()
    }))
})

export const youtubeVideoTranslationSchema = z.object({
    title: z.string(),
    comment: z.string(),
    translatedYoutubeVideo: z.string()
})

//Esquema de validación de link en controller principal de yt-video
export const youtubeVideoSchema = z.object({
    videoLink: z.string().refine(isSecureLink, {message:'Link seguro'})
})


