'use client'

import { motion } from 'framer-motion'
import { useTrackPageView } from '@/lib/intelligence'
import { getIngestions } from '@/lib/intelligence/modules'
import { AICoPilot } from '@/components/intelligence/ai-co-pilot'

const sourceIcons: Record<string, string> = { excel: '📊', pdf: '📄', csv: '📋', manual: '✏️' }
const statusColors: Record<string, string> = {
  completed: 'bg-emerald-500/10 text-emerald-400',
  processing: 'bg-amber-500/10 text-amber-400',
  pending: 'bg-zinc-500/10 text-zinc-400',
  error: 'bg-rose-500/10 text-rose-400',
}

export default function DataIngestionPage() {
  useTrackPageView('data-ingestion')
  const ingestions = getIngestions()

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">📥</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400/60">Module 3</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Data Ingestion Hub</h1>
          <p className="text-sm text-white/50 mt-1">Import Excel, PDF, CSV — AI structures your legacy knowledge</p>
        </div>
      </div>

      {/* Upload Zone */}
      <motion.div
        whileHover={{ borderColor: 'rgba(139,92,246,0.3)' }}
        className="rounded-2xl border-2 border-dashed border-white/10 p-8 text-center transition-colors cursor-pointer"
      >
        <span className="text-4xl block mb-3">📤</span>
        <h3 className="text-base font-semibold text-white mb-1">Drop files or click to upload</h3>
        <p className="text-xs text-white/40">Supports Excel (.xlsx, .xls), CSV, PDF — AI will parse and structure your data</p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 px-6 py-2.5 rounded-xl bg-violet-500 text-white text-sm font-semibold hover:bg-violet-600 transition-colors"
        >
          Upload Files
        </motion.button>
      </motion.div>

      {/* History */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-white/70 mb-3">Import History</h2>
        {ingestions.map((ing) => (
          <motion.div
            key={ing.id}
            className="rounded-xl border border-white/5 p-3 flex items-center justify-between"
            style={{ background: 'rgba(23,28,36,0.6)' }}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{sourceIcons[ing.source] || '📄'}</span>
              <div>
                <p className="text-sm font-semibold text-white">{ing.fileName}</p>
                <p className="text-[10px] text-white/30">{ing.recordCount} records · {ing.importedAt}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {ing.aiProcessed && <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400">AI</span>}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${statusColors[ing.status]}`}>{ing.status}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <AICoPilot />
    </div>
  )
}
