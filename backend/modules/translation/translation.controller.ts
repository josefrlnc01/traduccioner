import { Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { TranslationService } from "./translation.service.js";

export class TranslationController {
    static getTranslation = async (req: Request, res: Response) => {
        try {
            const {lang} = req.params as {lang: string}
            const {fileText} = req.body
            const translatedFile = await TranslationService.translateText(lang, fileText)
            return res.send(translatedFile)
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({error: error.message})
            }
            return res.status(500).json({error: 'Hubo un error al traducir el documento'})
        }
    }


    static getYoutubeTranslation = async (req: Request, res: Response) => {
        try {
            const {lang} = req.params as {lang: string}
            const {youtubeVideoText} = req.body
            const translatedFile = await TranslationService.translateText(lang, youtubeVideoText)
            return res.send(translatedFile)
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({error: error.message})
            }
            return res.status(500).json({error: 'Hubo un error al traducir el documento'})
        }
    }
}