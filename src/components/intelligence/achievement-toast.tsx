'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Achievement } from '@/lib/intelligence/types'

interface Props {
  achievement: Achievement | null
  onDismiss: () => void
}

export function AchievementToast({ achievement, onDismiss }: Props) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (achievement) {
      setShow(true)
      const timer = setTimeout(() => {
        setShow(false)
        setTimeout(onDismiss, 500)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [achievement, onDismiss])

  const rarityColors: Record<string, string> = {
    common: 'from-zinc-500/20 to-zinc-600/20 border-zinc-500/30',
    rare: 'from-green-500/20 to-emerald-600/20 border-green-500/30',
    epic: 'from-violet-500/20 to-purple-600/20 border-violet-500/30',
    legendary: 'from-amber-500/20 to-orange-600/20 border-amber-500/30',
  }

  const rarityGlow: Record<string, string> = {
    common: 'shadow-zinc-500/10',
    rare: 'shadow-green-500/20',
    epic: 'shadow-violet-500/25',
    legendary: 'shadow-amber-500/40',
  }

  return (
    <AnimatePresence>
      {show && achievement && (
        <motion.div
          initial={{ opacity: 0, y: 40, x: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-4 rounded-2xl border px-5 py-4 backdrop-blur-xl ${rarityColors[achievement.rarity]} ${rarityGlow[achievement.rarity]} shadow-2xl max-w-sm`}
          style={{ background: 'rgba(23,28,36,0.95)' }}
        >
          <motion.span
            initial={{ rotate: -20, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
            className="text-3xl"
          >
            {achievement.icon}
          </motion.span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Achievement Unlocked
            </p>
            <p className="text-sm font-semibold text-white truncate">
              {achievement.title}
            </p>
            <p className="text-xs text-white/60 line-clamp-1">
              {achievement.description}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${
                achievement.rarity === 'legendary' ? 'text-amber-400' :
                achievement.rarity === 'epic' ? 'text-violet-400' :
                achievement.rarity === 'rare' ? 'text-green-400' :
                'text-zinc-400'
              }`}>
                {achievement.rarity}
              </span>
              <span className="text-[10px] text-white/40">+{achievement.points} XP</span>
            </div>
          </div>
          <button
            onClick={() => { setShow(false); setTimeout(onDismiss, 500) }}
            className="text-white/30 hover:text-white/70 transition-colors text-sm"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
