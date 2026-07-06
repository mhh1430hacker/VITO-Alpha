'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  ShieldCheck, TrendingUp, AlertTriangle, Sparkles, Layers,
  ArrowUpRight, ArrowDownRight, Minus,
} from 'lucide-react'

interface Driver {
  name: string
  contribution: number
  direction: 'positive' | 'negative' | 'neutral'
  description: string
}

interface ImpactEstimate {
  metric: string
  currentValue: number | string
  predictedValue: number | string
  unit: string
  improvement: number
}

interface AIEvidence {
  confidence: number
  primaryDrivers: Driver[]
  impacts: ImpactEstimate[]
  reasoning: string
  dataPoints: number
  modelVersion: string
}

interface AIInsightCardProps {
  title: string
  subtitle?: string
  evidence: AIEvidence
  variant?: 'default' | 'compact' | 'expanded'
  className?: string
}

export function AIInsightCard({ title, subtitle, evidence, variant = 'default', className }: AIInsightCardProps) {
  const confidenceLevel = evidence.confidence >= 90 ? 'very-high' :
    evidence.confidence >= 80 ? 'high' :
    evidence.confidence >= 65 ? 'moderate' :
    evidence.confidence >= 50 ? 'low' : 'speculative'

  const confidenceColor = {
    'very-high': 'emerald',
    'high': 'green',
    'moderate': 'amber',
    'low': 'orange',
    'speculative': 'red',
  }[confidenceLevel]

  const confidenceLabel = {
    'very-high': 'Very High Confidence',
    'high': 'High Confidence',
    'moderate': 'Moderate Confidence',
    'low': 'Low Confidence',
    'speculative': 'Speculative',
  }[confidenceLevel]

  if (variant === 'compact') {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className={cn('rounded-xl border border-violet-500/10 bg-gradient-to-br from-[#171C24] to-violet-500/5 p-4', className)}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span className="text-[13px] font-semibold text-foreground">{title}</span>
          </div>
          <ConfidenceBadge confidence={evidence.confidence} />
        </div>
        {subtitle && <p className="text-[11px] text-muted-foreground/50 mb-2">{subtitle}</p>}
        <p className="text-[12px] text-muted-foreground/70 leading-relaxed">{evidence.reasoning}</p>
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/40">
          <span className="text-[10px] text-muted-foreground/30">{evidence.dataPoints.toLocaleString()} data points</span>
          <span className="text-[10px] text-muted-foreground/30">{evidence.modelVersion}</span>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className={cn('rounded-2xl border border-violet-500/15 bg-gradient-to-br from-[#171C24] via-[#171C24] to-violet-500/[0.03] p-6 shadow-elevation-2', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-violet-500/10">
            <Sparkles className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-foreground">{title}</h3>
            {subtitle && <p className="text-[11px] text-muted-foreground/50">{subtitle}</p>}
          </div>
        </div>
        <ConfidenceBadge confidence={evidence.confidence} size="lg" />
      </div>

      {evidence.primaryDrivers.length > 0 && (
        <div className="mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/40 mb-2">Primary Drivers</p>
          <div className="space-y-2">
            {evidence.primaryDrivers.map((driver, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
                className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-border/40">
                <div className="flex items-center gap-2.5">
                  {driver.direction === 'positive' ? <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" /> :
                   driver.direction === 'negative' ? <ArrowDownRight className="h-3.5 w-3.5 text-rose-400" /> :
                   <Minus className="h-3.5 w-3.5 text-muted-foreground/40" />}
                  <div>
                    <p className="text-[13px] font-medium text-foreground/80">{driver.name}</p>
                    <p className="text-[11px] text-muted-foreground/40">{driver.description}</p>
                  </div>
                </div>
                <span className="text-[13px] font-semibold text-foreground/70 tabular-nums">{driver.contribution}%</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-2 h-1.5 bg-border/40 rounded-full overflow-hidden flex">
            {evidence.primaryDrivers.map((d, i) => (
              <motion.div key={i} initial={{ width: 0 }} animate={{ width: `${d.contribution}%` }} transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                className={`h-full ${i === 0 ? 'bg-violet-500/60 rounded-l-full' : i === 1 ? 'bg-violet-500/40' : 'bg-violet-500/20'}`} />
            ))}
          </div>
        </div>
      )}

      {evidence.impacts.length > 0 && (
        <div className="mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/40 mb-2">Predicted Impact</p>
          <div className="grid grid-cols-2 gap-2">
            {evidence.impacts.map((impact, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.08 }}
                className="p-3 rounded-xl bg-white/[0.02] border border-border/40">
                <p className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground/40 mb-1">{impact.metric}</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[13px] text-muted-foreground/40 line-through">{impact.currentValue}</span>
                  <span className="text-lg font-bold text-foreground">{impact.predictedValue}</span>
                  <span className="text-[11px] text-muted-foreground/40">{impact.unit}</span>
                </div>
                <span className={`text-[11px] font-medium ${impact.improvement > 0 ? 'text-emerald-400' : impact.improvement < 0 ? 'text-rose-400' : 'text-muted-foreground/50'}`}>
                  {impact.improvement > 0 ? '+' : ''}{impact.improvement}%
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 rounded-xl bg-white/[0.01] border border-border/40 mb-4">
        <div className="flex items-start gap-2.5">
          <Layers className="h-4 w-4 text-violet-400/60 shrink-0 mt-0.5" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/40 mb-1">Reasoning</p>
            <p className="text-[13px] text-muted-foreground/70 leading-relaxed">{evidence.reasoning}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-muted-foreground/30">
        <span>Based on {evidence.dataPoints.toLocaleString()} historical data points</span>
        <span>{evidence.modelVersion}</span>
      </div>
    </motion.div>
  )
}

export function ConfidenceBadge({ confidence, size = 'md' }: { confidence: number; size?: 'sm' | 'md' | 'lg' }) {
  const level = confidence >= 90 ? 'very-high' :
    confidence >= 80 ? 'high' :
    confidence >= 65 ? 'moderate' :
    confidence >= 50 ? 'low' : 'speculative'

  const colors: Record<string, string> = {
    'very-high': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'high': 'bg-green-500/10 text-green-400 border-green-500/20',
    'moderate': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'low': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    'speculative': 'bg-red-500/10 text-red-400 border-red-500/20',
  }

  return (
    <div className={cn(
      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1',
      colors[level],
      size === 'sm' && 'px-2 py-0.5 text-[10px]',
      size === 'lg' && 'px-3 py-1.5 text-[12px]',
      'text-[11px] font-medium'
    )}>
      <div className={cn('rounded-full animate-pulse-soft', size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2',
        level === 'very-high' ? 'bg-emerald-400' : level === 'high' ? 'bg-green-400' : level === 'moderate' ? 'bg-amber-400' : level === 'low' ? 'bg-orange-400' : 'bg-red-400'
      )} />
      {confidence}%
    </div>
  )
}

export type { Driver, ImpactEstimate, AIEvidence }