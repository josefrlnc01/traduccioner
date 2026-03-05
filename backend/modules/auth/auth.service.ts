import jwt from "jsonwebtoken";
import { AuthEmail } from "../../emails/AuthEmail.js";
import RefreshToken from "../tokens/refreshToken.model.js";
import Token from "../tokens/token.model.js";
import User from "../user/user.model.js";
import { UserRegistrationForm } from "../../shared/types/index.js";
import { getRequiredEnv, hashPassword } from "../../shared/utils/auth.js";
import { generate6DigitsToken } from "../../shared/utils/token.js";


const accessTokenKey = getRequiredEnv('ACCESS_JWT_KEY')
const refreshTokenKey = getRequiredEnv('REFRESH_JWT_KEY')

export async function createUser(u: UserRegistrationForm) {
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

    return { user, token }
}


export async function confirmToken(token: string) {
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
    await Promise.allSettled([user.save(), tokenExists.deleteOne()])
}



export async function authJWT(email: string) {

    const user = await User.findOne({ email })
    console.log(user)
    if (!user) {
        throw new Error('Usuario no registrado')

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

    return { accessToken, refreshToken, user }
}



export async function verifyAndSendToken(email: string) {
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

    await Promise.allSettled([user.save(), token.save()])
}



export async function decodeAndGenerateTokens(refreshToken: string) {
    const accessTokenKey = getRequiredEnv('ACCESS_JWT_KEY')
    const refreshTokenKey = getRequiredEnv('REFRESH_JWT_KEY')


    console.log('cookies recibidas,', refreshToken)

    const tokenInBD = await RefreshToken.findOne({ token: refreshToken })

    console.log('Token in bd', tokenInBD)

    if (!tokenInBD) {
        throw new Error('Token inválido o expirado')

    }
    const decoded = jwt.verify(tokenInBD.token, refreshTokenKey)

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

    await Promise.allSettled([user.save(), newRefreshTokenInDB.save()])


    return {accessToken, newRefreshToken}
}