import { Request, Response } from "express"
import User, { IUser } from "../models/User.js"
import { checkPassword, hashPassword } from "../utils/auth.js"
import Token from "../models/Token.js"
import { generate6DigitsToken } from "../utils/token.js"
import { AuthEmail } from "../emails/AuthEmail.js"
import jwt from 'jsonwebtoken'
import RefreshToken from "../models/RefreshToken.js"
import { getRequiredEnv } from "../utils/auth.js"
import { de } from "zod/v4/locales"
import { authJWT, confirmToken, createUser, decodeAndGenerateTokens, verifyAndSendToken } from "../modules/auth/auth.service.js"
declare global {
    namespace Express {
        interface Request {
            user: IUser
        }
    }
}






export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, password_confirmation } = req.body
            if (password !== password_confirmation) {
                throw new Error('Las contraseñas no coinciden')
            }
            const { user, token } = await createUser(req.body)
            console.log('token en create account', token)
            await AuthEmail.sendEmail({
                name: user.name,
                email: user.email,
                token: token.token
            })

            return res.status(201).send('Usuario creado correctamente, revisa tu correo para confirmar tu cuenta')
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message })
            }
            return res.status(500).json({ error: 'Hubo un error en la creación de usuario' })
        }
    }


    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body
            await confirmToken(token)
            res.send('Cuenta confirmada correctamente')
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({error: error.message})
            }
            return res.status(500).json({ error: 'Hubo un error en la confirmación de la cuenta' })
        }
    }


    static authenticateAndLogin = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body

            const {accessToken, refreshToken, user} = await authJWT(email)

            if (!user.confirmed) {
                const error = new Error('La cuenta no está confirmada, se ha enviado un nuevo token de confirmación')
                const token = new Token()
                token.token = generate6DigitsToken()
                AuthEmail.sendEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })
                await token.save()
                return res.status(400).json({ error: error.message })
            }


            const isValidPassword = await checkPassword(password, user.password)

            if (!isValidPassword) {
                const error = new Error('Contraseña incorrecta')
                return res.status(401).json({ error: error.message })
            }
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'strict'

            })
            res.send(accessToken)
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({error:error.message})
            }
            return res.status(500).json({ error: 'Hubo un error en el login del usuario' })
        }
    }


    static resetAccountConfirmationToken = async (req: Request, res: Response) => {
        try {
            const { email } = req.body
            await verifyAndSendToken(email)
            return res.status(200).send('Nuevo token enviado, revisa tu bandeja de email')
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({error: error.message})
            }
            return res.status(500).json({ error: 'Hubo un error en el reenvío del token de confirmación de cuenta' })
        }
    }


    static refreshToken = async (req: Request, res: Response) => {
        try {
            const { refreshToken } = req.cookies
            const {accessToken, newRefreshToken} = await decodeAndGenerateTokens(refreshToken)

            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                sameSite: 'strict'
            })
            
            return res.status(200).json({ access_token: accessToken })
        } catch (error) {
            console.error('Error en refreshToken:', error)
            return res.status(500).json({ error: 'Hubo un error al reenviar el token' })
        }
    }


    static user = (req: Request, res: Response) => {
        console.log(req.user)
        return res.status(200).json(req.user)
    }

}
