import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import clsx from 'clsx'

export default function ServerList() {
  const servers = useAppStore((s) => s.servers)
  const { serverId } = useParams()
  const navigate = useNavigate()

  return (
    <div className="w-[72px] bg-dc-servers flex flex-col items-center py-3 gap-2 overflow-y-auto shrink-0">
      {servers.map((s) => (
        <button key={s._id}
          onClick={() => navigate(`/app/${s._id}`)}
          title={s.name}
          className={clsx(
            'w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all',
            serverId === s._id
              ? 'rounded-2xl bg-dc-accent'
              : 'bg-dc-sidebar hover:rounded-2xl hover:bg-dc-accent'
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
