export function isSecureLink (link: string) {
    try {
        const url = new URL(link)
        if (url.protocol !== 'https') return false
        return true
    } catch (error) {
        return false
    }
}