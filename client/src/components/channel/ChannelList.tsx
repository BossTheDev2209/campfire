import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import clsx from 'clsx'

export default function ChannelList() {
  const { activeServer, channels } = useAppStore()
  const { channelId } = useParams()
  const navigate = useNavigate()
  const { serverId } = useParams()

  const textChannels = channels.filter((c) => c.type === 'text')
  const voiceChannels = channels.filter((c) => c.type === 'voice')

  if (!activeServer) return (
    <div className="w-60 bg-dc-sidebar shrink-0 flex items-center justify-center">
      <p className="text-dc-muted text-sm">Select a server</p>
    </div>
  )

  return (
    <div className="w-60 bg-dc-sidebar shrink-0 flex flex-col overflow-y-auto">
      <div className="h-12 px-4 flex items-center border-b border-black/20 font-semibold text-dc-text shrink-0">
        {activeServer.name}
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {textChannels.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-dc-muted uppercase px-2 mb-1">Text Channels</p>
            {textChannels.map((ch) => (
              <button key={ch._id}
                onClick={() => navigate(`/app/${serverId}/${ch._id}`)}
                className={clsx(
                  'w-full text-left px-2 py-1 rounded flex items-center gap-2 text-sm transition-colors',
                  channelId === ch._id
                    ? 'bg-dc-hover text-white'
                    : 'text-dc-muted hover:bg-dc-hover hover:text-dc-text'
                )}>
                <span className="text-dc-muted">#</span> {ch.name}
              </button>
            ))}
          </div>
        )}
        {voiceChannels.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-dc-muted uppercase px-2 mb-1">Voice Channels</p>
            {voiceChannels.map((ch) => (
              <button key={ch._id}
                className="w-full text-left px-2 py-1 rounded flex items-center gap-2 text-sm text-dc-muted hover:bg-dc-hover hover:text-dc-text transition-colors">
                <span>🔊</span> {ch.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
