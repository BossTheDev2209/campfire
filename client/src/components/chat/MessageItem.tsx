import { useState } from 'react'
import { Message } from '@/types'
import { useAuthStore } from '@/store/authStore'
import { useAppStore } from '@/store/appStore'
import api from '@/api'
import { getSocket } from '@/hooks/useSocket'
import { format } from 'date-fns'

export default function MessageItem({ message }: { message: Message }) {
  const user = useAuthStore((s) => s.user)
  const { removeMessage, updateMessage } = useAppStore()
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)
  const isOwn = user?._id === message.authorId

  const handleDelete = async () => {
    await api.delete(`/messages/${message._id}`)
    removeMessage(message._id)
    getSocket()?.emit('message:delete', { messageId: message._id, channelId: message.channelId })
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editContent.trim() || editContent === message.content) { setEditing(false); return }
    const { data } = await api.patch(`/messages/${message._id}`, { content: editContent })
    updateMessage(message._id, data.content, data.editedAt)
    getSocket()?.emit('message:edit', { messageId: message._id, content: data.content, editedAt: data.editedAt, channelId: message.channelId })
    setEditing(false)
  }

  return (
    <div className="group flex gap-3 py-1.5 px-2 rounded-claudeMd hover:bg-claude-surfaceSoft transition-colors">
      <div className="w-9 h-9 rounded-claudeLg bg-claude-surfaceDark flex items-center justify-center text-claude-onDark font-semibold shrink-0 mt-0.5 text-sm">
        {message.author?.username?.charAt(0).toUpperCase() ?? '?'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-claude-ink text-sm">{message.author?.username}</span>
          <span className="text-claude-mutedSoft text-xs">
            {format(new Date(message.createdAt), 'MM/dd/yyyy h:mm a')}
          </span>
          {message.edited && <span className="text-claude-mutedSoft text-xs">(edited)</span>}
        </div>
        {editing ? (
          <form onSubmit={handleEdit} className="mt-1">
            <input value={editContent} onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && setEditing(false)}
              autoFocus
              className="w-full h-9 bg-claude-canvas text-claude-ink rounded-claudeMd px-3 text-sm outline-none border border-claude-hairline focus:border-claude-primary focus:ring-2 focus:ring-claude-primary/15" />
            <p className="text-xs text-claude-muted mt-1">Enter to save, Esc to cancel</p>
          </form>
        ) : (
          <p className="text-claude-body text-sm break-words leading-relaxed">{message.content}</p>
        )}
      </div>
      {isOwn && !editing && (
        <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 flex gap-1 shrink-0">
          <button onClick={() => setEditing(true)}
            className="text-claude-muted hover:text-claude-ink text-xs px-2 py-1.5 min-h-[32px] rounded-claudeSm hover:bg-claude-canvas transition-colors border border-transparent hover:border-claude-hairline">
            Edit
          </button>
          <button onClick={handleDelete}
            className="text-claude-muted hover:text-claude-error text-xs px-2 py-1.5 min-h-[32px] rounded-claudeSm hover:bg-claude-canvas transition-colors border border-transparent hover:border-claude-hairline">
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
