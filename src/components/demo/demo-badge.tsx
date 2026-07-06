'use client'

import { useDemoStore } from '@/lib/store'

export function DemoBadge() {
  const { isDemoMode } = useDemoStore()

  if (!isDemoMode) return null

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-500 animate-pulse-soft"
      title="Viewing demo data. Changes won't be saved."
    >
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      DEMO
    </span>
  )
}
