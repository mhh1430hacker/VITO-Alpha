'use client'

import { motion } from 'framer-motion'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts'
import { investorData } from '@/lib/investor-data'

const chartColors = {
  revenue: '#6C3BF5',
  customers: '#14B8A6',
  grid: '#1F2937',
  text: '#6B7280',
}

export function Traction() {
  const revData = investorData.financials.monthlyRevenue

  return (
    <motion.section
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
      }}
      className="mb-32"
    >
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-white">Traction</h2>
        <p className="mt-2 text-gray-400">From $0 to $4.8M ARR in 24 months</p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'ARR', value: '$4.8M', sub: '+320% YoY' },
          { label: 'MRR', value: '$412K', sub: '15% MoM growth' },
          { label: 'Gross Margin', value: '82%', sub: 'Software-led' },
          { label: 'Net Retention', value: '135%', sub: 'Expanding revenue' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-center backdrop-blur-sm">
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
            <p className="mt-0.5 text-[11px] text-emerald-400">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-300">Revenue Growth ($)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.revenue} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={chartColors.revenue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: chartColors.text, fontSize: 10 }} tickFormatter={(v) => v.split(' ')[0]} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: chartColors.text, fontSize: 10 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ background: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke={chartColors.revenue} fill="url(#revGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-300">Customer Growth</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={revData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: chartColors.text, fontSize: 10 }} tickFormatter={(v) => v.split(' ')[0]} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: chartColors.text, fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Line type="monotone" dataKey="customers" stroke={chartColors.customers} strokeWidth={2} dot={{ fill: chartColors.customers, r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-300">Revenue by Plan Tier</h3>
          <div className="space-y-3">
            {investorData.financials.revenueByPlan.map((plan) => (
              <div key={plan.plan}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-gray-300">{plan.plan}</span>
                  <span className="text-gray-400">${plan.mrr.toLocaleString()} MRR</span>
                </div>
                <div className="h-2 rounded-full bg-gray-800">
                  <div
                    className="h-2 rounded-full bg-violet-500 transition-all"
                    style={{ width: `${plan.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-300">Customer Testimonials</h3>
          <div className="space-y-4">
            {investorData.testimonials.slice(0, 2).map((t, i) => (
              <blockquote key={i} className="border-l-2 border-violet-500/50 pl-4">
                <p className="text-sm italic leading-relaxed text-gray-300">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-2 text-xs text-gray-500">— {t.author}, {t.title}</p>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
