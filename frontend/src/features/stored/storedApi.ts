import axios, { isAxiosError } from "axios";
import type { Stored } from "./stored.types";
import { tokenStore } from "@/lib/token.store";
const baseUrl = import.meta.env.VITE_API_URL
export async function saveVideo ({videoId, title, text}: Stored) {
    const accessToken = tokenStore.get()
    try {
        const {data} = await axios.post(`${baseUrl}/storeds/save`, {
            videoId,
            title,
            text
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