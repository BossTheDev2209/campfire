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
    <div className="w-60 bg-notion-surfaceSoft shrink-0 flex items-center justify-center border-r border-notion-hairline">
      <p className="text-notion-stone text-sm">Select a server</p>
    </div>
  )

  return (
    <div className="w-60 bg-notion-surfaceSoft shrink-0 flex flex-col overflow-y-auto border-r border-notion-hairline">
      <div className="h-12 px-4 flex items-center border-b border-notion-hairline font-semibold text-notion-charcoal shrink-0">
        {activeServer.name}
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {textChannels.length > 0 && (
          <div className="mb-4">
            <p className="text-[11px] font-semibold text-notion-stone uppercase px-2 mb-1 tracking-wide">Text Channels</p>
            {textChannels.map((ch) => (
              <button key={ch._id}
                onClick={() => navigate(`/app/${serverId}/${ch._id}`)}
                className={clsx(
                  'w-full text-left px-2 py-1.5 rounded-notionMd flex items-center gap-2 text-sm transition-colors',
                  channelId === ch._id
                    ? 'bg-notion-canvas text-notion-ink shadow-sm border border-notion-hairline'
                    : 'text-notion-slate hover:bg-notion-canvas hover:text-notion-ink'
                )}>
                <span className="text-notion-stone">#</span> {ch.name}
              </button>
            ))}
          </div>
        )}
        {voiceChannels.length > 0 && (
          <div>
            <p className="text-[11px] font-semibold text-notion-stone uppercase px-2 mb-1 tracking-wide">Voice Channels</p>
            {voiceChannels.map((ch) => (
              <button key={ch._id}
                className="w-full text-left px-2 py-1.5 rounded-notionMd flex items-center gap-2 text-sm text-notion-slate hover:bg-notion-canvas hover:text-notion-ink transition-colors">
                <span className="text-notion-stone">Voice</span> {ch.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
