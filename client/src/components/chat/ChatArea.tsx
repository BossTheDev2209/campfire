import { useAppStore } from '@/store/appStore'
import MessageList from './MessageList'
import MessageInput from './MessageInput'

export default function ChatArea() {
  const activeChannel = useAppStore((s) => s.activeChannel)

  if (!activeChannel) return (
    <div className="flex-1 min-w-0 bg-notion-canvas flex items-center justify-center">
      <div className="text-center">
        <p className="text-notion-charcoal font-medium">Select a channel</p>
        <p className="text-notion-stone text-sm mt-1">Messages will appear here.</p>
      </div>
    </div>
  )

  return (
    <div className="flex-1 min-w-0 bg-notion-canvas flex flex-col overflow-hidden">
      <div className="h-12 px-4 flex items-center border-b border-notion-hairline font-semibold text-notion-charcoal shrink-0 min-w-0">
        <span className="text-notion-stone mr-2 shrink-0">#</span>
        <span className="truncate">{activeChannel.name}</span>
      </div>
      <MessageList />
      <MessageInput />
    </div>
  )
}
