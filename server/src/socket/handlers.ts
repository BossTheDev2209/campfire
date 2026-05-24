import { Server, Socket } from 'socket.io'
import jwt from 'jsonwebtoken'
import User from '../models/User'

export function setupSocket(io: Server) {
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) return next(new Error('Unauthorized'))
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET ?? 'secret') as any
      socket.data.userId = payload.userId
      next()
    } catch {
      next(new Error('Unauthorized'))
    }
  })

  io.on('connection', async (socket: Socket) => {
    const userId = socket.data.userId
    await User.findByIdAndUpdate(userId, { status: 'online' })

    socket.on('channel:join', (channelId: string) => {
      socket.join(`channel_${channelId}`)
    })
    socket.on('channel:leave', (channelId: string) => {
      socket.leave(`channel_${channelId}`)
    })
    socket.on('server:join', (serverId: string) => {
      socket.join(`server_${serverId}`)
      io.to(`server_${serverId}`).emit('presence:update', { userId, status: 'online' })
    })

    socket.on('message:send', ({ channelId, message }: any) => {
      socket.to(`channel_${channelId}`).emit('message:new', message)
    })
    socket.on('message:edit', (payload: any) => {
      socket.to(`channel_${payload.channelId}`).emit('message:updated', payload)
    })
    socket.on('message:delete', (payload: any) => {
      socket.to(`channel_${payload.channelId}`).emit('message:deleted', payload)
    })

    socket.on('status:update', async ({ status }: any) => {
      await User.findByIdAndUpdate(userId, { status })
    })

    socket.on('voice:join', ({ channelId }: any) => {
      socket.join(`voice_${channelId}`)
      io.to(`voice_${channelId}`).emit('voice:user-joined', { userId, channelId })
    })
    socket.on('voice:leave', ({ channelId }: any) => {
      socket.leave(`voice_${channelId}`)
      io.to(`voice_${channelId}`).emit('voice:user-left', { userId, channelId })
    })
    socket.on('voice:signal', ({ targetUserId, signal }: any) => {
      io.to(`user_${targetUserId}`).emit('voice:signal', { fromUserId: userId, signal })
    })

    socket.join(`user_${userId}`)

    socket.on('disconnect', async () => {
      await User.findByIdAndUpdate(userId, { status: 'offline' })
      io.emit('presence:update', { userId, status: 'offline' })
    })
  })
}
