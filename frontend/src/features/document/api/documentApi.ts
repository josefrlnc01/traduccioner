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


export async function generatePDF({ segments, title }: DocumentProps) {
    const accessToken = tokenStore.get()
    try {
        const { data } = await axios.post(`${baseUrl}/document/create-pdf`, { segments }, {
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
        a.download = `${title.replace('.mp4', '')}.pdf`
        a.click()
        URL.revokeObjectURL(url)
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            if (error.response.data instanceof Blob) {
                const text = await error.response.data.text()
                try {
                    const parsed = JSON.parse(text)
                    throw new Error(parsed.error || 'Hubo un error al generar el pdf')
                } catch {
                    throw new Error(text || 'Hubo un error al generar el pdf')
                }
            }
            throw new Error(error.response.data.error)
        }
    }
}


export async function generateSRT({ segments, title }: DocumentProps) {
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

export async function generateVTT({ segments, title }: DocumentProps) {
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
            throw new Error(error.response.data.error)
        }
    }
}


export async function generateTXT({ segments, title }: DocumentProps) {
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
        a.download = `${title.replace('.mp4', '')}.txt`
        a.click()
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}



export async function generateDOCX({ segments, title }: DocumentProps) {
    const accessToken = tokenStore.get()
    try {
        const { data } = await axios.post(`${baseUrl}/document/create-docx`, { segments }, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
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



export async function generateJSON({ segments, title }: DocumentProps) {
    const accessToken = tokenStore.get()
    try {
        const { data } = await axios.post(`${baseUrl}/document/create-json`, { segments }, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
            withCredentials: true,
            responseType: 'blob'
        })

        const url = URL.createObjectURL(data)
        const a = document.createElement('a')
        a.href = url
        a.download = `${title.replace('.mp4', '')}.json`
        a.click()
    } catch (error) {
        console.error(error)
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}


export async function generateCSV({ segments, title }: DocumentProps) {
    const accessToken = tokenStore.get()
    try {
        const { data } = await axios.post(`${baseUrl}/document/create-csv`, { segments }, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
            withCredentials: true,
            responseType: 'blob'
        })

        const url = URL.createObjectURL(data)
        const a = document.createElement('a')
        a.href = url
        a.download = `${title.replace('.mp4', '')}.csv`
        a.click()
    } catch (error) {
        console.error(error)
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

