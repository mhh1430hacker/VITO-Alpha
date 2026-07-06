'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { dashboardData } from '@/lib/demo-data'

const planColor = {
  Enterprise: 'bg-violet-100 text-violet-700 border-violet-200',
  Business: 'bg-blue-100 text-blue-700 border-blue-200',
  Professional: 'bg-amber-100 text-amber-700 border-amber-200',
}

const healthColor = (h: number) =>
  h >= 80 ? 'bg-emerald-500' : h >= 60 ? 'bg-amber-500' : 'bg-red-500'

const Trend = ({ trend }: { trend: string }) => {
  if (trend === 'up') return <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
  if (trend === 'down') return <TrendingDown className="h-3.5 w-3.5 text-red-500" />
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />
}

export function TopCustomers() {
  const customers = dashboardData.topCustomers

  return (
    <div className="space-y-3">
      {customers.map((c) => (
        <div key={c.name} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
              c.health >= 80 ? 'bg-emerald-100 text-emerald-700' :
              c.health >= 60 ? 'bg-amber-100 text-amber-700' :
              'bg-red-100 text-red-700'
            )}>
              {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{c.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Trend trend={c.trend} />
                <span className="text-xs text-muted-foreground">${c.mrr.toLocaleString()}/mo</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className={cn('text-[10px] px-2 py-0', planColor[c.plan])}>
              {c.plan}
            </Badge>
            <div className="flex items-center gap-1.5">
              <div className={cn('h-2 w-2 rounded-full', healthColor(c.health))} />
              <span className="text-xs font-medium text-muted-foreground">{c.health}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
