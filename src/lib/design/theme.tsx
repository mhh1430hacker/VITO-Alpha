'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useEffect, useRef } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'
export type DensityMode = 'comfortable' | 'standard' | 'compact'

interface ThemeState {
  mode: ThemeMode
  density: DensityMode
  accent: string
  setMode: (mode: ThemeMode) => void
  setDensity: (density: DensityMode) => void
  setAccent: (accent: string) => void
}

function getSystemPreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(mode: ThemeMode): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  const resolved = mode === 'system' ? getSystemPreference() : mode
  const root = document.documentElement
  if (resolved === 'dark') {
    root.classList.add('dark')
    root.style.colorScheme = 'dark'
  } else {
    root.classList.remove('dark')
    root.style.colorScheme = 'light'
  }
  return resolved
}

function applyDensity(density: DensityMode) {
  if (typeof window === 'undefined') return
  document.documentElement.setAttribute('data-density', density)
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system' as ThemeMode,
      density: 'standard' as DensityMode,
      accent: 'violet',
      setMode: (mode) => {
        applyTheme(mode)
        set({ mode })
      },
      setDensity: (density) => {
        applyDensity(density)
        set({ density })
      },
      setAccent: (accent) => set({ accent }),
    }),
    {
      name: 'vito-theme',
      skipHydration: true,
    }
  )
)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const { mode, density } = useThemeStore.getState()
    applyTheme(mode)
    applyDensity(density)

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      const state = useThemeStore.getState()
      if (state.mode === 'system') {
        applyTheme('system')
      }
    }
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return <>{children}</>
}
