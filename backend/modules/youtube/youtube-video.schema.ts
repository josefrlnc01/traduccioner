import z from "zod";


export const youtubeVideoSchema = z.object({
    videoId: z.string(),
    title: z.string(),
    youtubeVideoText: z.string()
})

export type StoredSchema = z.infer<typeof youtubeVideoSchema>