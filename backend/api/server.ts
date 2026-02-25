import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import { mainRoute } from '../routes/mainRoute.js'
import { corsMiddleware } from '../middlewares/corsOptions.js'

const isProd = process.env.NODE_ENV === 'production';
const port = process.env.PORT 

const app = express()
app.use(corsMiddleware())
app.use(express.json())
app.use(express.urlencoded({ extended: true })) 

app.use('/link', mainRoute)

if (!isProd) {
    app.listen(port, () => {
        console.log(`Sevidor corriendo en ${port}`)
    })
}

export default app

