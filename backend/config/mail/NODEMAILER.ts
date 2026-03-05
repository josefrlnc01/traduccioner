// Looking to send emails in production? Check out our Email API/SMTP product!
import nodemailer, { TransportOptions } from 'nodemailer'
import { getRequiredEnv } from '../../shared/utils/variables.js';
import dotenv from 'dotenv'
dotenv.config({})



const transport = nodemailer.createTransport({
  host: getRequiredEnv('SMTP_HOST'),
  port: Number(getRequiredEnv('SMTP_PORT')),
  auth: {
    user: getRequiredEnv('SMTP_USER'),
    pass: getRequiredEnv('SMTP_PASS')
  }
} as TransportOptions);


export default transport