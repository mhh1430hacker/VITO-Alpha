'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Beaker, Brain, Clock, BarChart3 } from 'lucide-react'
import { dashboardData } from '@/lib/demo-data'

function StatCard({ icon: Icon, value, label, color }: { icon: any; value: string | ReactNode; label: string; color: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
      <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', color.replace('text-', 'bg-').replace('600', '100'))}>
        <Icon className={cn('h-4.5 w-4.5', color)} />
      </div>
      <div>
        <div className="text-lg font-bold leading-none">{value}</div>
        <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">{label}</p>
      </div>
    </div>
  )
}

function AnimatedStat({ value, suffix }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const duration = 1000
    const step = Math.max(1, Math.floor(value / 25))
    const interval = setInterval(() => {
      start += step
      if (start >= value) {
        setCount(value)
        clearInterval(interval)
      } else {
        setCount(start)
      }
    }, duration / (value / step))
    return () => clearInterval(interval)
  }, [value])

  return <>{count.toLocaleString()}{suffix}</>
}

export function FormulaIntelligence() {
  const { formulaSuccess } = dashboardData

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <StatCard
          icon={Beaker}
          value={<AnimatedStat value={formulaSuccess.total} />}
          label="Total Formulas"
          color="text-violet-600"
        />
        <StatCard
          icon={Brain}
          value={<AnimatedStat value={formulaSuccess.aiGenerated} />}
          label="AI Generated"
          color="text-amber-600"
        />
        <StatCard
          icon={BarChart3}
          value={`${formulaSuccess.rate}%`}
          label="Success Rate"
          color="text-emerald-600"
        />
        <StatCard
          icon={Clock}
          value={`${formulaSuccess.avgTime} days`}
          label="Avg Dev Time"
          color="text-blue-600"
        />
      </div>
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">AI vs Manual success rate</span>
          <span className="font-medium text-emerald-600">+12% higher</span>
        </div>
        <div className="flex gap-1.5 h-3">
          <div className="relative flex-1 rounded-full bg-muted overflow-hidden">
            <div className="absolute inset-0 flex">
              <div className="bg-violet-500 h-full" style={{ width: `${(formulaSuccess.aiGenerated / formulaSuccess.total) * 100}%` }} />
              <div className="bg-amber-200 h-full flex-1" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-violet-500" /> AI ({Math.round((formulaSuccess.aiGenerated / formulaSuccess.total) * 100)}%)</span>
          <span className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-amber-200" /> Manual ({Math.round(((formulaSuccess.total - formulaSuccess.aiGenerated) / formulaSuccess.total) * 100)}%)</span>
        </div>
      </div>
    </div>
  )
}
