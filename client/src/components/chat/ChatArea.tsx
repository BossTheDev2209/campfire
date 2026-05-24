import { useAppStore } from '@/store/appStore'
import MessageList from './MessageList'
import MessageInput from './MessageInput'

export default function ChatArea() {
  const activeChannelId = useAppStore((s) => s.activeChannelId)
  const channels = useAppStore((s) => s.channels)
  const activeChannel = channels.find((c) => c._id === activeChannelId) ?? null

  if (!activeChannel) return (
    <div className="flex-1 bg-dc-bg flex items-center justify-center">
      <p className="text-dc-muted">Select a channel to start chatting</p>
    </div>
  )

  return (
    <div className="flex-1 bg-dc-bg flex flex-col overflow-hidden">
      <div className="h-12 px-4 flex items-center border-b border-black/20 font-semibold text-dc-text shrink-0">
        # {activeChannel.name}
      </div>
      <MessageList />
      <MessageInput />
    </div>
  )
}
