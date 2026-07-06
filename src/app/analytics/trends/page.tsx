'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import { cn } from '@/lib/utils'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import {
  AlertCircle,
  Loader2,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Gavel,
  FileWarning,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'

interface AccordTrend {
  month: string
  floral: number
  woody: number
  citrus: number
  oriental: number
}

interface MaterialCost {
  material: string
  cas: string
  q1Cost: number
  q2Cost: number
  change: number
  trend: 'up' | 'down' | 'stable'
}

interface RegulatoryChange {
  date: string
  regulation: string
  impact: 'high' | 'medium' | 'low'
  description: string
}

const ACCORD_TRENDS: AccordTrend[] = [
  { month: 'Jan', floral: 120, woody: 95, citrus: 80, oriental: 45 },
  { month: 'Feb', floral: 125, woody: 98, citrus: 78, oriental: 48 },
  { month: 'Mar', floral: 132, woody: 102, citrus: 85, oriental: 50 },
  { month: 'Apr', floral: 128, woody: 110, citrus: 90, oriental: 55 },
  { month: 'May', floral: 135, woody: 115, citrus: 88, oriental: 60 },
  { month: 'Jun', floral: 142, woody: 120, citrus: 92, oriental: 62 },
]

const MATERIAL_COSTS: MaterialCost[] = [
  { material: 'Benzyl Acetate', cas: '140-11-4', q1Cost: 12.50, q2Cost: 13.80, change: 10.4, trend: 'up' },
  { material: 'Linalool', cas: '78-70-6', q1Cost: 8.20, q2Cost: 7.90, change: -3.7, trend: 'down' },
  { material: 'Vanillin', cas: '121-33-5', q1Cost: 15.00, q2Cost: 16.50, change: 10.0, trend: 'up' },
  { material: 'Limonene', cas: '5989-27-5', q1Cost: 5.50, q2Cost: 5.50, change: 0.0, trend: 'stable' },
  { material: 'Hedione', cas: '24851-98-7', q1Cost: 32.00, q2Cost: 30.50, change: -4.7, trend: 'down' },
  { material: 'Galaxolide', cas: '1222-05-5', q1Cost: 38.00, q2Cost: 42.00, change: 10.5, trend: 'up' },
]

const REGULATORY_CHANGES: RegulatoryChange[] = [
  { date: '2026-03-15', regulation: 'IFRA 51st Amendment', impact: 'high', description: 'New restrictions on Musk Ketone and Lilial concentrations in leave-on products.' },
  { date: '2026-05-01', regulation: 'EU REACH SVHC Update', impact: 'medium', description: '5 new substances added to the Candidate List of Substances of Very High Concern.' },
  { date: '2026-06-10', regulation: 'CLP Hazard Class Update', impact: 'medium', description: 'Updated hazard classifications for 12 fragrance allergens under EU CLP Regulation.' },
  { date: '2026-07-01', regulation: 'UK REACH Deadline', impact: 'high', description: 'Grandfathering deadline for UK REACH registration of EU-REACH registered substances.' },
]

const IMPACT_VARIANT: Record<string, 'destructive' | 'warning' | 'secondary'> = {
  high: 'destructive',
  medium: 'warning',
  low: 'secondary',
}

const ACCORD_COLORS: Record<string, string> = {
  floral: '#ec4899',
  woody: '#8b5cf6',
  citrus: '#f59e0b',
  oriental: '#ef4444',
}

type PageState = 'loading' | 'ready' | 'empty' | 'error'

export default function TrendsPage() {
  const [pageState, setPageState] = useState<PageState>('loading')

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageState('ready')
    }, 1100)
    return () => clearTimeout(timer)
  }, [])

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">Trend Analysis</h1>
            <p className="text-sm text-muted-foreground">Market and ingredient trend intelligence</p>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="py-12">
                  <div className="h-48 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    )
  }

  if (pageState === 'empty') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">Trend Analysis</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <FileWarning className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No trend data available yet. Data will populate as formulas are created.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (pageState === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">Trend Analysis</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <p className="text-red-600 mb-2 font-semibold">Failed to Load Trend Data</p>
              <p className="text-muted-foreground mb-6">Unable to retrieve market trend data.</p>
              <Button onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
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
          <h1 className="text-2xl font-bold">Trend Analysis</h1>
          <p className="text-sm text-muted-foreground">Market and ingredient trend intelligence</p>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm">Accord Popularity Trend</CardTitle>
              <CardDescription>Number of formulas created per accord type over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ACCORD_TRENDS}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Legend />
                    {Object.entries(ACCORD_COLORS).map(([key, color]) => (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={color}
                        strokeWidth={2}
                        name={key.charAt(0).toUpperCase() + key.slice(1)}
                        dot={{ r: 3 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Material Cost Trends
              </CardTitle>
              <CardDescription>Q1 vs Q2 cost comparison</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>CAS#</TableHead>
                    <TableHead>Q1/kg</TableHead>
                    <TableHead>Q2/kg</TableHead>
                    <TableHead>Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MATERIAL_COSTS.map(m => (
                    <TableRow key={m.cas}>
                      <TableCell className="font-medium">{m.material}</TableCell>
                      <TableCell className="font-mono text-xs">{m.cas}</TableCell>
                      <TableCell>${m.q1Cost.toFixed(2)}</TableCell>
                      <TableCell>${m.q2Cost.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-xs">
                          {m.trend === 'up' ? (
                            <ArrowUpRight className="h-3 w-3 text-red-500" />
                          ) : m.trend === 'down' ? (
                            <ArrowDownRight className="h-3 w-3 text-green-500" />
                          ) : null}
                          <span className={cn(
                            m.trend === 'up' && 'text-red-600',
                            m.trend === 'down' && 'text-green-600',
                          )}>
                            {m.change > 0 ? '+' : ''}{m.change}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Gavel className="h-4 w-4" />
                Regulatory Change Impact Timeline
              </CardTitle>
              <CardDescription>Upcoming and recent regulatory changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {REGULATORY_CHANGES.map((r, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        'w-3 h-3 rounded-full mt-1',
                        r.impact === 'high' ? 'bg-red-500' : r.impact === 'medium' ? 'bg-yellow-500' : 'bg-blue-500',
                      )} />
                      {i < REGULATORY_CHANGES.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 mt-1" />}
                    </div>
                    <div className="pb-4 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-muted-foreground">{r.date}</span>
                        <Badge variant={IMPACT_VARIANT[r.impact]}>{r.impact} impact</Badge>
                      </div>
                      <p className="font-medium text-sm">{r.regulation}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{r.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
