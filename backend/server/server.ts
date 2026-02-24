import express from 'express'
import dotenv from 'dotenv'
import { mainRoute } from '../routes/MainRoute.ts'
import { corsMiddleware } from '../middlewares/corsOptions.ts'

dotenv.config()
const port = process.env.PORT 

const app = express()
app.use(corsMiddleware())
app.use(express.json())
app.use(express.urlencoded({ extended: true })) 

app.use('/link', mainRoute)


app.listen(port, () => {
    console.log(`listening on ${port}`)
})

