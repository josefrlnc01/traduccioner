import z from "zod";


export const storedSchema = z.object({
    videoId: z.string(),
    title: z.string(),
    text: z.string()
})

export type StoredSchema = z.infer<typeof storedSchema>