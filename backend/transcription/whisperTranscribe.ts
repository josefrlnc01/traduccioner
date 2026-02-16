import { exec } from "child_process";
import { promisify }from 'util'

const execPromise = promisify(exec)

export async function transcribeWhisperAudio(audioPath:string) {
    try {
        const {stdout} = await execPromise(`
            python transcription/whisper_transcribe.py "${audioPath}"`
        )

        const result = JSON.parse(stdout)

        return result.text
    } catch (error) {
        console.error(error)
        return null
    }
}