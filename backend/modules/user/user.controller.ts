import { Request, Response } from "express"
import { AppError } from "../errors/AppError.js"
import { UserService } from "./user.service.js"

export class UserController {
    static deleteUser = async (req: Request, res: Response) => {
        try {
            const user = req.user
            console.log(user)
            await UserService.delete(user)
            return res.status(200).send('Cuenta eliminada correctamente')
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({error: error.message})
            }
            return res.status(500).json({error: 'Hubo un error al eliminar la cuenta'})
        }
    }
}