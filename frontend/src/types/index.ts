import z from 'zod'

export const userSchema = z.object({
    name:z.string(),
    email: z.string(),
    password: z.string(),
    confirmed: z.boolean()
})

export const userReqSchema = z.object({
    name: z.string(),
    email: z.string()
})
 const registrationFormSchema = z.object({
    name:z.string(),
    email:z.string(),
    password: z.string(),
    password_confirmation: z.string
})


export type TokenConfirmation = {
    token: string
}


export type UserLoginForm = {
    email: string
    password: string
}

export type RegistrationForm = z.infer<typeof registrationFormSchema>