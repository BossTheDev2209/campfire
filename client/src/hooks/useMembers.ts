import { useEffect, useState } from 'react'
import api from '@/api'
import { useAppStore } from '@/store/appStore'

export function useMembers(serverId: string | null) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const setMembers = useAppStore((s) => s.setMembers)

  useEffect(() => {
    if (!serverId) return
    setLoading(true)
    setError(null)
    api
      .get(`/servers/${serverId}/members`)
      .then((r) => setMembers(r.data))
      .catch((err: unknown) => {
        setMembers([])
        setError(err instanceof Error ? err.message : 'Failed to load members')
      })
      .finally(() => setLoading(false))
  }, [serverId])

  return { loading, error }
}
