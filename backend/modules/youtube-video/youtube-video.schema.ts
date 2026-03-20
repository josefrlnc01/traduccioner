import z from "zod";
import { isSecureLink } from '../../shared/utils/link.js'

export const youtubeVideoTranscriptionSchema = z.object({
    title: z.string(),
    comment: z.string(),
    youtubeVideoText: z.string()
})

export const youtubeVideoTranslationSchema = z.object({
    title: z.string(),
    comment: z.string(),
    translatedYoutubeVideo: z.string()
})

//Esquema de validación de link en controller principal de yt-video
export const videoSchema = z.object({
    videoLink: z.string().refine(isSecureLink, {message:'Link seguro'})
})


