'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTrackPageView } from '@/lib/intelligence'
import { getAlerts, type MaterialAlert } from '@/lib/intelligence/modules'
import aiAPI from '@/lib/ai_api'
import { AICoPilot } from '@/components/intelligence/ai-co-pilot'

const severityColors: Record<string, string> = {
  critical: 'text-rose-400 bg-rose-500/10', high: 'text-amber-400 bg-amber-500/10',
  medium: 'text-blue-400 bg-blue-500/10', low: 'text-zinc-400 bg-zinc-500/10',
}

export default function MaterialsPage() {
  useTrackPageView('material-intelligence')
  const [alerts, setAlerts] = useState<MaterialAlert[]>([])
  const [embeddings, setEmbeddings] = useState<any[]>([])
  const [searchMat, setSearchMat] = useState('')
  const [similarResults, setSimilarResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const embRes = await aiAPI.getMaterialEmbeddings()
        setEmbeddings(embRes.data?.materials || [])
        const matCount = embRes.data?.count || 0
        setAlerts(Array.from({ length: Math.min(matCount, 5) }, (_, i) => ({
          id: `a${i}`, material: embRes.data?.materials?.[i]?.name || 'Unknown',
          type: 'alternative_available' as const, severity: 'low' as const,
          description: `Material available in embedding index — explore similar materials`,
        })))
      } catch {
        setAlerts(getAlerts())
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleSearchSimilar = async () => {
    if (!searchMat) return
    try {
      const res = await aiAPI.searchSimilarMaterials(searchMat.toLowerCase().replace(/ /g, '_'))
      setSimilarResults(res.data?.results || [])
    } catch {
      try {
        const pairRes = await aiAPI.suggestPairings(searchMat.toLowerCase().replace(/ /g, '_'))
        setSimilarResults(pairRes.data?.suggestions || [])
      } catch {
        setSimilarResults([])
      }
    }
  }

  const showAlerts = alerts

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">📦</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-400/60">Module 5</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Material Intelligence</h1>
          <p className="text-sm text-white/50 mt-1">Real-time material tracking, AI substitutions, quality monitoring</p>
        </div>
      </div>

      <div className="rounded-xl border border-blue-500/20 p-6" style={{ background: 'rgba(23,28,36,0.6)' }}>
        <h2 className="text-sm font-semibold text-white mb-4">🔍 Find Similar Materials</h2>
        <div className="flex gap-3">
          <input value={searchMat} onChange={(e) => setSearchMat(e.target.value)} placeholder="Material name (e.g. bergamot)" className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50" />
          <button onClick={handleSearchSimilar} className="rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:from-blue-500 hover:to-cyan-500 transition-all">Search Similar</button>
        </div>
        {similarResults.length > 0 && (
          <div className="mt-4 space-y-2">
            {similarResults.map((r: any, i: number) => (
              <div key={i} className="rounded-lg border border-white/5 p-3 bg-white/[0.02] flex items-center justify-between">
                <span className="text-sm text-white">{r.material || r.material_id}</span>
                <span className="text-xs font-bold text-emerald-400">{(r.similarity || r.score) * 100}%</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {embeddings.length > 0 && (
        <div className="rounded-xl border border-white/5 p-4" style={{ background: 'rgba(23,28,36,0.6)' }}>
          <h2 className="text-sm font-semibold text-white/70 mb-3">📊 Material Embeddings ({embeddings.length} indexed)</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {embeddings.slice(0, 12).map((m: any) => (
              <div key={m.id} className="rounded-lg border border-white/5 p-2 bg-white/[0.02]">
                <p className="text-xs font-semibold text-white truncate">{m.name || m.id}</p>
                <p className="text-[10px] text-white/30">{m.family}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {showAlerts.map((alert) => (
          <motion.div key={alert.id} whileHover={{ y: -1 }} className="rounded-xl border border-white/5 p-4" style={{ background: 'rgba(23,28,36,0.6)' }}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-sm font-semibold text-white">{alert.material}</h3>
                <p className="text-xs text-white/40">{alert.type.replace(/_/g, ' ')}</p>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${severityColors[alert.severity]}`}>{alert.severity}</span>
            </div>
            <p className="text-xs text-white/50 leading-relaxed">{alert.description}</p>
          </motion.div>
        ))}
      </div>

      <AICoPilot />
    </div>
  )
}
