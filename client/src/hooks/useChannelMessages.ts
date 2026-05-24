import { useEffect, useState } from 'react'
import api from '@/api'
import { useAppStore } from '@/store/appStore'

export function useChannelMessages(channelId: string | null, before?: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const setMessages = useAppStore((s) => s.setMessages)
  const prependMessages = useAppStore((s) => s.prependMessages)

  useEffect(() => {
    if (!channelId) return
    setLoading(true)
    setError(null)

    const params: Record<string, string | number> = { limit: 50 }
    if (before) params.before = before

    api
      .get(`/channels/${channelId}/messages`, { params })
      .then((r) => {
        if (before) {
          prependMessages(r.data)
        } else {
          setMessages(r.data)
        }
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load messages')
      })
      .finally(() => setLoading(false))
  }, [channelId, before])

  return { loading, error }
}
