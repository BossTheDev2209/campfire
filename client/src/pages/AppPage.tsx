import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ServerList from '@/components/server/ServerList'
import ChannelList from '@/components/channel/ChannelList'
import ChatArea from '@/components/chat/ChatArea'
import MembersList from '@/components/layout/MembersList'
import { useSocket, getSocket } from '@/hooks/useSocket'
import { useAppStore } from '@/store/appStore'
import api from '@/api'

export default function AppPage() {
  useSocket()
  const { serverId, channelId } = useParams()
  const {
    setServers,
    setChannels,
    setMembers,
    setActiveServer,
    setActiveChannel,
    servers,
    channels,
  } = useAppStore()

  const [serverLoadError, setServerLoadError] = useState<string | null>(null)
  const [channelLoadError, setChannelLoadError] = useState<string | null>(null)
  const [memberLoadError, setMemberLoadError] = useState<string | null>(null)

  useEffect(() => {
    setServerLoadError(null)
    api.get('/servers')
      .then((r) => setServers(r.data))
      .catch(() => setServerLoadError('Servers could not load. Check the API server.'))
  }, [setServers])

  useEffect(() => {
    if (!serverId) {
      setActiveServer(null)
      setChannels([])
      setMembers([])
      return
    }

    const server = servers.find((s) => s._id === serverId)
    if (server) setActiveServer(server)

    setChannelLoadError(null)
    setMemberLoadError(null)

    api.get(`/servers/${serverId}/channels`)
      .then((r) => setChannels(r.data))
      .catch(() => setChannelLoadError('Channels could not load.'))

    api.get(`/servers/${serverId}/members`)
      .then((r) => setMembers(r.data))
      .catch(() => setMemberLoadError('Members could not load.'))
  }, [serverId, servers, setActiveServer, setChannels, setMembers])

  useEffect(() => {
    if (!channelId) {
      setActiveChannel(null)
      return
    }
    const channel = channels.find((c) => c._id === channelId)
    if (channel) setActiveChannel(channel)
  }, [channelId, channels, setActiveChannel])

  useEffect(() => {
    if (!serverId) return
    const socket = getSocket()
    socket?.emit('server:join', serverId)
  }, [serverId])

  useEffect(() => {
    if (!channelId) return
    const socket = getSocket()
    socket?.emit('channel:join', channelId)
    return () => {
      socket?.emit('channel:leave', channelId)
    }
  }, [channelId])

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-claude-canvas text-claude-ink font-claudeSans">
      <ServerList error={serverLoadError} />
      <ChannelList error={channelLoadError} />
      <ChatArea />
      <MembersList error={memberLoadError} />
    </div>
  )
}
