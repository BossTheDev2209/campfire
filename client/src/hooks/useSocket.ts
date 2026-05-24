import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '@/store/authStore'
import { useAppStore } from '@/store/appStore'
import { Message } from '@/types'

let socket: Socket | null = null

export function getSocket() { return socket }

export function useSocket() {
  const token = useAuthStore((s) => s.token)
  const { addMessage, updateMessage, removeMessage, setUserOnline, setUserOffline, addVoiceUser, removeVoiceUser } = useAppStore()
  const initialized = useRef(false)

  useEffect(() => {
    if (!token || initialized.current) return
    initialized.current = true

    socket = io('/', { auth: { token } })

    socket.on('message:new', (msg: Message) => addMessage(msg))
    socket.on('message:updated', ({ messageId, content, editedAt }: any) =>
      updateMessage(messageId, content, editedAt)
    )
    socket.on('message:deleted', ({ messageId }: any) => removeMessage(messageId))
    socket.on('presence:update', ({ userId, status }: any) => {
      status === 'offline' ? setUserOffline(userId) : setUserOnline(userId)
    })
    socket.on('voice:user-joined', ({ userId, channelId }: any) =>
      addVoiceUser(channelId, userId)
    )
    socket.on('voice:user-left', ({ userId, channelId }: any) =>
      removeVoiceUser(channelId, userId)
    )

    return () => {
      socket?.disconnect()
      socket = null
      initialized.current = false
    }
  }, [token])

  return socket
}
