

export async function getVideoLength (id:string) {
    try {
        const apiKey = process.env.GOOGLE_API_KEY
        const url = `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${apiKey}&part=contentDetails`
        const response = await fetch(url)
        if (response) {
            const data = await response.json()
            return (data)
        }
    } catch (error) {
        console.error(error)
    }
}


export async function getLanguageAndTitle(id:string) {
    try {
        const apiKey = process.env.GOOGLE_API_KEY
        const url = `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${apiKey}&part=snippet`
        const response = await fetch(url)
        if (response) {
            const data = await response.json()
            const videoInfo = data.items[0].snippet
            if (videoInfo) {
            const language:string= videoInfo.defaultLanguage
            const title:string = videoInfo.title
            return {language, title}
            }
            
        }
    } catch (error) {
        console.error(error)
    }
}