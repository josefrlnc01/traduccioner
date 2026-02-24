import cors from 'cors'
export const isProd = process.env.NODE_ENV === 'production'

function getRequiredEnv(key:string): string {
    const value = process.env[key]
    if (!value) {
        throw new Error ("Variables de entorno no definidas")
    }
    return value
}

const backendUrl = isProd 
    ? getRequiredEnv('PROD_BACKEND_URL') 
    : getRequiredEnv('LOCAL_BACKEND_URL')   
const frontendUrl = isProd 
    ? getRequiredEnv('PROD_FRONTEND_URL')
    : getRequiredEnv('LOCAL_FRONTEND_URL')


export const corsMiddleware = () => cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        const ACCEPTED_ORIGINS:string[] | undefined = [
        backendUrl,
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

