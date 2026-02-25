import { exec } from "child_process";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { promisify }from 'util'
import fs from 'node:fs/promises'

const execPromise = promisify(exec)
const __fileName = fileURLToPath(import.meta.url)
const __dirname = dirname(__fileName)


export async function transcribeWhisperAudio(lang:string) {
    try {
        const scriptPath = path.join(__dirname, "whisper_transcribe.py")
        
        const audioPath = path.join(__dirname, "..", "audio.mp3")
        const {stdout, stderr} = await execPromise(`python "${scriptPath}" "${audioPath}" "${lang}"`)
        if (stderr) {
            console.log(stderr)
        }
        
        const jsonLine = stdout.split('\n').find(line => line.trim().startsWith('{'))
        if (!jsonLine || jsonLine.trim().length === 0) {
        throw new Error('Python no devolvió ningún resultado');
        }
        const result = JSON.parse(jsonLine)
        console.log("transcribiendo")
        return result.text
    } catch (error) {
        console.error(error)
        return null
    }
}