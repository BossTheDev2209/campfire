import { useState } from 'react'
import { useAppStore } from '@/store/appStore'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import SearchBar from './SearchBar'
import VoiceArea from '../channel/VoiceArea'

export default function ChatArea() {
  const activeChannelId = useAppStore((s) => s.activeChannelId)
  const channels = useAppStore((s) => s.channels)
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen)
  const activeChannel = channels.find((c) => c._id === activeChannelId) ?? null
  const [isSearchActive, setIsSearchActive] = useState(false)

  if (!activeChannel) return (
    <div className="flex-1 min-w-0 bg-claude-canvas flex items-center justify-center relative">
      {/* Mobile top-left menu trigger */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden absolute top-3 left-3 p-1.5 rounded-claudeSm text-claude-muted hover:text-claude-ink hover:bg-claude-surfaceSoft transition-colors"
        title="Open sidebar"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="text-center">
        <p className="font-claudeDisplay text-3xl tracking-[-0.02em] text-claude-ink">Select a channel</p>
        <p className="text-claude-muted text-sm mt-2">Messages will appear here.</p>
      </div>
    </div>
  )

  if (activeChannel.type === 'voice') {
    return <VoiceArea channel={activeChannel} />
  }

  if (isSearchActive) {
    return (
      <SearchBar
        channelId={activeChannel._id}
        channelName={activeChannel.name}
        onClose={() => setIsSearchActive(false)}
      />
    )
  }

  return (
    <div className="flex-1 min-w-0 bg-claude-canvas flex flex-col overflow-hidden">
      <div className="h-12 px-4 flex items-center justify-between border-b border-claude-hairline font-medium text-claude-ink shrink-0 min-w-0">
        <div className="flex items-center min-w-0 gap-2">
          {/* Hamburger button for mobile */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-1.5 rounded-claudeSm text-claude-muted hover:text-claude-ink hover:bg-claude-surfaceSoft transition-colors flex shrink-0 -ml-1"
            title="Open sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <span className="text-claude-primary mr-1 shrink-0">#</span>
          <span className="truncate">{activeChannel.name}</span>
        </div>
        <button
          onClick={() => setIsSearchActive(true)}
          className="p-1.5 rounded-claudeSm text-claude-muted hover:text-claude-ink hover:bg-claude-surfaceSoft transition-colors flex shrink-0"
          title="Search"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
      <MessageList />
      <MessageInput />
    </div>
  )
}
