import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useThemeManager = create(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: (newTheme) => {
        set({ theme: newTheme })
      },
      toggleTheme: () =>
        set((state) => {
          const next = state.theme === 'light' ? 'dark' : 'light'
          return { theme: next }
        }),
    }),
    { name: 'theme' }
  )
)

