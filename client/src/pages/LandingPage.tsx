import { useState } from 'react'
import LoginForm from '@/components/auth/LoginForm'
import RegisterForm from '@/components/auth/RegisterForm'

export default function LandingPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  return (
    <div className="min-h-screen bg-claude-canvas text-claude-ink flex items-center justify-center px-4 font-claudeSans">
      <div className="w-full max-w-md rounded-claudeLg bg-claude-surfaceCard border border-claude-hairline p-8">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-claudeLg bg-claude-primary text-claude-onPrimary font-claudeDisplay text-2xl">
          C
        </div>
        <h1 className="font-claudeDisplay text-4xl font-medium tracking-[-0.02em] text-claude-ink text-center mb-2">
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h1>
        <p className="text-claude-muted text-center mb-6 text-sm">
          {mode === 'login' ? 'Sign in to continue to Campfire.' : 'Create a workspace-ready account.'}
        </p>
        {mode === 'login' ? <LoginForm /> : <RegisterForm />}
        <p className="text-claude-muted text-sm mt-4">
          {mode === 'login' ? (
            <>Need an account?{' '}
              <button onClick={() => setMode('register')} className="text-claude-primary font-medium hover:underline">
                Register
              </button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button onClick={() => setMode('login')} className="text-claude-primary font-medium hover:underline">
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
