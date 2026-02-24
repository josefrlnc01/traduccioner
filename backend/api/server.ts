import express from 'express'
import dotenv from 'dotenv'
import { mainRoute } from '../routes/mainRoute.js'
import { corsMiddleware } from '../middlewares/corsOptions.js'

dotenv.config()
const port = process.env.PORT 

const app = express()
app.use(corsMiddleware())
app.use(express.json())
app.use(express.urlencoded({ extended: true })) 

app.use('/link', mainRoute)

export default app

