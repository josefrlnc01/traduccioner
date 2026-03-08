import { tokenStore } from "@/lib/token.store"
export type PromiseLink = {
    subtitles: string, 
    translatedText:string, 
    title:string, 
    id: string
}

export type PromiseFile = {
    text: string
}
const urlBackend = import.meta.env.VITE_API_URL
export async function sendLink(link:string | null, formData: FormData | null):Promise<PromiseLink | PromiseFile | undefined> {
    const accessToken = tokenStore.get()
    try {
        let response
        if (link) {
            response = await fetch(`${urlBackend}/link`, {
            method:'POST',
            body: JSON.stringify({videoLink: link}),
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${accessToken}`
            }
        })
        
        if (!response.ok) {
            if (response.status === 429){
                throw new Error('No puedes realizar más traducciones')
            }
            throw new Error(`Server error`)
        }

        const data = await response.json()
        if (!data) {
            throw new Error('Hubo un error en el proceso')
        }
        const {subtitles, translatedText, title, id} = data
            return {title, subtitles, translatedText, id}
        } else if (formData) {
            response = await fetch(`${urlBackend}/file`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization' : `Bearer ${accessToken}`
                }
            })

            if (!response.ok) {
                if (response.status === 429){
                    throw new Error('No puedes realizar más traducciones')
                }
                throw new Error(`Server error`)
            }

            const data = await response.json()
            if (!data) {
                throw new Error('Hubo un error en el proceso')
            }
            const {text} = data
            return text
        }
    } catch (error) {
        throw error instanceof Error ? error : new Error('Hubo un error en el proceso')
    }
}





