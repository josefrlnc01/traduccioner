import { Request, Response } from "express";
import { SavedsService } from "./saveds.service.js";
import { AppError } from "../errors/AppError.js";
import { generateSummary } from "../transcription/summary-ia.service.js";

export class SavedsController {
    static getSaveds = async (req: Request, res: Response) => {
        try {
            const user = req.user;

            const files = await SavedsService.getFiles(user)
            const youtubeFiles = await SavedsService.getYoutubeFiles(user)

            return res.status(200).json({ files, youtubeFiles })
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            return res.status(500).json({ error: 'Hubo un error al obtener los documentos guardados' })
        }
    }


    static getSavedById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params as { id: string }
            const user = req.user
            const file = await SavedsService.getFile(id)
            return res.status(200).json({file, user})
        } catch (error) {
            console.error(error)
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            return res.status(500).json({ error: 'Hubo un error al obtener el documento por id' })
        }
    }


    static deleteOne = async (req: Request, res: Response) => {
        try {
            const { id } = req.params as { id: string }

            await SavedsService.delete(id)

            return res.status(200).send('Documento eliminado correctamente')
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            return res.status(500).json({ error: 'Hubo un error al eliminar el documento' })
        }
    }


    static editTitle = async (req: Request, res: Response) => {
        try {
            const { id } = req.params as { id: string }
            const { newTitle } = req.body
            await SavedsService.edit(newTitle, id)

            return res.status(200).send('Documento editado correctamente')
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            return res.status(500).json({ error: 'Hubo un error al eliminar el documento' })
        }
    }


    static generateIaSummary = async (req: Request, res: Response) => {
        try {
            const { id } = req.params as { id: string }
            const file = await SavedsService.getFile(id)
    
            const textSegments = file[0].segments.map(s => {
                return {
                    text: s.text
                }
            })
            const stream = await generateSummary(textSegments)
            res.setHeader('Content-Type', 'text/event-stream')
            res.setHeader('Cache-Control', 'no-cache')
            res.setHeader('Connection', 'keep-alive')

            for await (const chunk of stream) {
                const text = chunk.choices[0]?.delta.content ?? ''

                if (text) {
                    res.write(`data: ${JSON.stringify({text})}\n\n`)
                }
            }

            res.write(`data: [DONE]\n\n`)
            res.end()
        } catch (error) {
            console.error(error)
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            return res.status(500).json({ error: 'Hubo un error al eliminar el documento' })
        }
    }
}