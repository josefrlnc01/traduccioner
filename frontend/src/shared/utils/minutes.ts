export function formatMinutes(decimal: number): string {
    const totalSeconds = Math.round(decimal * 60)

    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60

    return secs > 0 ? `${mins}m ${totalSeconds}s` : `${mins}min`
}

export function formatTime(seconds: number) {
        const hrs = Math.floor(seconds / 3600)
        const mins = Math.floor((seconds % 3600) / 60)
        const secs = Math.floor(seconds % 60)
        return hrs >= 1 
        ? `[${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}]` 
        : `[${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}]`
    }