import axios, { isAxiosError } from 'axios'
import { userReqSchema } from '../schemas/auth.schema'
import type { ForgotPasswordForm, NewPasswordForm, RegistrationForm, TokenConfirmation, UserLoginForm } from '../types/auth.types'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '@/firebase'
import { tokenStore } from '@/lib/token.store'
import { minutesStore } from '@/shared/stores/minutes.store'
import { suscriptionStore } from '@/shared/stores/user-suscription.store'


const baseUrl = import.meta.env.VITE_API_URL
export async function createAccount(formData: RegistrationForm) {
    try {
        const { data } = await axios.post(`${baseUrl}/auth/create-account`, formData)
        if (!data) throw new Error('Error al crear la cuenta')

        return data
    } catch (error) {

        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.errors[0].error)
        }
    }
}


export async function authenticateGoogle() {
    try {
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider)
        const credential = GoogleAuthProvider.credentialFromResult(result)

        if (!credential) {
            throw new Error('No se pudieron obtener las credenciales de Google');
        }
        const googleToken = await result.user.getIdToken()

        if (!googleToken) {
            throw new Error('No se pudo obtener el token de Google')
        }

        const { data } = await axios.post(`${baseUrl}/auth/authenticate-google`, {
            googleToken
        }, {
            withCredentials: true
        })
        
        if (!data) throw new Error('Error al autenticar con google')
        tokenStore.set(data.accessToken)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}


export async function getUser(accessToken: string) {
    
        const { data } = await axios.get(`${baseUrl}/auth/user`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        const response = userReqSchema.safeParse(data)

        if (!response.success) throw new Error('Respuesta inválida del servidor');
        suscriptionStore.set(response.data.user.suscription)
        minutesStore.set(response.data?.usedMinutes ?? 0)
        return response.data
    
}



export async function confirmAccount(token: string) {
    try {
        const { data } = await axios.post<string>(`${baseUrl}/auth/confirm-account`, { token })
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
        localStorage.setItem('isAuth', 'true')
        tokenStore.set(data)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}



export async function resendToken(email: string) {
    try {
        const { data } = await axios.post<string>(`${baseUrl}/auth/resend-confirmation-token`, { email })
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
        localStorage.setItem('isAuth', 'true')
        return response.data.access_token
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            if (error.response.status === 401 || error.response.status === 403) {
                localStorage.setItem('isAuth', 'false')
                return null
            }
            throw new Error(error.response.data.error)
        }
        localStorage.setItem('isAuth', 'false')
        return null
    }
}


export async function forgotPassword (formData: ForgotPasswordForm) {
    try {
        const {data} = await axios.post<string>(`${baseUrl}/auth/forgot-password`, {formData})

        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}


export async function validateToken (token: string) {
    try {
        const {data} = await axios.post(`${baseUrl}/auth/validate-password-token`, {token})
        return data
    } catch (error) {
        console.error(error)
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function updatePasswordWithToken ({formData, token}: {formData : NewPasswordForm, token : TokenConfirmation['token']}) {
    try {
        const {data} = await axios.post<string>(`${baseUrl}/auth/update-password/${token}`, {formData})
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function logOut() {
    try {

        await axios.post(`${baseUrl}/auth/logout`, {})
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}
