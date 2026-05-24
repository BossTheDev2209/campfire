import { useAppStore } from '@/store/appStore'
import clsx from 'clsx'

export default function MembersList() {
  const { members, onlineUsers } = useAppStore()

  const online = members.filter((m) => onlineUsers.has(typeof m.userId === 'string' ? m.userId : m.userId._id))
  const offline = members.filter((m) => !onlineUsers.has(typeof m.userId === 'string' ? m.userId : m.userId._id))

  return (
    <div className="w-60 bg-notion-surfaceSoft shrink-0 overflow-y-auto px-3 py-4 border-l border-notion-hairline">
      {members.length === 0 && (
        <div className="rounded-notionLg border border-notion-hairline bg-notion-canvas p-3">
          <p className="text-sm font-medium text-notion-charcoal">No members loaded</p>
          <p className="text-xs text-notion-stone mt-1">They will appear after server data syncs.</p>
        </div>
      )}
      {online.length > 0 && (
        <div className="mb-4">
          <p className="text-[11px] font-semibold text-notion-stone uppercase mb-2 tracking-wide">Online ({online.length})</p>
          {online.map((m) => {
            const u = m.userId as any
            return (
              <div key={m._id} className="flex items-center gap-2 py-1.5 px-2 rounded-notionMd hover:bg-notion-canvas cursor-pointer transition-colors">
                <div className="relative">
                  <div className="w-8 h-8 rounded-notionLg bg-notion-primary flex items-center justify-center text-white text-xs font-semibold">
                    {u.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-notion-success border-2 border-notion-surfaceSoft" />
                </div>
                <span className="text-notion-charcoal text-sm truncate">{u.username}</span>
              </div>
            )
          })}
        </div>
      )}
      {offline.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold text-notion-stone uppercase mb-2 tracking-wide">Offline ({offline.length})</p>
          {offline.map((m) => {
            const u = m.userId as any
            return (
              <div key={m._id} className="flex items-center gap-2 py-1.5 px-2 rounded-notionMd hover:bg-notion-canvas cursor-pointer transition-colors opacity-70">
                <div className="w-8 h-8 rounded-notionLg bg-notion-canvas border border-notion-hairline flex items-center justify-center text-notion-stone text-xs font-semibold">
                  {u.username?.charAt(0).toUpperCase()}
                </div>
                <span className="text-notion-slate text-sm truncate">{u.username}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
