import {z} from 'zod'
import { isSecureLink } from '../utils/secureLink.js'

export const videoSchema = z.object({
    videoLink: z.string().refine(isSecureLink, {message:'Link seguro'}),
    lang: z.string().min(2)
})