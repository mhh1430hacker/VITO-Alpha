'use client'

import { motion } from 'framer-motion'
import type { StreakState } from '@/lib/intelligence/types'

interface Props {
  streak: StreakState
  className?: string
}

export function StreakIndicator({ streak, className = '' }: Props) {
  const flameIntensity = Math.min(streak.current / 30, 1)

  return (
    <motion.div
      className={`flex items-center gap-2 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="relative">
        <motion.span
          className="text-xl"
          animate={{
            scale: streak.isActiveToday ? [1, 1.15, 1] : 1,
          }}
          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 3 }}
        >
          {streak.current >= 30 ? '🔥' : streak.current >= 7 ? '⚡' : streak.current >= 3 ? '🔥' : '🔥'}
        </motion.span>
      </div>
      <div>
        <motion.span
          className="text-sm font-bold text-white"
          key={streak.current}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {streak.current}
        </motion.span>
        <span className="text-xs text-white/40 ml-1">day streak</span>
        {streak.multiplier > 1 && (
          <span className="text-[10px] text-amber-400 ml-1.5 font-semibold">
            ×{streak.multiplier.toFixed(1)}
          </span>
        )}
      </div>
    </motion.div>
  )
}
