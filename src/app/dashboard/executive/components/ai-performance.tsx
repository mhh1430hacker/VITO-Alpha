'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Cpu, Database, Play, Layers } from 'lucide-react'
import { dashboardData } from '@/lib/demo-data'

function AnimatedCounter({ value, label, suffix }: { value: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const duration = 1200
    const step = Math.max(1, Math.floor(value / 30))
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

  return (
    <div className="text-center">
      <p className="text-2xl font-bold tracking-tight">{count.toLocaleString()}{suffix}</p>
      <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">{label}</p>
    </div>
  )
}

function GaugeBar({ value, label, color, secondary }: { value: number; label: string; color: string; secondary?: { label: string; value: number } }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={cn('text-xs font-bold', color)}>{value}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <motion.div
          className={cn('h-2 rounded-full', color.replace('text-', 'bg-').replace('600', '500'))}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      {secondary && (
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs text-muted-foreground">{secondary.label}</span>
          <span className={cn('text-xs font-bold', color)}>{secondary.value}%</span>
        </div>
      )}
    </div>
  )
}

export function AiPerformance() {
  const { predictions, gpu } = dashboardData
  const gpuColor = gpu.utilization > 80 ? 'text-red-500' : gpu.utilization > 60 ? 'text-amber-500' : 'text-emerald-500'
  const memColor = gpu.memory > 80 ? 'text-red-500' : gpu.memory > 60 ? 'text-amber-500' : 'text-emerald-500'

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <AnimatedCounter value={predictions.today} label="Predictions" />
        <AnimatedCounter value={predictions.accuracy} label="Accuracy" suffix="%" />
        <AnimatedCounter value={predictions.total / 1000000} label="Total (M)" />
      </div>
      <div className="space-y-3 pt-1">
        <div className="flex items-center gap-3">
          <Cpu className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex-1">
            <GaugeBar value={gpu.utilization} label="GPU Utilization" color={gpuColor} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Database className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex-1">
            <GaugeBar value={gpu.memory} label="GPU Memory" color={memColor} secondary={{ label: 'Active Jobs', value: gpu.activeJobs }} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Layers className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex-1">
            <GaugeBar value={gpu.activeJobs * 25} label="Queue Depth" color="text-violet-500" />
          </div>
        </div>
      </div>
    </div>
  )
}
