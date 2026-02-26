import { exec } from "child_process";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { promisify }from 'util'
import OpenAi from 'openai'
import fs from 'node:fs'



export async function transcribeWhisperAudio():Promise<string | null>{
    try {
        const __fileName = fileURLToPath(import.meta.url)
        const __dirname = dirname(__fileName)
        const audioPath = path.join(__dirname, "..", "audio.mp3")
        const openAi = new OpenAi()

        const transcription = await openAi.audio.transcriptions.create({
            file:fs.createReadStream(audioPath),
            model:'whisper-1'
        })

        if (!transcription) throw new Error("Error en la transcripción del audio")

        return transcription.text
    } catch (error) {
        console.error(error)
        return null
    }
}