'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  AlertCircle,
  Package,
} from 'lucide-react'

interface PricingMaterial {
  id: number
  material: string
  currentCost: number
  lastPrice: number
  priceChange: number
  trend: 'up' | 'down' | 'stable'
  history: number[]
}

const MOCK_PRICING: PricingMaterial[] = [
  { id: 1, material: 'Benzyl Acetate', currentCost: 12.50, lastPrice: 11.80, priceChange: 0.70, trend: 'up', history: [11.2, 11.5, 11.8, 12.0, 12.5] },
  { id: 2, material: 'Linalool', currentCost: 8.20, lastPrice: 8.50, priceChange: -0.30, trend: 'down', history: [9.0, 8.8, 8.6, 8.5, 8.2] },
  { id: 3, material: 'Vanillin', currentCost: 15.00, lastPrice: 14.50, priceChange: 0.50, trend: 'up', history: [13.5, 14.0, 14.2, 14.5, 15.0] },
  { id: 4, material: 'Coumarin', currentCost: 22.00, lastPrice: 22.00, priceChange: 0.00, trend: 'stable', history: [22.5, 22.3, 22.0, 22.0, 22.0] },
  { id: 5, material: 'Methyl Ionone', currentCost: 18.75, lastPrice: 19.50, priceChange: -0.75, trend: 'down', history: [20.0, 19.8, 19.5, 19.2, 18.75] },
  { id: 6, material: 'Limonene', currentCost: 5.50, lastPrice: 5.20, priceChange: 0.30, trend: 'up', history: [4.8, 5.0, 5.1, 5.2, 5.5] },
  { id: 7, material: 'Ethyl Vanillin', currentCost: 45.00, lastPrice: 42.00, priceChange: 3.00, trend: 'up', history: [40.0, 40.5, 41.0, 42.0, 45.0] },
  { id: 8, material: 'Geraniol', currentCost: 11.30, lastPrice: 11.30, priceChange: 0.00, trend: 'stable', history: [11.5, 11.4, 11.3, 11.3, 11.3] },
  { id: 9, material: 'Hedione', currentCost: 32.00, lastPrice: 33.00, priceChange: -1.00, trend: 'down', history: [34.0, 33.5, 33.0, 32.5, 32.0] },
  { id: 10, material: 'Iso E Super', currentCost: 28.50, lastPrice: 27.00, priceChange: 1.50, trend: 'up', history: [26.0, 26.5, 26.8, 27.0, 28.5] },
  { id: 11, material: 'Galaxolide', currentCost: 38.00, lastPrice: 39.00, priceChange: -1.00, trend: 'down', history: [40.0, 39.5, 39.0, 38.5, 38.0] },
]

function Sparkline({ data, trend }: { data: number[]; trend: string }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const w = 80
  const h = 24
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 4) - 2
    return `${x},${y}`
  }).join(' ')
  const color = trend === 'up' ? '#22c55e' : trend === 'down' ? '#ef4444' : '#6b7280'

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-20 h-6">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
    </svg>
  )
}

export default function PricingPage() {
  const [pricing, setPricing] = useState<PricingMaterial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setPricing(MOCK_PRICING)
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">Pricing</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">Pricing</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Pricing</h1>
          <p className="text-sm text-muted-foreground">Material cost tracking and price history</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Cost/kg</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(pricing.reduce((s, p) => s + p.currentCost, 0) / pricing.length).toFixed(2)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Price Increases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {pricing.filter(p => p.trend === 'up').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Price Decreases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {pricing.filter(p => p.trend === 'down').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {pricing.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No pricing data available</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Current Cost/kg</TableHead>
                    <TableHead>Last Price</TableHead>
                    <TableHead>Price Change</TableHead>
                    <TableHead>Trend</TableHead>
                    <TableHead>Price History</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pricing.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.material}</TableCell>
                      <TableCell className="font-mono font-semibold">${p.currentCost.toFixed(2)}</TableCell>
                      <TableCell className="font-mono text-muted-foreground">${p.lastPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={p.priceChange > 0 ? 'text-green-600 font-mono' : p.priceChange < 0 ? 'text-red-600 font-mono' : 'text-muted-foreground font-mono'}>
                          {p.priceChange > 0 ? '+' : ''}{p.priceChange.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {p.trend === 'up' && (
                          <Badge variant="success" className="flex items-center gap-1 w-fit">
                            <TrendingUp className="h-3 w-3" /> Up
                          </Badge>
                        )}
                        {p.trend === 'down' && (
                          <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                            <TrendingDown className="h-3 w-3" /> Down
                          </Badge>
                        )}
                        {p.trend === 'stable' && (
                          <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                            <Minus className="h-3 w-3" /> Stable
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Sparkline data={p.history} trend={p.trend} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
