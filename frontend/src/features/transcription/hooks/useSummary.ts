import { tokenStore } from "@/lib/token.store"
import { isAxiosError } from "axios"
import { useState } from "react"
import { useParams } from "react-router"

export const useSummary = () => {
    const params = useParams()
    const id = params.id
    const [summary, setSummary] = useState('')
    const [isLoading, setIsLoading] = useState(false)
     const handleGenerateIaSummary = async () => {
        const urlBackend = import.meta.env.VITE_API_URL
        const accessToken = tokenStore.get()
        setIsLoading(true)
        setSummary('')
        try {
            const response = await fetch(`${urlBackend}/saveds/${id}/summary`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            }
            )

            const reader = response.body!.getReader()
            const decoder = new TextDecoder()

            while (true) {
                const { done, value } = await reader.read()

                if (done) break


                const chunk = decoder.decode(value)
                const lines = chunk.split('\n\n').filter(Boolean)

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.replace('data: ', '')

                        if (data === '[DONE]') return
                        const { text } = JSON.parse(data)
                        setSummary(prev => prev + text)
                    }
                }
                setIsLoading(false)
            }


            

        } catch (error) {
            if (isAxiosError(error) && error.response) {
                throw new Error(error.response.data.error)
            }
        }
    }


    return {summary, isLoading, handleGenerateIaSummary, id}
}