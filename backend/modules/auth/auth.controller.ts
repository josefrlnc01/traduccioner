import { Request, Response } from "express"
import User, { IUser } from "../user/user.model.js"
import { AuthService } from "./auth.service.js"
import { loginSchema, registerSchema } from "./auth.schema.js"
import { ZodError } from "zod"
import RefreshToken from "../tokens/refreshToken.model.js"
import { AppError } from "../errors/AppError.js"
import admin from 'firebase-admin'
import Quota from "../quota/quota.schema.js"

declare global {
    namespace Express {
        interface Request {
            user: IUser
        }
    }
}


export class AuthController {
    private static refreshCookieOptions = {
        httpOnly: true as const,
        sameSite: 'lax' as const,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 90 * 24 * 60 * 60 * 1000
    }

    static createAccount = async (req: Request, res: Response) => {
        try {
            const data = registerSchema.parse(req.body)
            await AuthService.createUser(data)
            return res.status(201).send('Usuario creado correctamente, revisa tu correo para confirmar tu cuenta')
        } catch (error) {
            console.error(error)
            if (error instanceof ZodError) {
                return res.status(400).json({
                    errors: error.issues.map(isue => ({
                        error: isue.message
                    }))
                })
            }
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            return res.status(500).json({ error: 'Hubo un error en la creación de usuario' })
        }
    }


    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body
            await AuthService.confirmToken(token)
            res.send('Cuenta confirmada correctamente')
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            return res.status(500).json({ error: 'Hubo un error en la confirmación de la cuenta' })
        }
    }


    static authenticateAndLogin = async (req: Request, res: Response) => {
        try {
            const data = loginSchema.parse(req.body)
            const { accessToken, refreshToken, user } = await AuthService.authJWT({ data })
            res.cookie('refreshToken', refreshToken, AuthController.refreshCookieOptions)
            res.send(accessToken)
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            return res.status(500).json({ error: 'Hubo un error en el login del usuario' })
        }
    }


    static authenticateGoogle = async (req: Request, res: Response) => {
        try {
            const { googleToken } = req.body
            if (!googleToken) {
                return res.status(400).json({ error: 'Google token no proporcionado' })
            }
            const decodedToken = await admin.auth().verifyIdToken(googleToken)
            const email = decodedToken?.email
            const name = decodedToken.name ?? decodedToken.email?.split('@')[0]
            if (!email || !name) return res.status(400).json({ error: 'Nombre o email no encontrados' })
            const { refreshToken, accessToken, user, newUser } = await AuthService.authJWTGoogle({ email, name, decodedToken })
            if (newUser) {
                return res.status(201).send('Usuario creado correctamente, revisa tu correo para confirmar la cuenta')
            } else if (user) {
                res.cookie('refreshToken', refreshToken, AuthController.refreshCookieOptions)
                return res.status(200).send({ success: 'Iniciando sesión', accessToken })
            }

        } catch (error) {
            console.error('Google auth error:', error)
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            if (error instanceof Error) {
                return res.status(500).json({ error: error.message })
            }
            return res.status(500).json({ error: 'Hubo un error al autenticar la cuenta con google' })
        }
    }


    static resetAccountConfirmationToken = async (req: Request, res: Response) => {
        try {
            const { email } = req.body
            await AuthService.verifyAndSendToken(email)
            return res.status(200).send('Nuevo token enviado, revisa tu bandeja de email')
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            return res.status(500).json({ error: 'Hubo un error en el reenvío del token de confirmación de cuenta' })
        }
    }


    static refreshToken = async (req: Request, res: Response) => {
        try {
            const { refreshToken } = req.cookies
            const { accessToken, newRefreshToken } = await AuthService.decodeAndGenerateTokens(refreshToken)

            res.cookie('refreshToken', newRefreshToken, AuthController.refreshCookieOptions)

            return res.status(200).json({ access_token: accessToken })
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            return res.status(500).json({ error: 'Hubo un error al reenviar el token' })
        }
    }


    static logOut = async (req: Request, res: Response) => {
        const { refreshToken } = req.cookies
        const refreshTokenDB = await RefreshToken.findOne({ token: refreshToken })
        await refreshTokenDB?.deleteOne()
        res.clearCookie('refreshToken')
        res.sendStatus(204)
    }


    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const email = req.body.formData.email
            await AuthService.generateTokenForPassword(email)

            return res.send('Revisa tu email para ver las instrucciones')
        } catch (error) {
            console.error(error)
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            return res.status(500).json({ error: 'Hubo un error en la solicitud de nueva contraseña' })
        }
    }


    static validatePasswordToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body
            AuthService.isValidTokenForNewPassword(token)

            return res.send('Token válido, puedes cambiar tu contraseña')
        } catch (error:any) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            return res.status(500).json({ error: 'Hubo un error en la solicitud de nueva contraseña' })
        }
    }


    static updatePassword = async (req: Request, res: Response) => {
        try {
            const {token} = req.params as {token: string}
            const { password, password_confirmation } = req.body.formData
            await AuthService.generateNewPassword(password, password_confirmation, token)

            return res.send('Contraseña cambiada correctamente')
        } catch (error) {
            console.error(error)
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ error: error.message })
            }
            return res.status(500).json({ error: 'Hubo un error en la creación de nueva contraseña' })
        }
    }


    static user = async (req: Request, res: Response) => {
        const ip = (req.headers['x-forwarded-for']?.toString().split(' ')[0] ||
            req.socket.remoteAddress || 'unknown').trim()
        const quota = await Quota.findOne({
            user: req.user._id, ip
        })
        return res.status(200).json({ user: req.user, usedMinutes: quota?.usedMinutes })
    }

}
