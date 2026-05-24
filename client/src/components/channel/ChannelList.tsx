import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import clsx from 'clsx'

interface Props {
  error?: string | null
}

export default function ChannelList({ error }: Props) {
  const { activeServerId, servers, channels } = useAppStore()
  const { channelId, serverId } = useParams()
  const navigate = useNavigate()
  const activeServer = servers.find((s) => s._id === activeServerId) ?? null
  const targetServerId = serverId ?? activeServerId

  const textChannels = channels.filter((c) => c.type === 'text')
  const voiceChannels = channels.filter((c) => c.type === 'voice')

  if (!activeServer) return (
    <div className="w-60 bg-claude-surfaceCard shrink-0 flex items-center justify-center border-r border-claude-hairline">
      <p className="text-claude-muted text-sm">Select a server</p>
    </div>
  )

  return (
    <div className="w-60 bg-claude-surfaceCard shrink-0 flex flex-col overflow-y-auto border-r border-claude-hairline">
      <div className="h-12 px-4 flex items-center border-b border-claude-hairline font-medium text-claude-ink shrink-0 min-w-0">
        <span className="truncate">{activeServer.name}</span>
      </div>
      {error && (
        <div className="mx-2 mt-2 rounded-claudeMd border border-claude-hairline bg-claude-canvas px-3 py-2 text-xs text-claude-body">
          {error}
        </div>
      )}
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
                <span className={clsx('shrink-0', channelId === ch._id ? 'text-claude-primary' : 'text-claude-muted')}>#</span>
                <span className="truncate">{ch.name}</span>
              </button>
            ))}
          </div>
        )}
        {voiceChannels.length > 0 && (
          <div>
            <p className="text-[11px] font-semibold text-claude-muted uppercase px-2 mb-1 tracking-wide">Voice Channels</p>
            {voiceChannels.map((ch) => (
              <div
                key={ch._id}
                className="w-full min-w-0 px-2 py-1.5 rounded-claudeMd flex items-center gap-2 text-sm text-claude-muted"
              >
                <span className="text-claude-mutedSoft shrink-0">Voice</span>
                <span className="truncate flex-1">{ch.name}</span>
                <span className="ml-auto text-[11px] text-claude-mutedSoft shrink-0">soon</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
