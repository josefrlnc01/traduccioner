import axios, { isAxiosError } from 'axios'
import { userReqSchema, type RegistrationForm, type UserLoginForm } from '@/types'

const baseUrl = import.meta.env.VITE_API_URL
export async function createAccount(formData: RegistrationForm) {
    try {
        const { data } = await axios.post(`${baseUrl}/auth/create-account`, formData)
        if (!data) throw new Error('Es necesario introducir los campos para crear la cuenta')

        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}


export async function getUser(accessToken: string) {
    try {
        const { data } = await axios.get(`${baseUrl}/auth/user`, {
            headers: {
                'Authorization' : `Bearer ${accessToken}`
            }
        })
        const response = userReqSchema.safeParse(data)

        if (!response.success) throw new Error('Respuesta inválida del servidor');
        
        return response.data
        

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}



export async function confirmAccount(formData: string) {
    try {
        const { data } = await axios.post<string>(`${baseUrl}/auth/confirm-account`, formData)
        console.log(data)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}



export async function authenticateAccount(formData: UserLoginForm) {
    try {
        const { data } = await axios.post(`${baseUrl}/auth/authenticate-account`, formData, {
            withCredentials: true
        })
        console.log(data)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}



export async function resendToken(formData: string) {
    try {
        const { data } = await axios.post(`${baseUrl}/auth/resend-confirmation-token`, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}


export async function getRefreshToken() {
    try {
        const response = await axios.post(`${baseUrl}/auth/refresh-token`, {}, {
            withCredentials: true
        })
        if (response.status === 401) return null
        return response.data.access_token
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}
