'use client'

import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

const marketData = [
  { name: 'TAM', value: 60, label: '$60B', description: 'Global fragrance market' },
  { name: 'SAM', value: 12, label: '$12B', description: 'Fragrance R&D software & services' },
  { name: 'SOM', value: 1.2, label: '$1.2B', description: 'AI-powered formulation segment' },
]

export function MarketOpportunity() {
  return (
    <motion.section
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
      }}
      className="mb-32"
    >
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-white">Market Opportunity</h2>
        <p className="mt-2 text-gray-400">A massive, underserved market ripe for AI disruption</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-8 backdrop-blur-sm">
          <h3 className="mb-6 text-lg font-semibold text-white">Market Size ($B)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={marketData} barSize={60}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
                formatter={(value: number) => [`$${value}B`, 'Market Size']}
              />
              <Bar dataKey="value" fill="#6C3BF5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {marketData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{d.name}: {d.description}</span>
                <span className="font-semibold text-white">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-8 backdrop-blur-sm">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
            320% YoY Growth
          </div>
          <h3 className="mb-4 text-lg font-semibold text-white">The Pain Point</h3>
          <blockquote className="border-l-2 border-violet-500 pl-4 text-lg italic text-gray-300">
            &ldquo;90% of fragrance R&D still uses spreadsheets&rdquo;
          </blockquote>
          <p className="mt-2 text-xs text-gray-500">— IFRA Industry Survey 2025</p>
          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-gray-800 bg-gray-950/50 p-4">
              <p className="text-sm font-medium text-white">Legacy workflow costs</p>
              <p className="mt-1 text-sm text-gray-400">Average fragrance R&D cycle: 12-18 months. VITO reduces to 2-4 weeks. That&apos;s 10x faster.</p>
            </div>
            <div className="rounded-lg border border-gray-800 bg-gray-950/50 p-4">
              <p className="text-sm font-medium text-white">Compliance risk</p>
              <p className="mt-1 text-sm text-gray-400">Non-compliance with IFRA standards can cost millions in recalls. VITO provides real-time compliance checking at 99.1% accuracy.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
