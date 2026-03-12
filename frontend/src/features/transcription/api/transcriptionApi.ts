import { tokenStore } from "@/lib/token.store"
import axios, { isAxiosError } from "axios";
import type { YoutubeVideoStored } from "../types/yt-video.types";
import type { FileStored } from "../types/file.types";

export type PromiseLink = {
    youtubeVideoText: string,
    translatedYoutubeVideo: string,
    title: string,
    id: string
}

export type PromiseFile = {
    fileText: string,
    translatedFile: string
}
const urlBackend = import.meta.env.VITE_API_URL
export async function sendLink(link: string | null, lang: string | null, formData: FormData | null): Promise<PromiseLink | PromiseFile | undefined> {
    const accessToken = tokenStore.get()
    try {


        if (link !== null) {
            const response = await fetch(`${urlBackend}/yt-video/${lang ? lang : 'not'}`, {
                method: 'POST',
                body: JSON.stringify({ videoLink: link }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            })

            if (!response.ok) {
                console.log(response.status)
                if (response.status === 429) {
                    throw new Error('No puedes realizar más traducciones')
                }
                throw new Error(`Server error`)
            }

            const data = await response.json()
            if (!data) {
                throw new Error('Hubo un error en el proceso')
            }
            const { youtubeVideoText, translatedYoutubeVideo, title, id } = data
            return { title, youtubeVideoText, translatedYoutubeVideo, id }
        } else {
            const response = await fetch(`${urlBackend}/file/${lang ? lang : 'not'}`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('No puedes realizar más traducciones')
                }
                throw new Error(`Server error`)
            }

            const data = await response.json()
            if (!data) {
                throw new Error('Hubo un error en el proceso')
            }
            const { fileText, translatedFile } = data
            return { fileText, translatedFile }
        }
    } catch (error) {
        throw error instanceof Error ? error : new Error('Hubo un error en el proceso')
    }
}



const baseUrl = import.meta.env.VITE_API_URL
export async function saveTranscription ({videoId, title, text, translatedYoutubeVideo}: YoutubeVideoStored) {
    const accessToken = tokenStore.get()
    try {
        const {data} = await axios.post(`${baseUrl}/yt-video/save`, {
            videoId,
            title,
            text,
            translatedYoutubeVideo
        },
        {
            headers: {
                'Authorization' : `Bearer ${accessToken}`
            }, 
        }
    )

        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}


export async function saveFileTranscription ({ text, translatedFile}: FileStored) {
    const accessToken = tokenStore.get()
    console.log('saveFile')
    try {
        const {data} = await axios.post(`${baseUrl}/file/save`, {
            text,
            translatedFile
        },
        {
            headers: {
                'Authorization' : `Bearer ${accessToken}`
            }, 
        }
    )

        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}





