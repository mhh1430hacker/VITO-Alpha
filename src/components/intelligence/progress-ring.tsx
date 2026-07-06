'use client'

import { motion } from 'framer-motion'

interface Props {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  color?: string
  bgColor?: string
  label?: string
}

export function ProgressRing({
  value,
  max,
  size = 48,
  strokeWidth = 4,
  color = '#a855f7',
  bgColor = 'rgba(255,255,255,0.06)',
  label,
}: Props) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(value / max, 1)
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
            transition={{ duration: 1.2 }}
        />
      </svg>
      {label && (
        <span className="text-[10px] font-medium text-white/50">{label}</span>
      )}
    </div>
  )
}
