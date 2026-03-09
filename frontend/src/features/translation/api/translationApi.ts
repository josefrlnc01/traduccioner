import { tokenStore } from "@/lib/token.store"
export type PromiseLink = {
    subtitles: string, 
    translatedText:string, 
    title:string, 
    id: string
}

export type PromiseFile = {
    text:string,
    translated: string
}
const urlBackend = import.meta.env.VITE_API_URL
export async function sendLink(link:string | null, lang: string | null, formData: FormData | null):Promise<PromiseLink | PromiseFile | undefined> {
    const accessToken = tokenStore.get()
    try {
        
        
        if (link !== null) {
            const response = await fetch(`${urlBackend}/link`, {
            method:'POST',
            body: JSON.stringify({videoLink: link, lang}),
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
        } else {
            const response = await fetch(`${urlBackend}/file/${lang ? lang : 'es'}`, {
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
            const {text, translated } = data
            return { text, translated }
        }
    } catch (error) {
        throw error instanceof Error ? error : new Error('Hubo un error en el proceso')
    }
}



