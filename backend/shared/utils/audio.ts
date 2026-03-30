import { parseFile } from 'music-metadata'

export async function getAudioDuration(filePath: string): Promise<number> {
    const metadata = await parseFile(filePath)
    const minutes = convertToMinutes(metadata.format.duration ?? 0)
    return Number(minutes)
}

export async function getSeconds(filePath: string): Promise<number> {
    const metadata = await parseFile(filePath)
    return Number(metadata.format.duration)
}

 function convertToMinutes(duration: number) {
    return (duration / 60)
}


export function formatMinutes(decimal: number): string {
    const mins = Math.floor(decimal)
    const secs = Math.floor((decimal % 1) * 60)
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}min`
}


export function formatMinutesDB(decimal: number): number {
    const secs = Math.floor((decimal % 1) * 60)
    const newMins = `${secs}`
    const formattedMins = convertToMinutes(Number(newMins))
    return formattedMins
}



