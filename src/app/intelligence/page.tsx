'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useTrackPageView } from '@/lib/intelligence'
import { PAIN_POINTS, getInsights } from '@/lib/intelligence/modules'
import { ModuleCard } from '@/components/intelligence/modules/module-card'
import { AICoPilot } from '@/components/intelligence/ai-co-pilot'

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
}

export default function IntelligenceHubPage() {
  useTrackPageView('intelligence-hub')
  const router = useRouter()
  const insights = getInsights()
  const solved = PAIN_POINTS.length
  const activeInsights = insights.length

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-8 space-y-8"
    >
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-violet-500/20 p-8"
        style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(0,0,0,0) 50%)' }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400/60">Perfumery Intelligence OS</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 font-semibold">Live</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">9 Problems. One Platform. AI-Powered.</h1>
          <p className="text-sm text-white/50 max-w-2xl">
            The fragrance industry has been held back by fragmented tools and hidden knowledge. 
            VITO Intelligence solves every pain point with unified, AI-driven tools — so you create better, faster, and smarter.
          </p>

          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="text-lg font-bold text-white">{solved}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Problems Solved</p>
              </div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <div>
                <p className="text-lg font-bold text-emerald-400">{activeInsights}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Active AI Insights</p>
              </div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="text-lg font-bold text-amber-400">94%</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider">Avg AI Accuracy</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PAIN_POINTS.map((pp, i) => (
          <ModuleCard key={pp.id} painPoint={pp} index={i} />
        ))}
      </div>

      {/* AI Co-Pilot takes bottom-left */}
      <AICoPilot />
    </motion.div>
  )
}
