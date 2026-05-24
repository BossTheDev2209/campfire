export interface User {
  _id: string
  username: string
  email: string
  avatar?: string
  status: 'online' | 'idle' | 'dnd' | 'offline'
  customStatus?: string
}

export interface Server {
  _id: string
  name: string
  icon?: string
  description?: string
  ownerId: string
  inviteCode: string
  memberCount: number
}

export interface Channel {
  _id: string
  serverId: string
  name: string
  type: 'text' | 'voice'
  topic?: string
  position: number
}

export interface Message {
  _id: string
  channelId: string
  authorId: string
  author: User
  content: string
  edited: boolean
  editedAt?: string
  createdAt: string
}

export interface Member {
  _id: string
  userId: User
  serverId: string
  joinedAt: string
}

export interface InvitePreview {
  serverName: string
  serverIcon?: string
  memberCount: number
  inviteCode: string
}

export interface VoiceState {
  _id: string
  serverId: string
  channelId: string
  userId: string
  user?: User
  muted: boolean
  deafened: boolean
  updatedAt: string
}
