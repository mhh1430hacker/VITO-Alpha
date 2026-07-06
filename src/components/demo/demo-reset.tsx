'use client'

import { useState } from 'react'
import { useDemoStore } from '@/lib/store'

export function DemoReset() {
  const { resetDemo } = useDemoStore()
  const [showConfirm, setShowConfirm] = useState(false)
  const [resetDone, setResetDone] = useState(false)

  const handleReset = () => {
    resetDemo()
    setShowConfirm(false)
    setResetDone(true)
    setTimeout(() => setResetDone(false), 2500)
  }

  return (
    <div className="px-3 py-2">
      {resetDone && (
        <p className="mb-2 text-xs text-emerald-500 animate-slide-up">Demo data has been reset</p>
      )}
      {showConfirm ? (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">This will reset all demo data to its original state.</p>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="inline-flex h-7 items-center justify-center rounded-md bg-destructive px-3 text-xs font-medium text-destructive-foreground hover:bg-destructive/90"
            >
              Confirm Reset
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="inline-flex h-7 items-center justify-center rounded-md border px-3 text-xs font-medium hover:bg-accent"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowConfirm(true)}
          className="inline-flex h-7 w-full items-center justify-center rounded-md border border-destructive/30 text-xs font-medium text-destructive hover:bg-destructive/10"
        >
          Reset Demo
        </button>
      )}
    </div>
  )
}
