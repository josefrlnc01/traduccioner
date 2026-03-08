import { Request, Response } from "express";
import { insert } from "./stored.service.js";
import { storedSchema } from "./stored.schema.js";

export class VideoStoredController {
    static saveVideo = async (req: Request, res: Response) => {
        try {
            const user = req.user
            const data = storedSchema.parse(req.body)
            await insert({data, user})
            return res.status(201).send('Video guardado correctamente')
        } catch (error) {
            if (error instanceof Error) {
                return res.status(409).json({error: error.message})
            }
            return res.status(500).json({error: 'Hubo un error al guardar el vídeo'})
        }
    }       
}