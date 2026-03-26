import { Request, Response } from "express";
import { DocumentService } from "./document.service.js";
import { AppError } from "../errors/AppError.js";
import { formatTime } from "../../shared/utils/time.js";

export class DocumentController {
    static createPDF = async (req: Request, res: Response) => {
        try {
            const { segments } = req.body as {segments: {start:number,end:number,text:string}[]}
            
            const buffer = await DocumentService.generatePdf(segments)
            res.setHeader("Content-Type", "application/pdf")
            res.setHeader("Content-Disposition", 'attachment; filename="archivo.pdf"')
            return res.status(201).send(buffer)
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            return res.status(500).json({ error: 'Hubo un error al generar el pdf' })
        }
    }

    static createSRT = async (req: Request, res: Response) => {
        try {
            const { segments } = req.body
            console.log('body', req.body)
            const srt = await DocumentService.generateSrt(segments)
            res.setHeader("Content-Type", "text/plain")
            res.setHeader("Content-Disposition", 'attachment; filename="archivo.srt"')
            return res.status(201).send(srt)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: 'Hubo un error al generar el SRT' })
        }
    }

    static createVTT = async (req: Request, res: Response) => {
        try {
            const { segments } = req.body

            const vtt = await DocumentService.generateVtt(segments)

            console.log('vtt', vtt)
            res.setHeader("Content-Type", "text/vtt; charset=utf-8")
            res.setHeader("Content-Disposition", 'attachment; filename="archivo.vtt"')
            return res.status(201).send(vtt)
        } catch (error) {
            return res.status(500).json({ error: 'Hubo un error al generar el SRT' })
        }
    }


    static createTXT = async (req: Request, res: Response) => {
        try {
            const { segments } = req.body

            const txt = await DocumentService.generateTxt(segments)

            res.setHeader("Content-Type", "text/plain")
            res.setHeader("Content-Disposition", 'attachment; filename="archivo.txt"')
            return res.status(201).send(txt)
        } catch (error) {
            console.error(error)
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            return res.status(500).json({ error: 'Hubo un error al crear el archivo TXT' })
        }
    }

    static createDOCX = async (req: Request, res: Response) => {
        try {
            const { segments } = req.body
            const buffer = await DocumentService.generateDocX(segments)

            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            )

            res.setHeader("Content-Disposition",
                'attachment; filename="archivo.docx"')

            return res.status(201).send(buffer)
        } catch (error) {
            console.error(error)
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            return res.status(500).json({ error: 'Hubo un error al crear el archivo DOCX' })
        }
    }


    static createJSON = async (req: Request, res: Response) => {
        try {
            const {segments} = req.body
            const json = await DocumentService.generateJson(segments)
            res.setHeader("Content-Type", "application/json")
            res.setHeader("Content-Disposition", 
                'attachment; filename="archivo.json"')
            return res.send(json)
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({error: error.message})
            }
            return res.status(500).json({error: 'Hubo un error al crear el archivo JSON'})
        }
    }


    static createCSV = async (req: Request, res: Response) => {
        try {
            console.log('inicio')
            const {segments} = req.body
            console.log(req.body)
            const csv = await DocumentService.generateCsv(segments)
            console.log('csv', csv)
            res.setHeader("Content-Type", "text/csv")
            res.setHeader("Content-Disposition", 'attachment; filename="archivo.csv"')
            return res.send(csv)
        } catch (error) {
            console.error(error)
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({error: error.message})
            }
            return res.status(500).json({error: 'Hubo un error al crear el archivo CSV'})
        }
    }


}   