import { tokenStore } from "@/lib/token.store"
import axios, { isAxiosError } from "axios";
import type { StoredYoutubeVideoTranscription, StoredYoutubeVideoTranslation } from "../types/yt-video.types";
import type { StoredFileTranscription, StoredFileTranslation, WhisperSegment } from "../types/file.types";
import type { SavedFile } from "../components/SavedFile";

export type PromiseLink = {
    youtubeVideoText: SavedFile,
    translatedYoutubeVideo: string,
    usedMinutes: number,
    user: {
        _id: () => string,
        suscription: string,
        name: string,
        email: string
    }
}

export type PromiseFile = {
    fileText: SavedFile,
    translatedFile: string,
    usedMinutes: number,
    user: {
        _id: () => string,
        suscription: string,
        name: string,
        email: string
    }
}

const urlBackend = import.meta.env.VITE_API_URL
export async function sendLink(link: string | null,  formData: FormData | null): Promise<PromiseLink | PromiseFile | undefined> {
    const accessToken = tokenStore.get()
    try {


        if (link !== null) {
            console.log('inicio de consulta')
            const response = await fetch(`${urlBackend}/yt-video`, {
                method: 'POST',
                body: JSON.stringify({ videoLink: link }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            })

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('No dispones de minutos de transcripción gratuita suficientes')
                } else if (response.status === 400) {
                    throw new Error('No se recibió ningun archivo')
                }
            }

            const data = await response.json()
            if (!data) {
                throw new Error('Hubo un error en el proceso')
            }
            const { youtubeVideoText, translatedYoutubeVideo, usedMinutes, user } = data
            return { youtubeVideoText, translatedYoutubeVideo, usedMinutes, user}
        } else {
            const response = await fetch(`${urlBackend}/file`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error(`No dispones de minutos de transcripción gratuita suficientes`)
                } else if (response.status === 400) {
                    throw new Error('No se recibió ningun archivo')
                }
            }

            const data = await response.json()
            if (!data) {
                throw new Error('Hubo un error en el proceso')
            }
            const { fileText, translatedFile, usedMinutes, user } = data
            return { fileText, translatedFile, usedMinutes, user }
        }
    } catch (error) {
        throw error instanceof Error ? error : new Error('Hubo un error en el proceso')
    }
}



const baseUrl = import.meta.env.VITE_API_URL
export async function saveYoutubeTranscription ({title, youtubeVideoText, comment}: StoredYoutubeVideoTranscription) {
    const accessToken = tokenStore.get()
    try {
        const {data} = await axios.post(`${baseUrl}/yt-video/save-transcription`, {
            title,
            youtubeVideoText,
            comment
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

export async function saveYoutubeTranslation ({title, translatedYoutubeVideo, comment}:StoredYoutubeVideoTranslation ) {
    const accessToken = tokenStore.get()
    try {
        const {data} = await axios.post(`${baseUrl}/yt-video/save-translation`, {
            title: title,
            translatedYoutubeVideo: translatedYoutubeVideo,
            comment: comment
        }, {
            headers: {
                "Authorization" : `Bearer ${accessToken}`
            }
        })

        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}


export async function saveFileTranscription ({title, fileText, comment}: StoredFileTranscription) {
    const accessToken = tokenStore.get()
    try {
        const {data} = await axios.post(`${baseUrl}/file/save-transcription`, {
            title,
            fileText,
            comment
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


export async function saveFileTranslation ({title, comment, translatedFile}: StoredFileTranslation) {
    const accessToken = tokenStore.get()
    try {
        const {data} = await axios.post(`${baseUrl}/file/save-translation`, {
            title,
            comment,
            translatedFile
        }, {
            headers: {
                "Authorization" : `Bearer ${accessToken}`
            }
        })

        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}





