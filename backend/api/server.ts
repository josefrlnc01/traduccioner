import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import { mainRoute } from '../routes/mainRoute.js'
import { corsMiddleware } from '../shared/middlewares/cors.middleware.js'
import { authRoute } from '../modules/auth/auth.routes.js'
import { connectToDb } from '../config/db.js'
import cookieParser from 'cookie-parser'

await connectToDb()
const isProd = process.env.NODE_ENV === 'production';
const port = process.env.PORT 

const app = express()
app.use(cookieParser())
app.use(corsMiddleware())
app.use(express.json())
app.use(express.urlencoded({ extended: true })) 

app.use('/link', mainRoute)
app.use('/auth', authRoute)

if (!isProd) {
    app.listen(port, () => {
        console.log(`Sevidor corriendo en ${port}`)
    })
}

export default app

