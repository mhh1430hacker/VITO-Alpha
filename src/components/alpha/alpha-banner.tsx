'use client'

import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ChevronDown, ChevronUp, Info } from 'lucide-react'
import { AlphaConfig } from '@/lib/alpha/config'

const SESSION_DURATION_MS = 30 * 60 * 1000
const AUTO_HIDE_DELAY_MS = 15 * 1000

function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

const DISABLED_FEATURES = ['Scheduler', 'Training', 'Background Jobs', 'Persistent Storage']

export function AlphaBanner() {
  const [visible, setVisible] = useState(true)
  const [dismissed, setDismissed] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION_MS)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    if (dismissed || !AlphaConfig.enabled) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1000
        if (next <= 0) {
          clearInterval(timer)
          setVisible(false)
          return 0
        }
        return next
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [dismissed])

  useEffect(() => {
    if (dismissed || !AlphaConfig.enabled || hasInteracted) return
    const timer = setTimeout(() => {
      setVisible(false)
    }, AUTO_HIDE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [dismissed, hasInteracted])

  const handleInteraction = useCallback(() => {
    setHasInteracted(true)
  }, [])

  if (!AlphaConfig.enabled) return null
  if (dismissed && !visible) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.5, y: 0 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <button
          onClick={() => {
            setDismissed(false)
            setVisible(true)
            setTimeLeft(SESSION_DURATION_MS)
            setHasInteracted(false)
          }}
          className="flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-400/80 backdrop-blur-sm border border-amber-500/20 hover:bg-amber-500/25 transition-colors"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          ALPHA
        </button>
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-60 overflow-hidden"
          onMouseEnter={handleInteraction}
          onFocusCapture={handleInteraction}
        >
          <div className="relative bg-gradient-to-r from-amber-500/95 via-amber-400/90 to-amber-500/95 backdrop-blur-md">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)] animate-[shimmer_3s_ease-in-out_infinite]" />

            <div className="relative mx-auto flex items-center justify-between px-4 py-2.5 text-sm">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base shrink-0">&#9888;&#65039;</span>
                <span className="font-semibold text-amber-950 truncate">
                  VITO Alpha &mdash; Synthetic Data Demo
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="tabular-nums text-amber-900 font-mono text-xs whitespace-nowrap">
                  Session expires in {formatTime(timeLeft)}
                </span>

                <button
                  onClick={() => setExpanded(!expanded)}
                  className="rounded p-0.5 text-amber-800 hover:bg-amber-600/20 transition-colors"
                  title="More info"
                >
                  {expanded ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>

                <button
                  onClick={() => setDismissed(true)}
                  className="rounded p-0.5 text-amber-800 hover:bg-amber-600/20 transition-colors"
                  title="Dismiss banner"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="relative border-t border-amber-600/20 bg-amber-500/10 backdrop-blur-sm px-4 py-3">
                    <div className="flex items-start gap-2 mb-2">
                      <Info className="h-4 w-4 text-amber-700 mt-0.5 shrink-0" />
                      <div className="space-y-1.5 text-xs text-amber-800">
                        <p>This is a read-only demo with synthetic data only.</p>
                        <p>No real formulas, materials, or user data are stored.</p>
                      </div>
                    </div>
                    <div className="ml-6">
                      <p className="text-[11px] font-medium text-amber-700 mb-1.5">Features disabled:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {DISABLED_FEATURES.map((feature) => (
                          <span
                            key={feature}
                            className="inline-flex items-center rounded-full bg-amber-600/15 px-2 py-0.5 text-[11px] text-amber-800"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
