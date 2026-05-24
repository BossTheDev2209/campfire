import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import clsx from 'clsx'

export default function ServerList() {
  const servers = useAppStore((s) => s.servers)
  const { serverId } = useParams()
  const navigate = useNavigate()

  return (
    <div className="w-[72px] bg-notion-surface flex flex-col items-center py-3 gap-2 overflow-y-auto shrink-0 border-r border-notion-hairline">
      {servers.map((s) => (
        <button key={s._id}
          onClick={() => navigate(`/app/${s._id}`)}
          title={s.name}
          className={clsx(
            'w-12 h-12 rounded-notionLg flex items-center justify-center font-semibold text-sm transition-colors border',
            serverId === s._id
              ? 'bg-notion-primary text-white border-notion-primary shadow-sm'
              : 'bg-notion-canvas text-notion-charcoal border-notion-hairline hover:bg-notion-surfaceSoft hover:border-notion-hairlineStrong'
          )}>
          {s.icon ? (
            <img src={s.icon} alt={s.name} className="w-12 h-12 rounded-[inherit] object-cover" />
          ) : (
            s.name.charAt(0).toUpperCase()
          )}
        </button>
      ))}
    </div>
  )
}
