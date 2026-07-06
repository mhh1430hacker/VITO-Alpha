'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { dashboardData } from '@/lib/demo-data'

const formatCurrency = (v: number) => `$${(v / 1000).toFixed(0)}K`

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  const total = payload.reduce((s: number, p: any) => s + p.value, 0)
  return (
    <div className="rounded-lg border bg-popover/95 p-3 shadow-md backdrop-blur-sm">
      <p className="text-xs font-medium text-muted-foreground mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="font-medium">{p.name}</span>
          </div>
          <span>{formatCurrency(p.value)}</span>
        </div>
      ))}
      <div className="mt-1.5 pt-1.5 border-t flex items-center justify-between text-xs font-bold">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  )
}

export function RevenueChart() {
  const data = dashboardData.revenueTrend

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="rvStarter" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6C3BF5" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#6C3BF5" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="rvProfessional" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F5A623" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#F5A623" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="rvBusiness" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14B8A6" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="rvEnterprise" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F43F5E" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} dy={8} />
          <YAxis tickFormatter={formatCurrency} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} dx={-4} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Legend
            wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
            iconType="circle"
            iconSize={8}
            verticalAlign="bottom"
          />
          <Area type="monotone" dataKey="starter" stackId="1" stroke="#6C3BF5" fill="url(#rvStarter)" strokeWidth={1.5} name="Starter" />
          <Area type="monotone" dataKey="professional" stackId="1" stroke="#F5A623" fill="url(#rvProfessional)" strokeWidth={1.5} name="Professional" />
          <Area type="monotone" dataKey="business" stackId="1" stroke="#14B8A6" fill="url(#rvBusiness)" strokeWidth={1.5} name="Business" />
          <Area type="monotone" dataKey="enterprise" stackId="1" stroke="#F43F5E" fill="url(#rvEnterprise)" strokeWidth={1.5} name="Enterprise" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
