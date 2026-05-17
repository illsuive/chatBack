import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import ConnectToDb from './src/database/db.js'
import cookieParser from 'cookie-parser'

import authRouter from './src/mvc/routes/auth.route.js'
import messageRouter from './src/mvc/routes/message.route.js'

import { app , server } from './src/utils/socket.js'

app.use(cookieParser())

app.set('trust proxy', 1)

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.use('/auth', authRouter)
app.use('/message', messageRouter)

server.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on http://localhost:${process.env.PORT || 3000}`)
    ConnectToDb()
})