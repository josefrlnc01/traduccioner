import express from 'express'
import dotenv from 'dotenv'
import { idRoutes } from '../routes/idRoutes.ts'

dotenv.config()
const PORT = process.env.PORT 

const app = express()
app.use(express.json())

app.use('/link', idRoutes )

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
})

