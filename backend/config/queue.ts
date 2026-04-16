import {Queue} from 'bullmq'

const isProd = process.env.NODE_ENV === 'production'

export const connection = {
    host: isProd ? process.env.REDIS_HOST?.trim() : '127.0.0.1',
    port: Number(process.env.REDIS_PORT ?? 6379),
    maxRetriesPerRequest: null
}

export const fileTranscriptionQueue = new Queue('fileTranscription', {connection})


export const youtubeTranscriptionQueue = new Queue('youtubeTranscription', {connection})