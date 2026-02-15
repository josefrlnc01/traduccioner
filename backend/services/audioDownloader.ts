import ytDlp from 'yt-dlp-exec';

export async function downloadAudio (link: string | null):Promise<string | null> {
    try {
        const filePath = 'video.mp4'
        const url = Array.isArray(link) ? link[0] : link
        console.log('link', url)
        console.log('extrayendo audio...')
        
        await ytDlp(url,{
            output : filePath,
            format: 'bestaudio',
            extractAudio: true
        })

        return filePath
    } catch (err) {
        console.error('Error downloading audio:', err)
        return null
    }
}