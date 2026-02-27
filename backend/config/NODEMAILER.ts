// Looking to send emails in production? Check out our Email API/SMTP product!
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config({})

const requiredEnv = (key: string): string => {
    const value = process.env[key]
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`)
    }
    return value
}

const config = () => ({
    host: requiredEnv('SMTP_HOST'),
    port: Number(requiredEnv('SMTP_PORT')),
    auth: {
        user: requiredEnv('SMTP_USER'),
        pass: requiredEnv('SMTP_PASS'),
    }
})
export const transporter = nodemailer.createTransport(config())