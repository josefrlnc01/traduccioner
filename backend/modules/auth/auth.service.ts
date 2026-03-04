import { AuthEmail } from "../../emails/AuthEmail.js";
import Token from "../../models/Token.js";
import User from "../../models/User.js";
import { UserRegistrationForm } from "../../types/index.js";
import { hashPassword } from "../../utils/auth.js";
import { generate6DigitsToken } from "../../utils/token.js";

export async function createUser(u: UserRegistrationForm, password_confirmation: string) {
    const userExists = await User.findOne({ email: u.email })

    if (userExists) {
        throw new Error('Este usuario ya está registrado')
    }

    const user = new User(u)
    user.password = await hashPassword(user.password)

    const token = new Token()
    token.token = generate6DigitsToken()
    token.user = user._id
    
    await Promise.allSettled([user.save(), token.save()])

    return {user, token}
}