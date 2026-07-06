'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTrackPageView } from '@/lib/intelligence'
import { getPredictions, type SuccessPrediction } from '@/lib/intelligence/modules'
import aiAPI from '@/lib/ai_api'
import { AICoPilot } from '@/components/intelligence/ai-co-pilot'

export default function SuccessPredictorPage() {
  useTrackPageView('success-predictor')
  const [predictions, setPredictions] = useState<SuccessPrediction[]>([])
  const [loading, setLoading] = useState(true)
  const [formulaName, setFormulaName] = useState('')
  const [materials, setMaterials] = useState('')
  const [predicting, setPredicting] = useState(false)
  const [predResult, setPredResult] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await aiAPI.predictSuccess({ name: 'Amber Rush', materials: [
          { name: 'ambroxan', percentage: 12 }, { name: 'hedione', percentage: 20 },
          { name: 'iso_e_super', percentage: 15 }, { name: 'bergamot', percentage: 18 },
          { name: 'vanillin', percentage: 8 }, { name: 'coumarin', percentage: 5 },
        ]})
        if (res.data) {
          setPredictions([{
            id: 'p1',
            formulaName: res.data.formula_name,
            predictedSuccess: res.data.predicted_success,
            confidence: res.data.confidence,
            marketFit: res.data.market_fit,
            longevityScore: res.data.longevity_score,
            appealScore: res.data.appeal_score,
            comparableHits: res.data.comparable_hits || [],
            riskFactors: res.data.risk_factors || [],
            recommendation: res.data.recommendation,
          }])
        }
      } catch {
        setPredictions(getPredictions())
      }
      setLoading(false)
    }
    load()
  }, [])

  const handlePredict = async () => {
    setPredicting(true)
    setPredResult(null)
    const mats = materials.split('\n').filter(Boolean).map((line) => {
      const parts = line.split(',')
      return { name: parts[0]?.trim().toLowerCase().replace(/ /g, '_') || 'unknown', percentage: parseFloat(parts[1]?.trim()) || 5 }
    })
    const name = formulaName || `Formula ${new Date().toISOString().split('T')[0]}`
    try {
      const res = await aiAPI.predictSuccess({ name, materials: mats })
      setPredResult(res.data)
    } catch {
      setPredResult({ error: 'API unavailable' })
    }
    setPredicting(false)
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🔮</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-fuchsia-400/60">Module 6</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Success Predictor</h1>
          <p className="text-sm text-white/50 mt-1">AI predicts commercial potential — before you invest in production</p>
        </div>
      </div>

      <div className="rounded-xl border border-fuchsia-500/20 p-6" style={{ background: 'rgba(23,28,36,0.6)' }}>
        <h2 className="text-sm font-semibold text-white mb-4">🔮 Predict Market Success</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
          <input value={formulaName} onChange={(e) => setFormulaName(e.target.value)} placeholder="Formula name" className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-fuchsia-500/50" />
          <button onClick={handlePredict} disabled={predicting} className="rounded-lg bg-gradient-to-r from-fuchsia-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 hover:from-fuchsia-500 hover:to-purple-500 transition-all">
            {predicting ? 'Predicting...' : 'Predict Success'}
          </button>
        </div>
        <textarea value={materials} onChange={(e) => setMaterials(e.target.value)} rows={4} placeholder="bergamot, 18&#10;ambroxan, 12&#10;vanillin, 8" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-fuchsia-500/50 font-mono" />
      </div>

      {predResult && !predResult.error && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-fuchsia-500/20 p-5" style={{ background: 'rgba(23,28,36,0.6)' }}>
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-base font-semibold text-white">{predResult.formula_name}</h3>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-400">{predResult.predicted_success}%</p>
              <p className="text-[10px] text-white/30">Success</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <MetricBar label="Market Fit" value={predResult.market_fit} color="bg-violet-500" />
            <MetricBar label="Longevity" value={predResult.longevity_score} color="bg-emerald-500" />
            <MetricBar label="Appeal" value={predResult.appeal_score} color="bg-amber-500" />
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] text-white/30">AI Confidence</span>
            <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500" initial={{ width: 0 }} animate={{ width: `${predResult.confidence}%` }} transition={{ duration: 1 }} />
            </div>
            <span className="text-xs font-bold text-violet-400">{predResult.confidence}%</span>
          </div>

          {predResult.comparable_hits?.length > 0 && (
            <div className="mb-3">
              <p className="text-[10px] text-white/30 mb-1">Comparable Market Hits</p>
              <div className="flex flex-wrap gap-1.5">
                {predResult.comparable_hits.map((h: string) => (
                  <span key={h} className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">{h}</span>
                ))}
              </div>
            </div>
          )}

          {predResult.risk_factors?.length > 0 && (
            <div className="mb-3">
              <p className="text-[10px] text-white/30 mb-1">Risk Factors</p>
              <div className="flex flex-wrap gap-1.5">
                {predResult.risk_factors.map((r: string) => (
                  <span key={r} className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400">{r}</span>
                ))}
              </div>
            </div>
          )}

          <div className="p-3 rounded-lg bg-violet-500/5 border border-violet-500/10">
            <p className="text-[10px] font-semibold text-violet-400/80">🤖 AI Recommendation</p>
            <p className="text-xs text-white/60 mt-0.5">{predResult.recommendation}</p>
          </div>

          <div className="mt-3 p-2 rounded-lg bg-white/[0.02] border border-white/5">
            <p className="text-[10px] text-white/30 font-mono">Model: {predResult.model?.name || 'Success Predictor v4.0'}</p>
            <p className="text-[10px] text-white/30 font-mono">Parameters: {predResult.model?.parameters || 'Multi-factor weighted regression'}</p>
          </div>
        </motion.div>
      )}

      {predResult?.error && <p className="text-xs text-rose-400">{predResult.error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {predictions.map((pred) => (
          <motion.div key={pred.id} whileHover={{ y: -1 }} className="rounded-xl border border-white/5 p-5" style={{ background: 'rgba(23,28,36,0.6)' }}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-base font-semibold text-white">{pred.formulaName}</h3>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-400">{pred.predictedSuccess}%</p>
                <p className="text-[10px] text-white/30">Success</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <MetricBar label="Market Fit" value={pred.marketFit} color="bg-violet-500" />
              <MetricBar label="Longevity" value={pred.longevityScore} color="bg-emerald-500" />
              <MetricBar label="Appeal" value={pred.appealScore} color="bg-amber-500" />
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] text-white/30">AI Confidence</span>
              <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500" initial={{ width: 0 }} animate={{ width: `${pred.confidence}%` }} transition={{ duration: 1 }} />
              </div>
              <span className="text-xs font-bold text-violet-400">{pred.confidence}%</span>
            </div>

            {pred.comparableHits.length > 0 && (
              <div className="mb-3">
                <p className="text-[10px] text-white/30 mb-1">Comparable Market Hits</p>
                <div className="flex flex-wrap gap-1.5">
                  {pred.comparableHits.map((h) => <span key={h} className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">{h}</span>)}
                </div>
              </div>
            )}

            {pred.riskFactors.length > 0 && (
              <div className="mb-3">
                <p className="text-[10px] text-white/30 mb-1">Risk Factors</p>
                <div className="flex flex-wrap gap-1.5">
                  {pred.riskFactors.map((r) => <span key={r} className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400">{r}</span>)}
                </div>
              </div>
            )}

            <div className="p-3 rounded-lg bg-violet-500/5 border border-violet-500/10">
              <p className="text-[10px] font-semibold text-violet-400/80">🤖 AI Recommendation</p>
              <p className="text-xs text-white/60 mt-0.5">{pred.recommendation}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AICoPilot />
    </div>
  )
}

function MetricBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] text-white/30 uppercase tracking-wider">{label}</span>
        <span className="text-[10px] font-bold text-white/60">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div className={`h-full rounded-full ${color}`} initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.8 }} />
      </div>
    </div>
  )
}
