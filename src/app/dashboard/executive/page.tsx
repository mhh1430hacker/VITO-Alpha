'use client'

import { motion } from 'framer-motion'
import { ChartCard } from './components/chart-card'
import { ArrMetrics } from './components/arr-metrics'
import { RevenueChart } from './components/revenue-chart'
import { CustomerGrowthChart } from './components/customer-growth-chart'
import { ModelHealthTable } from './components/model-health-table'
import { TopCustomers } from './components/top-customers'
import { ComplianceScore } from './components/compliance-score'
import { AiPerformance } from './components/ai-performance'
import { FormulaIntelligence } from './components/formula-intelligence'
import { ActivityTimeline } from './components/activity-timeline'
import { cn } from '@/lib/utils'
import { ShieldCheck, Brain, Beaker, Activity } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 }
}

export default function ExecutiveDashboard() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 p-6"
    >
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
          <p className="text-muted-foreground mt-1">CEO-level fragrance intelligence cockpit</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ArrMetrics />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        <motion.div variants={item} className="lg:col-span-1">
          <ChartCard title="Compliance Score" description="IFRA & regulatory overview">
            <ComplianceScore />
          </ChartCard>
        </motion.div>
        <motion.div variants={item} className="lg:col-span-1">
          <ChartCard title="Formula Intelligence" description="AI-driven formula development">
            <FormulaIntelligence />
          </ChartCard>
        </motion.div>
        <motion.div variants={item} className="lg:col-span-1">
          <ChartCard title="AI Performance" description="Prediction volume & GPU metrics">
            <AiPerformance />
          </ChartCard>
        </motion.div>
        <motion.div variants={item} className="lg:col-span-1">
          <ChartCard title="Customer Health" description="Expansion & pipeline overview">
            <div className="space-y-4">
              {[
                { label: 'Expansion Opportunities', value: '8', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-100' },
                { label: 'Pipeline Value', value: '$320K', icon: Brain, color: 'text-blue-600', bg: 'bg-blue-100' },
                { label: 'Active Upgrades', value: '3', icon: ShieldCheck, color: 'text-amber-600', bg: 'bg-amber-100' },
                { label: 'This Month', value: '$45K', icon: Beaker, color: 'text-violet-600', bg: 'bg-violet-100' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between p-2.5 rounded-lg border">
                  <div className="flex items-center gap-2.5">
                    <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', stat.bg)}>
                      <stat.icon className={cn('h-4 w-4', stat.color)} />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
                  </div>
                  <span className="text-base font-bold">{stat.value}</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </motion.div>
      </div>

      <motion.div variants={item}>
        <ChartCard title="Revenue Trend" description="Monthly revenue by plan tier with hockey-stick growth">
          <RevenueChart />
        </ChartCard>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div variants={item} className="lg:col-span-2">
          <ChartCard title="Customer Growth" description="New vs churned customers monthly">
            <CustomerGrowthChart />
          </ChartCard>
        </motion.div>
        <motion.div variants={item} className="lg:col-span-1">
          <ChartCard title="Top Customers" description="By MRR & health score">
            <TopCustomers />
          </ChartCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div variants={item} className="lg:col-span-2">
          <ChartCard title="AI Model Health" description="Drift detection & accuracy monitoring">
            <ModelHealthTable />
          </ChartCard>
        </motion.div>
        <motion.div variants={item} className="lg:col-span-1">
          <ChartCard title="Activity Timeline" description="Real-time team activity">
            <ActivityTimeline />
          </ChartCard>
        </motion.div>
      </div>
    </motion.div>
  )
}
