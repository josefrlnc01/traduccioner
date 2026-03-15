import path, { dirname } from "path";
import { fileURLToPath } from "url";
import OpenAi from 'openai'
import fs from 'node:fs'



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


            const formatted = await openAi.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `Eres un editor de texto. Recibirás una transcripción de audio en bruto.
                    Tu tarea es:
                    - Añadir comas coherentemente
                    - Dividir en párrafos semánticos coherentes mediante puntos
                    - Corregir errores obvios de transcripción
                    - NO cambiar el contenido ni añadir información
                    Devuelve únicamente el texto formateado, sin comentarios.`
                },
                {
                    role: 'user',
                    content: transcription.text
                }
            ]
        })

        return formatted.choices[0].message.content ?? null
        
    } catch (error) {
        console.error(error)
        return null
    }
}