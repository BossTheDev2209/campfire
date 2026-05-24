import { create } from 'zustand'
import { User, Server, Channel, Message, Member, VoiceState } from '@/types'

interface AppState {
  user: User | null
  servers: Server[]
  activeServerId: string | null
  channels: Channel[]
  activeChannelId: string | null
  activeVoiceChannelId: string | null
  isSidebarOpen: boolean
  messages: Message[]
  members: Member[]
  onlineUsers: Set<string>
  voiceUsers: Record<string, string[]>

  setUser: (user: User | null) => void
  setServers: (servers: Server[]) => void
  setActiveServerId: (id: string | null) => void
  setChannels: (channels: Channel[]) => void
  setActiveChannelId: (id: string | null) => void
  setActiveVoiceChannelId: (id: string | null) => void
  setSidebarOpen: (isOpen: boolean) => void
  setMessages: (messages: Message[]) => void
  prependMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  updateMessage: (messageId: string, content: string, editedAt: string) => void
  removeMessage: (messageId: string) => void
  setMembers: (members: Member[]) => void
  setUserOnline: (userId: string) => void
  setUserOffline: (userId: string) => void
  setVoiceUsers: (channelId: string, userIds: string[]) => void
  setVoiceUsersFromStates: (states: VoiceState[]) => void
  clearVoiceUsers: () => void
  addVoiceUser: (channelId: string, userId: string) => void
  removeVoiceUser: (channelId: string, userId: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  servers: [],
  activeServerId: null,
  channels: [],
  activeChannelId: null,
  activeVoiceChannelId: null,
  isSidebarOpen: false,
  messages: [],
  members: [],
  onlineUsers: new Set(),
  voiceUsers: {},

  setUser: (user) => set({ user }),
  setServers: (servers) => set({ servers }),
  setActiveServerId: (activeServerId) => set({ activeServerId }),
  setChannels: (channels) => set({ channels }),
  setActiveChannelId: (activeChannelId) => set({ activeChannelId }),
  setActiveVoiceChannelId: (activeVoiceChannelId) => set({ activeVoiceChannelId }),
  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
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
  setVoiceUsersFromStates: (states) =>
    set(() => {
      const voiceUsers = states.reduce<Record<string, string[]>>((acc, state) => {
        acc[state.channelId] = [...(acc[state.channelId] ?? []), state.userId]
        return acc
      }, {})
      return { voiceUsers }
    }),
  clearVoiceUsers: () => set({ voiceUsers: {}, activeVoiceChannelId: null }),
  addVoiceUser: (channelId, userId) =>
    set((s) => ({
      voiceUsers: {
        ...s.voiceUsers,
        [channelId]: Array.from(new Set([...(s.voiceUsers[channelId] ?? []), userId])),
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
