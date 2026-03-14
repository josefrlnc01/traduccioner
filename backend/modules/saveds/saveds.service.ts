import FileModel from "../file/file.model.js"
import { IUser } from "../user/user.model.js"
import YoutubeVideo from "../youtube-video/youtube-video.model.js"

export class SavedsService {
    static getFiles = async (user: IUser) => {
        try {

            if (!user) {
                throw new Error('Error al obtener el usuario')
            }

            const userFiles = await FileModel.find({
                user: user
            })

            if (!userFiles) {
                throw new Error('No hay documentos guardados')
            }

            return userFiles
        } catch (error) {

            throw new Error('Hubo un error al obtener documentos')
        }
    }

    static getYoutubeFiles = async (user: IUser) => {
        try {
            if (!user) {
                throw new Error('Error al obtener el usuario')
            }

            const userYoutubeFiles = await YoutubeVideo.find({
                user: user
            })

            if (!userYoutubeFiles) {
                throw new Error('No hay documentos guardados')
            }

            return userYoutubeFiles
        } catch {
            throw new Error('Hubo un error al obtener documentos de vídeos de youtube')
        }
    }
}