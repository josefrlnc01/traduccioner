
import ytDlp from 'yt-dlp-exec';

export async function downloadAudio (link: string | null):Promise<string> {
    const filePath = 'video.mp4'
    const url = Array.isArray(link) ? link[0] : link
    console.log('link', url)
    ytDlp(url,{
        output : filePath,
        format: 'bestaudio',
        extractAudio: true
    })

    return filePath
}