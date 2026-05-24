import { useAppStore } from '@/store/appStore'

interface Props {
  error?: string | null
}

export default function MembersList({ error }: Props) {
  const { members, onlineUsers } = useAppStore()

  const online = members.filter((m) => onlineUsers.has(typeof m.userId === 'string' ? m.userId : m.userId._id))
  const offline = members.filter((m) => !onlineUsers.has(typeof m.userId === 'string' ? m.userId : m.userId._id))

  return (
    <div className="hidden xl:block w-60 bg-claude-surfaceCard shrink-0 overflow-y-auto px-3 py-4 border-l border-claude-hairline">
      {(error || members.length === 0) && (
        <div className="rounded-claudeLg border border-claude-hairline bg-claude-canvas p-3">
          <p className="text-sm font-medium text-claude-ink">Members unavailable</p>
          <p className="text-xs text-claude-muted mt-1">
            {error ?? 'Select a server or check the API connection.'}
          </p>
        </div>
      )}
      {online.length > 0 && (
        <div className="mb-4">
          <p className="text-[11px] font-semibold text-claude-muted uppercase mb-2 tracking-wide">Online ({online.length})</p>
          {online.map((m) => {
            const u = m.userId as any
            const name = u?.username ?? 'Unknown'
            return (
              <div key={m._id} className="flex items-center gap-2 py-1.5 px-2 rounded-claudeMd hover:bg-claude-canvas cursor-pointer transition-colors">
                <div className="relative">
                  <div className="w-8 h-8 rounded-claudeLg bg-claude-surfaceDark flex items-center justify-center text-claude-onDark text-xs font-semibold">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-claude-success border-2 border-claude-surfaceCard" />
                </div>
                <span className="text-claude-ink text-sm truncate">{name}</span>
              </div>
            )
          })}
        </div>
      )}
      {offline.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold text-claude-muted uppercase mb-2 tracking-wide">Offline ({offline.length})</p>
          {offline.map((m) => {
            const u = m.userId as any
            const name = u?.username ?? 'Unknown'
            return (
              <div key={m._id} className="flex items-center gap-2 py-1.5 px-2 rounded-claudeMd hover:bg-claude-canvas cursor-pointer transition-colors opacity-70">
                <div className="w-8 h-8 rounded-claudeLg bg-claude-canvas border border-claude-hairline flex items-center justify-center text-claude-muted text-xs font-semibold">
                  {name.charAt(0).toUpperCase()}
                </div>
                <span className="text-claude-body text-sm truncate">{name}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
