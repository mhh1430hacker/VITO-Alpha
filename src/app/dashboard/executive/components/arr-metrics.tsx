'use client'

import { motion } from 'framer-motion'
import { DollarSign, TrendingUp, Users, Brain } from 'lucide-react'
import { MetricCard } from './metric-card'
import { dashboardData } from '@/lib/demo-data'

export function ArrMetrics() {
  const { arr, mrr, customers, predictions, arrSparkline, mrrSparkline, customerSparkline, predictionSparkline } = dashboardData

  const items = [
    {
      label: 'Annual Recurring Revenue',
      value: `$${(arr.current / 1000000).toFixed(1)}M`,
      trend: arr.trend,
      trendValue: `+${arr.change}% YoY`,
      icon: DollarSign,
      sparklineData: arrSparkline,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
    },
    {
      label: 'Monthly Recurring Revenue',
      value: `$${(mrr.current / 1000).toFixed(0)}K`,
      trend: mrr.trend,
      trendValue: `+${mrr.change}% MoM`,
      icon: TrendingUp,
      sparklineData: mrrSparkline,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
    },
    {
      label: 'Active Customers',
      value: customers.total.toString(),
      trend: customers.trend,
      trendValue: `+${customers.new} this month`,
      icon: Users,
      sparklineData: customerSparkline,
      iconColor: 'text-violet-600',
      iconBg: 'bg-violet-100',
    },
    {
      label: 'AI Predictions Today',
      value: predictions.today.toLocaleString(),
      trend: 'up',
      trendValue: `${predictions.accuracy}% accuracy`,
      icon: Brain,
      sparklineData: predictionSparkline,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-100',
    },
  ]

  return (
    <>
      {items.map((item) => (
        <motion.div key={item.label} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
          <MetricCard {...item} />
        </motion.div>
      ))}
    </>
  )
}
