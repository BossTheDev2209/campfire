import { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import api from '@/api'
import { getSocket } from '@/hooks/useSocket'

export default function MessageInput() {
  const { channelId } = useParams()
  const [content, setContent] = useState('')
  const { activeChannel, addMessage } = useAppStore()
  const inputRef = useRef<HTMLInputElement>(null)

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !channelId) return
    const { data } = await api.post(`/channels/${channelId}/messages`, { content })
    addMessage(data)
    getSocket()?.emit('message:send', { channelId, messageId: data._id })
    setContent('')
  }

  if (!activeChannel || activeChannel.type !== 'text') return null

  return (
    <form onSubmit={send} className="px-4 pb-6 shrink-0">
      <div className="bg-dc-input rounded-lg flex items-center px-4 gap-2">
        <input ref={inputRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Message #${activeChannel.name}`}
          className="flex-1 bg-transparent py-3 text-dc-text placeholder-dc-muted outline-none text-sm" />
        <button type="submit" className="text-dc-muted hover:text-dc-text transition-colors text-sm">
          ↵
        </button>
      </div>
    </form>
  )
}
