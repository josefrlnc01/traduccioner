import { Request, Response } from "express"
import { IUser } from "../user/user.model.js"
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
        sameSite: 'strict' as const,
        maxAge: 90 * 24 * 60 * 60 * 1000
    }

    static createAccount = async (req: Request, res: Response) => {
        try {
            const data = registerSchema.parse(req.body)
            await AuthService.createUser(data)
            return res.status(201).send('Usuario creado correctamente, revisa tu correo para confirmar tu cuenta')
        } catch (error) {
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
            console.log('data', data)
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
            const {googleToken} = req.body
            const decodedToken = await admin.auth().verifyIdToken(googleToken)
            const email = decodedToken?.email
            const name = decodedToken.name
            console.log(decodedToken)
            if (!email || !name) return res.status(400).json({error: 'Nombre o email no encontrados'})
            const {refreshToken, accessToken, user, newUser, } = await AuthService.authJWTGoogle({email, name, decodedToken})
            if (newUser) {
                return res.status(201).send('Usuario creado correctamente, revisa tu correo para confirmar la cuenta')
            } else if (user) {
                res.cookie('refreshToken', refreshToken, AuthController.refreshCookieOptions)
                return res.status(200).send({success: 'Iniciando sesión', accessToken})
            }
            
        } catch (error) {
            console.log(error)
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({error: error.message})
            }
            return res.status(500).json({error: 'Hubo un error al autenticar la cuenta con google'})
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


    static user = async (req: Request, res: Response) => {
        const ip = (req.headers['x-forwarded-for']?.toString().split(' ')[0] ||
            req.socket.remoteAddress || 'unknown').trim()
        const quota = await Quota.findOne({
            user: req.user._id, ip
        })
        return res.status(200).json({user: req.user, usedMinutes: quota?.usedMinutes})
    }

}
