import fs from 'node:fs/promises'
import path, { dirname } from 'node:path'
import { InsertFileTranscriptionProps, InsertFileTranslationProps } from './file.types.js'
import FileModel from './file.model.js'
import { AppError } from '../errors/AppError.js'
import { IUser } from '../user/user.model.js'
import { formatMinutes, getAudioDuration } from '../../shared/utils/audio.js'
import { transcribeWhisperAudio } from '../transcription/whisper.service.js'
import Quota from '../quota/quota.schema.js'
import { v4 as uuidv4 } from 'uuid'

export class FileService {

    static insertTranscription = async ({ fileText, user, title, duration }: InsertFileTranscriptionProps) => {
        try {
            const fileExists = await FileModel.findOne({
                user: user,
                title: title
            })

            const id = uuidv4()

            const savedFile = await FileModel.create({
                title: title,
                fileId: id,
                segments: fileText,
                duration: duration,
                user: user._id
            })


            return savedFile
        } catch (error: any) {
            if (error instanceof AppError) throw error
            return null
        }
    }



    static getTranscriptionFromAudio = async (finalFilePath: string, user: IUser, ip: string) => {
        try {
            //Obtención de la ip del dispositivo
            const minutes = await getAudioDuration(finalFilePath)
            const formattedAudioDuration = formatMinutes(minutes)
            const quota = await Quota.findOne({
                user: user._id, ip
            })

            const usedMinutes = Number(quota?.usedMinutes ?? 0)
            const totalMinutes = Number((usedMinutes + minutes))
            const planLimits: Record<string, number> = {
                free: 10,
                pro: 180,
                business: 600
            }

            const limit = planLimits[user.subscription] ?? 0

            if (totalMinutes > limit) {
                throw new AppError(`No dispones de más minutos de transcripción`, 429)
            }

            await Quota.findOneAndUpdate(
                {user: user._id, ip},
                {
                    $set: {usedMinutes: totalMinutes}
                },
                {upsert: true, new: true}
            )

            const fileText = await transcribeWhisperAudio(finalFilePath)

            await fs.unlink(finalFilePath)
            return { fileText, usedMinutes: totalMinutes, audioDuration: formattedAudioDuration }
        } catch (error) {
            if (error instanceof AppError) throw error
            if (error instanceof Error) {
                throw new Error(error.message)
            }

            throw new Error('Hubo un error al transcribir el audio')
        }
    }
}


async function fileExists() {
    try {
        const backendDir = process.cwd();
        const base = path.join(backendDir, 'archivos');
        const filepath = base + '.json';
        await fs.access(filepath);
        return true;
    }
    catch {
        return false;
    }
}

