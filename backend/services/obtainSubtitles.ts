import fs from 'node:fs/promises'
import { getSubtitlesFromVideo } from '../utils/getSubtitles.ts'

export const obtainSubtitles = async () => {
    try {
        const links = JSON.parse(await fs.readFile('link.json', 'utf-8')) as Record<string, unknown>
        const link: string | null = (links.key as string) || null
        
        if (!link) {
            return { error: 'No link found' }
        }
        
        const subtitles = await getSubtitlesFromVideo(link)
        return subtitles
    } catch (err) {
        console.error('Error in obtainSubtitles:', err)
        return { error: 'Failed to obtain subtitles' }
    }
}