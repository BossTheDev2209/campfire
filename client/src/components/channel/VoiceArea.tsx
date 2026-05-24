import { useState, useEffect } from 'react'
import { Channel } from '@/types'
import { useAppStore } from '@/store/appStore'
import { useUIStore } from '@/store/uiStore'

interface Props {
  channel: Channel
}

export default function VoiceArea({ channel }: Props) {
  const user = useAppStore((s) => s.user)
  const members = useAppStore((s) => s.members)

  const isMicMuted = useUIStore((s) => s.isMicMuted)
  const isDeafened = useUIStore((s) => s.isDeafened)
  const isCameraOn = useUIStore((s) => s.isCameraOn)
  const isScreenSharing = useUIStore((s) => s.isScreenSharing)

  const setMicMuted = useUIStore((s) => s.setMicMuted)
  const setDeafened = useUIStore((s) => s.setDeafened)
  const setCameraOn = useUIStore((s) => s.setCameraOn)
  const setScreenSharing = useUIStore((s) => s.setScreenSharing)
  const setConnectedVoiceChannelId = useUIStore((s) => s.setConnectedVoiceChannelId)

  const setMobileSidebarOpen = useUIStore((s) => s.setMobileSidebarOpen)

  // Simulation of speaking states
  const [speakers, setSpeakers] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Randomly toggle speaking status of other participants for realistic effect
    const interval = setInterval(() => {
      const activeSpeakers: Record<string, boolean> = {}
      
      // Make ourselves speak if we aren't muted
      if (!isMicMuted) {
        activeSpeakers['self'] = Math.random() > 0.4
      }

      // Toggle others
      members.forEach((m) => {
        const u = m.userId as any
        if (u && Math.random() > 0.6) {
          activeSpeakers[u._id] = true
        }
      })
      setSpeakers(activeSpeakers)
    }, 2500)

    return () => clearInterval(interval)
  }, [members, isMicMuted])

  const handleDisconnect = () => {
    setConnectedVoiceChannelId(null)
  }

  // Get other members
  const otherParticipants = members
    .map((m) => m.userId as any)
    .filter((u) => u && u._id !== user?._id)
    .slice(0, 5) // Display up to 5 other members

  return (
    <div className="flex-1 bg-claude-surfaceDark text-claude-onDark flex flex-col overflow-hidden relative">
      {/* Header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-claude-surfaceDarkElevated shrink-0 min-w-0 z-10 bg-claude-surfaceDark">
        <div className="flex items-center min-w-0 gap-2">
          {/* Hamburger button for mobile */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="md:hidden p-1.5 rounded-claudeSm text-claude-onDarkSoft hover:text-claude-onDark hover:bg-claude-surfaceDarkSoft transition-colors flex shrink-0 -ml-1"
            title="Open sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <span className="text-claude-primary text-lg">🔊</span>
          <span className="font-semibold text-sm truncate">{channel.name}</span>

          <span className="text-xs text-claude-accentTeal bg-claude-accentTeal/10 px-2 py-0.5 rounded-claudePill font-medium">
            Voice Connected
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-claude-onDarkSoft">
            {otherParticipants.length + 1} connected
          </span>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center min-h-0 bg-claude-surfaceDarkSoft">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl max-h-full aspect-video">
          
          {/* Self Participant Card */}
          <div className={`relative rounded-claudeLg bg-claude-surfaceDarkElevated overflow-hidden border-2 flex flex-col items-center justify-center p-6 aspect-video transition-all shadow-lg ${
            speakers['self'] && !isMicMuted
              ? 'border-claude-success shadow-[0_0_12px_rgba(93,184,114,0.2)] scale-[1.01]' 
              : 'border-claude-surfaceDarkSoft'
          }`}>
            {isCameraOn ? (
              <div className="absolute inset-0 bg-gradient-to-tr from-claude-primary/30 to-claude-accentTeal/30 flex items-center justify-center">
                <span className="text-sm font-medium bg-black/40 px-3 py-1 rounded-claudePill text-white backdrop-blur-sm animate-pulse">
                  Your Camera Stream Active
                </span>
              </div>
            ) : (
              <div className="relative">
                <div className={`w-20 h-20 rounded-full bg-claude-primary text-white flex items-center justify-center text-3xl font-bold shadow-md transition-all ${
                  speakers['self'] && !isMicMuted ? 'ring-4 ring-claude-success' : ''
                }`}>
                  {user?.username?.charAt(0).toUpperCase() ?? 'U'}
                </div>
                {isMicMuted && (
                  <span className="absolute -bottom-1 -right-1 w-7 h-7 bg-claude-error border-2 border-claude-surfaceDarkElevated rounded-full flex items-center justify-center text-white text-xs">
                    🎤
                  </span>
                )}
              </div>
            )}
            
            <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-1 rounded-claudeMd text-xs font-medium text-white flex items-center gap-2">
              <span className="truncate max-w-[100px]">{user?.username} (You)</span>
              {speakers['self'] && !isMicMuted && (
                <span className="w-2 h-2 rounded-full bg-claude-success animate-ping" />
              )}
            </div>
            {isScreenSharing && (
              <span className="absolute top-3 right-3 bg-claude-primary text-white text-[10px] px-2 py-0.5 rounded-claudePill uppercase tracking-wider font-bold">
                Screen Sharing
              </span>
            )}
          </div>

          {/* Other Participants Cards */}
          {otherParticipants.map((u, i) => {
            const isSpeaking = !!speakers[u._id]
            // Mock random camera states for other participants
            const hasMockCamera = i === 1
            const isMockMuted = i === 2
            
            return (
              <div 
                key={u._id} 
                className={`relative rounded-claudeLg bg-claude-surfaceDarkElevated overflow-hidden border-2 flex flex-col items-center justify-center p-6 aspect-video transition-all shadow-lg ${
                  isSpeaking ? 'border-claude-success shadow-[0_0_12px_rgba(93,184,114,0.2)] scale-[1.01]' : 'border-claude-surfaceDarkSoft'
                }`}
              >
                {hasMockCamera ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-claude-accentAmber/20 to-claude-accentTeal/20 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-claude-surfaceDarkSoft flex items-center justify-center text-xl font-bold border border-claude-surfaceDarkElevated">
                      {u.username.charAt(0).toUpperCase()}
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className={`w-20 h-20 rounded-full bg-claude-surfaceDarkSoft text-claude-onDark flex items-center justify-center text-2xl font-bold border-2 border-claude-surfaceDarkElevated transition-all ${
                      isSpeaking ? 'ring-4 ring-claude-success' : ''
                    }`}>
                      {u.username.charAt(0).toUpperCase()}
                    </div>
                    {isMockMuted && (
                      <span className="absolute -bottom-1 -right-1 w-7 h-7 bg-claude-error border-2 border-claude-surfaceDarkElevated rounded-full flex items-center justify-center text-white text-xs">
                        🎤
                      </span>
                    )}
                  </div>
                )}
                
                <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-1 rounded-claudeMd text-xs font-medium text-white flex items-center gap-2">
                  <span className="truncate max-w-[120px]">{u.username}</span>
                  {isSpeaking && (
                    <span className="w-2 h-2 rounded-full bg-claude-success animate-ping" />
                  )}
                </div>
              </div>
            )
          })}

          {/* Add a beautiful empty state if no one else is here */}
          {otherParticipants.length === 0 && (
            <div className="border border-dashed border-claude-onDarkSoft/20 rounded-claudeLg flex flex-col items-center justify-center p-6 aspect-video text-center">
              <span className="text-2xl mb-2">👋</span>
              <p className="text-sm font-medium text-claude-onDark">You are the first one here</p>
              <p className="text-xs text-claude-onDarkSoft mt-1">Invite friends to join this channel</p>
            </div>
          )}
        </div>
      </div>

      {/* Control Action Panel */}
      <div className="h-20 bg-claude-surfaceDark border-t border-claude-surfaceDarkElevated flex items-center justify-center gap-4 px-6 shrink-0 z-10">
        {/* Toggle Video */}
        <button
          onClick={() => setCameraOn(!isCameraOn)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isCameraOn 
              ? 'bg-claude-accentTeal text-white hover:bg-claude-accentTeal/80' 
              : 'bg-claude-surfaceDarkElevated text-claude-onDarkSoft hover:text-claude-onDark hover:bg-claude-surfaceDarkSoft'
          }`}
          title={isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
        >
          {isCameraOn ? '📹' : '🎥'}
        </button>

        {/* Toggle Mic */}
        <button
          onClick={() => setMicMuted(!isMicMuted)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isMicMuted 
              ? 'bg-claude-error text-white hover:bg-claude-error/80' 
              : 'bg-claude-surfaceDarkElevated text-claude-onDarkSoft hover:text-claude-onDark hover:bg-claude-surfaceDarkSoft'
          }`}
          title={isMicMuted ? "Unmute Mic" : "Mute Mic"}
        >
          {isMicMuted ? '🔇' : '🎙️'}
        </button>

        {/* Toggle Deafen */}
        <button
          onClick={() => setDeafened(!isDeafened)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isDeafened 
              ? 'bg-claude-error text-white hover:bg-claude-error/80' 
              : 'bg-claude-surfaceDarkElevated text-claude-onDarkSoft hover:text-claude-onDark hover:bg-claude-surfaceDarkSoft'
          }`}
          title={isDeafened ? "Undeafen" : "Deafen"}
        >
          {isDeafened ? '🔇' : '🎧'}
        </button>

        {/* Share Screen */}
        <button
          onClick={() => setScreenSharing(!isScreenSharing)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isScreenSharing 
              ? 'bg-claude-primary text-white hover:bg-claude-primaryActive' 
              : 'bg-claude-surfaceDarkElevated text-claude-onDarkSoft hover:text-claude-onDark hover:bg-claude-surfaceDarkSoft'
          }`}
          title={isScreenSharing ? "Stop Sharing" : "Share Screen"}
        >
          🖥️
        </button>

        {/* Disconnect */}
        <button
          onClick={handleDisconnect}
          className="w-12 h-12 rounded-full bg-claude-error text-white flex items-center justify-center hover:bg-claude-error/80 transition-all font-bold text-lg"
          title="Disconnect Call"
        >
          ❌
        </button>
      </div>
    </div>
  )
}
