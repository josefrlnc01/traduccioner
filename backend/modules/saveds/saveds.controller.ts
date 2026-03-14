import { Request, Response } from "express";
import { SavedsService } from "./saveds.service.js";

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
            console.error(error)
            return res.status(500).json({error: 'Hubo un error al obtener los documentos guardados'})
        }
    }
}