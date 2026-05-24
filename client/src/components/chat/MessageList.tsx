import { useEffect, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import { useAuthStore } from '@/store/authStore'
import api from '@/api'
import MessageItem from './MessageItem'

export default function MessageList() {
  const { channelId } = useParams()
  const { messages, setMessages, prependMessages } = useAppStore()
  const bottomRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const hasMore = useRef(true)
  const loading = useRef(false)

  useEffect(() => {
    if (!channelId) return
    hasMore.current = true
    api.get(`/channels/${channelId}/messages?limit=50`).then((r) => {
      setMessages(r.data)
      bottomRef.current?.scrollIntoView()
    })
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
    <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-1">
      <div ref={topRef} className="h-1" />
      {messages.map((msg) => <MessageItem key={msg._id} message={msg} />)}
      <div ref={bottomRef} />
    </div>
  )
}
