import { useAppStore } from '@/store/appStore'
import clsx from 'clsx'

export default function MembersList() {
  const { members, onlineUsers } = useAppStore()

  const online = members.filter((m) => onlineUsers.has(typeof m.userId === 'string' ? m.userId : m.userId._id))
  const offline = members.filter((m) => !onlineUsers.has(typeof m.userId === 'string' ? m.userId : m.userId._id))

  return (
    <div className="w-60 bg-dc-sidebar shrink-0 overflow-y-auto px-3 py-4">
      {online.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-dc-muted uppercase mb-2">Online — {online.length}</p>
          {online.map((m) => {
            const u = m.userId as any
            return (
              <div key={m._id} className="flex items-center gap-2 py-1 px-2 rounded hover:bg-dc-hover cursor-pointer">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-dc-accent flex items-center justify-center text-white text-xs font-bold">
                    {u.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-dc-green border-2 border-dc-sidebar" />
                </div>
                <span className="text-dc-text text-sm">{u.username}</span>
              </div>
            )
          })}
        </div>
      )}
      {offline.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-dc-muted uppercase mb-2">Offline — {offline.length}</p>
          {offline.map((m) => {
            const u = m.userId as any
            return (
              <div key={m._id} className="flex items-center gap-2 py-1 px-2 rounded hover:bg-dc-hover cursor-pointer opacity-50">
                <div className="w-8 h-8 rounded-full bg-dc-sidebar border border-dc-hover flex items-center justify-center text-dc-muted text-xs font-bold">
                  {u.username?.charAt(0).toUpperCase()}
                </div>
                <span className="text-dc-muted text-sm">{u.username}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
