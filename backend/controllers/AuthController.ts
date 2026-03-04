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
import { createUser } from "../modules/auth/auth.service.js"
declare global {
    namespace Express {
        interface Request {
            user: IUser
        }
    }
}



const accessTokenKey = getRequiredEnv('ACCESS_JWT_KEY')
const refreshTokenKey = getRequiredEnv('REFRESH_JWT_KEY')


export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, password_confirmation } = req.body
            if (password !== password_confirmation) {
                throw new Error('Las contraseñas no coinciden')
            }
            const { user, token } = await createUser(req.body, password_confirmation)

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
            const tokenExists = await Token.findOne(token)
            if (!tokenExists) {
                const error = new Error('Token no válido')
                return res.status(401).json({ error: error.message })
            }

            //Confirmamos el usuario
            const user = await User.findById(tokenExists.user)
            if (!user) {
                throw new Error('Usuario no encontrado')
            }

            user.confirmed = true
            await Promise.allSettled([user.save(), tokenExists.deleteOne()])
            res.send('Cuenta confirmada correctamente')
        } catch (error) {
            return res.status(500).json({ error: 'Hubo un error en la confirmación de la cuenta' })
        }
    }


    static authenticateAndLogin = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body

            const user = await User.findOne({ email })
            console.log(user)
            if (!user) {
                const error = new Error('Usuario no registrado')
                return res.status(400).json({ error: error.message })
            }

            if (!user.confirmed) {
                const error = new Error('La cuenta no está confirmada, se ha enviado un nuevo token de confirmación')
                const token = new Token()
                token.token = generate6DigitsToken()
                AuthEmail.sendEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })
                return res.status(400).json({ error: error.message })
            }


            const isValidPassword = await checkPassword(password, user.password)

            if (!isValidPassword) {
                const error = new Error('Contraseña incorrecta')
                return res.status(401).json({ error: error.message })
            }


            const accessToken = jwt.sign({
                id: user._id
            }, accessTokenKey,
                { expiresIn: '10m' })


            const refreshToken = jwt.sign({
                id: user._id
            }, refreshTokenKey, {
                expiresIn: '90d'
            })

            console.log('refreshToken', refreshToken)

            const refreshTokenDB = new RefreshToken({ token: refreshToken })
            console.log(refreshTokenDB)
            refreshTokenDB.user = user._id


            await Promise.allSettled([user.save(), refreshTokenDB.save()])
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'strict'

            })

            res.send(accessToken)

        } catch (error) {
            return res.status(500).json({ error: 'Hubo un error en el login del usuario' })
        }
    }


    static resetAccountConfirmationToken = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            const user = await User.findOne(email)

            if (!user) {
                const error = new Error('Usuario no registrado')
                return res.status(400).json({ error: error.message })
            }

            if (user.confirmed) {
                const error = new Error('Esta cuenta ya está confirmada')
                return res.status(400).json({ error: error.message })
            }

            const token = new Token()
            token.token = generate6DigitsToken()
            token.user = user._id
            AuthEmail.sendEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])

            return res.status(200).send('Nuevo token enviado, revisa tu bandeja de email')
        } catch (error) {
            return res.status(500).json({ error: 'Hubo un error en el reenvío del token de confirmación de cuenta' })
        }
    }


    static refreshToken = async (req: Request, res: Response) => {
        try {
            const accessTokenKey = getRequiredEnv('ACCESS_JWT_KEY')
            const refreshTokenKey = getRequiredEnv('REFRESH_JWT_KEY')
            const { refreshToken } = req.cookies

            console.log('cookies recibidas,', refreshToken)

            const tokenInBD = await RefreshToken.findOne({ token: refreshToken })

            console.log('Token in bd', tokenInBD)

            if (!tokenInBD) {
                const error = new Error('Token inválido o expirado')
                return res.status(401).json({ error: error.message })
            }
            const decoded = jwt.verify(tokenInBD.token, refreshTokenKey)

            if (typeof decoded !== 'object') {
                const error = new Error('No se pudo obtener el cuerpo del token')
                return res.status(401).json({ error: error.message })
            }

            const user = await User.findById(decoded.id)


            if (!user) return res.status(401).json({ error: 'Usuario no encontrado' })

            const accessToken = jwt.sign({
                id: user._id
            }, accessTokenKey, {
                expiresIn: '10m'
            })

            const newRefreshToken = jwt.sign({
                id: user._id
            }, refreshTokenKey, {
                expiresIn: '90d'
            })

            await tokenInBD.deleteOne()

            const newRefreshTokenInDB = new RefreshToken()
            newRefreshTokenInDB.token = newRefreshToken

            newRefreshTokenInDB.user = user._id


            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                sameSite: 'strict'
            })
            await Promise.allSettled([user.save(), newRefreshTokenInDB.save()])
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
