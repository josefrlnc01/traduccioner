import { Request, Response } from "express";
import { SavedsService } from "./saveds.service.js";
import { AppError } from "../errors/AppError.js";
import { IFileStored } from "../file/file.model.js";
import { IYoutubeVideo } from "../youtube-video/youtube-video.model.js";

export class SavedsController {
    static getSaveds = async (req: Request, res: Response) => {
        try {
            const user = req.user;

            const files = await SavedsService.getFiles(user)
            const youtubeFiles = await SavedsService.getYoutubeFiles(user)
            console.log('files', files)
            console.log('yt files', youtubeFiles)
            return res.status(200).json({files, youtubeFiles})
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({error: error.message})
            }
            return res.status(500).json({error: 'Hubo un error al obtener los documentos guardados'})
        }
    }
}