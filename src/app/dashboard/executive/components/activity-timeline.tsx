'use client'

import { cn } from '@/lib/utils'
import { dashboardData } from '@/lib/demo-data'
import {
  Beaker, CheckCircle2, Brain, Cpu, Edit3, FileText, AlertTriangle,
  Package, ShieldCheck, Lightbulb, type LucideIcon
} from 'lucide-react'

const typeConfig: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
  formula: { icon: Beaker, color: 'text-violet-600', bg: 'bg-violet-100' },
  approval: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  prediction: { icon: Brain, color: 'text-amber-600', bg: 'bg-amber-100' },
  system: { icon: Cpu, color: 'text-blue-600', bg: 'bg-blue-100' },
  review: { icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  alert: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
  material: { icon: Package, color: 'text-teal-600', bg: 'bg-teal-100' },
  report: { icon: Edit3, color: 'text-sky-600', bg: 'bg-sky-100' },
  compliance: { icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-100' },
}

function getConfig(type: string) {
  return typeConfig[type] || { icon: Lightbulb, color: 'text-muted-foreground', bg: 'bg-muted' }
}

export function ActivityTimeline() {
  const items = dashboardData.activities

  return (
    <div className="relative">
      <div className="absolute left-[17px] top-2 bottom-2 w-px bg-border" />
      <div className="space-y-0">
        {items.map((item) => {
          const cfg = getConfig(item.type)
          const Icon = cfg.icon
          return (
            <div key={item.id} className="flex gap-3 pb-3 last:pb-0">
              <div className={cn('relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full', cfg.bg)}>
                <Icon className={cn('h-4 w-4', cfg.color)} />
              </div>
              <div className="flex-1 min-w-0 pt-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{item.user}</span>
                  <span className="text-xs text-muted-foreground">{item.action}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-medium text-foreground/80">{item.target}</span>
                  <span className="text-[10px] text-muted-foreground">&middot; {item.timestamp}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
