import express from 'express'
import { createServer } from 'http'
import { Server as SocketServer } from 'socket.io'
import mongoose from 'mongoose'
import cors from 'cors'
import 'dotenv/config'

import authRoutes from './routes/auth'
import serverRoutes from './routes/servers'
import channelRoutes from './routes/channels'
import messageRoutes from './routes/messages'
import userRoutes from './routes/users'
import inviteRoutes from './routes/invites'
import { setupSocket } from './socket/handlers'

const app = express()
const httpServer = createServer(app)
const io = new SocketServer(httpServer, {
  cors: { origin: process.env.CLIENT_URL ?? 'http://localhost:5173', credentials: true }
})

app.use(cors({ origin: process.env.CLIENT_URL ?? 'http://localhost:5173', credentials: true }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/servers', serverRoutes)
app.use('/api/servers', channelRoutes)
app.use('/api', messageRoutes)
app.use('/api/users', userRoutes)
app.use('/api/invites', inviteRoutes)

setupSocket(io)

const PORT = process.env.PORT ?? 3001
const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/campfire'

mongoose.connect(MONGODB_URI).then(() => {
  console.log('MongoDB connected')
  httpServer.listen(PORT, () => console.log(`Server running on :${PORT}`))
}).catch(console.error)
