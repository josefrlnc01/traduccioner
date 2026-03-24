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


export async function getSaved (id: string) {
    const accessToken = tokenStore.get()
    try {
        const {data} = await axios(`${urlBackend}/saveds/${id}`, {
            withCredentials: true,
            headers: {
                "Authorization" : `Bearer ${accessToken}`
            }
        })

        return data
    } catch (error) {
        console.error(error)
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}



export async function deleteSaved (id: string) {
    const accessToken = tokenStore.get()
    try {
        const {data} = await axios.delete(`${urlBackend}/saveds/${id}`, {
            withCredentials: true,
            headers: {
                "Authorization" : `Bearer ${accessToken}`
            }
        })

        return data
    } catch (error) {
        console.error(error)
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

type EditTitleProps = {
    
        id: string,
    title: string
    
}

export async function editTitle ({id, title}: EditTitleProps) {
    const accessToken = tokenStore.get()
    try {
        
        const {data} = await axios.patch(`${urlBackend}/saveds/${id}`, {title}, {
            withCredentials: true,
            headers: {
                "Authorization" : `Bearer ${accessToken}`
            }
        })

        return data
    } catch (error) {
        console.error(error)
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}


export async function generateIaSummary (id: string) {
    const accessToken = tokenStore.get()
    try {
        const {data} = await axios.post(`${urlBackend}/saveds/${id}/summary`, {}, {
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