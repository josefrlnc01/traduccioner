import { Request, Response } from "express"
import { IUser } from "../user/user.model.js"
import {  AuthService } from "./auth.service.js"
import { loginSchema, registerSchema } from "./auth.schema.js"
import { ZodError } from "zod"
import RefreshToken from "../tokens/refreshToken.model.js"


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
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message })
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
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message })
            }
            return res.status(500).json({ error: 'Hubo un error en la confirmación de la cuenta' })
        }
    }


    static authenticateAndLogin = async (req: Request, res: Response) => {
        try {
            const data = loginSchema.parse(req.body)
            console.log('data', data)
            const { accessToken, refreshToken, user } = await AuthService.authJWT({data})

            res.cookie('refreshToken', refreshToken, AuthController.refreshCookieOptions)
            res.send(accessToken)
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message })
            }
            return res.status(500).json({ error: 'Hubo un error en el login del usuario' })
        }
    }


    static resetAccountConfirmationToken = async (req: Request, res: Response) => {
        try {
            const { email } = req.body
            await AuthService.verifyAndSendToken(email)
            return res.status(200).send('Nuevo token enviado, revisa tu bandeja de email')
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message })
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
            console.error('Error en refreshToken:', error)
            if (error instanceof Error) {
                if (error.message === 'Refresh token no proporcionado' || error.message === 'Token inválido o expirado') {
                    res.clearCookie('refreshToken')
                    return res.status(401).json({ error: error.message })
                }
                return res.status(400).json({ error: error.message })
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


    static user = (req: Request, res: Response) => {
        return res.status(200).json(req.user)
    }

}
