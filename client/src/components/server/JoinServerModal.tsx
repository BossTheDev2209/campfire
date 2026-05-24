import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {
  onClose: () => void
}

export default function JoinServerModal({ onClose }: Props) {
  const [code, setCode] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    
    // Extract the code if they pasted a full URL
    let finalCode = code.trim()
    if (finalCode.includes('/invite/')) {
      const parts = finalCode.split('/invite/')
      finalCode = parts[parts.length - 1]
    }
    
    navigate(`/invite/${finalCode}`)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 font-claudeSans px-4">
      <div className="w-full max-w-sm bg-claude-surfaceCard rounded-claudeLg border border-claude-hairline p-6 shadow-xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-claude-muted hover:text-claude-ink p-1 rounded-claudeSm transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h3 className="font-claudeDisplay text-2xl tracking-[-0.02em] text-claude-ink mb-2">Join a Server</h3>
        <p className="text-sm text-claude-muted mb-6">Enter an invite code below to join an existing server.</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter invite code..."
            autoFocus
            className="h-10 w-full rounded-claudeMd border border-claude-hairline bg-claude-canvas px-3 text-sm outline-none focus:border-claude-primary focus:ring-2 focus:ring-claude-primary/15 text-claude-ink placeholder-claude-muted" 
          />
          
          <div className="flex gap-3 justify-end mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-claudeMd border border-claude-hairline bg-claude-canvas text-claude-ink hover:bg-claude-surfaceSoft transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!code.trim()}
              className="px-4 py-2 text-sm font-medium rounded-claudeMd bg-claude-primary text-claude-onPrimary hover:bg-claude-primaryActive transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
