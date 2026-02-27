// Looking to send emails in production? Check out our Email API/SMTP product!
import nodemailer, { TransportOptions } from 'nodemailer'

import dotenv from 'dotenv'
dotenv.config({})

export const requiredEnv = (key: string): string => {
    const value = process.env[key]
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`)
    }
    return value
}



const transport = nodemailer.createTransport({
  host: requiredEnv('SMTP_HOST'),
  port: Number(requiredEnv('SMTP_PORT')),
  auth: {
    user: requiredEnv('SMTP_USER'),
    pass: requiredEnv('SMTP_PASS')
  }
} as TransportOptions);


export default transport