import mongoose from "mongoose";
import { requiredEnv } from "./NODEMAILER.js";

export async function connectToDb() {
    const uri = requiredEnv('URI')
    try {
        const connection = await mongoose.connect(uri)
        const url = `${connection.connection.host}:${connection.connection.port}`
        console.log(`Database levantada en ${url}`)
    } catch (error) {
        console.error(error)
    }
}