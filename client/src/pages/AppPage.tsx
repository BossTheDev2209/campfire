import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import ServerList from '@/components/server/ServerList'
import ChannelList from '@/components/channel/ChannelList'
import ChatArea from '@/components/chat/ChatArea'
import MembersList from '@/components/layout/MembersList'
import { joinChannel, joinServer, leaveChannel, useSocket } from '@/hooks/useSocket'
import { useMembers } from '@/hooks/useMembers'
import { useAppStore } from '@/store/appStore'
import api from '@/api'

export default function AppPage() {
  useSocket()
  const { serverId, channelId } = useParams()
  const prevChannelId = useRef<string | null>(null)
  const {
    setServers,
    setChannels,
    setMembers,
    setMessages,
    setVoiceUsersFromStates,
    clearVoiceUsers,
    setActiveServerId,
    setActiveChannelId,
    activeServerId,
    activeChannelId,
    isSidebarOpen,
    setSidebarOpen,
  } = useAppStore()

  const [serverLoadError, setServerLoadError] = useState<string | null>(null)
  const [channelLoadError, setChannelLoadError] = useState<string | null>(null)
  const [voiceStateLoadError, setVoiceStateLoadError] = useState<string | null>(null)
  const { error: memberLoadError } = useMembers(serverId ?? null)

  useEffect(() => {
    setServerLoadError(null)
    api.get('/servers')
      .then((r) => setServers(r.data))
      .catch(() => setServerLoadError('Servers could not load. Check the API server.'))
  }, [setServers])

  useEffect(() => {
    if (!serverId) {
      setActiveServerId(null)
      setActiveChannelId(null)
      setChannels([])
      setMembers([])
      setMessages([])
      clearVoiceUsers()
      return
    }

    setActiveServerId(serverId)
    setChannelLoadError(null)
    setVoiceStateLoadError(null)

    api.get(`/servers/${serverId}/channels`)
      .then((r) => setChannels(r.data))
      .catch(() => setChannelLoadError('Channels could not load.'))

    api.get(`/servers/${serverId}/voice-states`)
      .then((r) => setVoiceUsersFromStates(r.data))
      .catch(() => {
        clearVoiceUsers()
        setVoiceStateLoadError('Voice participants could not load.')
      })
  }, [
    serverId,
    setActiveServerId,
    setActiveChannelId,
    setChannels,
    setMembers,
    setMessages,
    setVoiceUsersFromStates,
    clearVoiceUsers,
  ])

  useEffect(() => {
    setActiveChannelId(channelId ?? null)
    if (!channelId) setMessages([])
  }, [channelId, setActiveChannelId, setMessages])

  useEffect(() => {
    if (!activeServerId) return
    joinServer(activeServerId)
  }, [activeServerId])

  useEffect(() => {
    if (prevChannelId.current) leaveChannel(prevChannelId.current)
    if (activeChannelId) joinChannel(activeChannelId)
    prevChannelId.current = activeChannelId

    return () => {
      if (activeChannelId) leaveChannel(activeChannelId)
    }
  }, [activeChannelId])

  // Automatically close mobile sidebar on navigation
  useEffect(() => {
    setSidebarOpen(false)
  }, [serverId, channelId, setSidebarOpen])

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-claude-canvas text-claude-ink font-claudeSans relative">
      {/* Desktop sidebars */}
      <div className="hidden md:flex shrink-0">
        <ServerList error={serverLoadError} />
        <ChannelList error={channelLoadError ?? voiceStateLoadError} />
      </div>

      {/* Mobile sidebar overlay drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer content container */}
          <div className="relative flex h-full max-w-[312px] shadow-2xl z-10 animate-[slideIn_0.2s_ease-out]">
            <ServerList error={serverLoadError} />
            <ChannelList error={channelLoadError ?? voiceStateLoadError} />
          </div>
        </div>
      )}

      <ChatArea />
      <MembersList error={memberLoadError} />
    </div>
  )
}
