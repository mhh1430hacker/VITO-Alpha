'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import type { PainPoint } from '@/lib/intelligence/modules'

interface Props {
  painPoint: PainPoint
  index: number
}

const GRADIENTS: Record<number, string> = {
  1: 'from-violet-500 to-purple-600', 2: 'from-emerald-500 to-teal-600', 3: 'from-blue-500 to-cyan-600',
  4: 'from-amber-500 to-orange-600', 5: 'from-rose-500 to-red-600', 6: 'from-fuchsia-500 to-pink-600',
  7: 'from-cyan-500 to-blue-600', 8: 'from-indigo-500 to-violet-600', 9: 'from-gold-500 to-amber-600',
}

export function ModuleCard({ painPoint, index }: Props) {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -3 }}
      onClick={() => router.push(painPoint.href)}
      className="group cursor-pointer rounded-2xl border border-white/5 overflow-hidden transition-all hover:border-white/10"
      style={{ background: 'rgba(23,28,36,0.6)' }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${GRADIENTS[painPoint.id]} shadow-lg`}>
            <span className="text-xl">{painPoint.icon}</span>
          </div>
          <span className="text-[10px] font-bold text-white/20">#{painPoint.id}</span>
        </div>

        <h3 className="text-base font-semibold text-white mb-1">{painPoint.title}</h3>
        <p className="text-xs text-white/50 leading-relaxed mb-4 line-clamp-2">{painPoint.description}</p>

        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 mb-4">
          <p className="text-[10px] font-semibold text-violet-400/80 uppercase tracking-wider mb-1">🤖 AI Feature</p>
          <p className="text-xs text-white/60">{painPoint.aiFeature}</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {painPoint.metrics.map((m) => (
            <div key={m.label} className="text-center">
              <p className={`text-sm font-bold ${
                m.trend === 'up' ? 'text-emerald-400' : m.trend === 'down' ? 'text-rose-400' : 'text-white/60'
              }`}>
                {m.value}
              </p>
              <p className="text-[9px] text-white/30 uppercase tracking-wider mt-0.5">{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="h-1 w-full bg-white/[0.03]">
        <motion.div
          className={`h-full bg-gradient-to-r ${GRADIENTS[painPoint.id]}`}
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          transition={{ duration: 0.8, delay: index * 0.1 }}
        />
      </div>
    </motion.div>
  )
}
