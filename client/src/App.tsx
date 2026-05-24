import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import LandingPage from '@/pages/LandingPage'
import AppPage from '@/pages/AppPage'
import InvitePage from '@/pages/InvitePage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token)
  return token ? <>{children}</> : <Navigate to="/" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/invite/:code" element={<PrivateRoute><InvitePage /></PrivateRoute>} />
      <Route path="/app" element={<PrivateRoute><AppPage /></PrivateRoute>} />
      <Route path="/app/:serverId" element={<PrivateRoute><AppPage /></PrivateRoute>} />
      <Route path="/app/:serverId/:channelId" element={<PrivateRoute><AppPage /></PrivateRoute>} />
    </Routes>
  )
}
