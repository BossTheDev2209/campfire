import { create } from 'zustand'
import { Server, Channel, Message, Member } from '@/types'

interface AppState {
  servers: Server[]
  activeServer: Server | null
  channels: Channel[]
  activeChannel: Channel | null
  messages: Message[]
  members: Member[]
  onlineUsers: Set<string>
  voiceUsers: Record<string, string[]> // channelId -> userId[]

  setServers: (servers: Server[]) => void
  setActiveServer: (server: Server | null) => void
  setChannels: (channels: Channel[]) => void
  setActiveChannel: (channel: Channel | null) => void
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
  servers: [],
  activeServer: null,
  channels: [],
  activeChannel: null,
  messages: [],
  members: [],
  onlineUsers: new Set(),
  voiceUsers: {},

  setServers: (servers) => set({ servers }),
  setActiveServer: (activeServer) => set({ activeServer }),
  setChannels: (channels) => set({ channels }),
  setActiveChannel: (activeChannel) => set({ activeChannel }),
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
