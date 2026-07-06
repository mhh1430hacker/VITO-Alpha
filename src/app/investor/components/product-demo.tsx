'use client'

import { motion } from 'framer-motion'
import { FlaskConical, ShieldCheck, Users, Lock, ArrowRight, Brain, BarChart3 } from 'lucide-react'

const capabilities = [
  {
    icon: Brain,
    title: 'AI Formulation Engine',
    description: 'Generate complete, compliant formulas from a brief in minutes. Multi-objective optimization for cost, performance, and compliance.',
  },
  {
    icon: ShieldCheck,
    title: 'Real-Time Compliance',
    description: 'Instant IFRA 51st Amendment checking. Automatic flagging of restricted materials and concentration limits.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Real-time co-editing, comments, approvals, and version control. Built for distributed fragrance teams.',
  },
  {
    icon: Lock,
    title: 'Enterprise Security',
    description: 'SOC 2, SSO/SAML, RBAC, audit logs, and data encryption. Enterprise-grade security from day one.',
  },
  {
    icon: BarChart3,
    title: 'Business Intelligence',
    description: 'Executive dashboards with real-time KPIs, revenue analytics, model health monitoring, and predictive insights.',
  },
  {
    icon: FlaskConical,
    title: '500K+ Molecule Database',
    description: 'Curated molecular database with olfactory profiles, IFRA limits, cost data, and performance characteristics.',
  },
]

export function ProductDemo() {
  return (
    <motion.section
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
      }}
      className="mb-32"
    >
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-white">The Platform</h2>
        <p className="mt-2 text-gray-400">Everything you need to create fragrances at AI speed</p>
      </div>

      <div className="relative mb-12 overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-900 to-black p-1">
        <div className="rounded-xl bg-gray-950 p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((cap) => {
              const Icon = cap.icon
              return (
                <div key={cap.title} className="group rounded-lg border border-gray-800 bg-black/50 p-6 transition-colors hover:border-violet-500/30">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
                    <Icon className="h-5 w-5 text-violet-400" />
                  </div>
                  <h3 className="mb-2 text-sm font-semibold text-white">{cap.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-400">{cap.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="text-center">
        <a
          href="#ask"
          className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
        >
          See the full product demo <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </motion.section>
  )
}
