import { Request, Response } from "express";
import fs from 'node:fs/promises'
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { transcribeWhisperAudio } from "../transcription/whisper.service.js";
import { convertVideoToAudio } from "../audio/audio.service.js";
import { translateText } from "../translation/translation.service.js";
export class FileController {
    static init = async (req: Request, res: Response) => {
        try {
            const lang = String(req.params.lang)
            console.log('lenguaje', lang)
            const __fileName = fileURLToPath(import.meta.url)
            const file = req.file
            const __dirname = dirname(__fileName)
            const rutaArchivo = path.join(__dirname, '..', '..', 'archivos.json')
            if (!file) {
                return res.status(400).json({ error: 'No se recibio ningun archivo en el campo audio' })
            }
            const fileName = file.filename
            const fileIn = await fileExists()
            console.log(fileIn)
            if (!fileIn) {
                await fs.writeFile(rutaArchivo, JSON.stringify([]), "utf-8")
            }

            const archivo = await fs.readFile(rutaArchivo, "utf-8")
            const archivoParseado = JSON.parse(archivo)

            const nombreArchivo = {
                nombre: fileName
            }
            const filePath = path.join(process.cwd(), 'uploads', fileName)
            archivoParseado.push(nombreArchivo)
            const finalFilePath = await convertVideoToAudio(filePath)
            const text = await transcribeWhisperAudio(finalFilePath)
            await fs.writeFile(rutaArchivo, JSON.stringify(archivoParseado, null, 2), "utf-8")
            if (!text) return res.status(400).json({ error: 'Error al obtener transcripción' })
            const translated = await translateText(lang, text)
            console.log(translated)
            return res.status(200).json({ text, translated})
        } catch (error) {
            console.error(error)
            return res.status(500).json({ error: 'Hubo un error al enviar el archivo' })
        }
    }
}


async function fileExists() {
    try {
        const backendDir = process.cwd();
        const base = path.join(backendDir, 'archivos');
        const filepath = base + '.json';
        console.log(filepath)
        await fs.access(filepath);
        return true;
    }
    catch {
        return false;
    }
}