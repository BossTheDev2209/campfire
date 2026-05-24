import { create } from 'zustand'

interface UIState {
  isMobileSidebarOpen: boolean
  connectedVoiceChannelId: string | null
  isMicMuted: boolean
  isDeafened: boolean
  isCameraOn: boolean
  isScreenSharing: boolean

  setMobileSidebarOpen: (val: boolean) => void
  setConnectedVoiceChannelId: (id: string | null) => void
  setMicMuted: (val: boolean) => void
  setDeafened: (val: boolean) => void
  setCameraOn: (val: boolean) => void
  setScreenSharing: (val: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  isMobileSidebarOpen: false,
  connectedVoiceChannelId: null,
  isMicMuted: false,
  isDeafened: false,
  isCameraOn: false,
  isScreenSharing: false,

  setMobileSidebarOpen: (isMobileSidebarOpen) => set({ isMobileSidebarOpen }),
  setConnectedVoiceChannelId: (connectedVoiceChannelId) => set({ connectedVoiceChannelId }),
  setMicMuted: (isMicMuted) => set({ isMicMuted }),
  setDeafened: (isDeafened) => set({ isDeafened }),
  setCameraOn: (isCameraOn) => set({ isCameraOn }),
  setScreenSharing: (isScreenSharing) => set({ isScreenSharing }),
}))
