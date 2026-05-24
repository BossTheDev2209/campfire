import { useAppStore } from '@/store/appStore'
import MessageList from './MessageList'
import MessageInput from './MessageInput'

export default function ChatArea() {
  const activeChannel = useAppStore((s) => s.activeChannel)

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
