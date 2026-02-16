import ytDlp from 'yt-dlp-exec';
import fs from 'node:fs/promises'
export async function downloadAudio (link: string | null):Promise<string | null> {
    try {
        const base = 'audio'
        const url = Array.isArray(link) ? link[0] : link
        console.log('link', url)
        console.log('extrayendo audio...')
        
        await ytDlp(url,{
            output : base + '.%(ext)s', // Permite que yt-dlp use la extensión correcta
            format: 'bestaudio',
            audioFormat: 'mp3',
            extractAudio: true,
            ffmpegLocation: 'C:\\ffmpeg\\bin\\ffmpeg.exe'
        })

        const filepath = base + '.mp3'

        await fs.access(filepath)

        return filepath
    } catch (err) {
        console.error('Error downloading audio:', err)
        return null
    }
}