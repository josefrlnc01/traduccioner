export function formatTime(seconds: number) {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    return hrs >= 1
        ? `[${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}]`
        : `[${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}]`
}

export function formatSRTTime(seconds: number): string {
    const date = new Date(seconds * 1000)
    const hh = date.getUTCHours().toString().padStart(2, '0')
    const mm = date.getUTCMinutes().toString().padStart(2, '0')
    const ss = date.getUTCSeconds().toString().padStart(2, '0')
    const ms = date.getUTCMilliseconds().toString().padStart(2, '0')
    return `${hh}:${mm}:${ss},${ms}`
}