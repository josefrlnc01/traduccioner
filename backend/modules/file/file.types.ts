import { IUser } from "../user/user.model.js"

export type InsertFileProps = {
    text: string,
    translatedFile: string | null,
    user: IUser
}