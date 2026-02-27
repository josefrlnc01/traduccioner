import z from 'zod'

export const userSchema = z.object({
    name:z.string(),
    email: z.string(),
    password: z.string(),
    confirmed: z.boolean()
})


export type TokenConfirmation = {
    token: string
}