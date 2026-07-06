'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { dashboardData } from '@/lib/demo-data'

const statusConfig = {
  healthy: { badge: 'success' as const, label: 'Healthy', dot: 'bg-emerald-500' },
  warning: { badge: 'warning' as const, label: 'Warning', dot: 'bg-amber-500' },
  critical: { badge: 'destructive' as const, label: 'Critical', dot: 'bg-red-500' },
}

const driftColor = (score: number) =>
  score < 0.05 ? 'text-emerald-600' : score < 0.1 ? 'text-amber-600' : 'text-red-600'

export function ModelHealthTable() {
  const models = dashboardData.modelHealth

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Model</th>
            <th className="text-right py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Drift Score</th>
            <th className="text-right py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Accuracy</th>
            <th className="text-right py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Last Trained</th>
            <th className="text-right py-2.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody>
          {models.map((model) => {
            const cfg = statusConfig[model.status]
            return (
              <tr key={model.name} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="py-3 font-medium">{model.name}</td>
                <td className={cn('py-3 text-right font-mono text-xs font-medium', driftColor(model.driftScore))}>
                  {model.driftScore.toFixed(2)}
                </td>
                <td className="py-3 text-right font-medium">{model.accuracy}%</td>
                <td className="py-3 text-right text-muted-foreground text-xs">
                  {new Date(model.lastTrained).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <div className={cn('h-2 w-2 rounded-full', cfg.dot)} />
                    <Badge variant={cfg.badge} className="text-[10px] px-2 py-0">{cfg.label}</Badge>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
