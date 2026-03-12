import { IUser } from "../user/user.model.js"

export type InsertFileProps = {
    fileText: string,
    translatedFile: string | null,
    user: IUser
}