import { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import api from '@/api'
import { getSocket } from '@/hooks/useSocket'

export default function MessageInput() {
  const { channelId } = useParams()
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const { activeChannelId, channels, addMessage } = useAppStore()
  const activeChannel = channels.find((c) => c._id === activeChannelId) ?? null
  const inputRef = useRef<HTMLInputElement>(null)

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !channelId) return
    setSending(true)
    setSendError(null)
    try {
      const { data } = await api.post(`/channels/${channelId}/messages`, { content })
      addMessage(data)
      getSocket()?.emit('message:send', { channelId, message: data })
      setContent('')
    } catch {
      setSendError('Message could not send.')
    } finally {
      setSending(false)
    }
  }

  if (!activeChannel || activeChannel.type !== 'text') return null

  return (
    <form onSubmit={send} className="px-4 pb-5 pt-3 shrink-0 border-t border-claude-hairline bg-claude-canvas">
      <div className="min-h-11 bg-claude-surfaceSoft rounded-claudeMd flex items-center px-3 gap-2 border border-claude-hairline focus-within:border-claude-primary focus-within:ring-2 focus-within:ring-claude-primary/15 transition-colors">
        <input
          ref={inputRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Message #${activeChannel.name}`}
          disabled={sending}
          className="flex-1 bg-transparent text-claude-ink placeholder-claude-mutedSoft outline-none text-sm disabled:opacity-60 py-2"
        />
        <button
          type="submit"
          disabled={!content.trim() || sending}
          className="h-10 px-4 rounded-claudeMd text-claude-onPrimary bg-claude-primary hover:bg-claude-primaryActive disabled:bg-claude-primaryDisabled disabled:text-claude-mutedSoft transition-colors text-sm font-medium shrink-0"
        >
          {sending ? 'Sending' : 'Send'}
        </button>
      </div>
      {sendError && <p className="mt-2 text-xs text-claude-error">{sendError}</p>}
    </form>
  )
}
