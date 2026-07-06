'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, LineChart, Line, Legend,
} from 'recharts'
import { useInvestorStore } from '@/lib/store'
import { investorData } from '@/lib/investor-data'

const COLORS = ['#6C3BF5', '#F5A623', '#14B8A6', '#F43F5E', '#8B5CF6', '#34D399', '#F97316', '#06B6D4']

export default function InvestorDashboardPage() {
  const router = useRouter()
  const { isAuthenticated } = useInvestorStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/investor/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  const revData = investorData.financials.monthlyRevenue
  const funnelData = investorData.financials.customerAcquisitionFunnel
  const planData = investorData.financials.revenueByPlan
  const geoData = investorData.financials.geographicRevenue
  const cohortData = investorData.financials.retentionCohorts

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Investor Dashboard</h1>
            <p className="mt-1 text-gray-400">Real-time business metrics for VITO</p>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <p className="text-xs text-gray-500">ARR</p>
              <p className="text-2xl font-bold text-white">$4.8M</p>
              <p className="text-xs text-emerald-400">+320% YoY</p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <p className="text-xs text-gray-500">MRR</p>
              <p className="text-2xl font-bold text-white">$412K</p>
              <p className="text-xs text-emerald-400">+15% MoM</p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <p className="text-xs text-gray-500">Customers</p>
              <p className="text-2xl font-bold text-white">47</p>
              <p className="text-xs text-emerald-400">+8 net new</p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <p className="text-xs text-gray-500">AI Accuracy</p>
              <p className="text-2xl font-bold text-white">98.5%</p>
              <p className="text-xs text-emerald-400">+2.1%</p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <p className="text-xs text-gray-500">Predictions Today</p>
              <p className="text-2xl font-bold text-white">12,847</p>
              <p className="text-xs text-emerald-400">Live</p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <p className="text-xs text-gray-500">LTV/CAC</p>
              <p className="text-2xl font-bold text-white">8x</p>
              <p className="text-xs text-emerald-400">Healthy</p>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-sm font-semibold text-gray-300">Revenue Growth ($)</h3>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={revData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6C3BF5" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#6C3BF5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} tickFormatter={(v) => v.split(' ')[0]} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={{ background: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} labelStyle={{ color: '#F3F4F6' }} formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#6C3BF5" fill="url(#revGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-sm font-semibold text-gray-300">Customer Acquisition Funnel</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={funnelData} layout="vertical" barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} />
                  <YAxis type="category" dataKey="stage" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10 }} width={120} />
                  <Tooltip contentStyle={{ background: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} labelStyle={{ color: '#F3F4F6' }} />
                  <Bar dataKey="count" fill="#6C3BF5" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-sm font-semibold text-gray-300">Revenue by Plan Tier</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={planData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="mrr" nameKey="plan">
                    {planData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} formatter={(value: number) => [`$${value.toLocaleString()} MRR`, '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-1">
                {planData.map((p, i) => (
                  <div key={p.plan} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      {p.plan}
                    </span>
                    <span className="text-gray-400">{p.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-sm font-semibold text-gray-300">Geographic Distribution</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={geoData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="mrr" nameKey="region">
                    {geoData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} formatter={(value: number) => [`$${value.toLocaleString()} MRR`, '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-1">
                {geoData.map((g, i) => (
                  <div key={g.region} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      {g.region}
                    </span>
                    <span className="text-gray-400">{g.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-sm font-semibold text-gray-300">Retention Cohorts</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={cohortData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                  <XAxis dataKey="cohort" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} />
                  <YAxis domain={[80, 105]} axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip contentStyle={{ background: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} formatter={(value: number) => [`${value}%`, 'Retention']} />
                  <Line type="monotone" dataKey="retention" stroke="#14B8A6" strokeWidth={2} dot={{ fill: '#14B8A6', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
            <h3 className="mb-4 text-sm font-semibold text-gray-300">Monthly Revenue & Customer Detail</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Month</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Revenue</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Customers</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">ARPU</th>
                  </tr>
                </thead>
                <tbody>
                  {revData.map((row) => (
                    <tr key={row.month} className="border-b border-gray-800/50 transition-colors hover:bg-gray-900/30">
                      <td className="px-4 py-2.5 text-gray-300">{row.month}</td>
                      <td className="px-4 py-2.5 text-right text-gray-300">${row.revenue.toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-right text-gray-300">{row.customers}</td>
                      <td className="px-4 py-2.5 text-right text-gray-300">${(row.revenue / row.customers).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
