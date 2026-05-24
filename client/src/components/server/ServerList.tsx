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
    <div className="w-[72px] bg-notion-surface flex flex-col items-center py-3 gap-2 overflow-y-auto shrink-0 border-r border-notion-hairline">
      {error && (
        <div className="w-12 rounded-notionMd bg-notion-tintRose border border-notion-hairline flex items-center justify-center py-1 px-1">
          <span className="text-notion-error text-[10px] text-center leading-tight">!</span>
        </div>
      )}
      {servers.length === 0 && !error && (
        <div className="w-12 h-12 rounded-notionLg border border-dashed border-notion-hairlineStrong flex items-center justify-center text-notion-stone text-xs">
          C
        </div>
      )}
      {servers.map((s) => (
        <button
          key={s._id}
          onClick={() => navigate(`/app/${s._id}`)}
          title={s.name}
          className={clsx(
            'w-12 h-12 rounded-notionLg flex items-center justify-center font-semibold text-sm transition-colors border',
            serverId === s._id
              ? 'bg-notion-primary text-white border-notion-primary shadow-sm'
              : 'bg-notion-canvas text-notion-charcoal border-notion-hairline hover:bg-notion-surfaceSoft hover:border-notion-hairlineStrong'
          )}
        >
          {s.icon ? (
            <img src={s.icon} alt={s.name} className="w-12 h-12 rounded-[inherit] object-cover" />
          ) : (
            s.name.charAt(0).toUpperCase()
          )}
        </button>
      ))}
      <div className="mt-auto flex flex-col items-center gap-2 pt-3 border-t border-notion-hairline w-full">
        <div
          title={user?.username ?? 'Current user'}
          className="w-9 h-9 rounded-notionMd bg-notion-canvas border border-notion-hairline flex items-center justify-center text-notion-charcoal text-xs font-semibold"
        >
          {user?.username?.charAt(0).toUpperCase() ?? 'U'}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="text-[11px] text-notion-stone hover:text-notion-error rounded-notionSm px-1 py-1 focus:outline-none focus:ring-2 focus:ring-notion-primary/20 transition-colors"
        >
          Log out
        </button>
      </div>
    </div>
  )
}
