'use client'

import { motion } from 'framer-motion'
import { Mail, ArrowUpRight } from 'lucide-react'
import { investorData } from '@/lib/investor-data'

export function Ask() {
  return (
    <motion.section
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
      }}
      className="mb-16"
    >
      <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-b from-violet-500/10 to-black p-12 text-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-500/20 blur-[100px]" />
        </div>

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-violet-500/20 px-4 py-1.5 text-sm text-violet-300">
            Series A
          </span>

          <h2 className="mt-6 text-4xl font-bold text-white">
            Raising ${(investorData.funding.target / 1000000).toFixed(0)}M
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-gray-400">
            Join us in transforming the $60B fragrance industry with AI. We have the product, the traction, and the team.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href="mailto:investors@vito.ai"
              className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-3 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
            >
              <Mail className="h-4 w-4" />
              investors@vito.ai
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-6 py-3 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
            >
              View Pitch Deck <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <p className="mt-6 text-xs text-gray-600">
            Lead investor: {investorData.funding.leadInvestor} &middot; Pre-money valuation: ${(investorData.funding.preMoney / 1000000).toFixed(0)}M
          </p>
        </div>
      </div>
    </motion.section>
  )
}
