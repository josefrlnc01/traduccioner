import express from 'express'
import dotenv from 'dotenv'
import { idRoutes } from '../routes/idRoutes.ts'

import { corsMiddleware } from '../middlewares/corsOptions.ts'

dotenv.config()
const PORT = process.env.PORT 

const app = express()
app.use(corsMiddleware())
app.use(express.json())
app.use(express.urlencoded({ extended: true })) 

app.use('/link', idRoutes)


app.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
})

