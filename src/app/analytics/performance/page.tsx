'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import {
  AlertCircle,
  Loader2,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Target,
  BarChart3,
  FileWarning,
} from 'lucide-react'

interface KPI {
  label: string
  value: string | number
  icon: React.ElementType
  trend: 'up' | 'down' | 'neutral'
}

interface QualityDataPoint {
  month: string
  qualityScore: number
  target: number
}

interface CostDataPoint {
  month: string
  materials: number
  labor: number
  overhead: number
}

interface SuccessDataPoint {
  name: string
  rate: number
  color: string
}

const QUALITY_DATA: QualityDataPoint[] = [
  { month: 'Jan', qualityScore: 82, target: 80 },
  { month: 'Feb', qualityScore: 85, target: 80 },
  { month: 'Mar', qualityScore: 79, target: 80 },
  { month: 'Apr', qualityScore: 88, target: 80 },
  { month: 'May', qualityScore: 91, target: 80 },
  { month: 'Jun', qualityScore: 87, target: 80 },
]

const COST_DATA: CostDataPoint[] = [
  { month: 'Jan', materials: 42, labor: 28, overhead: 18 },
  { month: 'Feb', materials: 45, labor: 27, overhead: 17 },
  { month: 'Mar', materials: 40, labor: 30, overhead: 19 },
  { month: 'Apr', materials: 38, labor: 26, overhead: 16 },
  { month: 'May', materials: 36, labor: 25, overhead: 15 },
  { month: 'Jun', materials: 39, labor: 24, overhead: 14 },
]

const SUCCESS_DATA: SuccessDataPoint[] = [
  { name: 'Floral', rate: 94, color: '#ec4899' },
  { name: 'Woody', rate: 88, color: '#8b5cf6' },
  { name: 'Citrus', rate: 76, color: '#f59e0b' },
  { name: 'Oriental', rate: 82, color: '#ef4444' },
  { name: 'Fresh', rate: 91, color: '#06b6d4' },
]

const MOCK_KPIS: KPI[] = [
  { label: 'Total Formulas', value: 847, icon: BarChart3, trend: 'up' },
  { label: 'Avg Quality Score', value: '87%', icon: TrendingUp, trend: 'up' },
  { label: 'Avg Commercial Score', value: '7.4/10', icon: Target, trend: 'neutral' },
  { label: 'Success Rate', value: '86.2%', icon: Target, trend: 'up' },
]

type PageState = 'loading' | 'ready' | 'empty' | 'error'

export default function PerformancePage() {
  const [pageState, setPageState] = useState<PageState>('loading')

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageState('ready')
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">Performance Analytics</h1>
            <p className="text-sm text-muted-foreground">Formula performance metrics and trends</p>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="py-6">
                  <div className="h-16 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="py-12">
                  <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    )
  }

  if (pageState === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">Performance Analytics</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <p className="text-red-600 mb-2 font-semibold">Failed to Load Performance Data</p>
              <p className="text-muted-foreground mb-6">Unable to retrieve analytics from the server.</p>
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

  if (pageState === 'empty') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">Performance Analytics</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <FileWarning className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No performance data available yet. Create formulas to start tracking.</p>
              <Button>Create Formula</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Performance Analytics</h1>
            <p className="text-sm text-muted-foreground">Formula performance metrics and trends</p>
          </div>
          <div className="flex items-center gap-2">
            <Input type="date" className="w-36 text-xs" defaultValue="2026-01-01" />
            <span className="text-xs text-muted-foreground">to</span>
            <Input type="date" className="w-36 text-xs" defaultValue="2026-06-29" />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {MOCK_KPIS.map((kpi, i) => {
            const Icon = kpi.icon
            return (
              <Card key={i}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">{kpi.label}</span>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <Badge variant={kpi.trend === 'up' ? 'success' : kpi.trend === 'down' ? 'destructive' : 'secondary'} className="mt-1 text-xs">
                    {kpi.trend === 'up' ? '▲ +2.4%' : kpi.trend === 'down' ? '▼ -1.2%' : '― 0.0%'}
                  </Badge>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quality Score Trend</CardTitle>
              <CardDescription>Monthly average quality scores vs target</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={QUALITY_DATA}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis domain={[60, 100]} fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="qualityScore" stroke="#8b5cf6" strokeWidth={2} name="Quality Score" dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="target" stroke="#ef4444" strokeWidth={2} name="Target" dot={false} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Cost Trends</CardTitle>
              <CardDescription>Monthly cost breakdown by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={COST_DATA}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="materials" fill="#8b5cf6" name="Materials" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="labor" fill="#06b6d4" name="Labor" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="overhead" fill="#f59e0b" name="Overhead" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Success Rate by Accord</CardTitle>
            <CardDescription>Percentage of successful formulations by accord type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {SUCCESS_DATA.map(d => (
                <div key={d.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                      <span>{d.name}</span>
                    </div>
                    <span className="font-semibold">{d.rate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full transition-all"
                      style={{ width: `${d.rate}%`, backgroundColor: d.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
