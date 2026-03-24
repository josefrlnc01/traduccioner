import mongoose from "mongoose";
import { getRequiredEnv } from "../shared/utils/variables.js";

export async function connectToDb() {
    const uri = getRequiredEnv('URI')
    try {
        const connection = await mongoose.connect(uri)
        const url = `${connection.connection.host}:${connection.connection.port}`
    } catch (error) {
        console.error(error)
    }
}