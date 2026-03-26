import { Request, Response } from "express";
import { DocumentService } from "./document.service.js";
import { AppError } from "../errors/AppError.js";

export class DocumentController {
    static createPDF = async (req: Request, res: Response) => {
        try {
            const {text} = req.body
            const buffer = await DocumentService.generatePdf(text)
            res.setHeader("Content-Type", "application/pdf")
            res.setHeader("Content-Disposition", "attachment; filename='archivo.pdf'")
            return res.status(201).send(buffer)
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({error: error.message})
            }
            return res.status(500).json({error: 'Hubo un error al generar el pdf'})
        } 
    }

    static createSRT = async (req: Request, res: Response) => {
        try {
            const {segments} = req.body

            const srt = await DocumentService.generateSrt(segments)
            res.setHeader("Content-Type", "text/plain")
            res.setHeader("Content-Disposition", "attachment; filename='archivo.srt'")
            return res.status(201).send(srt)
        } catch (error) {
            return res.status(500).json({error: 'Hubo un error al generar el SRT'})
        }
    }


    static createTXT = async (req: Request, res: Response) => {
        try {
            const {segments} = req.body

            const txt = await DocumentService.generateTxt(segments)

            res.setHeader("Content-Type", "text/plain")
            res.setHeader("Content-Disposition", "attachment; filename='archivo.txt'")
            return res.status(201).send(txt)
        } catch (error) {
            console.error(error)
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({error: error.message})
            }
            return res.status(500).json({error: 'Hubo un error al crear el archivo TXT'})
        }
    }

}   