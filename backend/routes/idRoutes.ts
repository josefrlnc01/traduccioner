import { Router } from "express";
import type { Request, Response } from "express";
import { isSecureLink } from "../utils/secureLink.ts";

export const idRoutes = Router()
type VideoLink = {
    videoLink : string
}
idRoutes.post('/', (req: Request, res: Response) => {
    const {videoLink}:VideoLink = req.body
    if (!videoLink) {
        const error = new Error('Debes introducir un link')
        return res.status(400).json({error : error.message})
    }

    if (typeof videoLink !== 'string' || !isSecureLink(videoLink)) {
        console.log(typeof videoLink)
        const error = new Error('Debes introducir un link válido')
        return res.status(400).json({error : error.message})
    }

    //Obtenemos el link del enlace tratándo el enlace entero como un array
    const reg: RegExp = /\b\w+\b/g
    const arrayOfLink = videoLink.match(reg)
    let id = '' 
    if (videoLink && arrayOfLink) {
        for (let i = 0; i < arrayOfLink.length; i++) {
        if (arrayOfLink[i] === 'v') {
            id = arrayOfLink[i + 1]
        }
    }
    }

    return res.json(id)
})

