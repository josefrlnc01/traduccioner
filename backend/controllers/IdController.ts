import type { Request, Response } from "express";
import { isSecureLink } from "../utils/secureLink.ts";
import fs from 'node:fs/promises'
type VideoLink = {
    videoLink : string
}

export class IdController {
    static obtainId = (req : Request, res : Response) => {
    const {videoLink}:VideoLink = req.body
    if (!videoLink) {
        const error = new Error('Debes introducir un link')
        return res.status(400).json({error : error.message})
    }
    
    fs.writeFile('link.json', JSON.stringify({key : videoLink }))
    if (typeof videoLink !== 'string' || !isSecureLink(videoLink)) {
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

    if (!id || typeof id === 'undefined') {
        const error = new Error('No se pudo procesar el id correctamente')
        return res.status(400).json({error : error.message})
    }

    return res.json({id, link:videoLink})
    }



}