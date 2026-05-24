import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import { useUIStore } from '@/store/uiStore'
import clsx from 'clsx'

interface Props {
  error?: string | null
}

export default function ChannelList({ error }: Props) {
  const { activeServerId, servers, channels, voiceUsers, members, user } = useAppStore()
  const { channelId, serverId } = useParams()
  const navigate = useNavigate()
  const activeServer = servers.find((s) => s._id === activeServerId) ?? null
  const targetServerId = serverId ?? activeServerId

  const textChannels = channels.filter((c) => c.type === 'text')
  const voiceChannels = channels.filter((c) => c.type === 'voice')

  const connectedVoiceChannelId = useUIStore((s) => s.connectedVoiceChannelId)
  const setConnectedVoiceChannelId = useUIStore((s) => s.setConnectedVoiceChannelId)
  const isMicMuted = useUIStore((s) => s.isMicMuted)
  const isDeafened = useUIStore((s) => s.isDeafened)
  const setMicMuted = useUIStore((s) => s.setMicMuted)
  const setDeafened = useUIStore((s) => s.setDeafened)

  const connectedVoiceChannel = channels.find((c) => c._id === connectedVoiceChannelId) ?? null

  if (!activeServer) return (
    <div className="w-60 bg-claude-surfaceCard shrink-0 flex items-center justify-center border-r border-claude-hairline">
      <p className="text-claude-muted text-sm">Select a server</p>
    </div>
  )

  return (
    <div className="w-60 bg-claude-surfaceCard shrink-0 flex flex-col border-r border-claude-hairline h-full overflow-hidden">
      <div className="h-12 px-4 flex items-center border-b border-claude-hairline font-medium text-claude-ink shrink-0 min-w-0">
        <span className="truncate">{activeServer.name}</span>
      </div>
      {error && (
        <div className="mx-2 mt-2 rounded-claudeMd border border-claude-hairline bg-claude-canvas px-3 py-2 text-xs text-claude-body shrink-0">
          {error}
        </div>
      )}
      
      {/* Scrollable list of channels */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {textChannels.length > 0 && (
          <div className="mb-4">
            <p className="text-[11px] font-semibold text-claude-muted uppercase px-2 mb-1 tracking-wide">Text Channels</p>
            {textChannels.map((ch) => (
              <button
                key={ch._id}
                onClick={() => targetServerId && navigate(`/app/${targetServerId}/${ch._id}`)}
                className={clsx(
                  'w-full min-w-0 text-left px-2 py-1.5 rounded-claudeMd flex items-center gap-2 text-sm transition-colors',
                  channelId === ch._id
                    ? 'bg-claude-canvas text-claude-ink border border-claude-hairline'
                    : 'text-claude-body hover:bg-claude-canvas hover:text-claude-ink'
                )}
              >
                <span className={clsx('shrink-0', channelId === ch._id ? 'text-claude-primary' : 'text-claude-mutedSoft')}>#</span>
                <span className="truncate">{ch.name}</span>
              </button>
            ))}
          </div>
        )}
        
        {voiceChannels.length > 0 && (
          <div>
            <p className="text-[11px] font-semibold text-claude-muted uppercase px-2 mb-1 tracking-wide">Voice Channels</p>
            {voiceChannels.map((ch) => {
              const isActive = channelId === ch._id
              const isJoined = connectedVoiceChannelId === ch._id
              
              // Get other connected users for this channel
              const channelUserIds = voiceUsers[ch._id] ?? []
              
              // Add ourselves if we are connected here in UI
              const displayUserIds = new Set(channelUserIds)
              if (isJoined && user?._id) {
                displayUserIds.add(user._id)
              }

              return (
                <div key={ch._id} className="mb-1">
                  <button
                    onClick={() => {
                      if (targetServerId) {
                        navigate(`/app/${targetServerId}/${ch._id}`)
                      }
                      setConnectedVoiceChannelId(ch._id)
                    }}
                    className={clsx(
                      'w-full min-w-0 text-left px-2 py-1.5 rounded-claudeMd flex items-center gap-2 text-sm transition-colors',
                      isActive
                        ? 'bg-claude-canvas text-claude-ink border border-claude-hairline'
                        : 'text-claude-body hover:bg-claude-canvas hover:text-claude-ink'
                    )}
                  >
                    <span className={clsx('shrink-0', isActive ? 'text-claude-primary' : 'text-claude-mutedSoft')}>🔊</span>
                    <span className="truncate flex-1 font-medium">{ch.name}</span>
                    {isJoined && (
                      <span className="w-2 h-2 rounded-full bg-claude-success shrink-0" title="Connected" />
                    )}
                  </button>

                  {/* Connected users list */}
                  {displayUserIds.size > 0 && (
                    <div className="pl-6 pr-2 py-1 flex flex-col gap-1">
                      {Array.from(displayUserIds).map((uid) => {
                        let name = 'Teammate'
                        if (uid === user?._id) {
                          name = user.username
                        } else {
                          const m = members.find((m) => {
                            const u = m.userId as any
                            return u && u._id === uid
                          })
                          name = (m?.userId as any)?.username ?? 'Teammate'
                        }
                        
                        return (
                          <div key={uid} className="flex items-center gap-1.5 text-xs text-claude-muted py-0.5 px-1.5 rounded-claudeXs bg-claude-canvas/30">
                            <div className="w-4 h-4 rounded-claudeXs bg-claude-surfaceDark text-claude-onDark flex items-center justify-center text-[9px] font-bold">
                              {name.charAt(0).toUpperCase()}
                            </div>
                            <span className="truncate">{name}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Voice Status Footer */}
      {connectedVoiceChannel && (
        <div className="h-[52px] bg-claude-surfaceSoft border-t border-claude-hairline px-3 flex items-center justify-between shrink-0">
          <button
            onClick={() => targetServerId && navigate(`/app/${targetServerId}/${connectedVoiceChannelId}`)}
            className="flex items-center gap-2 min-w-0 text-left hover:opacity-80 transition-opacity flex-1"
            title="Go to call"
          >
            <div className="w-6 h-6 rounded-full bg-claude-success/15 flex items-center justify-center shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-claude-success animate-pulse" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-claude-success uppercase leading-none tracking-wide">Connected</p>
              <p className="text-xs text-claude-ink font-semibold truncate mt-0.5">
                {connectedVoiceChannel.name}
              </p>
            </div>
          </button>
          
          <div className="flex items-center gap-0.5 ml-2">
            <button
              onClick={() => setMicMuted(!isMicMuted)}
              className={clsx(
                "p-1.5 rounded-claudeSm hover:bg-claude-surfaceCreamStrong transition-colors flex items-center justify-center",
                isMicMuted ? "text-claude-error" : "text-claude-muted hover:text-claude-ink"
              )}
              title={isMicMuted ? "Unmute Mic" : "Mute Mic"}
            >
              {isMicMuted ? '🔇' : '🎙️'}
            </button>
            <button
              onClick={() => setDeafened(!isDeafened)}
              className={clsx(
                "p-1.5 rounded-claudeSm hover:bg-claude-surfaceCreamStrong transition-colors flex items-center justify-center",
                isDeafened ? "text-claude-error" : "text-claude-muted hover:text-claude-ink"
              )}
              title={isDeafened ? "Undeafen" : "Deafen"}
            >
              {isDeafened ? '🔇' : '🎧'}
            </button>
            <button
              onClick={() => setConnectedVoiceChannelId(null)}
              className="p-1.5 rounded-claudeSm text-claude-muted hover:text-claude-error hover:bg-claude-surfaceCreamStrong transition-colors flex items-center justify-center"
              title="Disconnect"
            >
              ❌
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
