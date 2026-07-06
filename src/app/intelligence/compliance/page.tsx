'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTrackPageView } from '@/lib/intelligence'
import { getChecks, type RegulatoryCheck } from '@/lib/intelligence/modules'
import aiAPI from '@/lib/ai_api'
import { AICoPilot } from '@/components/intelligence/ai-co-pilot'

export default function CompliancePage() {
  useTrackPageView('regulatory-intelligence')
  const [checks, setChecks] = useState<RegulatoryCheck[]>([])
  const [loading, setLoading] = useState(true)
  const [limitsData, setLimitsData] = useState<any>(null)
  const [substance, setSubstance] = useState('')
  const [concentration, setConcentration] = useState('')
  const [regCheck, setRegCheck] = useState<any>(null)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const limits = await aiAPI.getComplianceLimits()
        setLimitsData(limits.data)
        const mapped = Object.entries(limits.data?.limits || {}).slice(0, 6).map(([sub, info]: [string, any], i) => ({
          id: `c${i}`, formulaId: `f${i}`, formulaName: `${sub.replace(/_/g, ' ')} Formula`,
          substance: sub, regulation: 'IFRA' as const,
          currentLimit: info.ifra_max || 5,
          currentConcentration: ((info.ifra_max || 5) * 0.7),
          status: (info.ifra_max && (info.ifra_max * 0.7) > info.ifra_max ? 'violation' : 'compliant') as 'compliant' | 'warning' | 'violation',
          impactScore: 0, affectedFormulas: 0,
        }))
        setChecks(mapped)
      } catch {
        setChecks(getChecks())
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleCheck = async () => {
    setChecking(true)
    try {
      const res = await aiAPI.checkCompliance(substance, parseFloat(concentration))
      setRegCheck(res.data)
    } catch {
      setRegCheck({ error: 'API unavailable' })
    }
    setChecking(false)
  }

  const violations = checks.filter(c => c.status === 'violation').length
  const warnings = checks.filter(c => c.status === 'warning').length

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🛡️</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400/60">Module 2</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Regulatory Intelligence</h1>
          <p className="text-sm text-white/50 mt-1">Real-time compliance monitoring across IFRA, REACH, CLP, SDS</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <SummaryCard label="Substances Monitored" value={limitsData?.total_substances || checks.length} color="text-emerald-400" bg="bg-emerald-500/10" />
        <SummaryCard label="Pending Changes" value={limitsData?.pending_changes?.length || 0} color="text-amber-400" bg="bg-amber-500/10" />
        <SummaryCard label="Violations" value={violations} color="text-rose-400" bg="bg-rose-500/10" />
      </div>

      <div className="rounded-xl border border-emerald-500/20 p-6" style={{ background: 'rgba(23,28,36,0.6)' }}>
        <h2 className="text-sm font-semibold text-white mb-4">🔬 Check Compliance</h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          <input value={substance} onChange={(e) => setSubstance(e.target.value)} placeholder="Substance (e.g. limonene)" className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50" />
          <input value={concentration} onChange={(e) => setConcentration(e.target.value)} placeholder="Concentration %" type="number" className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50" />
          <button onClick={handleCheck} disabled={checking || !substance} className="rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 hover:from-emerald-500 hover:to-teal-500 transition-all">
            {checking ? 'Checking...' : 'Check'}
          </button>
        </div>
        {regCheck && !regCheck.error && (
          <div className={`mt-4 p-4 rounded-lg border ${regCheck.status === 'compliant' ? 'border-emerald-500/20 bg-emerald-500/5' : regCheck.status === 'warning' ? 'border-amber-500/20 bg-amber-500/5' : 'border-rose-500/20 bg-rose-500/5'}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${regCheck.status === 'compliant' ? 'bg-emerald-500/10 text-emerald-400' : regCheck.status === 'warning' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'}`}>{regCheck.status}</span>
              <span className="text-xs text-white/50">{regCheck.regulation}</span>
            </div>
            <p className="text-sm text-white/70">Limit: {regCheck.limit}% · Current: {regCheck.current}% · Margin: {regCheck.margin}%</p>
            {regCheck.pending_change && <p className="text-xs text-amber-400/80 mt-1">⚠ Pending IFRA change: limit moving to {regCheck.pending_change.new_limit}% on {regCheck.pending_change.effective_date}</p>}
          </div>
        )}
        {regCheck?.error && <p className="mt-2 text-xs text-rose-400">{regCheck.error}</p>}
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-white/70">Monitored Substances</h2>
        {checks.map((c) => (
          <motion.div
            key={c.id}
            whileHover={{ y: -1 }}
            className="rounded-xl border border-white/5 p-4"
            style={{ background: 'rgba(23,28,36,0.6)' }}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-sm font-semibold text-white">{c.substance}</h3>
                <p className="text-xs text-white/40 mt-0.5">{c.regulation} · Limit: {c.currentLimit}%</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {limitsData?.pending_changes?.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white/70">Pending Regulatory Changes</h2>
          {limitsData.pending_changes.map((pc: any, i: number) => (
            <div key={i} className="rounded-xl border border-amber-500/20 p-4 bg-amber-500/5">
              <p className="text-sm font-semibold text-amber-400">{pc.substance}</p>
              <p className="text-xs text-white/60">{pc.change_description}</p>
              <p className="text-[10px] text-white/30 mt-1">Effective: {pc.effective_date}</p>
            </div>
          ))}
        </div>
      )}

      <AICoPilot />
    </div>
  )
}

function SummaryCard({ label, value, color, bg }: { label: string; value: number | string; color: string; bg: string }) {
  return (
    <div className={`rounded-xl border border-white/5 p-4 ${bg}`}>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-white/50 mt-1">{label}</p>
    </div>
  )
}
