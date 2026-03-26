import { tokenStore } from "@/lib/token.store";
import axios, { isAxiosError } from "axios";
const baseUrl = import.meta.env.VITE_API_URL

type DocumentProps = {
    segments: {
        start: number,
        end: number,
        text: string
    }[],
    title: string
}


export async function generatePDF(text: string) {
    const accessToken = tokenStore.get()
    try {
        const { data } = await axios.post(`${baseUrl}/document/create-pdf`, { text }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            withCredentials: true,
            responseType: 'blob'
        })

        const url = URL.createObjectURL(data)
        const a = document.createElement('a')
        a.href = url
        a.download = 'archivo.pdf'
        a.click()
        URL.revokeObjectURL(url)
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}


export async function generateSRT({segments, title}: DocumentProps) {
    const accessToken = tokenStore.get()
    try {
        const { data } = await axios.post(`${baseUrl}/document/create-srt`, { segments }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            withCredentials: true,
            responseType: 'blob'
        })
        if (!data) {
            throw new Error('Error en generación de srt')
        }
        const url = URL.createObjectURL(data)
        const a = document.createElement('a')
        a.href = url
        a.download = `${title.replace('.mp4', '')}.srt`
        a.click()
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function generateVTT({segments, title}: DocumentProps) {
    const accessToken = tokenStore.get()
    try {
        const { data } = await axios.post(`${baseUrl}/document/create-vtt`, { segments }, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
            withCredentials: true,
            responseType: 'blob'
        })
        if (!data) {
            throw new Error('Error en generación de vtt')
        }
        const url = URL.createObjectURL(data)
        const a = document.createElement('a')
        a.href = url
        a.download = `${title.replaceAll('.mp4', '')}.vtt`
        a.click()
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.errror)
        }
    }
}


export async function generateTXT(segments: { start: number, end: number, text: string }[]) {
    const accessToken = tokenStore.get()
    try {
        const { data } = await axios.post(`${baseUrl}/document/create-txt`, { segments }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            withCredentials: true,
            responseType: 'blob'
        })
        if (!data) {
            throw new Error('Error en generación de srt')
        }
        const url = URL.createObjectURL(data)
        const a = document.createElement('a')
        a.href = url
        a.download = 'transcripción.txt'
        a.click()
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}



export async function generateDOCX({segments, title}: DocumentProps) {
    const accessToken = tokenStore.get()
    try {
        const {data} = await axios.post(`${baseUrl}/document/create-docx`, {segments}, {
            headers: {
                "Authorization" : `Bearer ${accessToken}`
            },
            withCredentials: true,
            responseType: 'blob'
        })

        const url = URL.createObjectURL(data)
        const a = document.createElement('a')
        a.href = url
        a.download = `${title.replace('.mp4', '')}.docx`
        a.click()
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

