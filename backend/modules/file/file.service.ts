import fs from 'node:fs/promises'
import path, { dirname } from 'node:path'
import { InsertFileTranscriptionProps, InsertFileTranslationProps } from './file.types.js'
import FileModel from './file.model.js'
import { AppError } from '../errors/AppError.js'
import { IUser } from '../user/user.model.js'
import { getAudioDuration } from '../../shared/utils/audio.js'
import { transcribeWhisperAudio } from '../transcription/whisper.service.js'
import Quota from '../quota/quota.schema.js'


export class FileService {

    static insertTranscription = async ({ data, user }: InsertFileTranscriptionProps) => {
        try {
            const fileExists = await FileModel.findOne({
                user: user,
                fileText: data.fileText
            })

            if (fileExists) {
                throw new Error('Este documento ya existe')
            }

            const transcription = new FileModel()
            transcription.title = data.title
            transcription.fileText = data.fileText
            transcription.comment = data.comment
            transcription.user = user._id
            await transcription.save()
        } catch (error: any) {
            if (error instanceof AppError) throw error
            throw new Error('Hubo un error al guardar la transcripción')
        }
    }


    static insertTranslation = async ({ data, user }: InsertFileTranslationProps) => {
        try {
            const fileExists = await FileModel.findOne({
                user: user,
                translatedFile: data.translatedFile
            })

            if (fileExists) {
                throw new AppError('Este documento ya existe', 409)
            }

            const translation = new FileModel()

            translation.title = data.title
            translation.comment = data.comment
            translation.translatedFile = data.translatedFile

            translation.user = user._id
            await translation.save()
        } catch (error: any) {
            if (error instanceof AppError) throw error
            console.log(error)
            throw new Error('Hubo un error al guardar la traducción')
        }
    }


    static getTranscriptionFromAudio = async (finalFilePath: string, user: IUser, ip: string) => {
            //Obtención de la ip del dispositivo
            const audioDuration = await getAudioDuration(finalFilePath)
            await Quota.findOneAndUpdate(
                {user: user._id, ip},
                {
                    $inc: {usedMinutes: audioDuration.toFixed(2)}
                },
                {upsert: true, new: true}
            )

            const fileText = await transcribeWhisperAudio(finalFilePath)
            const quota = await Quota.findOne({
                user: user._id, ip
            })
            await fs.unlink(finalFilePath)
            return {fileText, usedMinutes: quota?.usedMinutes}
    }
}


async function fileExists() {
    try {
        const backendDir = process.cwd();
        const base = path.join(backendDir, 'archivos');
        const filepath = base + '.json';
        console.log(filepath)
        await fs.access(filepath);
        return true;
    }
    catch {
        return false;
    }
}

