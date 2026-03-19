import path, { dirname } from "path";
import { fileURLToPath } from "url";
import OpenAi from 'openai'
import fs from 'node:fs'
import { formatTime } from "../../shared/utils/time.js";
import { TranscriptionSegment } from "openai/resources/audio/transcriptions.mjs";



export async function transcribeWhisperAudio(filePath: string): Promise<TranscriptionSegment[] | null> {
    try {
        const __fileName = fileURLToPath(import.meta.url)
        const __dirname = dirname(__fileName)
        console.log('transcribe filepath', filePath)
        console.log('audioPath', filePath)
        const openAi = new OpenAi()

        const transcription = await openAi.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: 'whisper-1',
            response_format: 'verbose_json',
            timestamp_granularities: ['segment']
        })


        if (!transcription.segments) throw new Error("Error en la transcripción del audio")
            console.log('segments', transcription.segments)
        const segmentText = transcription.segments
            ?.map(s => `[${formatTime(s.start)}] ${s.text}`)
            .join('\n')

        return transcription.segments ?? null

    } catch (error) {
        console.error(error)
        return null
    }
}