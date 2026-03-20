import { Request, Response } from "express";
import { generatePdf, generateSrt } from "../../shared/utils/create-files.js";
import { AppError } from "../errors/AppError.js";

export class DocumentController {
    static createPDF = async (req: Request, res: Response) => {
        try {
            const {text} = req.body
            console.log('text', text)
            const buffer = await generatePdf(text)
            res.setHeader("Content-Type", "application/pdf")
            res.setHeader("Content-Disposition", "attachment; filename='archivo.pdf'")
            return res.status(201).send(buffer)
        } catch (error) {
            console.log(error)
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({error: error.message})
            }
            return res.status(500).json({error: 'Hubo un error al generar el pdf'})
        } 
    }

    static createSRT = async (req: Request, res: Response) => {
        try {
            const {segments} = req.body

            const srt = await generateSrt(segments)
            res.setHeader("Content-Type", "text/plain")
            res.setHeader("Content-Disposition", "attachment; filename='archivo.srt'")
            return res.status(201).send(srt)
        } catch (error) {
            return res.status(500).json({error: 'Hubo un error al generar el SRT'})
        }
    }

}   