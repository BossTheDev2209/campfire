import { create } from 'zustand'

interface UIState {
  isMicMuted: boolean
  isDeafened: boolean
  isCameraOn: boolean
  isScreenSharing: boolean

  setMicMuted: (val: boolean) => void
  setDeafened: (val: boolean) => void
  setCameraOn: (val: boolean) => void
  setScreenSharing: (val: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  isMicMuted: false,
  isDeafened: false,
  isCameraOn: false,
  isScreenSharing: false,

  setMicMuted: (isMicMuted) => set({ isMicMuted }),
  setDeafened: (isDeafened) => set({ isDeafened }),
  setCameraOn: (isCameraOn) => set({ isCameraOn }),
  setScreenSharing: (isScreenSharing) => set({ isScreenSharing }),
}))
