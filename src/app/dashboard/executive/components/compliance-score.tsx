'use client'

import { cn } from '@/lib/utils'
import { ShieldCheck, AlertTriangle, RefreshCw, Ban } from 'lucide-react'
import { dashboardData } from '@/lib/demo-data'

export function ComplianceScore() {
  const { score, ifraCompliance, pending, restrictedSubstitutions } = dashboardData.compliance

  const gaugeCircumference = 2 * Math.PI * 54
  const gaugeOffset = gaugeCircumference - (score / 100) * gaugeCircumference
  const scoreColor = score >= 90 ? 'stroke-emerald-500' : score >= 70 ? 'stroke-amber-500' : 'stroke-red-500'
  const scoreText = score >= 90 ? 'text-emerald-600' : score >= 70 ? 'text-amber-600' : 'text-red-600'

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6">
        <div className="relative shrink-0">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" className="stroke-muted" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="54"
              fill="none"
              className={cn('transition-all duration-1000 ease-out', scoreColor)}
              strokeWidth="8"
              strokeDasharray={gaugeCircumference}
              strokeDashoffset={gaugeOffset}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn('text-2xl font-bold', scoreText)}>{score}%</span>
            <span className="text-[10px] text-muted-foreground mt-0.5">overall</span>
          </div>
        </div>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-xs text-muted-foreground">IFRA</span>
            <span className="text-sm font-bold ml-auto">{ifraCompliance}%</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span className="text-xs text-muted-foreground">Pending</span>
            <span className="text-sm font-bold ml-auto">{pending}</span>
          </div>
          <div className="flex items-center gap-2">
            <Ban className="h-4 w-4 text-red-500" />
            <span className="text-xs text-muted-foreground">Restricted</span>
            <span className="text-sm font-bold ml-auto">{restrictedSubstitutions}</span>
          </div>
        </div>
      </div>
      <div className="pt-1 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Compliance score trend</span>
          <span className="font-medium text-emerald-600">+2.4% this quarter</span>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5">
          <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '62%' }} />
        </div>
      </div>
    </div>
  )
}
