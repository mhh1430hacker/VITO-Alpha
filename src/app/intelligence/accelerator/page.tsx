'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useTrackPageView } from '@/lib/intelligence'
import { getFormulas, type FormulaVersion, type AcceleratorSuggestion } from '@/lib/intelligence/modules'
import aiAPI from '@/lib/ai_api'
import { AICoPilot } from '@/components/intelligence/ai-co-pilot'

export default function AcceleratorPage() {
  useTrackPageView('formula-accelerator')
  const [formulas, setFormulas] = useState<FormulaVersion[]>([])
  const [suggestions, setSuggestions] = useState<AcceleratorSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [formulaName, setFormulaName] = useState('')
  const [materials, setMaterials] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await aiAPI.analyzeFormula({ name: 'Amber Rush', materials: [
          { name: 'ambroxan', percentage: 12 }, { name: 'hedione', percentage: 20 },
          { name: 'iso_e_super', percentage: 15 }, { name: 'bergamot', percentage: 18 },
          { name: 'vanillin', percentage: 8 }, { name: 'coumarin', percentage: 5 },
        ]})
        if (res.data) {
          setFormulas([{
            id: 'f1', name: res.data.formula_name || 'Amber Rush', version: 1,
            createdAt: new Date().toISOString().split('T')[0],
            stabilityScore: res.data.stability_score || 0,
            performanceScore: res.data.performance_score || 0,
            notes: `Complexity: ${res.data.complexity_score}% · Balance: ${res.data.balance_score}%`,
          }])
          const src = res.data
          setSuggestions([
            { id: 's1', type: 'accord', title: 'Detected Accords', description: (src.detected_accords || []).join(', '), expectedImprovement: `Novelty: ${src.novelty_score}%`, confidence: 92 },
            { id: 's2', type: 'modifier', title: 'Note Pyramid', description: `Top: ${(src.note_pyramid?.top || 0)}% · Middle: ${(src.note_pyramid?.middle || 0)}% · Base: ${(src.note_pyramid?.base || 0)}%`, expectedImprovement: 'Balanced pyramid profile', confidence: 88 },
          ])
        }
      } catch {
        setFormulas(getFormulas())
        const { getSuggestions } = await import('@/lib/intelligence/modules')
        setSuggestions(getSuggestions())
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleAnalyze = async () => {
    setAnalyzing(true)
    setAnalysisResult(null)
    const mats = materials.split('\n').filter(Boolean).map((line) => {
      const parts = line.split(',')
      return { name: parts[0]?.trim().toLowerCase().replace(/ /g, '_') || 'unknown', percentage: parseFloat(parts[1]?.trim()) || 5 }
    })
    const name = formulaName || `Formula ${new Date().toISOString().split('T')[0]}`
    try {
      const res = await aiAPI.analyzeFormula({ name, materials: mats })
      setAnalysisResult(res.data)
    } catch {
      setAnalysisResult({ error: 'API unavailable — try seeding first' })
    }
    setAnalyzing(false)
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">⚡</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400/60">Module 1</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Formula Accelerator</h1>
          <p className="text-sm text-white/50 mt-1">AI-guided formula development — reduce iterations by 67%</p>
        </div>
      </div>

      <div className="rounded-xl border border-violet-500/20 p-6" style={{ background: 'rgba(23,28,36,0.6)' }}>
        <h2 className="text-sm font-semibold text-white mb-4">🧪 Analyze New Formula</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-white/30 mb-1 block">Formula Name</label>
            <input value={formulaName} onChange={(e) => setFormulaName(e.target.value)} placeholder="e.g. Oud Silk" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50" />
          </div>
          <div className="flex items-end">
            <button onClick={handleAnalyze} disabled={analyzing} className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 hover:from-violet-500 hover:to-purple-500 transition-all">
              {analyzing ? 'Analyzing...' : 'Analyze Formula'}
            </button>
          </div>
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-white/30 mb-1 block">Materials (name, percentage per line)</label>
          <textarea value={materials} onChange={(e) => setMaterials(e.target.value)} rows={4} placeholder="bergamot, 18&#10;ambroxan, 12&#10;hedione, 20&#10;vanillin, 8" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 font-mono" />
        </div>
      </div>

      {analysisResult && !analysisResult.error && (
        <div className="rounded-xl border border-emerald-500/20 p-4" style={{ background: 'rgba(23,28,36,0.6)' }}>
          <h3 className="text-sm font-semibold text-emerald-400 mb-3">Analysis Results</h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <ScoreBox label="Stability" value={analysisResult.stability_score} />
            <ScoreBox label="Performance" value={analysisResult.performance_score} />
            <ScoreBox label="Complexity" value={analysisResult.complexity_score} />
            <ScoreBox label="Balance" value={analysisResult.balance_score} />
            <ScoreBox label="Novelty" value={analysisResult.novelty_score} />
            <ScoreBox label="Overall" value={null} avg={`${Math.round((analysisResult.stability_score + analysisResult.performance_score + analysisResult.balance_score) / 3)}%`} />
          </div>
          {analysisResult.note_pyramid && (
            <div className="flex items-center gap-4 mb-2">
              <span className="text-[10px] text-white/30">Top: {analysisResult.note_pyramid.top}%</span>
              <div className="h-2 rounded-full bg-white/5 flex-1 overflow-hidden">
                <div className="h-full rounded-full bg-sky-500" style={{ width: `${analysisResult.note_pyramid.top}%` }} />
              </div>
              <span className="text-[10px] text-white/30">Mid: {analysisResult.note_pyramid.middle}%</span>
              <div className="h-2 rounded-full bg-white/5 flex-1 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${analysisResult.note_pyramid.middle}%` }} />
              </div>
              <span className="text-[10px] text-white/30">Base: {analysisResult.note_pyramid.base}%</span>
              <div className="h-2 rounded-full bg-white/5 flex-1 overflow-hidden">
                <div className="h-full rounded-full bg-amber-500" style={{ width: `${analysisResult.note_pyramid.base}%` }} />
              </div>
            </div>
          )}
          {analysisResult.detected_accords?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {analysisResult.detected_accords.map((a: string) => (
                <span key={a} className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400">{a}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {analysisResult?.error && (
        <div className="rounded-xl border border-rose-500/20 p-4 bg-rose-500/5">
          <p className="text-sm text-rose-400">{analysisResult.error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-white/70">Active Formulas</h2>
          <div className="grid gap-3">
            {formulas.map((f) => (
              <FormulaCard key={f.id} formula={f} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">🤖</span>
            <h2 className="text-sm font-semibold text-white/70">AI Insights</h2>
          </div>
          {suggestions.map((s) => (
            <SuggestionCard key={s.id} suggestion={s} />
          ))}
        </div>
      </div>

      <AICoPilot />
    </div>
  )
}

function FormulaCard({ formula }: { formula: FormulaVersion }) {
  return (
    <motion.div
      whileHover={{ y: -1 }}
      className="rounded-xl border border-white/5 p-4 transition-colors hover:border-violet-500/20"
      style={{ background: 'rgba(23,28,36,0.6)' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-white">{formula.name}</h3>
          <p className="text-[10px] text-white/30">v{formula.version} · {formula.createdAt}</p>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40">{formula.id}</span>
      </div>
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-white/40">Stability</span>
          <ScoreBadge score={formula.stabilityScore} />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-white/40">Performance</span>
          <ScoreBadge score={formula.performanceScore} />
        </div>
      </div>
      <p className="text-xs text-white/40 italic">{formula.notes}</p>
    </motion.div>
  )
}

function SuggestionCard({ suggestion }: { suggestion: AcceleratorSuggestion }) {
  return (
    <div className="rounded-xl border border-violet-500/10 p-3" style={{ background: 'rgba(23,28,36,0.6)' }}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-400/60">{suggestion.type}</span>
        <span className="text-[10px] font-bold text-emerald-400">{suggestion.confidence}%</span>
      </div>
      <p className="text-xs font-semibold text-white">{suggestion.title}</p>
      <p className="text-[11px] text-white/40 mt-1 leading-relaxed">{suggestion.description}</p>
      <p className="text-[11px] text-emerald-400/70 mt-2 font-medium">{suggestion.expectedImprovement}</p>
    </div>
  )
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 85 ? 'text-emerald-400' : score >= 70 ? 'text-amber-400' : 'text-rose-400'
  return <span className={`text-xs font-bold ${color}`}>{score}%</span>
}

function ScoreBox({ label, value, avg }: { label: string; value?: number | null; avg?: string }) {
  return (
    <div className="rounded-lg border border-white/5 p-3 text-center">
      <p className="text-[10px] text-white/30 uppercase tracking-wider">{label}</p>
      <p className={`text-lg font-bold ${avg ? 'text-violet-400' : value && value >= 80 ? 'text-emerald-400' : value && value >= 60 ? 'text-amber-400' : 'text-white/60'}`}>
        {avg || (value !== null ? `${value}%` : '—')}
      </p>
    </div>
  )
}
