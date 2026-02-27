import { Request, Response } from "express"
import User, { IUser } from "../models/User.js"
import { hashPassword } from "../utils/auth.js"
import Token from "../models/Token.js"
import { generate6DigitsToken } from "../utils/token.js"
import { AuthEmail } from "../emails/AuthEmail.js"

declare global {
    namespace Express {
        interface Request {
            user: IUser
        }
    }
}

export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        const {name, email, password} = req.body

        const user = new User(req.body)

        const userExists = await User.findOne({email})

        if (userExists) {
            const error = new Error('Este usuario ya está registrado')
            return res.status(400).json({error: error.message})
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
        return res.status(200).send('Usuario creado correctamente')
    }


    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const {token} = req.body
            const tokenExists = await Token.findOne({token})
            if (!tokenExists) {
                const error = new Error('Token no válido')
                return res.status(401).json({error : error.message})
            }
            
            //Confirmamos el usuario
            const user = await User.findById(tokenExists.user)
            if (!user) {
            throw new Error('Usuario no encontrado')
            }

            user.confirmed = true
            await user.save()
            await Promise.allSettled([user.save(), tokenExists.deleteOne()])

            res.send('Cuenta confirmada correctamente')

        } catch(error) {
            return res.status(500).json({error: 'Hubo un error en la confirmación de la cuenta'})
        }
    }


    static user = (req: Request, res: Response) => {
        return res.status(200).json(req.user)
    }

}