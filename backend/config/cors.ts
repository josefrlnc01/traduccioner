import cors from 'cors'

const isProd = process.env.NODE_ENV === 'production'

const normalizeOrigin = (value?: string) => value?.trim().replace(/\/$/, '')

const getAcceptedOrigins = () => {
    const origins = [
        isProd ? process.env.FRONTEND_URL : process.env.FRONTEND_URL_DEV,
        process.env.FRONTEND_URL,
        process.env.FRONTEND_URL_WWW,
        ...(process.env.ALLOWED_ORIGINS?.split(',') ?? [])
    ]

    return origins
        .map(normalizeOrigin)
        .filter((origin): origin is string => Boolean(origin))
}

export const corsMiddleware = () =>
    cors({
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        optionsSuccessStatus: 204,
        origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
            const acceptedOrigins = getAcceptedOrigins()
            const normalizedOrigin = normalizeOrigin(origin)

            if (!normalizedOrigin) return callback(null, true)

            if (acceptedOrigins.includes(normalizedOrigin)) {
                return callback(null, true)
            }

            return callback(new Error(`No permitido por CORS para el origen ${normalizedOrigin}`))
        }
    })




