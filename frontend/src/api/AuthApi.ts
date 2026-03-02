import axios, { isAxiosError } from 'axios'
import { userReqSchema, type RegistrationForm, type UserLoginForm } from '@/types'
import { getAccessToken } from '@/stores/auth'


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


export async function getUser() {
    try {
        const accessToken = getAccessToken()
        const { data } = await axios.get(`${baseUrl}/auth/user`, {
            headers: {
                'Authorization' : `Bearer ${accessToken}`
            }
        })
        const response = userReqSchema.safeParse(data)

        if (response.success) {
            return response.data
        }

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
        const { data } = await axios.post(`${baseUrl}/auth/authenticate-account`, formData)
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