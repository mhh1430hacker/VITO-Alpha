'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useInvestorStore } from '@/lib/store'
import { HeroSection } from './components/hero'
import { MarketOpportunity } from './components/market-opportunity'
import { ProductDemo } from './components/product-demo'
import { Traction } from './components/traction'
import { Technology } from './components/technology'
import { Team } from './components/team'
import { Financials } from './components/financials'
import { CompetitiveLandscape } from './components/competitive'
import { Ask } from './components/ask'

export default function InvestorPage() {
  const router = useRouter()
  const { isAuthenticated } = useInvestorStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/investor/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 h-[600px] w-[600px] rounded-full bg-violet-500/5 blur-[150px]" />
          <div className="absolute bottom-1/4 -right-1/4 h-[500px] w-[500px] rounded-full bg-amber-500/5 blur-[150px]" />
        </div>
        <div className="relative mx-auto max-w-6xl px-8 py-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } },
            }}
          >
            <HeroSection />
            <MarketOpportunity />
            <ProductDemo />
            <Traction />
            <Technology />
            <Team />
            <Financials />
            <CompetitiveLandscape />
            <Ask />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
