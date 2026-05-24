import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAppStore } from '@/store/appStore'
import { Message } from '@/types'

interface MessageUpdatedPayload {
  messageId: string
  content: string
  editedAt: string
}

interface MessageDeletedPayload {
  messageId: string
  channelId: string
}

interface PresenceUpdatePayload {
  userId: string
  status: 'online' | 'idle' | 'dnd' | 'offline'
  serverId: string
}

interface VoiceUserPayload {
  userId: string
  channelId: string
}

let socket: Socket | null = null

export function getSocket(): Socket | null {
  return socket
}

export function joinServer(serverId: string): void {
  socket?.emit('server:join', { serverId })
}

export function joinChannel(channelId: string): void {
  socket?.emit('channel:join', channelId)
}

export function leaveChannel(channelId: string): void {
  socket?.emit('channel:leave', channelId)
}

export function useSocket() {
  const { addMessage, updateMessage, removeMessage, setUserOnline, setUserOffline, addVoiceUser, removeVoiceUser } = useAppStore()
  const initialized = useRef(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token || initialized.current) return
    initialized.current = true

    socket = io('/', { auth: { token } })

    socket.on('message:new', (msg: Message) => addMessage(msg))
    socket.on('message:updated', ({ messageId, content, editedAt }: MessageUpdatedPayload) =>
      updateMessage(messageId, content, editedAt)
    )
    socket.on('message:deleted', ({ messageId }: MessageDeletedPayload) => removeMessage(messageId))
    socket.on('presence:update', ({ userId, status }: PresenceUpdatePayload) => {
      status === 'offline' ? setUserOffline(userId) : setUserOnline(userId)
    })
    socket.on('voice:user-joined', ({ userId, channelId }: VoiceUserPayload) =>
      addVoiceUser(channelId, userId)
    )
    socket.on('voice:user-left', ({ userId, channelId }: VoiceUserPayload) =>
      removeVoiceUser(channelId, userId)
    )

    return () => {
      socket?.disconnect()
      socket = null
      initialized.current = false
    }
  }, [])

  return socket
}
