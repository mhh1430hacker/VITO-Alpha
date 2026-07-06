'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getInsights, type AIInsight } from '@/lib/intelligence/modules'
import aiAPI from '@/lib/ai_api'

export function AICoPilot() {
  const [open, setOpen] = useState(false)
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [activeInsight, setActiveInsight] = useState<AIInsight | null>(null)
  const [mounted, setMounted] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  const fetchInsights = async () => {
    try {
      const status = await aiAPI.getStatus()
      const patterns = await aiAPI.getPatterns()
      if (patterns.data?.patterns) {
        const mapped: AIInsight[] = patterns.data.patterns.map((p: any) => ({
          id: p.material_a + '-' + p.material_b,
          type: 'pattern' as const,
          title: `Pattern: ${p.material_a} + ${p.material_b}`,
          description: `Co-occurrence count: ${p.co_occurrence_count}, significance: ${p.significance}`,
          confidence: Math.min(99, Math.round(p.significance * 100)),
          source: {
            model: 'Knowledge Graph v2.0',
            confidence: p.significance,
            trainedOn: `${status.data?.vectorizer?.documents || 12} seed formulas`,
            lastUpdated: '2026-06-28',
          },
          timestamp: new Date().toISOString(),
          actionable: true,
          actionLabel: 'View in Vault',
        }))
        setInsights(mapped)
      }
    } catch {
      setInsights(getInsights())
    }
  }

  useEffect(() => {
    setMounted(true)
    fetchInsights()
    intervalRef.current = setInterval(fetchInsights, 30000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  const statusInsights = insights

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3 shadow-2xl shadow-violet-500/25 hover:shadow-violet-500/40 transition-shadow"
      >
        <span className="text-lg">🤖</span>
        <span className="text-sm font-semibold text-white">AI Co-Pilot</span>
        {statusInsights.length > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-400 text-[10px] font-bold text-black"
          >
            {statusInsights.length}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, x: -320, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -320, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-24 left-6 z-50 w-[380px] max-h-[600px] rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden"
              style={{ background: 'rgba(10,13,18,0.98)' }}
            >
              <div className="flex items-center gap-3 p-4 border-b border-white/5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-lg shadow-lg">🤖</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">AI Co-Pilot</p>
                  <p className="text-[10px] text-white/40">Always learning · {statusInsights.length} active insights</p>
                </div>
                <button onClick={() => setOpen(false)} className="text-white/30 hover:text-white/60 transition-colors text-sm">✕</button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {activeInsight ? (
                  <div className="space-y-3">
                    <button onClick={() => setActiveInsight(null)} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">← Back to insights</button>
                    <InsightCard insight={activeInsight} expanded />
                  </div>
                ) : statusInsights.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-white/30">No active insights</p>
                    <p className="text-[10px] text-white/20 mt-1">AI is analyzing your data — check back soon</p>
                  </div>
                ) : (
                  statusInsights.map((insight) => (
                    <InsightCard
                      key={insight.id}
                      insight={insight}
                      onClick={() => setActiveInsight(insight)}
                    />
                  ))
                )}
              </div>

              <div className="p-3 border-t border-white/5">
                <p className="text-[10px] text-white/20 text-center">
                  Powered by VITO AI Engine · {new Date().toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function InsightCard({ insight, expanded, onClick }: { insight: AIInsight; expanded?: boolean; onClick?: () => void }) {
  const typeIcons: Record<string, string> = { prediction: '🔮', warning: '⚠️', suggestion: '💡', discovery: '✨', pattern: '🧩' }
  const typeColors: Record<string, string> = {
    prediction: 'border-blue-500/20 bg-blue-500/5',
    warning: 'border-amber-500/20 bg-amber-500/5',
    suggestion: 'border-emerald-500/20 bg-emerald-500/5',
    discovery: 'border-violet-500/20 bg-violet-500/5',
    pattern: 'border-cyan-500/20 bg-cyan-500/5',
  }

  return (
    <motion.div
      layout
      onClick={onClick}
      className={`rounded-xl border p-3 cursor-pointer transition-all ${typeColors[insight.type]} ${expanded ? '' : 'hover:bg-white/[0.02]'}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-lg">{typeIcons[insight.type] || '💡'}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/30">{insight.type}</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              insight.confidence > 90 ? 'bg-emerald-500/20 text-emerald-400' :
              insight.confidence > 75 ? 'bg-amber-500/20 text-amber-400' :
              'bg-zinc-500/20 text-zinc-400'
            }`}>
              {insight.confidence}%
            </span>
          </div>
          <p className="text-sm font-semibold text-white mt-0.5">{insight.title}</p>
          {(expanded) && (
            <>
              <p className="text-xs text-white/50 mt-2 leading-relaxed">{insight.description}</p>
              <div className="mt-3 p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <p className="text-[10px] text-white/30 font-mono">Model: {insight.source.model}</p>
                <p className="text-[10px] text-white/30 font-mono">Trained on: {insight.source.trainedOn}</p>
              </div>
              {insight.actionable && (
                <button className="mt-2 text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors">
                  {insight.actionLabel} →
                </button>
              )}
            </>
          )}
          {!expanded && <p className="text-xs text-white/40 mt-1 line-clamp-2">{insight.description}</p>}
        </div>
      </div>
    </motion.div>
  )
}
