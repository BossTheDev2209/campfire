import { useEffect, useState } from 'react'
import api from '@/api'
import { Message } from '@/types'

export function useSearchMessages(channelId: string | null, query: string) {
  const [results, setResults] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!channelId || !query.trim()) {
      setResults([])
      return
    }
    setLoading(true)
    setError(null)
    api
      .get(`/channels/${channelId}/search`, { params: { q: query } })
      .then((r) => setResults(r.data))
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Search failed')
        setResults([])
      })
      .finally(() => setLoading(false))
  }, [channelId, query])

  return { results, loading, error }
}
