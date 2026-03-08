import { Request, Response } from "express";

export class FileController {
    static init = async (req: Request, res: Response) => {
        try {
            const {formData} = req.body

            
        } catch (error) {
            console.error()
            return res.status(500).json({error: 'Hubo un error al envíar el archivo'})
        }
    }
}