import OpenAI from "openai"
import { AppError } from "../errors/AppError.js"

const openAi =  new OpenAI()
export async function generateSummary (segments: {text:string}[]) {
    try {
        const fullText = segments.map((s) => s.text).join('')
        const stream = await openAi.chat.completions.create({
            model: 'gpt-4o-mini',
            stream: true,
            messages: [
                {
                    role: 'system',
                    content: `Eres un asistente experto en síntesis de contenido.
                    Recibirás el texto de una transcripción de audio.
                    Tu tarea es:
                    - Generar un resumen conciso de 3-5 frases
                    - Capturar los puntos clave del contenido
                    - Mantener un tono neutro y profesional
                    - NO inventar información que no esté en el texto
                    Devuelve únicamente el resumen, sin comentarios ni prefijos.`
                },
                {
                    role: 'user',
                    content: fullText
                }
            ]
        })

        
        return stream
    } catch (error) {
        if (error instanceof AppError) throw error
        throw new Error('Hubo un error durante el resumen de la transcripción')
    }
}