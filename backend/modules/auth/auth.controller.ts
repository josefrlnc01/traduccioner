import { Request, Response } from "express"
import { IUser} from "../user/user.model.js"
import { authJWT, confirmToken, createUser, decodeAndGenerateTokens, verifyAndSendToken } from "./auth.service.js"
import { registerSchema } from "./auth.schema.js"
import { ZodError } from "zod"
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
            const data = registerSchema.parse(req.body)
            await createUser(data)
            return res.status(201).send('Usuario creado correctamente, revisa tu correo para confirmar tu cuenta')
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({errors: error.issues.map(isue => ({
                    error: isue.message
                }))})
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

            const {accessToken, refreshToken, user} = await authJWT(email, password)

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
        return res.status(200).json(req.user)
    }

}
