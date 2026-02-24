import ytDlp from 'yt-dlp-exec'
import fs from 'node:fs/promises'
import path from 'node:path'


export async function downloadAudio (link: string | null):Promise<string | null> {
    try {
        const backendDir = process.cwd()
        const base = path.join(backendDir, 'audio')
        const filepath = base + '.mp3'
        const url = Array.isArray(link) ? link[0] : link
        
        const audio = await audioExists()

        if (audio) {
            fs.unlink(filepath)
        }

        await ytDlp(url,{
            output : base + '.%(ext)s', // Permite que yt-dlp use la extensión correcta
            format: 'bestaudio',
            audioFormat: 'mp3',
            extractAudio: true,
            ffmpegLocation: 'C:\\ffmpeg\\bin\\ffmpeg.exe'
        })

        return filepath
    } catch (err) {
        console.error('Error downloading audio:', err)
        return null
    }
}


async function audioExists () {
    try {
        const backendDir = process.cwd()
        const base = path.join(backendDir, 'audio')
        const filepath = base + '.mp3'
        await fs.access(filepath)
        return true
    } catch {
        return false
    }
}