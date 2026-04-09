import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
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
import admin from 'firebase-admin'
import { userRoutes } from '../modules/user/user.routes.js'
import { translationRoutes } from '../modules/translation/translation.routes.js'
import fs from 'node:fs'
import timeout from 'connect-timeout'
import { stripeRoutes } from '../modules/stripe/stripe.routes.js';
import { StripeController } from '../modules/stripe/stripe.controller.js';


await connectToDb()
const isProd = process.env.NODE_ENV === 'production';
const port = process.env.PORT 

const app = express()
app.use(cookieParser())
app.use(corsMiddleware())
app.post('/stripe/webhook', express.raw({ type: 'application/json' }), StripeController.createWebHook)
app.use(express.json())
app.use(express.urlencoded({ extended: true })) 
app.use(timeout('300s'))
app.use((req, res, next) => {
  if (!req.timedout) next()
})

app.use('/auth', authRoute)
app.use('/yt-video', youtubeVideoRoute)
app.use('/file', fileRoute)
app.use('/document', documentRoute)
app.use('/saveds', savedsRoute)
app.use('/translation', translationRoutes)
app.use('/stripe',stripeRoutes)
app.use('/user', userRoutes)

const getFirebaseCredential = () => {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
    if (serviceAccountJson) {
        return admin.credential.cert(JSON.parse(serviceAccountJson))
    }

    const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
    if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
        const serviceAccountFile = fs.readFileSync(serviceAccountPath, 'utf-8')
        return admin.credential.cert(JSON.parse(serviceAccountFile))
    }

    return admin.credential.applicationDefault()
}

admin.initializeApp({
    credential: getFirebaseCredential()
})


app.listen(port, () => {
    console.log(`Servidor corriendo en ${port}`);
});
export default app
