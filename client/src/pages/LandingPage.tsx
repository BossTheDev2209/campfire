import { useState } from 'react'
import LoginForm from '@/components/auth/LoginForm'
import RegisterForm from '@/components/auth/RegisterForm'

export default function LandingPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  return (
    <div className="min-h-screen bg-notion-surface flex items-center justify-center px-4 font-notion">
      <div className="w-full max-w-md bg-notion-canvas rounded-notionLg p-8 border border-notion-hairline shadow-[rgba(15,15,15,0.08)_0px_16px_40px_-16px]">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-notionLg bg-notion-primary text-white font-semibold">
          C
        </div>
        <h1 className="text-2xl font-semibold text-notion-ink text-center mb-2">
          {mode === 'login' ? 'Welcome back!' : 'Create an account'}
        </h1>
        <p className="text-notion-slate text-center mb-6 text-sm">
          {mode === 'login' ? 'Sign in to continue to Campfire.' : 'Create a workspace-ready account.'}
        </p>
        {mode === 'login' ? <LoginForm /> : <RegisterForm />}
        <p className="text-notion-slate text-sm mt-4">
          {mode === 'login' ? (
            <>Need an account?{' '}
              <button onClick={() => setMode('register')} className="text-notion-primary font-medium hover:underline">
                Register
              </button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button onClick={() => setMode('login')} className="text-notion-primary font-medium hover:underline">
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
