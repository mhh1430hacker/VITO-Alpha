'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string
  trend?: string
  trendValue?: string
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  sparklineData?: number[]
  className?: string
}

function MiniSparkline({ data }: { data: number[] }) {
  if (!data || data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const w = 60
  const h = 24
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        className="text-violet-400"
      />
    </svg>
  )
}

const TrendIcon = ({ trend }: { trend?: string }) => {
  if (trend === 'up') return <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
  if (trend === 'down') return <TrendingDown className="h-3.5 w-3.5 text-red-500" />
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />
}

export function MetricCard({
  label, value, trend, trendValue, icon: Icon, iconColor = 'text-violet-600', iconBg = 'bg-violet-100', sparklineData, className
}: MetricCardProps) {
  return (
    <div className={cn('rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {(trend || trendValue) && (
            <div className="flex items-center gap-1.5">
              <TrendIcon trend={trend} />
              {trendValue && (
                <span className={cn(
                  'text-xs font-medium',
                  trend === 'up' && 'text-emerald-600',
                  trend === 'down' && 'text-red-600',
                  trend === 'stable' && 'text-muted-foreground'
                )}>
                  {trendValue}
                </span>
              )}
            </div>
          )}
        </div>
        <div className={cn('flex items-center gap-2', iconBg ? '' : '')}>
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', iconBg)}>
            <Icon className={cn('h-5 w-5', iconColor)} />
          </div>
          {sparklineData && <MiniSparkline data={sparklineData} />}
        </div>
      </div>
    </div>
  )
}
