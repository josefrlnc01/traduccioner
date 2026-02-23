


export async function sendLink(link:string, lang:string | null):Promise<{subtitles: string, translatedText:string, title:string, id: string} | undefined> {
    try {
        const response = await fetch('http://localhost:8000/link', {
            method:'POST',
            body: JSON.stringify({videoLink: link, lang}),
            headers : {
                'Content-Type': 'application/json'
            }
        })
        console.log(response)
        
        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Server error: ${response.status} - ${errorText}`)
        }
        
        const data = await response.json()
        if (data) {
            const {subtitles, translatedText, title, id} = data
            return {title, subtitles, translatedText, id}
        }
    } catch (error) {
        console.error(error)
    }
}



