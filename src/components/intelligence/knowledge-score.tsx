'use client'

import { motion } from 'framer-motion'

interface Props {
  score: number
  level: { label: string; color: string; nextAt: number }
  className?: string
}

export function KnowledgeScore({ score, level, className = '' }: Props) {
  const progressToNext = Math.min(score / level.nextAt, 1)
  const circumference = 2 * Math.PI * 32
  const strokeDashoffset = circumference * (1 - progressToNext)

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-16 h-16 flex-shrink-0">
        <svg width="64" height="64" viewBox="0 0 72 72" className="transform -rotate-90">
          <circle cx="36" cy="36" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
          {level.nextAt < Infinity && (
            <motion.circle
              cx="36" cy="36" r="32"
              fill="none"
              stroke={level.color}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1 }}
            />
          )}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            key={score}
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-sm font-bold text-white"
          >
            {score}
          </motion.span>
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/40">Knowledge Score</p>
        <p className="text-base font-bold text-white">{level.label}</p>
        {level.nextAt < Infinity && (
          <p className="text-[10px] text-white/40">{score}/{level.nextAt} → {level.label}</p>
        )}
      </div>
    </div>
  )
}
