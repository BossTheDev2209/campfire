import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@/api'
import { useAuthStore } from '@/store/authStore'

export default function LoginForm() {
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
      const { data } = await api.post('/auth/login', { email, password })
      setAuth(data.token, data.user)
      navigate('/app')
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      {error && <p className="rounded-notionMd bg-red-50 px-3 py-2 text-notion-error text-sm border border-red-100">{error}</p>}
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-notion-stone uppercase tracking-wide">Email</span>
        <input value={email} onChange={(e) => setEmail(e.target.value)}
          type="email" required autoComplete="email"
          className="h-11 bg-notion-canvas text-notion-ink rounded-notionMd px-3 outline-none border border-notion-hairlineStrong focus:border-notion-primary focus:ring-2 focus:ring-notion-primary/10 text-sm" />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-notion-stone uppercase tracking-wide">Password</span>
        <input value={password} onChange={(e) => setPassword(e.target.value)}
          type="password" required autoComplete="current-password"
          className="h-11 bg-notion-canvas text-notion-ink rounded-notionMd px-3 outline-none border border-notion-hairlineStrong focus:border-notion-primary focus:ring-2 focus:ring-notion-primary/10 text-sm" />
      </label>
      <button type="submit" disabled={loading}
        className="h-11 bg-notion-primary hover:bg-notion-primaryPressed disabled:bg-notion-hairline disabled:text-notion-muted text-white rounded-notionMd px-4 text-sm font-medium transition-colors mt-2">
        {loading ? 'Signing in...' : 'Log In'}
      </button>
    </form>
  )
}
