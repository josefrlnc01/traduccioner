import { tokenStore } from "@/lib/token.store";
import axios, { isAxiosError } from "axios";

const urlBackend = import.meta.env.VITE_API_URL
export async function getSaveds () {
    const accessToken = tokenStore.get()
    try {
        const {data} = await axios(`${urlBackend}/saveds`, {
            withCredentials:true,
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })

        return data
    } catch (error) {
        console.error(error)
        if (isAxiosError(error) && error.response) {
            throw new Error('Error al obtener guardados')
        }
    } 
}