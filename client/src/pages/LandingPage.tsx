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
