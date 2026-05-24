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
    <div className="group flex gap-3 py-1 px-2 rounded hover:bg-white/5 transition-colors">
      <div className="w-10 h-10 rounded-full bg-dc-accent flex items-center justify-center text-white font-bold shrink-0 mt-0.5">
        {message.author?.username?.charAt(0).toUpperCase() ?? '?'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-dc-text text-sm">{message.author?.username}</span>
          <span className="text-dc-muted text-xs">
            {format(new Date(message.createdAt), 'MM/dd/yyyy h:mm a')}
          </span>
          {message.edited && <span className="text-dc-muted text-xs">(edited)</span>}
        </div>
        {editing ? (
          <form onSubmit={handleEdit} className="mt-1">
            <input value={editContent} onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && setEditing(false)}
              autoFocus
              className="w-full bg-dc-input text-dc-text rounded px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-dc-accent" />
            <p className="text-xs text-dc-muted mt-1">Enter to save · Esc to cancel</p>
          </form>
        ) : (
          <p className="text-dc-text text-sm break-words">{message.content}</p>
        )}
      </div>
      {isOwn && !editing && (
        <div className="opacity-0 group-hover:opacity-100 flex gap-1 shrink-0">
          <button onClick={() => setEditing(true)}
            className="text-dc-muted hover:text-dc-text text-xs px-2 py-1 rounded hover:bg-dc-hover transition-colors">
            Edit
          </button>
          <button onClick={handleDelete}
            className="text-dc-muted hover:text-dc-red text-xs px-2 py-1 rounded hover:bg-dc-hover transition-colors">
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
