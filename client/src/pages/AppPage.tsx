import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import ServerList from '@/components/server/ServerList'
import ChannelList from '@/components/channel/ChannelList'
import ChatArea from '@/components/chat/ChatArea'
import MembersList from '@/components/layout/MembersList'
import { useSocket, joinServer, joinChannel, leaveChannel } from '@/hooks/useSocket'
import { useAppStore } from '@/store/appStore'
import api from '@/api'

export default function AppPage() {
  useSocket()
  const { serverId, channelId } = useParams()
  const { setServers, setChannels, setActiveServerId, setActiveChannelId, activeServerId, activeChannelId } = useAppStore()
  const prevChannelId = useRef<string | null>(null)

  useEffect(() => {
    api.get('/servers').then((r) => setServers(r.data))
  }, [])

  useEffect(() => {
    if (!serverId) return
    setActiveServerId(serverId)
    api.get(`/servers/${serverId}/channels`).then((r) => setChannels(r.data))
  }, [serverId])

  useEffect(() => {
    if (!channelId) return
    setActiveChannelId(channelId)
  }, [channelId])

  useEffect(() => {
    if (!activeServerId) return
    joinServer(activeServerId)
  }, [activeServerId])

  useEffect(() => {
    if (prevChannelId.current) leaveChannel(prevChannelId.current)
    if (activeChannelId) joinChannel(activeChannelId)
    prevChannelId.current = activeChannelId
  }, [activeChannelId])

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <ServerList />
      <ChannelList />
      <ChatArea />
      <MembersList />
    </div>
  )
}
