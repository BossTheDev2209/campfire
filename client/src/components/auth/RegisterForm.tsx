import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@/api'
import { useAuthStore } from '@/store/authStore'

export default function RegisterForm() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', { username, email, password })
      setAuth(data.token, data.user)
      navigate('/app')
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      {error && <p className="rounded-claudeMd bg-claude-surfaceSoft px-3 py-2 text-claude-error text-sm border border-claude-hairline">{error}</p>}
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-claude-muted uppercase tracking-wide">Username</span>
        <input value={username} onChange={(e) => setUsername(e.target.value)}
          required minLength={2}
          className="h-10 w-full rounded-claudeMd border border-claude-hairline bg-claude-canvas px-3 text-sm text-claude-ink outline-none focus:border-claude-primary focus:ring-2 focus:ring-claude-primary/15" />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-claude-muted uppercase tracking-wide">Email</span>
        <input value={email} onChange={(e) => setEmail(e.target.value)}
          type="email" required
          className="h-10 w-full rounded-claudeMd border border-claude-hairline bg-claude-canvas px-3 text-sm text-claude-ink outline-none focus:border-claude-primary focus:ring-2 focus:ring-claude-primary/15" />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-claude-muted uppercase tracking-wide">Password</span>
        <input value={password} onChange={(e) => setPassword(e.target.value)}
          type="password" required minLength={6}
          className="h-10 w-full rounded-claudeMd border border-claude-hairline bg-claude-canvas px-3 text-sm text-claude-ink outline-none focus:border-claude-primary focus:ring-2 focus:ring-claude-primary/15" />
      </label>
      <button type="submit" disabled={loading}
        className="h-10 w-full rounded-claudeMd bg-claude-primary px-4 text-sm font-medium text-claude-onPrimary hover:bg-claude-primaryActive disabled:bg-claude-primaryDisabled disabled:text-claude-mutedSoft transition-colors mt-2">
        {loading ? 'Creating account...' : 'Continue'}
      </button>
    </form>
  )
}
