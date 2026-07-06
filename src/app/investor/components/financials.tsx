'use client'

import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts'
import { investorData } from '@/lib/investor-data'

export function Financials() {
  const projData = investorData.financials.projections.map((p) => ({
    year: p.year,
    ARR: p.arr / 1000000,
    Customers: p.customers,
  }))

  return (
    <motion.section
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
      }}
      className="mb-32"
    >
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-white">Financials</h2>
        <p className="mt-2 text-gray-400">Strong unit economics with a clear path to profitability</p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'CAC', value: '$12K' },
          { label: 'LTV', value: '$96K' },
          { label: 'LTV/CAC', value: '8x' },
          { label: 'Payback', value: '8 mo' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-center backdrop-blur-sm">
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-300">3-Year Projection ($M ARR)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={projData} barSize={50}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} tickFormatter={(v) => `$${v}M`} />
              <Tooltip
                contentStyle={{ background: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
                formatter={(value: number) => [`$${value}M`, 'ARR']}
              />
              <Bar dataKey="ARR" fill="#6C3BF5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-300">Use of Funds — $12M Series A</h3>
          <div className="space-y-3">
            {investorData.funding.useOfFunds.map((item) => (
              <div key={item.category}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-gray-300">{item.category}</span>
                  <span className="text-gray-400">{item.percentage}% (${(item.amount / 1000000).toFixed(1)}M)</span>
                </div>
                <div className="h-2 rounded-full bg-gray-800">
                  <div
                    className="h-2 rounded-full bg-violet-500 transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Current ARR: <span className="font-semibold text-white">$4.8M</span> &middot;
          Projected Year 3 ARR: <span className="font-semibold text-white">$42M</span> &middot;
          8.75x growth
        </p>
      </div>
    </motion.section>
  )
}
