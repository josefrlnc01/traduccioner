import { Request, Response } from "express"
import User, { IUser } from "../models/User.js"
import { checkPassword, hashPassword } from "../utils/auth.js"
import Token from "../models/Token.js"
import { generate6DigitsToken } from "../utils/token.js"
import { AuthEmail } from "../emails/AuthEmail.js"
import jwt from 'jsonwebtoken'
import RefreshToken from "../models/RefreshToken.js"
import { getRequiredEnv } from "../utils/auth.js"
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
            const { name, email, password, password_confirmation } = req.body

            const user = new User(req.body)

            const userExists = await User.findOne({ email })

            if (userExists) {
                const error = new Error('Este usuario ya está registrado')
                return res.status(400).json({ error: error.message })
            }

            if (password !== password_confirmation) {
                const error = new Error('Las contraseñas no coinciden')
                return res.status(400).json({ error: error.message })
            }

            const token = new Token()
            token.token = generate6DigitsToken()
            token.user = user._id
            user.password = await hashPassword(password)

            AuthEmail.sendEmail({
                email: user.email,
                token: token.token,
                name: user.name
            })
            await Promise.allSettled([user.save(), token.save()])
            return res.status(200).send('Usuario creado correctamente, revisa tu correo para confirmar tu cuenta')
        } catch (error) {
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
            const {email, password} = req.body

            const user = await User.findOne({email})
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
                return res.status(401).json({error: error.message})
            }


            const accessToken = jwt.sign({
                id:user._id
            }, accessTokenKey,
                { expiresIn: '10m' })


            const refreshToken = jwt.sign({
                id:user._id 
            }, refreshTokenKey, {
                expiresIn: '90d'
            })

            const refreshTokenDB = new RefreshToken({token: refreshToken})

            refreshTokenDB.user = user._id

            try {
                const decoded = jwt.verify(accessToken, accessTokenKey)

                if (typeof decoded === 'object' && decoded.id) {
                    const user = await User.findById(decoded.id).select('name email')
                    if (user) {
                        req.user = user
                    }
                }
            } catch {
                const error = new Error('No se pudo obtener el token')
                return res.status(400).json({error: error.message})
            }

            await Promise.allSettled([user.save(), refreshTokenDB.save()])
            res.cookie('refreshToken',refreshToken, {
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
            const {email} = req.body

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
            return res.status(500).json({error: 'Hubo un error en el reenvío del token de confirmación de cuenta'})
        }
    }


    static user = (req: Request, res: Response) => {
        console.log(req.user)
        return res.status(200).json(req.user)
    }

}