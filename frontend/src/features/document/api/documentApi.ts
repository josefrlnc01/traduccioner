import { tokenStore } from "@/lib/token.store";
import axios, { isAxiosError } from "axios";
const baseUrl = import.meta.env.VITE_API_URL
export async function generatePDF (text: string) {
    const accessToken = tokenStore.get()
    try {
        const response = await fetch(`${baseUrl}/document/create-pdf`, 
            {
                method: 'POST',
                headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${accessToken}`
                },
                body: JSON.stringify({text: text}),
            }
        )

        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
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


export async function generateSRT (segments: {start:number, end:number, text:string}[]) {
    try {
        const {data} = await axios.post(`${baseUrl}/document/create-srt`, segments, {
            responseType: 'blob'
        })
        if (!data) {
            throw new Error('Error en generación de srt')
        }
        const url = URL.createObjectURL(data)
        const a = document.createElement('a')
        a.href = url
        a.download = 'transcripción.srt'
        a.click()
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}