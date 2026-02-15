import cors from 'cors'

export const corsMiddleware = () => cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        const ACCEPTED_ORIGINS:string[] = [
        'http://localhost:8000',
        'http://localhost:5173'
    ]

    if (ACCEPTED_ORIGINS.includes(origin as string)) {
        callback(null, true)
    } else {
        callback(new Error('Not allowed by CORS'))
    }
    }
})