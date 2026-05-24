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
    <div className="group flex gap-3 py-1.5 px-2 rounded-notionMd hover:bg-notion-surface transition-colors">
      <div className="w-9 h-9 rounded-notionLg bg-notion-primary flex items-center justify-center text-white font-semibold shrink-0 mt-0.5 text-sm">
        {message.author?.username?.charAt(0).toUpperCase() ?? '?'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-notion-charcoal text-sm">{message.author?.username}</span>
          <span className="text-notion-stone text-xs">
            {format(new Date(message.createdAt), 'MM/dd/yyyy h:mm a')}
          </span>
          {message.edited && <span className="text-notion-stone text-xs">(edited)</span>}
        </div>
        {editing ? (
          <form onSubmit={handleEdit} className="mt-1">
            <input value={editContent} onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && setEditing(false)}
              autoFocus
              className="w-full h-9 bg-notion-canvas text-notion-ink rounded-notionMd px-3 text-sm outline-none border border-notion-hairlineStrong focus:border-notion-primary focus:ring-2 focus:ring-notion-primary/10" />
            <p className="text-xs text-notion-stone mt-1">Enter to save, Esc to cancel</p>
          </form>
        ) : (
          <p className="text-notion-ink text-sm break-words leading-relaxed">{message.content}</p>
        )}
      </div>
      {isOwn && !editing && (
        <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 flex gap-1 shrink-0">
          <button onClick={() => setEditing(true)}
            className="text-notion-slate hover:text-notion-ink text-xs px-2 py-1.5 min-h-[32px] rounded-notionSm hover:bg-notion-canvas transition-colors border border-transparent hover:border-notion-hairline">
            Edit
          </button>
          <button onClick={handleDelete}
            className="text-notion-slate hover:text-notion-error text-xs px-2 py-1.5 min-h-[32px] rounded-notionSm hover:bg-notion-canvas transition-colors border border-transparent hover:border-notion-hairline">
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
