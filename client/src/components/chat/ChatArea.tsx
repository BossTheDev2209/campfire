import { useAppStore } from '@/store/appStore'
import MessageList from './MessageList'
import MessageInput from './MessageInput'

export default function ChatArea() {
  const activeChannel = useAppStore((s) => s.activeChannel)

  if (!activeChannel) return (
    <div className="flex-1 min-w-0 bg-claude-canvas flex items-center justify-center">
      <div className="text-center">
        <p className="font-claudeDisplay text-3xl tracking-[-0.02em] text-claude-ink">Select a channel</p>
        <p className="text-claude-muted text-sm mt-2">Messages will appear here.</p>
      </div>
    </div>
  )

  return (
    <div className="flex-1 min-w-0 bg-claude-canvas flex flex-col overflow-hidden">
      <div className="h-12 px-4 flex items-center border-b border-claude-hairline font-medium text-claude-ink shrink-0 min-w-0">
        <span className="text-claude-primary mr-2 shrink-0">#</span>
        <span className="truncate">{activeChannel.name}</span>
      </div>
      <MessageList />
      <MessageInput />
    </div>
  )
}
