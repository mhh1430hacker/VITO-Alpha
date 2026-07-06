'use client'

import { motion } from 'framer-motion'
import { TrendingUp, ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <motion.section
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
      }}
      className="relative mb-32 text-center"
    >
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
        <TrendingUp className="h-3.5 w-3.5" />
        Currently raising $12M Series A
      </div>

      <h1 className="mb-4 text-6xl font-bold tracking-tight sm:text-7xl">
        <span className="bg-gradient-to-r from-white via-violet-200 to-white bg-clip-text text-transparent">
          VITO
        </span>
      </h1>
      <p className="mb-2 text-2xl font-semibold text-gray-300">The Olfactory Intelligence Platform</p>
      <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-gray-400">
        AI-native platform transforming fragrance R&D. From brief to compliance-ready formula in hours, not months.
      </p>

      <div className="mt-8 flex items-center justify-center gap-8">
        <div className="text-center">
          <p className="text-4xl font-bold text-white">$4.8M</p>
          <p className="text-sm text-gray-500">ARR</p>
        </div>
        <div className="h-12 w-px bg-gray-800" />
        <div className="text-center">
          <p className="text-4xl font-bold text-white">47</p>
          <p className="text-sm text-gray-500">Customers</p>
        </div>
        <div className="h-12 w-px bg-gray-800" />
        <div className="text-center">
          <p className="text-4xl font-bold text-white">98.5%</p>
          <p className="text-sm text-gray-500">AI Accuracy</p>
        </div>
        <div className="h-12 w-px bg-gray-800" />
        <div className="text-center">
          <p className="text-4xl font-bold text-white">135%</p>
          <p className="text-sm text-gray-500">Net Retention</p>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-center gap-6">
        {['Firmenich', 'Symrise', 'Givaudan', 'Puig', 'Mane'].map((name) => (
          <span key={name} className="text-sm font-medium text-gray-600">
            {name}
          </span>
        ))}
      </div>
    </motion.section>
  )
}
