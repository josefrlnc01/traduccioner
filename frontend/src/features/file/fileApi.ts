import { tokenStore } from "@/lib/token.store";
import axios, { isAxiosError } from "axios";
import type { File } from "./file.types";
const baseUrl = import.meta.env.VITE_API_URL

export async function saveFileTranscription ({ text, translated}: File) {
    const accessToken = tokenStore.get()
    console.log('saveFile')
    try {
        const {data} = await axios.post(`${baseUrl}/file/save`, {
            text,
            translated
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