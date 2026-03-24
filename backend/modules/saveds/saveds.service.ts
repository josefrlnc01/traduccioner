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


    static getFile = async (id: string) => {
        try {
            const file = await FileModel.find({
                fileId: id
            })
            if (!file) {
                const youtubeFile = await YoutubeVideo.find({
                    fileId: id
                })
                return youtubeFile
            }

            return file
        } catch (error) {
            if (error instanceof AppError) throw error
            throw new Error('Hubo un error al obtener el documento')
        }
    }


    static delete = async (id: string) => {
        try {
            const file = await FileModel.findOne({
                fileId: id
            })

            if (!file) {
                const youtubeFile = await YoutubeVideo.findOne({
                    fileId: id
                })
                await youtubeFile?.deleteOne()
                return true
            }


            await file.deleteOne()
            return true
        } catch (error) {
            if (error instanceof AppError) throw error
            throw new Error('Hubo un error al eliminar el documento')
        }
    }


    static edit = async (title: string, id: string) => {
        try {
            const file = await FileModel.findOne({
                fileId: id
            })
            if (!file) {
                const youtubeFile = await YoutubeVideo.findOne({
                    fileId: id
                })
                if (!youtubeFile) {
                    throw new AppError('Documento no encontrado', 404)
                }

                youtubeFile.title = title
                await youtubeFile?.save()

            } else {
                file.title = title
                await file.save()
            }
        } catch (error) {
            if (error instanceof AppError) throw error
            throw new Error('Hubo un error al eliminar el documento')
        }
    }
} 