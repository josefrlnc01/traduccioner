import { Request, Response } from "express"
import User, { IUser } from "../models/User.js"
import { hashPassword } from "../utils/auth.js"

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


        user.password = await hashPassword(password)

        await user.save()
        return res.status(200).send('Usuario creado correctamente')
    }
}