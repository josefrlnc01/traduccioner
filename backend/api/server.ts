import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import { corsMiddleware } from '../config/cors.js'
import { authRoute } from '../modules/auth/auth.routes.js'
import { connectToDb } from '../config/db.js'
import cookieParser from 'cookie-parser'
import { youtubeVideoRoute } from '../modules/youtube-video/youtube-video.routes.js'
import { fileRoute } from '../modules/file/file.routes.js'
import { documentRoute } from '../modules/document/document.routes.js'
import { savedsRoute } from '../modules/saveds/saveds.routes.js'

await connectToDb()
const isProd = process.env.NODE_ENV === 'production';
const port = process.env.PORT 

const app = express()
app.use(cookieParser())
app.use(corsMiddleware())
app.use(express.json())
app.use(express.urlencoded({ extended: true })) 


app.use('/auth', authRoute)
app.use('/yt-video', youtubeVideoRoute)
app.use('/file', fileRoute)
app.use('/document', documentRoute)
app.use('/saveds', savedsRoute)
if (!isProd) {
    app.listen(port, () => {
        console.log(`Sevidor corriendo en ${port}`)
    })
}

export default app

