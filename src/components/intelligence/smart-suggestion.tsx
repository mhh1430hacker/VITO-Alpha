'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import type { Suggestion } from '@/lib/intelligence/types'

interface Props {
  suggestions: Suggestion[]
  onDismiss: (id: string) => void
}

const categoryIcons: Record<string, string> = {
  tip: '💡',
  discovery: '🔍',
  challenge: '🎯',
  shortcut: '⌨️',
  insight: '🧠',
}

const categoryColors: Record<string, string> = {
  tip: 'from-blue-500/10 to-cyan-500/5 border-blue-500/20',
  discovery: 'from-violet-500/10 to-purple-500/5 border-violet-500/20',
  challenge: 'from-amber-500/10 to-orange-500/5 border-amber-500/20',
  shortcut: 'from-emerald-500/10 to-green-500/5 border-emerald-500/20',
  insight: 'from-rose-500/10 to-pink-500/5 border-rose-500/20',
}

export function SmartSuggestion({ suggestions, onDismiss }: Props) {
  const router = useRouter()
  const [dismissed, setDismissed] = useState<string[]>([])

  if (suggestions.length === 0) return null

  const visible = suggestions.filter(s => !dismissed.includes(s.id))

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
          Intelligence
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
      </div>
      <AnimatePresence mode="popLayout">
        {visible.map((suggestion) => (
          <motion.div
            key={suggestion.id}
            layout
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95, height: 0, marginBottom: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className={`relative overflow-hidden rounded-xl border bg-gradient-to-r ${categoryColors[suggestion.category]} p-3.5 cursor-pointer group`}
            style={{ background: 'rgba(23,28,36,0.8)' }}
            onClick={() => {
              if (suggestion.href && suggestion.href !== '#') {
                router.push(suggestion.href)
              }
            }}
          >
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">{categoryIcons[suggestion.category]}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
                    {suggestion.category}
                  </span>
                </div>
                <p className="text-sm font-semibold text-white">{suggestion.title}</p>
                <p className="text-xs text-white/50 mt-0.5 line-clamp-2">
                  {suggestion.description}
                </p>
                <span className="inline-block mt-2 text-xs font-medium text-white/70 group-hover:text-white transition-colors">
                  {suggestion.action} →
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setDismissed(prev => [...prev, suggestion.id])
                  onDismiss(suggestion.id)
                }}
                className="text-white/20 hover:text-white/60 transition-colors text-xs flex-shrink-0"
              >
                ✕
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
