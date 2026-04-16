import { Request, Response } from "express";
import { YoutubeVideoService } from "./youtube-video.service.js";
import { youtubeVideoTranscriptionSchema, youtubeVideoTranslationSchema } from "./youtube-video.schema.js";
import { RequestProps, DataOfId } from "./youtube-video.types.js";
import fs from "node:fs/promises"
import getVideoId from "get-video-id";
import { AppError } from "../errors/AppError.js";
import { youtubeTranscriptionQueue } from "../../config/queue.js";

export class YoutubeVideoController {
    static init = async (req: Request, res: Response) => {
        const ip = (req.headers['x-forwarded-for']?.toString().split(' ')[0] ||
        req.socket.remoteAddress || 'unknown').trim()
        const { videoLink }: RequestProps = req.body
        const user = req.user

        //Guardado del link en archivo para usarlo posteriormente
        await fs.writeFile('link.json', JSON.stringify({ key: videoLink }))

        //Obtención de id del video de youtube
        const dataOfId: DataOfId = getVideoId(videoLink)
        const id = dataOfId.id
        if (!id || typeof id === 'undefined' || typeof id !== 'string') {
            const error = new Error('No se pudo procesar el id correctamente')
            return res.status(400).json({ error: error.message })
        }
        


        try {
            //Obtención de transcripción del vídeo ya convertido en audio

            const job = await youtubeTranscriptionQueue.add('youtubeTranscription', {
                user,
                ip

            })
            
            return res.json({jobId : job.id})
        } catch (err) {
            if (err instanceof AppError) {
                return res.status(err.statusCode).json({ error: err.message })
            }
            console.error('Error processing video:', err)
            return res.status(500).json({ error: 'Failed to process video' })
        }
    }


    static getJobStatus = async (req: Request, res: Response) => {
        try {
            const {jobId} = req.params as {jobId : string}
            const job = await youtubeTranscriptionQueue.getJob(jobId)

            if (!job) {
                return res.status(400).json({error: 'No se encontró el job'})
            }

            const state = await job.getState()

            if (state === 'completed') {
                return res.status(200).json({status: 'completed', data: job.returnvalue})
            }

            if (state === 'failed') {
                return res.status(200).json({status: 'faided', error: job.failedReason})
            }

            return res.status(200).json({status: state})
        } catch (error) {
            return res.status(500).json({error: 'Hubo un error en la obtención del status'})
        }
    }


}
