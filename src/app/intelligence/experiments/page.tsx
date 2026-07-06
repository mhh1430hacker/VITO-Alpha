'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTrackPageView } from '@/lib/intelligence'
import { getExperiments, type ExperimentResult } from '@/lib/intelligence/modules'
import aiAPI from '@/lib/ai_api'
import { AICoPilot } from '@/components/intelligence/ai-co-pilot'

export default function ExperimentsPage() {
  useTrackPageView('experiment-optimizer')
  const [experiments, setExperiments] = useState<ExperimentResult[]>([])
  const [loading, setLoading] = useState(true)
  const [formulaName, setFormulaName] = useState('')
  const [materials, setMaterials] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await aiAPI.analyzeFormula({ name: 'Amber Rush Analysis', materials: [
          { name: 'ambroxan', percentage: 12 }, { name: 'hedione', percentage: 20 },
          { name: 'iso_e_super', percentage: 15 }, { name: 'bergamot', percentage: 18 },
          { name: 'vanillin', percentage: 8 }, { name: 'coumarin', percentage: 5 },
        ]})
        if (res.data) {
          setExperiments([{
            id: 'e1', experimentName: res.data.formula_name || 'Amber Rush Analysis',
            hypothesis: 'Balanced amber-woody profile',
            result: (res.data.stability_score > 70 ? 'success' : 'partial') as 'success' | 'partial' | 'failure',
            successScore: Math.round((res.data.stability_score + res.data.performance_score) / 2),
            aiPredictedScore: Math.round((res.data.stability_score + res.data.performance_score) / 2),
            learnings: [`Stability: ${res.data.stability_score}%`, `Performance: ${res.data.performance_score}%`, `Complexity: ${res.data.complexity_score}%`],
            date: new Date().toISOString().split('T')[0],
          }])
        }
      } catch {
        setExperiments(getExperiments())
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleAnalyze = async () => {
    setAnalyzing(true)
    setResult(null)
    const mats = materials.split('\n').filter(Boolean).map((line) => {
      const parts = line.split(',')
      return { name: parts[0]?.trim().toLowerCase().replace(/ /g, '_') || 'unknown', percentage: parseFloat(parts[1]?.trim()) || 5 }
    })
    const name = formulaName || `Exp ${new Date().toISOString().split('T')[0]}`
    try {
      const res = await aiAPI.analyzeFormula({ name, materials: mats })
      setResult(res.data)
    } catch {
      setResult({ error: 'API unavailable' })
    }
    setAnalyzing(false)
  }

  const successes = experiments.filter(e => e.result === 'success').length
  const avgScore = Math.round(experiments.reduce((a, e) => a + e.successScore, 0) / Math.max(experiments.length, 1))

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🔬</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400/60">Module 7</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Experiment Optimizer</h1>
          <p className="text-sm text-white/50 mt-1">AI learns from every result — turning failures into formulas</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-white/5 p-4 bg-emerald-500/5">
          <p className="text-2xl font-bold text-emerald-400">{successes}</p>
          <p className="text-xs text-white/50 mt-1">Successful</p>
        </div>
        <div className="rounded-xl border border-white/5 p-4 bg-amber-500/5">
          <p className="text-2xl font-bold text-amber-400">{avgScore}%</p>
          <p className="text-xs text-white/50 mt-1">Avg Success Score</p>
        </div>
        <div className="rounded-xl border border-white/5 p-4 bg-violet-500/5">
          <p className="text-2xl font-bold text-violet-400">{experiments.length}</p>
          <p className="text-xs text-white/50 mt-1">Total Experiments</p>
        </div>
      </div>

      <div className="rounded-xl border border-cyan-500/20 p-6" style={{ background: 'rgba(23,28,36,0.6)' }}>
        <h2 className="text-sm font-semibold text-white mb-4">🧪 Analyze New Experiment</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
          <input value={formulaName} onChange={(e) => setFormulaName(e.target.value)} placeholder="Experiment name" className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50" />
          <button onClick={handleAnalyze} disabled={analyzing} className="rounded-lg bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 hover:from-cyan-500 hover:to-teal-500 transition-all">
            {analyzing ? 'Analyzing...' : 'Run Experiment'}
          </button>
        </div>
        <textarea value={materials} onChange={(e) => setMaterials(e.target.value)} rows={4} placeholder="bergamot, 18&#10;ambroxan, 12&#10;vanillin, 8" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 font-mono" />
      </div>

      {result && !result.error && (
        <div className="rounded-xl border border-emerald-500/20 p-4" style={{ background: 'rgba(23,28,36,0.6)' }}>
          <h3 className="text-sm font-semibold text-emerald-400 mb-3">Analysis Results</h3>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <ScoreBox label="Stability" value={result.stability_score} />
            <ScoreBox label="Performance" value={result.performance_score} />
            <ScoreBox label="Balance" value={result.balance_score} />
          </div>
          {result.detected_accords?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {result.detected_accords.map((a: string) => (
                <span key={a} className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400">{a}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {result?.error && <p className="text-xs text-rose-400">{result.error}</p>}

      <div className="space-y-3">
        {experiments.map((exp) => (
          <motion.div key={exp.id} whileHover={{ y: -1 }} className="rounded-xl border border-white/5 p-4" style={{ background: 'rgba(23,28,36,0.6)' }}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">{exp.experimentName}</h3>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${exp.result === 'success' ? 'bg-emerald-500/10 text-emerald-400' : exp.result === 'partial' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'}`}>{exp.result}</span>
                </div>
                <p className="text-xs text-white/40 mt-0.5">Hypothesis: {exp.hypothesis}</p>
              </div>
              <span className="text-[10px] text-white/30">{exp.date}</span>
            </div>
            <div className="flex items-center gap-4 text-xs mb-2">
              <span className="text-white/50">Actual: <span className="font-semibold text-white">{exp.successScore}%</span></span>
              <span className="text-white/50">AI Predicted: <span className="font-semibold text-violet-400">{exp.aiPredictedScore}%</span></span>
              <span className="text-white/30">Δ {exp.successScore - exp.aiPredictedScore > 0 ? '+' : ''}{exp.successScore - exp.aiPredictedScore}%</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {exp.learnings.map((l, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/50">{l}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <AICoPilot />
    </div>
  )
}

function ScoreBox({ label, value }: { label: string; value?: number | null }) {
  return (
    <div className="rounded-lg border border-white/5 p-3 text-center">
      <p className="text-[10px] text-white/30 uppercase tracking-wider">{label}</p>
      <p className={`text-lg font-bold ${value && value >= 80 ? 'text-emerald-400' : value && value >= 60 ? 'text-amber-400' : 'text-white/60'}`}>
        {value !== null ? `${value}%` : '—'}
      </p>
    </div>
  )
}
