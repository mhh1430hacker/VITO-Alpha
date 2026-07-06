'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { dashboardAPI } from '@/lib/api'
import { KPICards } from '@/types'
import { Formula, Project } from '@/types/enterprise'
import { cn } from '@/lib/utils'
import {
  BarChart3, FlaskConical, Users, ArrowRight, Plus, Beaker,
  AlertCircle, RefreshCw, Target, GitBranch, Rocket, CheckCircle2
} from 'lucide-react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

interface PipelineStage {
  name: string
  count: number
  icon: any
  color: string
}

interface TeamMember {
  name: string
  activeProjects: number
  formulasDue: number
}

const pipelineStages: PipelineStage[] = [
  { name: 'Discovery', count: 0, icon: Target, color: 'bg-blue-500' },
  { name: 'Development', count: 0, icon: GitBranch, color: 'bg-indigo-500' },
  { name: 'Validation', count: 0, icon: Rocket, color: 'bg-violet-500' },
  { name: 'Launch', count: 0, icon: CheckCircle2, color: 'bg-emerald-500' },
]

const sampleTrendData = [
  { month: 'Jan', rate: 72 }, { month: 'Feb', rate: 75 },
  { month: 'Mar', rate: 73 }, { month: 'Apr', rate: 78 },
  { month: 'May', rate: 76 }, { month: 'Jun', rate: 81 },
]

export default function RDDashboard() {
  const router = useRouter()
  const [kpi, setKpi] = useState<KPICards | null>(null)
  const [recentFormulas, setRecentFormulas] = useState<Formula[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [kpiRes, formulasRes] = await Promise.all([
        dashboardAPI.getKPI(),
        dashboardAPI.getRecentFormulas(10),
      ])
      setKpi(kpiRes.data)
      setRecentFormulas(formulasRes.data)
    } catch (err: any) {
      setError(err?.message || 'Failed to load R&D dashboard')
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="h-5 w-40 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-muted rounded animate-pulse" />
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

  const pipeline = pipelineStages.map((stage, i) => ({
    ...stage,
    count: Math.max(0, (kpi?.total_formulas ?? 0) - i * 2),
  }))

  const maxPipeline = Math.max(...pipeline.map((s) => s.count), 1)

  const teamWorkload: TeamMember[] = [
    { name: 'Dr. Chen', activeProjects: 3, formulasDue: 2 },
    { name: 'Maria Lopez', activeProjects: 2, formulasDue: 1 },
    { name: 'James Wilson', activeProjects: 4, formulasDue: 3 },
  ]

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">R&D Dashboard</h1>
          <p className="text-muted-foreground">Research and development pipeline overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'Total Formulas', value: kpi?.total_formulas ?? 0, icon: Beaker, color: 'text-blue-600', bgColor: 'bg-blue-100' },
          { title: 'Avg Quality', value: kpi?.avg_quality_score?.toFixed(2) ?? '0.00', icon: BarChart3, color: 'text-green-600', bgColor: 'bg-green-100' },
          { title: 'Avg Stability', value: kpi?.avg_stability_score?.toFixed(2) ?? '0.00', icon: FlaskConical, color: 'text-amber-600', bgColor: 'bg-amber-100' },
          { title: 'Avg Compliance', value: `${kpi?.avg_compliance_score?.toFixed(1) ?? '0'}%`, icon: Target, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Funnel</CardTitle>
            <CardDescription>Formulas progressing through stages</CardDescription>
          </CardHeader>
          <CardContent>
            {pipeline.every((s) => s.count === 0) ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <GitBranch className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-muted-foreground">No formulas in pipeline</p>
                <p className="text-xs text-muted-foreground">Create a formula to start building your pipeline</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pipeline.map((stage) => (
                  <div key={stage.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className={cn('p-1 rounded', stage.color.replace('bg-', 'bg-').replace('500', '100'))}>
                          <stage.icon className={cn('h-4 w-4', stage.color.replace('bg-', 'text-'))} />
                        </div>
                        <span className="text-sm font-medium">{stage.name}</span>
                      </div>
                      <span className="text-sm font-bold">{stage.count}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className={cn('h-3 rounded-full transition-all duration-500', stage.color)}
                        style={{ width: `${(stage.count / maxPipeline) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Formula Success Rate</CardTitle>
            <CardDescription>Quality score trend over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sampleTrendData}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis domain={[60, 100]} className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="rate" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRate)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Team Workload</CardTitle>
            <CardDescription>Current project distribution</CardDescription>
          </CardHeader>
          <CardContent>
            {teamWorkload.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-muted-foreground">No team data available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {teamWorkload.map((member) => (
                  <div key={member.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <div className="flex gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">{member.activeProjects} active projects</span>
                        <span className="text-xs text-muted-foreground">{member.formulasDue} formulas due</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: member.activeProjects }).map((_, i) => (
                        <div key={i} className="w-2 h-8 bg-primary rounded-sm" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Navigate to common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button className="h-24 flex flex-col gap-2" variant="default" onClick={() => router.push('/projects/planning')}>
                <Plus className="h-6 w-6" />
                <span>Create Project</span>
              </Button>
              <Button className="h-24 flex flex-col gap-2" variant="outline" onClick={() => router.push('/formulation-studio')}>
                <Beaker className="h-6 w-6" />
                <span>Assign Formula</span>
              </Button>
              <Button className="h-24 flex flex-col gap-2" variant="outline" onClick={() => router.push('/ai-lab/predictions')}>
                <BarChart3 className="h-6 w-6" />
                <span>Review Results</span>
              </Button>
              <Button className="h-24 flex flex-col gap-2" variant="outline" onClick={() => router.push('/admin/teams')}>
                <Users className="h-6 w-6" />
                <span>Team View</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
