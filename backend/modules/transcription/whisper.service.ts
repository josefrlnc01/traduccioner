import OpenAi from 'openai'
import fs from 'node:fs'

import { AppError } from "../errors/AppError.js";

export type TranscriptionFormatt = {
    end:number,
    start:number,
    text:string
}

export async function transcribeWhisperAudio(filePath: string): Promise<TranscriptionFormatt[]> {
    try {
        const openAi = new OpenAi()

        const transcription = await openAi.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: 'whisper-1',
            response_format: 'verbose_json',
            timestamp_granularities: ['segment']
        })


        if (!transcription.segments) throw new Error("Error en la transcripción del audio")

        const segmentsJSON = JSON.stringify(transcription.segments.map(s => ({
            start: s.start,
            end: s.end,
            text: s.text
        })))
        const formatted = await openAi.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `Eres un editor de texto. Recibirás un array JSON de segmentos de transcripción de audio.
            Cada segmento tiene: start (tiempo en segundos) y text (texto del segmento).
            Tu tarea es:
            - Corregir errores obvios de transcripción
            - Añadir puntuación coherente
            - Corregir errores semánticos
            - NO cambiar el contenido ni añadir información
            - NO modificar los valores de start ni end bajo ningún concepto
            Devuelve ÚNICAMENTE el array JSON con el mismo formato, sin comentarios, sin markdown, sin bloques de código.`
                },
                {
                    role: 'user',
                    content: segmentsJSON
                }
            ]
        })

        const responseText = formatted.choices[0].message.content

        if (!responseText) throw new AppError('Error al formatear la transcripción', 400)

        const formattedSegments: TranscriptionFormatt[] = JSON.parse(responseText)
        console.log('segments', formattedSegments)
        return formattedSegments ?? null

    } catch (error) {
        console.error(error)
        throw new Error('Hubo un erro al transcribir el audio')
    }
}