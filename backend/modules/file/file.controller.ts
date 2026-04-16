import { Request, Response } from "express";
import { convertVideoToAudio } from "../../shared/utils/video.js";
import { FileService } from "./file.service.js";
import { fileTranscriptionSchema, fileTranslationSchema } from "./file.schema.js";
import { AppError } from "../errors/AppError.js";
import { formatMinutes, getAudioDuration } from "../../shared/utils/audio.js";
import { fileTranscriptionQueue } from "../../config/queue.js";
import { title } from "node:process";
import { error } from "node:console";



export class FileController {
    static init = async (req: Request, res: Response) => {
        try {
            const ip = (req.headers['x-forwarded-for']?.toString().split(' ')[0] ||
                    req.socket.remoteAddress ||
                    'unknown').trim()
            const file = req.file
            const user = req.user
            if (!file) {
                return res.status(400).json({ error: 'No se recibio ningun archivo en el campo audio' })
            }
            
            const job = await fileTranscriptionQueue.add('fileTranscription', {
                file,
                user,
                ip,
                title: file.originalname
            })
            
            return res.status(200).json({ jobId: job.id})
        } catch (error) {
            console.error('File transcription error:', error)
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({error: error.message})
            }
            if (error instanceof Error) {
                return res.status(500).json({ error: error.message })
            }
            return res.status(500).json({ error: 'Hubo un error al enviar el archivo' })
        }
    }


    static getJobStatus = async (req: Request, res: Response) => {
        const {jobId} = req.params as {jobId: string}
        const job = await fileTranscriptionQueue.getJob(jobId)

        if (!job) {
            return res.status(404).json({error: 'Job no encontrado'})
        }

        const state = await job.getState()
        console.log('state', state)
        if (state === 'completed') {
            return res.status(200).json({
                status: 'completed',
                data: job.returnvalue
            })
        }

        if (state === 'failed') {
            return res.status(200).json({
                status: 'failed',
                error: job.failedReason
            })
        }

        return res.status(200).json({status : state})
    }

}


