import axios, { isAxiosError } from 'axios'
import { userSchema } from 'src/types'

type UserRegistrationForm = {
    name: string,
    email: string,
    password: string,
    confirmed: boolean
}
const baseUrl = import.meta.env.VITE_API_URL
export async function createAccount (formData: UserRegistrationForm) {
    try {
        const {data} = await axios.post(`${baseUrl}/auth/create-account`, formData)
        if (!data) throw new Error('Es necesario introducir los campos para crear la cuenta')

        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}


export async function getUser () {
    try {
        const {data} = await axios.get(`${baseUrl}/auth/user`)

        const response = userSchema.safeParse(data)
        
        if (!response.success) {
            throw new Error('Hubo un error obteniendo el usuario')
        }

        return response.data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    } 
}