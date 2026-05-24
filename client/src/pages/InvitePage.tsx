import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '@/api'
import { useAppStore } from '@/store/appStore'
import { Server } from '@/types'

interface InviteInfo {
  serverName: string
  serverIcon: string | null
  memberCount: number
  inviteCode: string
}

export default function InvitePage() {
  const { code } = useParams()
  const navigate = useNavigate()
  const setServers = useAppStore((s) => s.setServers)
  const servers = useAppStore((s) => s.servers)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null)
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    if (!code) return
    api.get(`/invites/${code}`)
      .then((res) => {
        setInviteInfo(res.data)
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Invalid invite code')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [code])

  const handleJoin = async () => {
    if (!code) return
    setJoining(true)
    try {
      const res = await api.post(`/invites/${code}/join`)
      const serverId = res.data.serverId
      
      // We don't have the full server object in the response to append it immediately 
      // with all details, but we can trigger a refetch of servers or just navigate, 
      // and AppPage will fetch servers if needed, or we just fetch servers here before redirecting.
      // Wait, let's just fetch all servers again to make sure our store is updated
      const serversRes = await api.get<Server[]>('/servers')
      setServers(serversRes.data)

      navigate(`/app/${serverId}`)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to join server')
      setJoining(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-claude-canvas flex items-center justify-center px-4 font-claudeSans">
        <div className="w-full max-w-sm rounded-claudeLg bg-claude-surfaceCard border border-claude-hairline p-8 flex justify-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-claudeLg bg-claude-surfaceSoft"></div>
            <div className="w-32 h-6 bg-claude-surfaceSoft rounded"></div>
            <div className="w-20 h-4 bg-claude-surfaceSoft rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !inviteInfo) {
    return (
      <div className="min-h-screen bg-claude-canvas flex items-center justify-center px-4 font-claudeSans">
        <div className="w-full max-w-sm rounded-claudeLg bg-claude-surfaceCard border border-claude-hairline p-8 text-center">
          <div className="bg-claude-surfaceSoft border border-claude-hairline rounded-claudeMd p-4 mb-6">
            <p className="text-claude-error text-sm">{error || 'Invite not found'}</p>
          </div>
          <Link to="/app" className="text-claude-muted hover:text-claude-ink text-sm transition-colors border border-transparent hover:border-claude-hairline px-3 py-1.5 rounded-claudeSm hover:bg-claude-canvas">
            Go back to app
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-claude-canvas flex items-center justify-center px-4 font-claudeSans">
      <div className="w-full max-w-sm rounded-claudeLg bg-claude-surfaceCard border border-claude-hairline p-8 text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-claudeLg bg-claude-surfaceDark flex items-center justify-center text-claude-onDark text-2xl font-semibold mb-6 shrink-0">
          {inviteInfo.serverIcon ? (
             <img src={inviteInfo.serverIcon} alt={inviteInfo.serverName} className="w-full h-full rounded-[inherit] object-cover" />
          ) : (
             inviteInfo.serverName.charAt(0).toUpperCase()
          )}
        </div>
        <h2 className="font-claudeDisplay text-3xl tracking-[-0.02em] text-claude-ink mb-2">You've been invited</h2>
        <p className="text-claude-muted text-sm mb-1">
          Join <strong className="text-claude-ink font-medium">{inviteInfo.serverName}</strong>
        </p>
        <p className="text-claude-mutedSoft text-xs mb-8">
          {inviteInfo.memberCount} member{inviteInfo.memberCount !== 1 ? 's' : ''}
        </p>
        
        <button 
          onClick={handleJoin}
          disabled={joining}
          className="h-10 w-full rounded-claudeMd bg-claude-primary text-claude-onPrimary font-medium text-sm transition-colors hover:bg-claude-primaryActive focus:outline-none focus:ring-2 focus:ring-claude-primary/20 focus:ring-offset-1 focus:ring-offset-claude-surfaceCard disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {joining ? 'Joining...' : 'Accept Invite'}
        </button>
      </div>
    </div>
  )
}
