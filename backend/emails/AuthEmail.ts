import { transporter } from "../config/NODEMAILER.js"

interface IEmail {
    email: string
    token: string
    name: string
}

export class AuthEmail {
    static sendEmail = async (user : IEmail ) => {
        await transporter.sendMail({
                from: 'Traduccioner <admin@uptask.com>',
                to : user.email,
                subject : 'Uptask-- Confirma tu cuenta',
                text : 'Uptask-- Confirma tu cuenta',
                html : `<p>Hola ${user.name}, te has registrado correctamente, ya casi esta todo listo, solo debes confirmar tu cuenta.</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>
                <p>Ingresa el código: <b>${user.token}</b></p>
                <p>Este token expira en 10 minutos</p>
                `
            })
    }
}