import { create } from 'zustand'
import { User, Server, Channel, Message, Member } from '@/types'

interface AppState {
  user: User | null
  servers: Server[]
  activeServerId: string | null
  channels: Channel[]
  activeChannelId: string | null
  messages: Message[]
  members: Member[]
  onlineUsers: Set<string>
  voiceUsers: Record<string, string[]>

  setUser: (user: User | null) => void
  setServers: (servers: Server[]) => void
  setActiveServerId: (id: string | null) => void
  setChannels: (channels: Channel[]) => void
  setActiveChannelId: (id: string | null) => void
  setMessages: (messages: Message[]) => void
  prependMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  updateMessage: (messageId: string, content: string, editedAt: string) => void
  removeMessage: (messageId: string) => void
  setMembers: (members: Member[]) => void
  setUserOnline: (userId: string) => void
  setUserOffline: (userId: string) => void
  setVoiceUsers: (channelId: string, userIds: string[]) => void
  addVoiceUser: (channelId: string, userId: string) => void
  removeVoiceUser: (channelId: string, userId: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  servers: [],
  activeServerId: null,
  channels: [],
  activeChannelId: null,
  messages: [],
  members: [],
  onlineUsers: new Set(),
  voiceUsers: {},

  setUser: (user) => set({ user }),
  setServers: (servers) => set({ servers }),
  setActiveServerId: (activeServerId) => set({ activeServerId }),
  setChannels: (channels) => set({ channels }),
  setActiveChannelId: (activeChannelId) => set({ activeChannelId }),
  setMessages: (messages) => set({ messages }),
  prependMessages: (older) => set((s) => ({ messages: [...older, ...s.messages] })),
  addMessage: (message) => set((s) => ({ messages: [...s.messages, message] })),
  updateMessage: (messageId, content, editedAt) =>
    set((s) => ({
      messages: s.messages.map((m) =>
        m._id === messageId ? { ...m, content, edited: true, editedAt } : m
      ),
    })),
  removeMessage: (messageId) =>
    set((s) => ({ messages: s.messages.filter((m) => m._id !== messageId) })),
  setMembers: (members) => set({ members }),
  setUserOnline: (userId) =>
    set((s) => ({ onlineUsers: new Set([...s.onlineUsers, userId]) })),
  setUserOffline: (userId) =>
    set((s) => {
      const next = new Set(s.onlineUsers)
      next.delete(userId)
      return { onlineUsers: next }
    }),
  setVoiceUsers: (channelId, userIds) =>
    set((s) => ({ voiceUsers: { ...s.voiceUsers, [channelId]: userIds } })),
  addVoiceUser: (channelId, userId) =>
    set((s) => ({
      voiceUsers: {
        ...s.voiceUsers,
        [channelId]: [...(s.voiceUsers[channelId] ?? []), userId],
      },
    })),
  removeVoiceUser: (channelId, userId) =>
    set((s) => ({
      voiceUsers: {
        ...s.voiceUsers,
        [channelId]: (s.voiceUsers[channelId] ?? []).filter((id) => id !== userId),
      },
    })),
}))
