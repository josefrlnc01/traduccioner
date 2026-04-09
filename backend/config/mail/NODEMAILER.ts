import nodemailer, { TransportOptions } from 'nodemailer'
import { getRequiredEnv } from '../../shared/utils/variables.js';

const transport = nodemailer.createTransport({
  host: getRequiredEnv('SMTP_HOST'),
  auth: {
    user: getRequiredEnv('SMTP_USER'),
    pass: getRequiredEnv('SMTP_PASS')
  }
} as TransportOptions);


export default transport