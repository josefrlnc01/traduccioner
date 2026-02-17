import { exec } from "child_process";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { promisify }from 'util'

const execPromise = promisify(exec)
const __fileName = fileURLToPath(import.meta.url)
const __dirname = dirname(__fileName)
export async function transcribeWhisperAudio(audioPath:string) {
    try {
        const scriptPath = path.join(__dirname, "whisper_transcribe.py")
        console.log(scriptPath)
       
        const {stdout} = await execPromise(`
            python "${scriptPath}" "${audioPath}"`
        )
            if (!stdout || stdout.trim().length === 0) {
        throw new Error('Python no devolvió ningún resultado');
        }
        const result = JSON.parse(stdout)
        console.log(result)
        return result.text
    } catch (error) {
        console.error(error)
        return null
    }
}