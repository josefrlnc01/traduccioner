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
import { AppError } from "../errors/AppError.js";


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

            throw new Error('Hubo un error al crear el usuario')
        }
    }


    static confirmToken = async (token: string) => {
        try {
            const tokenExists = await Token.findOne({ token })
            if (!tokenExists) {
                throw new AppError('Token no válido', 400)
            }

            //Confirmamos el usuario
            const user = await User.findById(tokenExists.user)
            if (!user) {
                throw new AppError('Usuario no encontrado', 404)
            }

            user.confirmed = true
            await Promise.all([user.save(), tokenExists.deleteOne()])
        } catch (error) {
            if (error instanceof AppError) throw error
            throw new Error('Token inválido o expirado')
        }
    }



    static authJWT = async ({ data }: AuthJwtProps) => {
        try {
            console.log('data auth jwt', data.password)
            const user = await User.findOne({ email: data.email })
            console.log('user', user)
            if (!user) {
                throw new AppError('Usuario no registrado', 404)

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
                throw new AppError('La cuenta no está confirmada, se ha enviado un nuevo token de confirmación', 400)
            }


            const isValidPassword = await checkPassword(data.password, user.password)

            if (!isValidPassword) {
                throw new AppError('Contraseña incorrecta', 400)
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
            if (error instanceof AppError) throw error
            throw new Error('Error al generar tokens de acceso y refresco')
        }
    }


    static verifyAndSendToken = async (email: string) => {
        try {
            const user = await User.findOne({ email })

            if (!user) {
                throw new AppError('Usuario no registrado', 404)
            }

            if (user.confirmed) {
                throw new AppError('Esta cuenta ya está confirmada', 400)
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
            if (error instanceof AppError) throw error
            throw new Error('Hubo un error al verificar la cuenta')
        }
    }


    static decodeAndGenerateTokens = async (refreshToken?: string) => {
        try {
            if (!refreshToken) {
                throw new AppError('Refresh token no proporcionado', 404)
            }

            const tokenInBD = await RefreshToken.findOne({ token: refreshToken })

            if (!tokenInBD) {
                throw new AppError('Token inválido o expirado', 404)
            }

            let decoded: string | jwt.JwtPayload
            try {
                decoded = jwt.verify(tokenInBD.token, refreshTokenKey)
            } catch {
                await tokenInBD.deleteOne()
                throw new AppError('Token inválido o expirado', 404)
            }

            if (typeof decoded !== 'object') {
                throw new AppError('No se pudo obtener el cuerpo del token', 404)
            }

            const user = await User.findById(decoded.id)

            if (!user) throw new AppError('Usuario no encontrado', 404)

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
            if (error instanceof AppError) throw error
            throw new Error('Hubo un error al verificar tokens')
        }
    }
}

