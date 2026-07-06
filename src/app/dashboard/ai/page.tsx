'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { dashboardAPI } from '@/lib/api'
import { KPICards } from '@/types'
import { AIModel, AIExperiment } from '@/types/enterprise'
import { cn } from '@/lib/utils'
import {
  Brain, Cpu, Activity, AlertTriangle, BarChart3, FlaskConical,
  AlertCircle, RefreshCw, ChevronUp, ChevronDown, Gauge, Server
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts'

interface ModelLeaderboardEntry {
  id: number
  name: string
  accuracy: number
  f1Score: number
  latencyMs: number
  status: string
  lastTrained: string
}

interface DriftAlert {
  id: number
  modelName: string
  metric: string
  driftValue: number
  threshold: number
  detectedAt: string
}

const predictionVolumeData = [
  { day: 'Mon', count: 142 }, { day: 'Tue', count: 189 }, { day: 'Wed', count: 165 },
  { day: 'Thu', count: 203 }, { day: 'Fri', count: 178 }, { day: 'Sat', count: 98 },
  { day: 'Sun', count: 87 },
]

const mockModels: ModelLeaderboardEntry[] = [
  { id: 1, name: 'Quality Predictor v3', accuracy: 94.2, f1Score: 0.92, latencyMs: 145, status: 'active', lastTrained: '2026-06-15' },
  { id: 2, name: 'Commercial Score v2', accuracy: 91.8, f1Score: 0.89, latencyMs: 98, status: 'active', lastTrained: '2026-06-10' },
  { id: 3, name: 'Stability Net v4', accuracy: 88.5, f1Score: 0.86, latencyMs: 210, status: 'active', lastTrained: '2026-06-01' },
  { id: 4, name: 'IFRA Compliance v1', accuracy: 96.1, f1Score: 0.94, latencyMs: 67, status: 'active', lastTrained: '2026-05-28' },
  { id: 5, name: 'Ethical Score v2', accuracy: 85.3, f1Score: 0.81, latencyMs: 175, status: 'draft', lastTrained: '2026-05-15' },
]

const mockDriftAlerts: DriftAlert[] = [
  { id: 1, modelName: 'Stability Net v4', metric: 'Feature Drift - logP', driftValue: 0.35, threshold: 0.3, detectedAt: '2026-06-28T10:30:00Z' },
  { id: 2, modelName: 'Commercial Score v2', metric: 'Prediction Shift', driftValue: 0.28, threshold: 0.25, detectedAt: '2026-06-27T14:15:00Z' },
]

export default function AIDashboard() {
  const [kpi, setKpi] = useState<KPICards | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await dashboardAPI.getKPI()
      setKpi(res.data)
    } catch (err: any) {
      setError(err?.message || 'Failed to load AI dashboard')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-lg font-medium text-red-600">Failed to load dashboard</div>
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button onClick={loadDashboard} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" /> Retry
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-8 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <div className="h-5 w-40 bg-muted rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="h-56 bg-muted rounded animate-pulse" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const activeExperiments = Math.max(0, (kpi?.total_analyses ?? 0) - 3)
  const gpuUtilization = 72
  const gpuTemp = 68

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Dashboard</h1>
          <p className="text-muted-foreground">Model performance, experiments, and infrastructure monitoring</p>
        </div>
      </div>

      {mockDriftAlerts.length > 0 && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800">
              {mockDriftAlerts.length} drift alert{mockDriftAlerts.length > 1 ? 's' : ''} detected
            </p>
            <p className="text-xs text-red-600 mt-1">
              {mockDriftAlerts.map((a) => `${a.modelName}: ${a.metric}`).join(', ')}
            </p>
          </div>
          <Button size="sm" variant="destructive" className="ml-auto shrink-0">Investigate</Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'Active Models', value: mockModels.filter((m) => m.status === 'active').length, icon: Brain, color: 'text-blue-600', bgColor: 'bg-blue-100' },
          { title: 'Active Experiments', value: activeExperiments, icon: FlaskConical, color: 'text-purple-600', bgColor: 'bg-purple-100' },
          { title: 'Total Predictions', value: kpi?.total_analyses ?? 0, icon: Activity, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
          { title: 'GPU Utilization', value: `${gpuUtilization}%`, icon: Cpu, color: gpuUtilization > 80 ? 'text-red-600' : 'text-amber-600', bgColor: gpuUtilization > 80 ? 'bg-red-100' : 'bg-amber-100' },
        ].map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={cn('p-2 rounded-lg', card.bgColor)}>
                <card.icon className={cn('h-5 w-5', card.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prediction Volume (Last 7 Days)</CardTitle>
          <CardDescription>Daily AI prediction requests</CardDescription>
        </CardHeader>
        <CardContent>
          {predictionVolumeData.every((d) => d.count === 0) ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <BarChart3 className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No prediction data</p>
            </div>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={predictionVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Model Performance Leaderboard</CardTitle>
            <CardDescription>Ranked by accuracy score</CardDescription>
          </CardHeader>
          <CardContent>
            {mockModels.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Server className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-muted-foreground">No models deployed</p>
                <p className="text-xs text-muted-foreground">Train your first model to see performance metrics</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium text-muted-foreground">#</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Model</th>
                      <th className="text-center py-2 font-medium text-muted-foreground">Accuracy</th>
                      <th className="text-center py-2 font-medium text-muted-foreground">F1 Score</th>
                      <th className="text-center py-2 font-medium text-muted-foreground">Latency</th>
                      <th className="text-center py-2 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...mockModels]
                      .sort((a, b) => b.accuracy - a.accuracy)
                      .map((model, i) => (
                        <tr key={model.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                          <td className="py-3">
                            <div className={cn('flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold', i === 0 ? 'bg-yellow-100 text-yellow-700' : i === 1 ? 'bg-gray-100 dark:bg-gray-800 text-gray-600' : i === 2 ? 'bg-amber-100 text-amber-700' : 'bg-muted text-muted-foreground')}>
                              {i + 1}
                            </div>
                          </td>
                          <td className="py-3 font-medium">{model.name}</td>
                          <td className="text-center py-3">
                            <span className={cn('font-medium', model.accuracy >= 90 ? 'text-green-600' : model.accuracy >= 85 ? 'text-amber-600' : 'text-red-600')}>
                              {model.accuracy}%
                            </span>
                          </td>
                          <td className="text-center py-3 text-muted-foreground">{model.f1Score.toFixed(2)}</td>
                          <td className="text-center py-3 text-muted-foreground">{model.latencyMs}ms</td>
                          <td className="text-center py-3">
                            <Badge variant={model.status === 'active' ? 'success' : 'secondary'}>{model.status}</Badge>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Infrastructure</CardTitle>
            <CardDescription>GPU & system status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">GPU Utilization</span>
                </div>
                <span className={cn('text-sm font-bold', gpuUtilization > 80 ? 'text-red-600' : 'text-amber-600')}>
                  {gpuUtilization}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className={cn('h-3 rounded-full transition-all', gpuUtilization > 80 ? 'bg-red-500' : gpuUtilization > 60 ? 'bg-amber-500' : 'bg-green-500')}
                  style={{ width: `${gpuUtilization}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">GPU Temperature</span>
                </div>
                <span className={cn('text-sm font-bold', gpuTemp > 80 ? 'text-red-600' : 'text-amber-600')}>
                  {gpuTemp}°C
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className={cn('h-3 rounded-full transition-all', gpuTemp > 80 ? 'bg-red-500' : gpuTemp > 65 ? 'bg-amber-500' : 'bg-green-500')}
                  style={{ width: `${(gpuTemp / 100) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Memory Usage</span>
                </div>
                <span className="text-sm font-bold text-blue-600">6.2 / 16 GB</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div className="bg-blue-500 h-3 rounded-full" style={{ width: '39%' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {mockDriftAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Drift Detection Alerts</CardTitle>
            <CardDescription>Model degradation warnings requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockDriftAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-800">{alert.modelName}</p>
                      <p className="text-xs text-red-600 mt-0.5">
                        {alert.metric}: {alert.driftValue} (threshold: {alert.threshold})
                      </p>
                      <p className="text-xs text-red-400 mt-0.5">
                        Detected {new Date(alert.detectedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">Suppress</Button>
                    <Button size="sm" variant="destructive">Retrain</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {mockDriftAlerts.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Drift Detection</CardTitle>
            <CardDescription>No drift alerts — all models performing within expected ranges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Activity className="h-10 w-10 text-green-500 mb-3" />
              <p className="text-sm font-medium text-green-600">All models stable</p>
              <p className="text-xs text-muted-foreground">No drift detected in any active model</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
