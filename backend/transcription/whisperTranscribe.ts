import { exec } from "child_process";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { promisify }from 'util'
import fs from 'node:fs/promises'

const execPromise = promisify(exec)
const __fileName = fileURLToPath(import.meta.url)
const __dirname = dirname(__fileName)
export async function transcribeWhisperAudio() {
    try {
        const scriptPath = path.join(__dirname, "whisper_transcribe.py")
        
        const audioPath = path.join(__dirname, "..", "audio.mp3")
        console.log(audioPath)
        const {stdout, stderr} = await execPromise(`python "${scriptPath}" "${audioPath}"`)
        if (stderr) {
            console.log(stderr)
        }
        
        const jsonLine = stdout.split('\n').find(line => line.trim().startsWith('{'))
        if (!jsonLine || jsonLine.trim().length === 0) {
        throw new Error('Python no devolvió ningún resultado');
        }
        const result = JSON.parse(jsonLine)
        await fs.writeFile("song.json", JSON.stringify(result.text),{encoding : 'utf-8'})
       
        return result.text
    } catch (error) {
        console.error(error)
        return null
    }
}