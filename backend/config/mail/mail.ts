import transport from "./NODEMAILER.js"

interface IEmail {
    email: string
    token: string
    name: string
}
const isProd = process.env.NODE_ENV === 'production'
const frontendUrl = isProd ? process.env.FRONTEND_URL ?? process.env.FRONTEND_URL_WWW : process.env.FRONTEND_URL_DEV
export class AuthEmail {
    static sendEmail = async (user : IEmail ) => {
        await transport.sendMail({
                from: 'josefrlnc01@gmail.com',
                to : user.email,
                subject : 'AudWave-- Confirma tu cuenta',
                text : 'AudWave-- Confirma tu cuenta',
                html : `<p>Hola ${user.name}, te has registrado correctamente en AudWave, ya casi esta todo listo, solo debes confirmar tu cuenta.</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${frontendUrl}/auth/confirm-account">Confirmar cuenta</a>
                <p>Ingresa el código: <b>${user.token}</b></p>
                <p>Este token expira en 10 minutos</p>
                `
            })
    }

    static sendPasswordResetToken = async (user : IEmail ) => {
        await transport.sendMail({
                from: 'josefrlnc01@gmail.com',
                to : user.email,
                subject : 'AudWave-- Cambia tu contraseña',
                text : 'AudWave-- Confirma el numero',
                html : `<p>Hola ${user.name}, para cambiar tu contraseña primero verifica el token.</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${frontendUrl}/auth/new-password">Cambiar contraseña</a>
                <p>Ingresa el código: <b>${user.token}</b></p>
                <p>Este token expira en 10 minutos</p>
                `
            })
    }
}