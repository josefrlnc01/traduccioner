import path, { dirname } from "path";
import { fileURLToPath } from "url";
import OpenAi from 'openai'
import fs from 'node:fs'
import { resolveSoa } from "node:dns";



export async function transcribeWhisperAudio(filePath:string):Promise<string | null>{
    try {
        const __fileName = fileURLToPath(import.meta.url)
        const __dirname = dirname(__fileName)
        console.log('transcribe filepath', filePath)
        console.log('audioPath', filePath)
        const openAi = new OpenAi()

        const transcription = await openAi.audio.transcriptions.create({
            file:fs.createReadStream(filePath),
            model:'whisper-1'
        })

        if (!transcription) throw new Error("Error en la transcripción del audio")
        
        return transcription.text
    } catch (error) {
        console.error(error)
        return null
    }
}