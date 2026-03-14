import jwt from "jsonwebtoken";
import { AuthEmail } from "../../config/mail/mail.js";
import RefreshToken from "../tokens/refreshToken.model.js";
import Token from "../tokens/token.model.js";
import User from "../user/user.model.js";
import type { UserRegistrationForm } from "../user/user.types.js";
import { checkPassword, hashPassword } from "../../shared/utils/auth.js";
import { generate6DigitsToken } from "../../shared/utils/token.js";
import { refreshTokenKey, accessTokenKey } from "../../shared/utils/variables.js";
import { AuthJwtProps } from "./auth.types.js";


export class AuthService {
    static createUser = async (u: UserRegistrationForm) => {
        try {
            const userExists = await User.findOne({ email: u.email })

            if (userExists) {
                throw new Error('Este usuario ya está registrado')
            }

            const user = new User(u)
            user.password = await hashPassword(user.password)

            const token = new Token()
            token.token = generate6DigitsToken()
            token.user = user._id

            await AuthEmail.sendEmail({
                name: user.name,
                email: user.email,
                token: token.token
            })
            await Promise.all([user.save(), token.save()])

            return { user, token }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('Este usuario ya está registrado')
            }
            throw new Error('Hubo un error al crear el usuario')
        }
    }


    static confirmToken = async (token: string) => {
        try {
            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                throw new Error('Token no válido')
            }

            //Confirmamos el usuario
            const user = await User.findById(tokenExists.user)
            if (!user) {
                throw new Error('Usuario no encontrado')
            }

            user.confirmed = true
            await Promise.all([user.save(), tokenExists.deleteOne()])
        } catch (error) {
            throw new Error('Token inválido o expirado')
        }
    }



    static authJWT = async ({data}: AuthJwtProps) => {
        try {
            const user = await User.findOne({password: data.password})
            if (!user) {
                throw new Error('Usuario no registrado')

            }

            if (!user.confirmed) {

                const token = new Token()
                token.token = generate6DigitsToken()
                AuthEmail.sendEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })
                await token.save()
                throw new Error('La cuenta no está confirmada, se ha enviado un nuevo token de confirmación')
            }


            const isValidPassword = await checkPassword(data.password, user.password)

            if (!isValidPassword) {
                throw new Error('Contraseña incorrecta')
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

            const refreshTokenDB = new RefreshToken({ token: refreshToken })
            refreshTokenDB.user = user._id


            await Promise.all([user.save(), refreshTokenDB.save()])

            return { accessToken, refreshToken, user }
        } catch (error) {
            throw new Error('Error al generar tokens de acceso y refresco')
        }
    }


    static verifyAndSendToken = async (email: string) => {
        try {
            const user = await User.findOne({ email })

            if (!user) {
                throw new Error('Usuario no registrado')
            }

            if (user.confirmed) {
                throw new Error('Esta cuenta ya está confirmada')
            }

            const token = new Token()
            token.token = generate6DigitsToken()
            token.user = user._id
            AuthEmail.sendEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.all([user.save(), token.save()])
        } catch (error) {
            throw new Error('Hubo un error al verificar la cuenta')
        }
    }


    static decodeAndGenerateTokens = async (refreshToken?: string) => {
        try {
            if (!refreshToken) {
                throw new Error('Refresh token no proporcionado')
            }

            const tokenInBD = await RefreshToken.findOne({ token: refreshToken })

            if (!tokenInBD) {
                throw new Error('Token inválido o expirado')
            }

            let decoded: string | jwt.JwtPayload
            try {
                decoded = jwt.verify(tokenInBD.token, refreshTokenKey)
            } catch {
                await tokenInBD.deleteOne()
                throw new Error('Token inválido o expirado')
            }

            if (typeof decoded !== 'object') {
                throw new Error('No se pudo obtener el cuerpo del token')
            }

            const user = await User.findById(decoded.id)

            if (!user) throw new Error('Usuario no encontrado')

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

            await Promise.all([user.save(), newRefreshTokenInDB.save()])

            return { accessToken, newRefreshToken }
        } catch (error) {
            throw new Error('Hubo un error al verificar tokens')
        }
    }
}







export async function decodeAndGenerateTokens(refreshToken?: string) {

}
