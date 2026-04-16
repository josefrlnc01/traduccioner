import { tokenStore } from "@/lib/token.store"
import axios, { isAxiosError } from "axios";
import type { StoredYoutubeVideoTranscription, StoredYoutubeVideoTranslation } from "../types/yt-video.types";
import type { StoredFileTranscription, StoredFileTranslation } from "../types/file.types";
import type { TranscriptionResult } from "../types/subtitles.types";
const urlBackend = import.meta.env.VITE_API_URL
const baseUrl = import.meta.env.VITE_API_URL
type GetJobStatus =
    | { status: string }
    | { status: 'completed', data: TranscriptionResult }
    | { status: 'failed', error: string }


async function extractErrorMessage(response: Response, fallback: string) {
    try {
        const data = await response.json()
        if (data?.error && typeof data.error === 'string') {
            return data.error
        }
    } catch {
        return fallback
    }

    return fallback
}
export type JobId = {
    jobId : string
}
export async function sendLink(link: string | null, formData: FormData | null): Promise<string> {
    const accessToken = tokenStore.get()

    try {
        console.log('form data sendlink', formData)
        if (!link && !formData) {
            throw new Error('Debes elegir un vídeo/audio para proceder con su transcripción.')
        }

        if (link !== null) {
            console.log('link', link)
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
                    throw new Error(await extractErrorMessage(response, 'No dispones de minutos de transcripcion gratuita suficientes'))
                }

                if (response.status === 400) {
                    throw new Error(await extractErrorMessage(response, 'No se recibio ningun archivo'))
                }

                throw new Error(await extractErrorMessage(response, 'Hubo un error en el proceso'))
            }

            const data = await response.json()
            if (!data) {
                throw new Error('Hubo un error en el proceso')
            }
            
            const { jobId } = data

            return  jobId 
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
                throw new Error(await extractErrorMessage(response, 'No dispones de minutos de transcripcion gratuita suficientes'))
            }

            if (response.status === 400) {
                throw new Error(await extractErrorMessage(response, 'No se recibio ningun archivo'))
            }

            throw new Error(await extractErrorMessage(response, 'Hubo un error en el proceso'))
        }

        const data = await response.json()
        if (!data) {
            throw new Error('Hubo un error en el proceso')
        }

        const { jobId } = data

        return  jobId 
        }

        
    } catch (error) {
        throw error instanceof Error ? error : new Error('Hubo un error en el proceso')
    }
}


export async function checkFileJobStatus (jobId: string):Promise<GetJobStatus | undefined>{
    const accessToken = tokenStore.get()
    try {
        const { data } = await axios.post(`${urlBackend}/file/${jobId}`, {}, {
            withCredentials: true,
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


export async function checkYoutubeJobStatus (jobId: string): Promise<GetJobStatus | undefined> {
    const accessToken = tokenStore.get()
    try {
        const { data } = await axios.post(`${urlBackend}/yt-video/${jobId}`, {}, {
            withCredentials: true,
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



export async function saveYoutubeTranscription({ title, youtubeVideoText, comment }: StoredYoutubeVideoTranscription) {
    const accessToken = tokenStore.get()

    try {
        const { data } = await axios.post(`${baseUrl}/yt-video/save-transcription`, {
            title,
            youtubeVideoText,
            comment
        },
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`
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

export async function saveYoutubeTranslation({ title, translatedYoutubeVideo, comment }: StoredYoutubeVideoTranslation) {
    const accessToken = tokenStore.get()

    try {
        const { data } = await axios.post(`${baseUrl}/yt-video/save-translation`, {
            title: title,
            translatedYoutubeVideo: translatedYoutubeVideo,
            comment: comment
        }, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })

        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function saveFileTranscription({ title, fileText, comment }: StoredFileTranscription) {
    const accessToken = tokenStore.get()

    try {
        const { data } = await axios.post(`${baseUrl}/file/save-transcription`, {
            title,
            fileText,
            comment
        },
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`
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

export async function saveFileTranslation({ title, comment, translatedFile }: StoredFileTranslation) {
    const accessToken = tokenStore.get()

    try {
        const { data } = await axios.post(`${baseUrl}/file/save-translation`, {
            title,
            comment,
            translatedFile
        }, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })

        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}
