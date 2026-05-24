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
  const { setServers, setChannels, setActiveServerId, setActiveChannelId } = useAppStore()

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

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <ServerList />
      <ChannelList />
      <ChatArea />
      <MembersList />
    </div>
  )
}
