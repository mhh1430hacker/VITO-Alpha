'use client'

import { motion } from 'framer-motion'
import { Cpu, Database, Shield, Layers, ArrowRight } from 'lucide-react'
import { investorData } from '@/lib/investor-data'

export function Technology() {
  return (
    <motion.section
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
      }}
      className="mb-32"
    >
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-white">Technology</h2>
        <p className="mt-2 text-gray-400">Patent-pending AI architecture built for fragrance</p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Molecule Database', value: '500K+', icon: Database },
          { label: 'AI Models', value: '12', icon: Cpu },
          { label: 'Predictions Total', value: '2.84M', icon: Layers },
          { label: 'Patent Applications', value: '3', icon: Shield },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-center backdrop-blur-sm">
              <Icon className="mx-auto mb-2 h-5 w-5 text-violet-400" />
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-300">Data Moat</h3>
          <ul className="space-y-3">
            {investorData.technology.dataMoat.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                <span className="text-sm text-gray-400">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-300">Architecture</h3>
          <div className="space-y-3">
            {investorData.technology.architecture.map((layer, i) => (
              <div key={i} className="rounded-lg border border-gray-800 bg-black/50 p-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">{layer.layer}</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">{layer.components}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
