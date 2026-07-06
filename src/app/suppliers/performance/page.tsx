'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, Truck, ThumbsDown, DollarSign, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Performance {
  supplier_id: number
  supplier_name: string
  on_time_delivery: number
  quality_rejection_rate: number
  pricing_competitiveness: number
  responsiveness: number
  overall_score: number
}

const MOCK_PERFORMANCES: Performance[] = [
  { supplier_id: 1, supplier_name: 'Givaudan SA', on_time_delivery: 94.2, quality_rejection_rate: 2.1, pricing_competitiveness: 4.0, responsiveness: 4.5, overall_score: 87 },
  { supplier_id: 2, supplier_name: 'Firmenich SA', on_time_delivery: 97.8, quality_rejection_rate: 1.3, pricing_competitiveness: 3.5, responsiveness: 4.8, overall_score: 92 },
  { supplier_id: 3, supplier_name: 'IFF Inc', on_time_delivery: 88.5, quality_rejection_rate: 3.7, pricing_competitiveness: 4.2, responsiveness: 3.8, overall_score: 78 },
  { supplier_id: 4, supplier_name: 'Symrise AG', on_time_delivery: 96.1, quality_rejection_rate: 1.8, pricing_competitiveness: 4.5, responsiveness: 4.2, overall_score: 90 },
  { supplier_id: 5, supplier_name: 'Takasago Corp', on_time_delivery: 82.0, quality_rejection_rate: 5.2, pricing_competitiveness: 3.8, responsiveness: 3.5, overall_score: 71 },
]

const scoreColor = (score: number) => {
  if (score >= 90) return 'text-green-600'
  if (score >= 80) return 'text-yellow-600'
  return 'text-red-600'
}

const barColor = (value: number, inverse = false) => {
  const v = inverse ? 100 - value : value
  if (v >= 90) return 'bg-green-500'
  if (v >= 75) return 'bg-yellow-500'
  return 'bg-red-500'
}

export default function PerformancePage() {
  const [performances, setPerformances] = useState<Performance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setPerformances(MOCK_PERFORMANCES)
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading scorecards...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-lg text-destructive">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Supplier Performance Scorecards</h1>
          <p className="text-sm text-muted-foreground">On-time delivery, quality, pricing & responsiveness</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {performances.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No performance data available</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {performances.map(p => (
              <Card key={p.supplier_id}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">{p.supplier_name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className={cn('text-3xl font-bold', scoreColor(p.overall_score))}>
                      {p.overall_score}
                    </span>
                    <span className="text-sm text-muted-foreground">/ 100</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span>On-Time Delivery</span>
                      </div>
                      <span className="text-sm font-medium">{p.on_time_delivery}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all', barColor(p.on_time_delivery))}
                        style={{ width: `${p.on_time_delivery}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 text-sm">
                        <ThumbsDown className="h-4 w-4 text-muted-foreground" />
                        <span>Quality Rejection Rate</span>
                      </div>
                      <span className="text-sm font-medium">{p.quality_rejection_rate}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all', barColor(p.quality_rejection_rate, true))}
                        style={{ width: `${Math.min(p.quality_rejection_rate * 10, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>Pricing Competitiveness</span>
                      </div>
                      <span className="text-sm font-medium">{p.pricing_competitiveness} / 5</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all', barColor(p.pricing_competitiveness * 20))}
                        style={{ width: `${(p.pricing_competitiveness / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 text-sm">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span>Responsiveness</span>
                      </div>
                      <span className="text-sm font-medium">{p.responsiveness} / 5</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all', barColor(p.responsiveness * 20))}
                        style={{ width: `${(p.responsiveness / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
