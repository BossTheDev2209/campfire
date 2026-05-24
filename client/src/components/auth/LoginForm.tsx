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
