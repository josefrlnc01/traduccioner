import z from 'zod'


export const registerSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    email: z.email('Email inválido'),
    password: z.string().min(8, "La contraseña debe tener 8 carácteres"),
    password_confirmation: z.string()
        
})
.refine((data) => data.password === data.password_confirmation, {
    error: "Las contraseñas no coinciden",
    path: ['password_confirmation']
})