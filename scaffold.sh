#!/bin/bash
# Campfire — full monorepo scaffold
# Run from inside the cloned repo: bash scaffold.sh

set -e

echo "==> Scaffolding campfire..."

# ─── Root ───────────────────────────────────────────────────────────────────
cat > package.json << 'EOF'
{
  "name": "campfire",
  "private": true,
  "scripts": {
    "dev": "concurrently \"bun run dev:server\" \"bun run dev:client\"",
    "dev:client": "cd client && bun run dev",
    "dev:server": "cd server && bun run dev"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
EOF

cat > .gitignore << 'EOF'
node_modules
dist
.env
.env.local
*.log
EOF

cat > .env.example << 'EOF'
MONGODB_URI=mongodb://localhost:27017/campfire
JWT_SECRET=change_this_secret_in_production
PORT=3001
CLIENT_URL=http://localhost:5173
EOF

# ─── Client ──────────────────────────────────────────────────────────────────
echo "==> Creating Vite React TS client..."
bunx create-vite client --template react-ts --skip-git
cd client

cat > package.json << 'EOF'
{
  "name": "campfire-client",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.7.2",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.23.1",
    "socket.io-client": "^4.7.5",
    "simple-peer": "^9.11.1",
    "zustand": "^4.5.2",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@types/simple-peer": "^9.11.8",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "typescript": "^5.4.5",
    "vite": "^5.3.1"
  }
}
EOF

cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001',
      '/socket.io': {
        target: 'http://localhost:3001',
        ws: true,
      },
    },
  },
})
EOF

cat > tailwind.config.ts << 'EOF'
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        dc: {
          bg:       '#313338',
          sidebar:  '#2B2D31',
          servers:  '#1E1F22',
          input:    '#383A40',
          hover:    '#35373C',
          text:     '#DBDEE1',
          muted:    '#80848E',
          accent:   '#5865F2',
          green:    '#23A559',
          yellow:   '#F0B232',
          red:      '#F23F43',
          mention:  '#F0B232',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
EOF

cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"]
}
EOF

# Update vite.config.ts with path alias
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001',
      '/socket.io': { target: 'http://localhost:3001', ws: true },
    },
  },
})
EOF

# ── src structure ─────────────────────────────────────────────────────────────
mkdir -p src/{api,components/{auth,chat,channel,server,voice,ui,layout},hooks,pages,store,types}

cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #313338;
  color: #DBDEE1;
  font-family: 'gg sans', 'Noto Sans', Whitney, 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #1e1f22; border-radius: 4px; }
EOF

cat > src/main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
EOF

cat > src/App.tsx << 'EOF'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import LandingPage from '@/pages/LandingPage'
import AppPage from '@/pages/AppPage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token)
  return token ? <>{children}</> : <Navigate to="/" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<PrivateRoute><AppPage /></PrivateRoute>} />
      <Route path="/app/:serverId" element={<PrivateRoute><AppPage /></PrivateRoute>} />
      <Route path="/app/:serverId/:channelId" element={<PrivateRoute><AppPage /></PrivateRoute>} />
    </Routes>
  )
}
EOF

# ── Types ─────────────────────────────────────────────────────────────────────
cat > src/types/index.ts << 'EOF'
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
EOF

# ── API client ────────────────────────────────────────────────────────────────
cat > src/api/index.ts << 'EOF'
import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/'
    }
    return Promise.reject(err)
  }
)

export default api
EOF

# ── Zustand stores ────────────────────────────────────────────────────────────
cat > src/store/authStore.ts << 'EOF'
import { create } from 'zustand'
import { User } from '@/types'

interface AuthState {
  token: string | null
  user: User | null
  setAuth: (token: string, user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: null,
  setAuth: (token, user) => {
    localStorage.setItem('token', token)
    set({ token, user })
  },
  logout: () => {
    localStorage.removeItem('token')
    set({ token: null, user: null })
  },
}))
EOF

cat > src/store/appStore.ts << 'EOF'
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
EOF

# ── Socket hook ───────────────────────────────────────────────────────────────
cat > src/hooks/useSocket.ts << 'EOF'
import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '@/store/authStore'
import { useAppStore } from '@/store/appStore'
import { Message } from '@/types'

let socket: Socket | null = null

export function getSocket() { return socket }

export function useSocket() {
  const token = useAuthStore((s) => s.token)
  const { addMessage, updateMessage, removeMessage, setUserOnline, setUserOffline, addVoiceUser, removeVoiceUser } = useAppStore()
  const initialized = useRef(false)

  useEffect(() => {
    if (!token || initialized.current) return
    initialized.current = true

    socket = io('/', { auth: { token } })

    socket.on('message:new', (msg: Message) => addMessage(msg))
    socket.on('message:updated', ({ messageId, content, editedAt }: any) =>
      updateMessage(messageId, content, editedAt)
    )
    socket.on('message:deleted', ({ messageId }: any) => removeMessage(messageId))
    socket.on('presence:update', ({ userId, status }: any) => {
      status === 'offline' ? setUserOffline(userId) : setUserOnline(userId)
    })
    socket.on('voice:user-joined', ({ userId, channelId }: any) =>
      addVoiceUser(channelId, userId)
    )
    socket.on('voice:user-left', ({ userId, channelId }: any) =>
      removeVoiceUser(channelId, userId)
    )

    return () => {
      socket?.disconnect()
      socket = null
      initialized.current = false
    }
  }, [token])

  return socket
}
EOF

# ── Pages (shells) ────────────────────────────────────────────────────────────
cat > src/pages/LandingPage.tsx << 'EOF'
import { useState } from 'react'
import LoginForm from '@/components/auth/LoginForm'
import RegisterForm from '@/components/auth/RegisterForm'

export default function LandingPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  return (
    <div className="min-h-screen bg-dc-bg flex items-center justify-center">
      <div className="w-full max-w-md bg-dc-sidebar rounded-lg p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-white text-center mb-2">
          {mode === 'login' ? 'Welcome back!' : 'Create an account'}
        </h1>
        <p className="text-dc-muted text-center mb-6 text-sm">
          {mode === 'login' ? "We're so excited to see you again!" : 'Fill in the details below'}
        </p>
        {mode === 'login' ? <LoginForm /> : <RegisterForm />}
        <p className="text-dc-muted text-sm mt-4">
          {mode === 'login' ? (
            <>Need an account?{' '}
              <button onClick={() => setMode('register')} className="text-dc-accent hover:underline">
                Register
              </button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button onClick={() => setMode('login')} className="text-dc-accent hover:underline">
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
EOF

cat > src/pages/AppPage.tsx << 'EOF'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ServerList from '@/components/server/ServerList'
import ChannelList from '@/components/channel/ChannelList'
import ChatArea from '@/components/chat/ChatArea'
import MembersList from '@/components/layout/MembersList'
import { useSocket } from '@/hooks/useSocket'
import { useAppStore } from '@/store/appStore'
import api from '@/api'

export default function AppPage() {
  useSocket()
  const { serverId, channelId } = useParams()
  const { setServers, setChannels, setActiveServer, setActiveChannel, servers, channels } = useAppStore()

  useEffect(() => {
    api.get('/servers').then((r) => setServers(r.data))
  }, [])

  useEffect(() => {
    if (!serverId) return
    const server = servers.find((s) => s._id === serverId)
    if (server) setActiveServer(server)
    api.get(`/servers/${serverId}/channels`).then((r) => setChannels(r.data))
  }, [serverId, servers])

  useEffect(() => {
    if (!channelId) return
    const channel = channels.find((c) => c._id === channelId)
    if (channel) setActiveChannel(channel)
  }, [channelId, channels])

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <ServerList />
      <ChannelList />
      <ChatArea />
      <MembersList />
    </div>
  )
}
EOF

# ── Auth components (shells) ──────────────────────────────────────────────────
cat > src/components/auth/LoginForm.tsx << 'EOF'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@/api'
import { useAuthStore } from '@/store/authStore'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/auth/login', { email, password })
      setAuth(data.token, data.user)
      navigate('/app')
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Login failed')
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      {error && <p className="text-dc-red text-sm">{error}</p>}
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-dc-muted uppercase tracking-wide">Email</span>
        <input value={email} onChange={(e) => setEmail(e.target.value)}
          type="email" required autoComplete="email"
          className="bg-dc-bg text-dc-text rounded px-3 py-2 outline-none focus:ring-2 focus:ring-dc-accent text-sm" />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-dc-muted uppercase tracking-wide">Password</span>
        <input value={password} onChange={(e) => setPassword(e.target.value)}
          type="password" required autoComplete="current-password"
          className="bg-dc-bg text-dc-text rounded px-3 py-2 outline-none focus:ring-2 focus:ring-dc-accent text-sm" />
      </label>
      <button type="submit"
        className="bg-dc-accent hover:bg-indigo-500 text-white rounded py-2 font-semibold transition-colors mt-2">
        Log In
      </button>
    </form>
  )
}
EOF

cat > src/components/auth/RegisterForm.tsx << 'EOF'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@/api'
import { useAuthStore } from '@/store/authStore'

export default function RegisterForm() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/auth/register', { username, email, password })
      setAuth(data.token, data.user)
      navigate('/app')
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Registration failed')
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      {error && <p className="text-dc-red text-sm">{error}</p>}
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-dc-muted uppercase tracking-wide">Username</span>
        <input value={username} onChange={(e) => setUsername(e.target.value)}
          required minLength={2}
          className="bg-dc-bg text-dc-text rounded px-3 py-2 outline-none focus:ring-2 focus:ring-dc-accent text-sm" />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-dc-muted uppercase tracking-wide">Email</span>
        <input value={email} onChange={(e) => setEmail(e.target.value)}
          type="email" required
          className="bg-dc-bg text-dc-text rounded px-3 py-2 outline-none focus:ring-2 focus:ring-dc-accent text-sm" />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-dc-muted uppercase tracking-wide">Password</span>
        <input value={password} onChange={(e) => setPassword(e.target.value)}
          type="password" required minLength={6}
          className="bg-dc-bg text-dc-text rounded px-3 py-2 outline-none focus:ring-2 focus:ring-dc-accent text-sm" />
      </label>
      <button type="submit"
        className="bg-dc-accent hover:bg-indigo-500 text-white rounded py-2 font-semibold transition-colors mt-2">
        Continue
      </button>
    </form>
  )
}
EOF

# ── Layout shells ─────────────────────────────────────────────────────────────
cat > src/components/server/ServerList.tsx << 'EOF'
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
EOF

cat > src/components/channel/ChannelList.tsx << 'EOF'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import clsx from 'clsx'

export default function ChannelList() {
  const { activeServer, channels } = useAppStore()
  const { channelId } = useParams()
  const navigate = useNavigate()
  const { serverId } = useParams()

  const textChannels = channels.filter((c) => c.type === 'text')
  const voiceChannels = channels.filter((c) => c.type === 'voice')

  if (!activeServer) return (
    <div className="w-60 bg-dc-sidebar shrink-0 flex items-center justify-center">
      <p className="text-dc-muted text-sm">Select a server</p>
    </div>
  )

  return (
    <div className="w-60 bg-dc-sidebar shrink-0 flex flex-col overflow-y-auto">
      <div className="h-12 px-4 flex items-center border-b border-black/20 font-semibold text-dc-text shrink-0">
        {activeServer.name}
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {textChannels.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-dc-muted uppercase px-2 mb-1">Text Channels</p>
            {textChannels.map((ch) => (
              <button key={ch._id}
                onClick={() => navigate(`/app/${serverId}/${ch._id}`)}
                className={clsx(
                  'w-full text-left px-2 py-1 rounded flex items-center gap-2 text-sm transition-colors',
                  channelId === ch._id
                    ? 'bg-dc-hover text-white'
                    : 'text-dc-muted hover:bg-dc-hover hover:text-dc-text'
                )}>
                <span className="text-dc-muted">#</span> {ch.name}
              </button>
            ))}
          </div>
        )}
        {voiceChannels.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-dc-muted uppercase px-2 mb-1">Voice Channels</p>
            {voiceChannels.map((ch) => (
              <button key={ch._id}
                className="w-full text-left px-2 py-1 rounded flex items-center gap-2 text-sm text-dc-muted hover:bg-dc-hover hover:text-dc-text transition-colors">
                <span>🔊</span> {ch.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
EOF

cat > src/components/chat/ChatArea.tsx << 'EOF'
import { useAppStore } from '@/store/appStore'
import MessageList from './MessageList'
import MessageInput from './MessageInput'

export default function ChatArea() {
  const activeChannel = useAppStore((s) => s.activeChannel)

  if (!activeChannel) return (
    <div className="flex-1 bg-dc-bg flex items-center justify-center">
      <p className="text-dc-muted">Select a channel to start chatting</p>
    </div>
  )

  return (
    <div className="flex-1 bg-dc-bg flex flex-col overflow-hidden">
      <div className="h-12 px-4 flex items-center border-b border-black/20 font-semibold text-dc-text shrink-0">
        # {activeChannel.name}
      </div>
      <MessageList />
      <MessageInput />
    </div>
  )
}
EOF

cat > src/components/chat/MessageList.tsx << 'EOF'
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
EOF

cat > src/components/chat/MessageItem.tsx << 'EOF'
import { useState } from 'react'
import { Message } from '@/types'
import { useAuthStore } from '@/store/authStore'
import { useAppStore } from '@/store/appStore'
import api from '@/api'
import { getSocket } from '@/hooks/useSocket'
import { format } from 'date-fns'

export default function MessageItem({ message }: { message: Message }) {
  const user = useAuthStore((s) => s.user)
  const { removeMessage, updateMessage } = useAppStore()
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)
  const isOwn = user?._id === message.authorId

  const handleDelete = async () => {
    await api.delete(`/messages/${message._id}`)
    removeMessage(message._id)
    getSocket()?.emit('message:delete', { messageId: message._id, channelId: message.channelId })
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editContent.trim() || editContent === message.content) { setEditing(false); return }
    const { data } = await api.patch(`/messages/${message._id}`, { content: editContent })
    updateMessage(message._id, data.content, data.editedAt)
    getSocket()?.emit('message:edit', { messageId: message._id, content: data.content, editedAt: data.editedAt, channelId: message.channelId })
    setEditing(false)
  }

  return (
    <div className="group flex gap-3 py-1 px-2 rounded hover:bg-white/5 transition-colors">
      <div className="w-10 h-10 rounded-full bg-dc-accent flex items-center justify-center text-white font-bold shrink-0 mt-0.5">
        {message.author?.username?.charAt(0).toUpperCase() ?? '?'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-dc-text text-sm">{message.author?.username}</span>
          <span className="text-dc-muted text-xs">
            {format(new Date(message.createdAt), 'MM/dd/yyyy h:mm a')}
          </span>
          {message.edited && <span className="text-dc-muted text-xs">(edited)</span>}
        </div>
        {editing ? (
          <form onSubmit={handleEdit} className="mt-1">
            <input value={editContent} onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && setEditing(false)}
              autoFocus
              className="w-full bg-dc-input text-dc-text rounded px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-dc-accent" />
            <p className="text-xs text-dc-muted mt-1">Enter to save · Esc to cancel</p>
          </form>
        ) : (
          <p className="text-dc-text text-sm break-words">{message.content}</p>
        )}
      </div>
      {isOwn && !editing && (
        <div className="opacity-0 group-hover:opacity-100 flex gap-1 shrink-0">
          <button onClick={() => setEditing(true)}
            className="text-dc-muted hover:text-dc-text text-xs px-2 py-1 rounded hover:bg-dc-hover transition-colors">
            Edit
          </button>
          <button onClick={handleDelete}
            className="text-dc-muted hover:text-dc-red text-xs px-2 py-1 rounded hover:bg-dc-hover transition-colors">
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
EOF

cat > src/components/chat/MessageInput.tsx << 'EOF'
import { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import api from '@/api'
import { getSocket } from '@/hooks/useSocket'

export default function MessageInput() {
  const { channelId } = useParams()
  const [content, setContent] = useState('')
  const { activeChannel, addMessage } = useAppStore()
  const inputRef = useRef<HTMLInputElement>(null)

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !channelId) return
    const { data } = await api.post(`/channels/${channelId}/messages`, { content })
    addMessage(data)
    getSocket()?.emit('message:send', { channelId, messageId: data._id })
    setContent('')
  }

  if (!activeChannel || activeChannel.type !== 'text') return null

  return (
    <form onSubmit={send} className="px-4 pb-6 shrink-0">
      <div className="bg-dc-input rounded-lg flex items-center px-4 gap-2">
        <input ref={inputRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Message #${activeChannel.name}`}
          className="flex-1 bg-transparent py-3 text-dc-text placeholder-dc-muted outline-none text-sm" />
        <button type="submit" className="text-dc-muted hover:text-dc-text transition-colors text-sm">
          ↵
        </button>
      </div>
    </form>
  )
}
EOF

cat > src/components/layout/MembersList.tsx << 'EOF'
import { useAppStore } from '@/store/appStore'
import clsx from 'clsx'

export default function MembersList() {
  const { members, onlineUsers } = useAppStore()

  const online = members.filter((m) => onlineUsers.has(typeof m.userId === 'string' ? m.userId : m.userId._id))
  const offline = members.filter((m) => !onlineUsers.has(typeof m.userId === 'string' ? m.userId : m.userId._id))

  return (
    <div className="w-60 bg-dc-sidebar shrink-0 overflow-y-auto px-3 py-4">
      {online.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-dc-muted uppercase mb-2">Online — {online.length}</p>
          {online.map((m) => {
            const u = m.userId as any
            return (
              <div key={m._id} className="flex items-center gap-2 py-1 px-2 rounded hover:bg-dc-hover cursor-pointer">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-dc-accent flex items-center justify-center text-white text-xs font-bold">
                    {u.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-dc-green border-2 border-dc-sidebar" />
                </div>
                <span className="text-dc-text text-sm">{u.username}</span>
              </div>
            )
          })}
        </div>
      )}
      {offline.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-dc-muted uppercase mb-2">Offline — {offline.length}</p>
          {offline.map((m) => {
            const u = m.userId as any
            return (
              <div key={m._id} className="flex items-center gap-2 py-1 px-2 rounded hover:bg-dc-hover cursor-pointer opacity-50">
                <div className="w-8 h-8 rounded-full bg-dc-sidebar border border-dc-hover flex items-center justify-center text-dc-muted text-xs font-bold">
                  {u.username?.charAt(0).toUpperCase()}
                </div>
                <span className="text-dc-muted text-sm">{u.username}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
EOF

bun install
cd ..

# ─── Server ───────────────────────────────────────────────────────────────────
echo "==> Creating Bun + Express server..."
mkdir -p server/src/{routes,models,middleware,socket}
cd server

cat > package.json << 'EOF'
{
  "name": "campfire-server",
  "version": "0.0.1",
  "scripts": {
    "dev": "bun --watch src/index.ts",
    "start": "bun src/index.ts",
    "seed": "bun src/seed.ts"
  },
  "dependencies": {
    "express": "^4.19.2",
    "mongoose": "^8.4.1",
    "socket.io": "^4.7.5",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.17",
    "typescript": "^5.4.5"
  }
}
EOF

cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "esModuleInterop": true
  },
  "include": ["src"]
}
EOF

cat > src/index.ts << 'EOF'
import express from 'express'
import { createServer } from 'http'
import { Server as SocketServer } from 'socket.io'
import mongoose from 'mongoose'
import cors from 'cors'
import 'dotenv/config'

import authRoutes from './routes/auth'
import serverRoutes from './routes/servers'
import channelRoutes from './routes/channels'
import messageRoutes from './routes/messages'
import userRoutes from './routes/users'
import inviteRoutes from './routes/invites'
import { setupSocket } from './socket/handlers'

const app = express()
const httpServer = createServer(app)
const io = new SocketServer(httpServer, {
  cors: { origin: process.env.CLIENT_URL ?? 'http://localhost:5173', credentials: true }
})

app.use(cors({ origin: process.env.CLIENT_URL ?? 'http://localhost:5173', credentials: true }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/servers', serverRoutes)
app.use('/api/channels', channelRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/users', userRoutes)
app.use('/api/invites', inviteRoutes)

setupSocket(io)

const PORT = process.env.PORT ?? 3001
const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/campfire'

mongoose.connect(MONGODB_URI).then(() => {
  console.log('MongoDB connected')
  httpServer.listen(PORT, () => console.log(`Server running on :${PORT}`))
}).catch(console.error)
EOF

# ── Models ────────────────────────────────────────────────────────────────────
cat > src/models/User.ts << 'EOF'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const schema = new mongoose.Schema({
  username:     { type: String, required: true, unique: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  password:     { type: String, required: true },
  avatar:       { type: String, default: null },
  status:       { type: String, enum: ['online','idle','dnd','offline'], default: 'offline' },
  customStatus: { type: String, default: '' },
}, { timestamps: true })

schema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

schema.methods.comparePassword = function(plain: string) {
  return bcrypt.compare(plain, this.password)
}

export default mongoose.model('User', schema)
EOF

cat > src/models/Server.ts << 'EOF'
import mongoose from 'mongoose'
import crypto from 'crypto'

const schema = new mongoose.Schema({
  name:        { type: String, required: true },
  icon:        { type: String, default: null },
  description: { type: String, default: '' },
  ownerId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  inviteCode:  { type: String, unique: true, default: () => crypto.randomBytes(4).toString('hex').toUpperCase() },
  memberCount: { type: Number, default: 1 },
}, { timestamps: true })

export default mongoose.model('Server', schema)
EOF

cat > src/models/Channel.ts << 'EOF'
import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  serverId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Server', required: true },
  name:      { type: String, required: true },
  type:      { type: String, enum: ['text', 'voice'], default: 'text' },
  topic:     { type: String, default: '' },
  position:  { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.model('Channel', schema)
EOF

cat > src/models/Message.ts << 'EOF'
import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  channelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
  authorId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content:   { type: String, required: true },
  edited:    { type: Boolean, default: false },
  editedAt:  { type: Date, default: null },
}, { timestamps: true })

schema.index({ channelId: 1, createdAt: -1 })

export default mongoose.model('Message', schema)
EOF

cat > src/models/Member.ts << 'EOF'
import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  serverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Server', required: true },
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  joinedAt: { type: Date, default: Date.now },
})

schema.index({ serverId: 1, userId: 1 }, { unique: true })

export default mongoose.model('Member', schema)
EOF

cat > src/models/VoiceState.ts << 'EOF'
import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  channelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  muted:     { type: Boolean, default: false },
  deafened:  { type: Boolean, default: false },
}, { timestamps: true })

schema.index({ channelId: 1, userId: 1 }, { unique: true })

export default mongoose.model('VoiceState', schema)
EOF

# ── Auth middleware ────────────────────────────────────────────────────────────
cat > src/middleware/auth.ts << 'EOF'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  userId?: string
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token' })
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET ?? 'secret') as any
    req.userId = payload.userId
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}
EOF

# ── Routes ────────────────────────────────────────────────────────────────────
cat > src/routes/auth.ts << 'EOF'
import { Router } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body
    if (!username || !email || !password) return res.status(400).json({ error: 'All fields required' })
    const user = await User.create({ username, email, password })
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET ?? 'secret', { expiresIn: '7d' })
    res.json({ token, user: { _id: user._id, username: user.username, email: user.email, status: user.status } })
  } catch (e: any) {
    res.status(400).json({ error: e.code === 11000 ? 'Username or email already taken' : 'Registration failed' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await (user as any).comparePassword(password)))
      return res.status(401).json({ error: 'Invalid credentials' })
    await User.findByIdAndUpdate(user._id, { status: 'online' })
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET ?? 'secret', { expiresIn: '7d' })
    res.json({ token, user: { _id: user._id, username: user.username, email: user.email, status: 'online' } })
  } catch {
    res.status(500).json({ error: 'Login failed' })
  }
})

router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  const user = await User.findById(req.userId).select('-password')
  if (!user) return res.status(404).json({ error: 'Not found' })
  res.json(user)
})

export default router
EOF

cat > src/routes/servers.ts << 'EOF'
import { Router } from 'express'
import Server from '../models/Server'
import Member from '../models/Member'
import User from '../models/User'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()
router.use(requireAuth)

router.get('/', async (req: AuthRequest, res) => {
  const memberships = await Member.find({ userId: req.userId })
  const serverIds = memberships.map((m) => m.serverId)
  const servers = await Server.find({ _id: { $in: serverIds } })
  res.json(servers)
})

router.get('/:id', async (req: AuthRequest, res) => {
  const server = await Server.findById(req.params.id)
  if (!server) return res.status(404).json({ error: 'Not found' })
  res.json(server)
})

router.get('/:id/members', async (req: AuthRequest, res) => {
  const members = await Member.find({ serverId: req.params.id }).populate('userId', '-password')
  res.json(members)
})

export default router
EOF

cat > src/routes/channels.ts << 'EOF'
import { Router } from 'express'
import Channel from '../models/Channel'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()
router.use(requireAuth)

router.get('/servers/:serverId', async (req, res) => {
  const channels = await Channel.find({ serverId: req.params.serverId }).sort('position')
  res.json(channels)
})

export default router
EOF

cat > src/routes/messages.ts << 'EOF'
import { Router } from 'express'
import Message from '../models/Message'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()
router.use(requireAuth)

router.get('/channels/:channelId', async (req: AuthRequest, res) => {
  const { before, limit = '50' } = req.query as any
  const query: any = { channelId: req.params.channelId }
  if (before) query.createdAt = { $lt: new Date(before) }
  const messages = await Message.find(query)
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .populate('authorId', 'username avatar status')
    .lean()
  const shaped = messages.reverse().map((m: any) => ({ ...m, author: m.authorId }))
  res.json(shaped)
})

router.post('/channels/:channelId', async (req: AuthRequest, res) => {
  const { content } = req.body
  if (!content?.trim()) return res.status(400).json({ error: 'Content required' })
  const msg = await Message.create({ channelId: req.params.channelId, authorId: req.userId, content })
  const populated = await msg.populate('authorId', 'username avatar status')
  const shaped: any = populated.toObject()
  shaped.author = shaped.authorId
  res.status(201).json(shaped)
})

router.patch('/:id', async (req: AuthRequest, res) => {
  const { content } = req.body
  const msg = await Message.findOne({ _id: req.params.id, authorId: req.userId })
  if (!msg) return res.status(404).json({ error: 'Not found or unauthorized' })
  msg.content = content
  msg.edited = true
  msg.editedAt = new Date()
  await msg.save()
  res.json({ content: msg.content, editedAt: msg.editedAt })
})

router.delete('/:id', async (req: AuthRequest, res) => {
  const msg = await Message.findOneAndDelete({ _id: req.params.id, authorId: req.userId })
  if (!msg) return res.status(404).json({ error: 'Not found or unauthorized' })
  res.json({ ok: true })
})

router.get('/channels/:channelId/search', async (req: AuthRequest, res) => {
  const { q } = req.query as any
  if (!q) return res.json([])
  const messages = await Message.find({
    channelId: req.params.channelId,
    content: { $regex: q, $options: 'i' }
  }).limit(20).populate('authorId', 'username avatar').lean()
  const shaped = messages.map((m: any) => ({ ...m, author: m.authorId }))
  res.json(shaped)
})

export default router
EOF

cat > src/routes/invites.ts << 'EOF'
import { Router } from 'express'
import Server from '../models/Server'
import Member from '../models/Member'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

router.get('/:code', async (req, res) => {
  const server = await Server.findOne({ inviteCode: req.params.code })
  if (!server) return res.status(404).json({ error: 'Invalid invite code' })
  res.json({
    serverName: server.name,
    serverIcon: server.icon,
    memberCount: server.memberCount,
    inviteCode: server.inviteCode,
  })
})

router.post('/:code/join', requireAuth, async (req: AuthRequest, res) => {
  const server = await Server.findOne({ inviteCode: req.params.code })
  if (!server) return res.status(404).json({ error: 'Invalid invite code' })
  try {
    await Member.create({ serverId: server._id, userId: req.userId })
    await Server.findByIdAndUpdate(server._id, { $inc: { memberCount: 1 } })
    res.json({ serverId: server._id })
  } catch (e: any) {
    if (e.code === 11000) return res.status(400).json({ error: 'Already a member' })
    res.status(500).json({ error: 'Join failed' })
  }
})

export default router
EOF

cat > src/routes/users.ts << 'EOF'
import { Router } from 'express'
import User from '../models/User'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()
router.use(requireAuth)

router.get('/me', async (req: AuthRequest, res) => {
  const user = await User.findById(req.userId).select('-password')
  res.json(user)
})

router.patch('/me', async (req: AuthRequest, res) => {
  const { username, avatar, customStatus } = req.body
  const user = await User.findByIdAndUpdate(req.userId, { username, avatar, customStatus }, { new: true }).select('-password')
  res.json(user)
})

router.patch('/me/status', async (req: AuthRequest, res) => {
  const { status } = req.body
  const user = await User.findByIdAndUpdate(req.userId, { status }, { new: true }).select('-password')
  res.json(user)
})

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')
  if (!user) return res.status(404).json({ error: 'Not found' })
  res.json(user)
})

export default router
EOF

# ── Socket handlers ───────────────────────────────────────────────────────────
cat > src/socket/handlers.ts << 'EOF'
import { Server, Socket } from 'socket.io'
import jwt from 'jsonwebtoken'
import User from '../models/User'

export function setupSocket(io: Server) {
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) return next(new Error('Unauthorized'))
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET ?? 'secret') as any
      socket.data.userId = payload.userId
      next()
    } catch {
      next(new Error('Unauthorized'))
    }
  })

  io.on('connection', async (socket: Socket) => {
    const userId = socket.data.userId
    await User.findByIdAndUpdate(userId, { status: 'online' })

    socket.on('channel:join', (channelId: string) => {
      socket.join(`channel_${channelId}`)
    })
    socket.on('channel:leave', (channelId: string) => {
      socket.leave(`channel_${channelId}`)
    })
    socket.on('server:join', (serverId: string) => {
      socket.join(`server_${serverId}`)
      io.to(`server_${serverId}`).emit('presence:update', { userId, status: 'online' })
    })

    socket.on('message:send', ({ channelId, messageId }: any) => {
      socket.to(`channel_${channelId}`).emit('message:new', { messageId })
    })
    socket.on('message:edit', (payload: any) => {
      socket.to(`channel_${payload.channelId}`).emit('message:updated', payload)
    })
    socket.on('message:delete', (payload: any) => {
      socket.to(`channel_${payload.channelId}`).emit('message:deleted', payload)
    })

    socket.on('status:update', async ({ status }: any) => {
      await User.findByIdAndUpdate(userId, { status })
    })

    socket.on('voice:join', ({ channelId }: any) => {
      socket.join(`voice_${channelId}`)
      io.to(`voice_${channelId}`).emit('voice:user-joined', { userId, channelId })
    })
    socket.on('voice:leave', ({ channelId }: any) => {
      socket.leave(`voice_${channelId}`)
      io.to(`voice_${channelId}`).emit('voice:user-left', { userId, channelId })
    })
    socket.on('voice:signal', ({ targetUserId, signal }: any) => {
      io.to(`user_${targetUserId}`).emit('voice:signal', { fromUserId: userId, signal })
    })

    socket.join(`user_${userId}`)

    socket.on('disconnect', async () => {
      await User.findByIdAndUpdate(userId, { status: 'offline' })
      io.emit('presence:update', { userId, status: 'offline' })
    })
  })
}
EOF

# ── Seed script ───────────────────────────────────────────────────────────────
cat > src/seed.ts << 'EOF'
import mongoose from 'mongoose'
import 'dotenv/config'
import User from './models/User'
import Server from './models/Server'
import Channel from './models/Channel'
import Member from './models/Member'
import Message from './models/Message'

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/campfire')
  await Promise.all([User, Server, Channel, Member, Message].map((M) => M.deleteMany({})))

  const [u1, u2, u3] = await User.create([
    { username: 'admin', email: 'admin@campfire.dev', password: 'password123' },
    { username: 'alice', email: 'alice@campfire.dev', password: 'password123' },
    { username: 'bob',   email: 'bob@campfire.dev',   password: 'password123' },
  ])

  const [s1, s2] = await Server.create([
    { name: 'Campfire HQ', description: 'Main server', ownerId: u1._id, inviteCode: 'CAMP1234', memberCount: 3 },
    { name: 'Dev Zone',    description: 'Dev stuff',   ownerId: u2._id, inviteCode: 'DEV56789', memberCount: 2 },
  ])

  const [general, random, vc1, vc2] = await Channel.create([
    { serverId: s1._id, name: 'general', type: 'text',  position: 0 },
    { serverId: s1._id, name: 'random',  type: 'text',  position: 1 },
    { serverId: s1._id, name: 'voice-1', type: 'voice', position: 2 },
    { serverId: s1._id, name: 'music',   type: 'voice', position: 3 },
    { serverId: s2._id, name: 'coding',  type: 'text',  position: 0 },
    { serverId: s2._id, name: 'lounge',  type: 'voice', position: 1 },
  ])

  await Member.create([
    { serverId: s1._id, userId: u1._id },
    { serverId: s1._id, userId: u2._id },
    { serverId: s1._id, userId: u3._id },
    { serverId: s2._id, userId: u2._id },
  ])

  const msgs = [
    'Welcome to Campfire! 🔥',
    'This is the real-time chat system.',
    'Try sending a message below!',
    'You can edit or delete your own messages.',
    'Voice channels are on the left too.',
    'This is seeded data from the seed script.',
    'Good luck in the competition! 🚀',
  ]
  const authors = [u1, u2, u3]
  await Message.create(
    msgs.map((content, i) => ({
      channelId: general._id,
      authorId: authors[i % 3]._id,
      content,
    }))
  )

  console.log('Seeded successfully!')
  console.log('Test accounts: admin/alice/bob — password: password123')
  console.log('Invite codes: CAMP1234, DEV56789')
  await mongoose.disconnect()
}

seed().catch(console.error)
EOF

bun install
cd ..

# ─── Git branches ─────────────────────────────────────────────────────────────
echo "==> Setting up git branches..."
cp .env.example .env
git add .
git commit -m "feat: initial monorepo scaffold — client + server"
git checkout -b dev
git push -u origin main
git push -u origin dev
git checkout -b feat/person-a && git push -u origin feat/person-a && git checkout dev
git checkout -b feat/person-b && git push -u origin feat/person-b && git checkout dev
git checkout -b feat/person-c && git push -u origin feat/person-c && git checkout dev
git checkout dev

echo ""
echo "=============================="
echo " Campfire scaffold complete!"
echo "=============================="
echo ""
echo "Branches created: main | dev | feat/person-a | feat/person-b | feat/person-c"
echo ""
echo "Next steps:"
echo "  1. Edit server/.env with your MongoDB URI"
echo "  2. bun run dev          (from root — starts both)"
echo "  3. cd server && bun seed (seed test data)"
echo ""
echo "Test logins: admin@campfire.dev / password123"
echo "             alice@campfire.dev / password123"
echo "             bob@campfire.dev   / password123"
echo ""
echo "Invite codes: CAMP1234  DEV56789"
