'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ShieldCheck, TrendingUp, Clock, AlertTriangle, Sparkles } from 'lucide-react'

interface ConfidenceIndicatorProps {
  confidence: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  showPercentage?: boolean
  className?: string
}

const tiers = [
  { min: 0.90, label: 'Very High', color: 'emerald', bgClass: 'bg-emerald-500', textClass: 'text-emerald-400', borderClass: 'border-emerald-500/30', Icon: ShieldCheck },
  { min: 0.80, label: 'High', color: 'green', bgClass: 'bg-green-500', textClass: 'text-green-400', borderClass: 'border-green-500/30', Icon: TrendingUp },
  { min: 0.65, label: 'Moderate', color: 'amber', bgClass: 'bg-amber-500', textClass: 'text-amber-400', borderClass: 'border-amber-500/30', Icon: Clock },
  { min: 0.50, label: 'Low', color: 'orange', bgClass: 'bg-orange-500', textClass: 'text-orange-400', borderClass: 'border-orange-500/30', Icon: AlertTriangle },
  { min: 0.00, label: 'Speculative', color: 'red', bgClass: 'bg-red-500', textClass: 'text-red-400', borderClass: 'border-red-500/30', Icon: Sparkles },
]

function getTier(confidence: number) {
  for (const tier of tiers) {
    if (confidence >= tier.min) return tier
  }
  return tiers[tiers.length - 1]
}

export function ConfidenceIndicator({
  confidence,
  size = 'md',
  showLabel = true,
  showPercentage = true,
  className,
}: ConfidenceIndicatorProps) {
  const tier = getTier(confidence)
  const Icon = tier.Icon

  const sizeConfig = {
    sm: { barWidth: 48, barHeight: 4, iconSize: 'h-3 w-3', textSize: 'text-[10px]', gap: 'gap-1.5' },
    md: { barWidth: 64, barHeight: 5, iconSize: 'h-3.5 w-3.5', textSize: 'text-[11px]', gap: 'gap-2' },
    lg: { barWidth: 80, barHeight: 6, iconSize: 'h-4 w-4', textSize: 'text-xs', gap: 'gap-2.5' },
  }

  const s = sizeConfig[size]

  return (
    <div className={cn('flex items-center', s.gap, className)}>
      <div className={cn('relative rounded-full bg-muted overflow-hidden', `h-[${s.barHeight}px]`)} style={{ width: s.barWidth, height: s.barHeight }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${confidence * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={cn('absolute inset-y-0 left-0 rounded-full', tier.bgClass)}
        />
      </div>
      <Icon className={cn(s.iconSize, tier.textClass)} />
      {showLabel && <span className={cn(s.textSize, 'font-medium', tier.textClass)}>{tier.label}</span>}
      {showPercentage && <span className={cn(s.textSize, 'text-muted-foreground tabular-nums')}>{Math.round(confidence * 100)}%</span>}
    </div>
  )
}

export function ConfidenceBadge({
  confidence,
  className,
}: {
  confidence: number
  className?: string
}) {
  const tier = getTier(confidence)
  const Icon = tier.Icon

  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium',
      tier.borderClass, tier.textClass, 'bg-background',
      className
    )}>
      <Icon className="h-3 w-3" />
      {tier.label}
    </span>
  )
}
