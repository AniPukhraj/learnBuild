import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'


const app = express()
app.use(cors(
    {
        origin: process.env.CORS_ORIGIN, 
        credentials : true
    }
))


app.use(express.json({limit: '10kb'}))
app.use(express.use(cookieParser()))
app.use(express.static('public'))
app.use(express.urlencoded({extended: true, limit : '10kb'}))




// setting routes

import userRoute from './src/routes/user.route.js'
app.use('/api/v1/users', userRoute)

export {app}