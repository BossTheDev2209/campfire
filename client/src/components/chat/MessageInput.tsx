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
    <form onSubmit={send} className="px-4 pb-5 pt-3 shrink-0 border-t border-notion-hairline bg-notion-canvas">
      <div className="h-11 bg-notion-surface rounded-notionMd flex items-center px-3 gap-2 border border-notion-hairline focus-within:border-notion-primary focus-within:ring-2 focus-within:ring-notion-primary/10 transition-colors">
        <input ref={inputRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Message #${activeChannel.name}`}
          className="flex-1 bg-transparent text-notion-ink placeholder-notion-stone outline-none text-sm" />
        <button type="submit" disabled={!content.trim()}
          className="h-8 px-3 rounded-notionSm text-white bg-notion-primary hover:bg-notion-primaryPressed disabled:bg-notion-hairline disabled:text-notion-muted transition-colors text-sm font-medium">
          Send
        </button>
      </div>
    </form>
  )
}
