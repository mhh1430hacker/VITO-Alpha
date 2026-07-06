'use client'

import { useEffect } from 'react'
import { useDemoStore } from '@/lib/store'

export function DemoModeToggle() {
  const { isDemoMode, setDemoMode } = useDemoStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        setDemoMode(!isDemoMode)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDemoMode, setDemoMode])

  useEffect(() => {
    if (isDemoMode) {
      const timer = setTimeout(() => {
        setDemoMode(false)
      }, 4 * 60 * 60 * 1000)
      return () => clearTimeout(timer)
    }
  }, [isDemoMode, setDemoMode])

  return (
    <div className="flex items-center justify-between px-3 py-2">
      <div>
        <p className="text-sm font-medium">Demo Mode</p>
        <p className="text-xs text-muted-foreground">Populate with demo data</p>
      </div>
      <button
        onClick={() => setDemoMode(!isDemoMode)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${isDemoMode ? 'bg-amber-500' : 'bg-input'}`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${isDemoMode ? 'translate-x-[18px]' : 'translate-x-[2px]'}`}
        />
      </button>
    </div>
  )
}
