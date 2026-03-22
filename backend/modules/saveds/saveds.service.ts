import { AppError } from "../errors/AppError.js"
import FileModel, { IFileStored } from "../file/file.model.js"
import { IUser } from "../user/user.model.js"
import YoutubeVideo from "../youtube-video/youtube-video.model.js"

export class SavedsService {
    static getFiles = async (user: IUser) => {
        try {

            if (!user) {
                throw new AppError('Error al obtener el usuario', 404)
            }

            const userFiles = await FileModel.find({
                user: user
            })

            if (!userFiles) {
                throw new AppError('No hay documentos guardados', 404)
            }

            return userFiles
        } catch (error) {
            if (error instanceof AppError) throw error
            throw new Error('Hubo un error al obtener documentos')
        }
    }

    static getYoutubeFiles = async (user: IUser) => {
        try {
            if (!user) {
                throw new AppError('Error al obtener el usuario', 404)
            }

            const userYoutubeFiles = await YoutubeVideo.find({
                user: user
            })


            if (!userYoutubeFiles) {
                throw new AppError('No hay documentos guardados', 404)
            }

            return userYoutubeFiles
        } catch (error: any) {
            if (error instanceof AppError) throw error
            throw new Error('Hubo un error al obtener documentos de vídeos de youtube')
        }
    }


    static getFile = async (id: string ) => {
        try {
            const file = await FileModel.findById(id)
            if (!file) {
                const youtubeFile = await YoutubeVideo.findById(id)
                return youtubeFile
            }

            return file
        } catch (error) {
            if (error instanceof AppError) throw error
            throw new Error('Hubo un error al obtener el documento')
        }
    }
}