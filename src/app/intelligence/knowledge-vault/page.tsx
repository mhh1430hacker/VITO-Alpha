'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTrackPageView } from '@/lib/intelligence'
import { getKnowledge, type KnowledgeEntry } from '@/lib/intelligence/modules'
import aiAPI from '@/lib/ai_api'
import { AICoPilot } from '@/components/intelligence/ai-co-pilot'

export default function KnowledgeVaultPage() {
  useTrackPageView('knowledge-vault')
  const [entries, setEntries] = useState<KnowledgeEntry[]>([])
  const [patterns, setPatterns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [patternsRes, perfumerRes] = await Promise.all([
          aiAPI.getPatterns(),
          aiAPI.getPerfumerSignature('Elena Voss').catch(() => null),
        ])
        const minedPatterns = patternsRes.data?.patterns || []
        setPatterns(minedPatterns)

        const mined: KnowledgeEntry[] = minedPatterns.map((p: any, i: number) => ({
          id: `p${i}`, title: `Pattern: ${p.material_a} + ${p.material_b}`,
          content: `Co-occurrence: ${p.co_occurrence_count}x, Support: ${(p.support * 100).toFixed(1)}%, Compatibility: ${p.compatibility}`,
          author: 'AI Engine', category: 'observation' as const,
          tags: [p.family_a, p.family_b, 'pattern', 'knowledge-graph'],
          createdAt: '2026-06-28', lastUsed: new Date().toISOString().split('T')[0],
          aiExtracted: true, relatedFormulas: p.co_occurrence_count, usageCount: 0,
        }))

        if (perfumerRes?.data) {
          mined.push({
            id: 'ps1', title: `Signature: ${perfumerRes.data.perfumer}`,
            content: `Top materials: ${(perfumerRes.data.signature_materials || []).join(', ')}. Avg stability: ${perfumerRes.data.avg_stability}%, Avg performance: ${perfumerRes.data.avg_performance}%`,
            author: perfumerRes.data.perfumer, category: 'technique' as const,
            tags: ['signature', 'perfumer', ...(perfumerRes.data.signature_materials || [])],
            createdAt: '2026-06-28', lastUsed: new Date().toISOString().split('T')[0],
            aiExtracted: true, relatedFormulas: perfumerRes.data.formula_count, usageCount: perfumerRes.data.formula_count,
          })
        }

        setEntries(mined.length > 0 ? mined : getKnowledge())
      } catch {
        setEntries(getKnowledge())
      }
      setLoading(false)
    }
    load()
  }, [])

  const localEntries = entries

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🧠</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400/60">Module 4</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Knowledge Vault</h1>
          <p className="text-sm text-white/50 mt-1">Perfumer expertise — preserved, searchable, AI-enriched</p>
        </div>
      </div>

      {patterns.length > 0 && (
        <div className="rounded-xl border border-amber-500/20 p-4" style={{ background: 'rgba(23,28,36,0.6)' }}>
          <h2 className="text-sm font-semibold text-amber-400 mb-3">🧩 Mined Patterns</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {patterns.slice(0, 6).map((p: any, i: number) => (
              <div key={i} className="rounded-lg border border-white/5 p-3 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">{p.material_a}</span>
                  <span className="text-white/30">+</span>
                  <span className="text-xs font-semibold text-white">{p.material_b}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-white/40">
                  <span>Co-occurrence: {p.co_occurrence_count}x</span>
                  <span>· Support: {(p.support * 100).toFixed(1)}%</span>
                  <span>· Compatibility: {p.compatibility}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {localEntries.map((entry) => (
          <motion.div key={entry.id} whileHover={{ y: -1 }} className="rounded-xl border border-white/5 p-4" style={{ background: 'rgba(23,28,36,0.6)' }}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/30">{entry.category.replace(/_/g, ' ')}</span>
                {entry.aiExtracted && <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-400">AI</span>}
              </div>
              <span className="text-[10px] text-white/30">by {entry.author}</span>
            </div>
            <h3 className="text-sm font-semibold text-white">{entry.title}</h3>
            <p className="text-xs text-white/50 mt-1 leading-relaxed">{entry.content}</p>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {entry.tags.map((t) => (
                <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40">{t}</span>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-3 text-[10px] text-white/30">
              <span>Used {entry.usageCount} times</span>
              <span>{entry.relatedFormulas} related formulas</span>
              <span>Last used: {entry.lastUsed}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <AICoPilot />
    </div>
  )
}
