import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import { useAuthStore } from '@/store/authStore'
import clsx from 'clsx'

interface Props {
  error?: string | null
}

export default function ServerList({ error }: Props) {
  const servers = useAppStore((s) => s.servers)
  const { serverId } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="w-[72px] bg-claude-surfaceDark text-claude-onDark flex flex-col items-center py-3 gap-2 overflow-y-auto shrink-0 border-r border-claude-surfaceDarkElevated">
      {error && (
        <div className="w-12 rounded-claudeMd bg-claude-surfaceDarkElevated border border-claude-surfaceDarkSoft flex items-center justify-center py-1 px-1">
          <span className="text-claude-error text-[10px] text-center leading-tight">!</span>
        </div>
      )}
      {servers.length === 0 && !error && (
        <div className="w-12 h-12 rounded-claudeLg border border-dashed border-claude-surfaceDarkSoft flex items-center justify-center text-claude-onDarkSoft text-xs">
          C
        </div>
      )}
      {servers.map((s) => (
        <button
          key={s._id}
          onClick={() => navigate(`/app/${s._id}`)}
          title={s.name}
          className={clsx(
            'w-12 h-12 rounded-claudeLg flex items-center justify-center font-semibold text-sm transition-colors border',
            serverId === s._id
              ? 'bg-claude-primary text-claude-onPrimary border-claude-primary shadow-sm'
              : 'bg-claude-surfaceDarkElevated text-claude-onDark border-claude-surfaceDarkElevated hover:bg-claude-surfaceDarkSoft'
          )}
        >
          {s.icon ? (
            <img src={s.icon} alt={s.name} className="w-12 h-12 rounded-[inherit] object-cover" />
          ) : (
            s.name.charAt(0).toUpperCase()
          )}
        </button>
      ))}
      <div className="mt-auto flex flex-col items-center gap-2 pt-3 border-t border-claude-surfaceDarkElevated w-full">
        <div
          title={user?.username ?? 'Current user'}
          className="w-9 h-9 rounded-claudeMd bg-claude-surfaceDarkElevated border border-claude-surfaceDarkSoft flex items-center justify-center text-claude-onDark text-xs font-semibold"
        >
          {user?.username?.charAt(0).toUpperCase() ?? 'U'}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="text-[11px] text-claude-onDarkSoft hover:text-claude-error rounded-claudeSm px-2 py-2 min-h-[32px] focus:outline-none focus:ring-2 focus:ring-claude-primary/20 transition-colors"
        >
          Log out
        </button>
      </div>
    </div>
  )
}
