import { tokenStore } from "@/lib/token.store"
import { isAxiosError } from "axios"
import { useState } from "react"

export const useSummary = () => {
    const [summary, setSummary] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleGenerateIaSummary = async (id: string) => {
        const urlBackend = import.meta.env.VITE_API_URL
        const accessToken = tokenStore.get()

        setIsLoading(true)
        setSummary('')

        try {
            const response = await fetch(`${urlBackend}/saveds/${id}/summary`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(errorText || 'No se pudo generar el resumen')
            }

            if (!response.body) {
                throw new Error('El servidor no devolvio un stream valido')
            }

            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let buffer = ''

            while (true) {
                const { done, value } = await reader.read()

                if (done) {
                    buffer += decoder.decode()
                    break
                }

                buffer += decoder.decode(value, { stream: true })
                const events = buffer.split('\n\n')
                buffer = events.pop() ?? ''

                for (const event of events) {
                    const lines = event
                        .split('\n')
                        .map(line => line.trim())
                        .filter(line => line.startsWith('data: '))

                    for (const line of lines) {
                        const data = line.replace('data: ', '')

                        if (data === '[DONE]') {
                            return
                        }

                        if (!data) {
                            continue
                        }

                        const { text } = JSON.parse(data)
                        setSummary(prev => prev + text)
                    }
                }
            }
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                throw new Error(error.response.data.error)
            }

            if (error instanceof Error) {
                throw error
            }

            throw new Error('No se pudo generar el resumen')
        } finally {
            setIsLoading(false)
        }
    }

    return { summary, isLoading, handleGenerateIaSummary }
}
