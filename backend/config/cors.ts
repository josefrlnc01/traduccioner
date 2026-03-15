import cors from 'cors'
export const isProd = process.env.NODE_ENV === 'production'
import { getRequiredEnv } from '../shared/utils/variables.js'

let frontendUrl: string | undefined

if (isProd) {
    frontendUrl = getRequiredEnv('FRONTEND_URL')
} else {
    frontendUrl = getRequiredEnv('FONTEND_URL_DEV')
}

export const corsMiddleware = () => cors({
    credentials:true,
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        const ACCEPTED_ORIGINS:string[] | undefined = [
        frontendUrl
    ]
    if (process.env.NODE_ENV === 'production' && ACCEPTED_ORIGINS.length === 0) {
        console.warn('Faltan las variables de produccion por definir')
        return callback(null, true)
    }

    if (!origin) return callback(null, true)
    if (ACCEPTED_ORIGINS.includes(origin as string)) {
        callback(null, true)
    } else {
        callback(new Error('No permitido por cors'))
    }
    }
})




