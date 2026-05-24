import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ServerList from '@/components/server/ServerList'
import ChannelList from '@/components/channel/ChannelList'
import ChatArea from '@/components/chat/ChatArea'
import MembersList from '@/components/layout/MembersList'
import { useSocket } from '@/hooks/useSocket'
import { useAppStore } from '@/store/appStore'
import api from '@/api'

export default function AppPage() {
  useSocket()
  const { serverId, channelId } = useParams()
  const { setServers, setChannels, setActiveServer, setActiveChannel, servers, channels } = useAppStore()

  useEffect(() => {
    api.get('/servers').then((r) => setServers(r.data))
  }, [])

  useEffect(() => {
    if (!serverId) return
    const server = servers.find((s) => s._id === serverId)
    if (server) setActiveServer(server)
    api.get(`/servers/${serverId}/channels`).then((r) => setChannels(r.data))
  }, [serverId, servers])

  useEffect(() => {
    if (!channelId) return
    const channel = channels.find((c) => c._id === channelId)
    if (channel) setActiveChannel(channel)
  }, [channelId, channels])

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-notion-surface text-notion-ink font-notion">
      <ServerList />
      <ChannelList />
      <ChatArea />
      <MembersList />
    </div>
  )
}
