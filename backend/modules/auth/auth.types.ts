import { loginSchema} from "./auth.schema.js"
import z from 'zod'

export type LoginSchemaType = z.infer<typeof loginSchema>
export type AuthJwtProps = {
    data: LoginSchemaType
}