'use client'

import { motion } from 'framer-motion'
import { useTrackPageView } from '@/lib/intelligence'
import { getTemplates } from '@/lib/intelligence/modules'
import { AICoPilot } from '@/components/intelligence/ai-co-pilot'

const roleColors: Record<string, string> = {
  perfumer: 'bg-violet-500/10 text-violet-400',
  management: 'bg-amber-500/10 text-amber-400',
  compliance: 'bg-emerald-500/10 text-emerald-400',
  procurement: 'bg-blue-500/10 text-blue-400',
  marketing: 'bg-rose-500/10 text-rose-400',
}

export default function ReportsPage() {
  useTrackPageView('report-studio')
  const templates = getTemplates()

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">📊</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400/60">Module 8</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Report Studio</h1>
          <p className="text-sm text-white/50 mt-1">One data set — infinite views. Tailored for every role.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {templates.map((t) => (
          <motion.div
            key={t.id}
            whileHover={{ y: -2 }}
            className="rounded-xl border border-white/5 p-5"
            style={{ background: 'rgba(23,28,36,0.6)' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${roleColors[t.targetRole] || 'bg-white/5 text-white/40'}`}>
                  {t.targetRole}
                </span>
              </div>
              {t.aiGenerated && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400">AI</span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">{t.name}</h3>
            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-3">Format: {t.format}</p>
            <div className="flex flex-wrap gap-1.5">
              {t.metrics.map((m) => (
                <span key={m} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/50">{m}</span>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 w-full py-2 rounded-lg bg-white/5 text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-all"
            >
              Generate Report →
            </motion.button>
          </motion.div>
        ))}
      </div>

      <AICoPilot />
    </div>
  )
}
