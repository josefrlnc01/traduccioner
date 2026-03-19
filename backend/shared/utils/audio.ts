import { parseFile } from 'music-metadata'

export async function getAudioDuration(filePath: string):Promise<number> {
    const metadata = await parseFile(filePath)
    const minutes = await convertToMinutes(metadata.format.duration ?? 0)
    return Number(minutes)
}


async function convertToMinutes(duration: number) {
    return (duration/60).toFixed(2)
}


