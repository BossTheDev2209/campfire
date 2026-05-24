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
    setActiveServerId,
    setActiveChannelId,
    activeServerId,
    activeChannelId,
  } = useAppStore()

  const [serverLoadError, setServerLoadError] = useState<string | null>(null)
  const [channelLoadError, setChannelLoadError] = useState<string | null>(null)
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
      return
    }

    setActiveServerId(serverId)
    setChannelLoadError(null)

    api.get(`/servers/${serverId}/channels`)
      .then((r) => setChannels(r.data))
      .catch(() => setChannelLoadError('Channels could not load.'))
  }, [serverId, setActiveServerId, setActiveChannelId, setChannels, setMembers, setMessages])

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

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-claude-canvas text-claude-ink font-claudeSans">
      <ServerList error={serverLoadError} />
      <ChannelList error={channelLoadError} />
      <ChatArea />
      <MembersList error={memberLoadError} />
    </div>
  )
}
