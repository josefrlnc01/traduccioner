import { Request, Response } from "express";
import { generatePdf } from "../../shared/utils/pdf.js";

export class DocumentController {
    static create = async (req: Request, res: Response) => {
        try {
            const {text} = req.body
            console.log('text', text)
            const buffer = await generatePdf(text)
            res.setHeader("Content-Type", "application/pdf")
            res.setHeader("Content-Disposition", "attachment; filename='archivo.pdf'")
            return res.status(201).send(buffer)
        } catch (error) {
            console.log(error)
            if (error instanceof Error) {
                return res.status(400).json({error: error.message})
            }
            return res.status(500).json({error: 'Hubo un error al generar el pdf'})
        } 
    }

}   