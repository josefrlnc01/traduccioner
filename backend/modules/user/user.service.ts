import { AppError } from "../errors/AppError.js"
import User, { IUser } from "./user.model.js"

export class UserService {
    static delete = async (user: IUser) => {
        try {
            const userExists = await User.findOne({
                email: user.email
            })

            if (!userExists) {
                throw new AppError('Credenciales incorrectas', 404)
            }   

            await userExists.deleteOne()
        } catch (error) {
            if (error instanceof AppError) throw error
            throw new Error('Hubo un error al eliminar el usuario')
        }
    }
}