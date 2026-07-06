'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { dashboardAPI } from '@/lib/api'
import { KPICards } from '@/types'
import { Formula, ComplianceAlert } from '@/types/enterprise'
import { cn } from '@/lib/utils'
import {
  FlaskConical, ClipboardCheck, Beaker, Brain, AlertTriangle, TrendingUp,
  Plus, BarChart3, Package, ArrowRight, Eye, Clock, Star, AlertCircle, RefreshCw
} from 'lucide-react'

interface PerfumerMetrics {
  activeProjects: number
  pendingReviews: number
  formulasCreated: number
  predictionsRun: number
  ifraAlerts: number
  avgQualityScore: number
}

export default function PerfumerDashboard() {
  const router = useRouter()
  const [metrics, setMetrics] = useState<PerfumerMetrics | null>(null)
  const [pendingFormulas, setPendingFormulas] = useState<Formula[]>([])
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [kpiRes, formulasRes, analysesRes] = await Promise.all([
        dashboardAPI.getKPI(),
        dashboardAPI.getFormulasByStatus(),
        dashboardAPI.getRecentAnalyses(5),
      ])
      const kpi: KPICards = kpiRes.data
      const formulasByStatus: Record<string, Formula[]> = formulasRes.data
      const analyses = analysesRes.data

      const pending = Object.values(formulasByStatus)
        .flat()
        .filter((f: Formula) => f.status === 'under_review')

      setMetrics({
        activeProjects: kpi.total_projects,
        pendingReviews: pending.length,
        formulasCreated: kpi.total_formulas,
        predictionsRun: kpi.total_analyses,
        ifraAlerts: Math.round((1 - (kpi.avg_compliance_score || 0) / 100) * kpi.total_formulas),
        avgQualityScore: kpi.avg_quality_score,
      })
      setPendingFormulas(pending)
      setRecentAnalyses(Array.isArray(analyses) ? analyses : [])
    } catch (err: any) {
      setError(err?.message || 'Failed to load perfumer dashboard')
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="h-5 w-40 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-14 bg-muted rounded animate-pulse" />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="h-5 w-40 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-14 bg-muted rounded animate-pulse" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const kpiCards = [
    { title: 'Active Projects', value: metrics?.activeProjects ?? 0, icon: FlaskConical, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { title: 'Pending Reviews', value: metrics?.pendingReviews ?? 0, icon: ClipboardCheck, color: 'text-amber-600', bgColor: 'bg-amber-100' },
    { title: 'Formulas Created', value: metrics?.formulasCreated ?? 0, icon: Beaker, color: 'text-green-600', bgColor: 'bg-green-100' },
    { title: 'AI Predictions Run', value: metrics?.predictionsRun ?? 0, icon: Brain, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { title: 'IFRA Alerts', value: metrics?.ifraAlerts ?? 0, icon: AlertTriangle, color: 'text-red-600', bgColor: 'bg-red-100' },
    { title: 'Avg Quality Score', value: metrics?.avgQualityScore?.toFixed(2) ?? '0.00', icon: TrendingUp, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  ]

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Perfumer Dashboard</h1>
          <p className="text-muted-foreground">Your creative workspace at a glance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((card) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pending Reviews</CardTitle>
              <CardDescription>Formulas awaiting your review</CardDescription>
            </div>
            {pendingFormulas.length > 0 && (
              <Badge variant="warning">{pendingFormulas.length} pending</Badge>
            )}
          </CardHeader>
          <CardContent>
            {pendingFormulas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ClipboardCheck className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-muted-foreground">All caught up!</p>
                <p className="text-xs text-muted-foreground">No formulas awaiting review</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingFormulas.map((f) => (
                  <div key={f.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{f.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Submitted {new Date(f.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" /> Review
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent AI Predictions</CardTitle>
            <CardDescription>Latest formula analysis results</CardDescription>
          </CardHeader>
          <CardContent>
            {recentAnalyses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Brain className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-muted-foreground">No predictions yet</p>
                <p className="text-xs text-muted-foreground">Run an AI analysis on a formula to see results here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAnalyses.map((a: any, i: number) => (
                  <div key={a.formula_id ?? i} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Formula #{a.formula_id}</span>
                      <Badge variant={a.confidence_score >= 0.8 ? 'success' : 'warning'}>
                        {Math.round(a.confidence_score * 100)}% confidence
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: 'Quality', value: a.quality_score, color: 'text-blue-600' },
                        { label: 'Commercial', value: a.commercial_score, color: 'text-emerald-600' },
                        { label: 'Stability', value: a.stability_score, color: 'text-amber-600' },
                        { label: 'Ethical', value: a.ethical_score, color: 'text-purple-600' },
                      ].map((s) => (
                        <div key={s.label} className="text-center">
                          <p className="text-xs text-muted-foreground">{s.label}</p>
                          <p className={cn('text-lg font-bold', s.color)}>{(s.value * 100).toFixed(0)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-24 flex flex-col gap-2" variant="default" onClick={() => router.push('/formulation-studio')}>
              <Plus className="h-6 w-6" />
              <span>New Formula</span>
            </Button>
            <Button className="h-24 flex flex-col gap-2" variant="outline" onClick={() => router.push('/ai-lab/predictions')}>
              <Brain className="h-6 w-6" />
              <span>Run Prediction</span>
            </Button>
            <Button className="h-24 flex flex-col gap-2" variant="outline" onClick={() => router.push('/materials/catalog')}>
              <Package className="h-6 w-6" />
              <span>Browse Materials</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
