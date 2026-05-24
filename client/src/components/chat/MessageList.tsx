import { useEffect, useRef, useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import api from '@/api'
import MessageItem from './MessageItem'

export default function MessageList() {
  const { channelId } = useParams()
  const { messages, setMessages, prependMessages } = useAppStore()
  const bottomRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const hasMore = useRef(true)
  const loading = useRef(false)
  const [loadingInitial, setLoadingInitial] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    if (!channelId) return
    hasMore.current = true
    setLoadingInitial(true)
    setLoadError(null)
    api.get(`/channels/${channelId}/messages?limit=50`)
      .then((r) => {
        setMessages(r.data)
        bottomRef.current?.scrollIntoView()
      })
      .catch(() => setLoadError('Messages could not load.'))
      .finally(() => setLoadingInitial(false))
  }, [channelId])

  const loadMore = useCallback(async () => {
    if (!channelId || loading.current || !hasMore.current) return
    loading.current = true
    const oldest = messages[0]?.createdAt
    if (!oldest) { loading.current = false; return }
    const { data } = await api.get(`/channels/${channelId}/messages?before=${oldest}&limit=50`)
    if (data.length === 0) hasMore.current = false
    else prependMessages(data)
    loading.current = false
  }, [channelId, messages])

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadMore()
    }, { threshold: 0.1 })
    if (topRef.current) observer.observe(topRef.current)
    return () => observer.disconnect()
  }, [loadMore])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-1 bg-notion-canvas">
      <div ref={topRef} className="h-1" />
      {loadingInitial && (
        <div className="space-y-2 animate-pulse">
          <div className="h-10 rounded-notionMd bg-notion-surface" />
          <div className="h-10 rounded-notionMd bg-notion-surfaceSoft" />
          <div className="h-10 rounded-notionMd bg-notion-surface" />
        </div>
      )}
      {loadError && (
        <div className="rounded-notionMd border border-notion-hairline bg-notion-surface px-3 py-2 text-sm text-notion-slate">
          {loadError}
        </div>
      )}
      {!loadingInitial && !loadError && messages.length === 0 && (
        <div className="rounded-notionLg border border-notion-hairline bg-notion-surfaceSoft p-4 text-sm text-notion-slate">
          No messages yet. Start the conversation.
        </div>
      )}
      {messages.map((msg) => <MessageItem key={msg._id} message={msg} />)}
      <div ref={bottomRef} />
    </div>
  )
}
