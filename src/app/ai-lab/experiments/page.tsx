'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import {
  TestTube,
  Loader2,
  AlertCircle,
  FlaskConical,
  Play,
  X,
  BarChart3,
  ArrowUpRight,
  Clock,
  Rocket,
} from 'lucide-react'

interface Experiment {
  id: number
  name: string
  modelType: string
  status: 'running' | 'completed' | 'failed' | 'draft'
  hyperparameters: string
  bestMetric: string
  created: string
}

const MOCK_EXPERIMENTS: Experiment[] = [
  { id: 1, name: 'LR-search-v3', modelType: 'Molecular GNN', status: 'running', hyperparameters: 'lr=0.001, batch=64, dropout=0.2, layers=4', bestMetric: '—', created: '2026-06-28' },
  { id: 2, name: 'Transformer-abl', modelType: 'Transformer', status: 'completed', hyperparameters: 'heads=8, depth=6, lr=5e-5, warmup=500', bestMetric: 'Acc: 0.912', created: '2026-06-25' },
  { id: 3, name: 'RF-baseline', modelType: 'Random Forest', status: 'completed', hyperparameters: 'n_est=500, max_depth=20, min_split=10', bestMetric: 'F1: 0.887', created: '2026-06-20' },
  { id: 4, name: 'GradBoost-v2', modelType: 'Gradient Boosting', status: 'failed', hyperparameters: 'lr=0.1, subsample=0.8, max_depth=6', bestMetric: '—', created: '2026-06-18' },
  { id: 5, name: 'Attention-v1', modelType: 'Transformer', status: 'draft', hyperparameters: 'heads=4, depth=3, lr=1e-4', bestMetric: '—', created: '2026-06-15' },
]

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [detail, setDetail] = useState<Experiment | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setTimeout(() => {
      if (cancelled) return
      setExperiments(MOCK_EXPERIMENTS)
      setLoading(false)
    }, 1000)
    return () => { cancelled = true }
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <p className="text-lg font-medium">Failed to load experiments</p>
            <p className="text-sm text-muted-foreground text-center">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading experiments...</p>
        </div>
      </div>
    )
  }

  const runningCount = experiments.filter((e) => e.status === 'running').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <TestTube className="h-7 w-7" /> Experiment Tracker
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and compare ML training experiments
          </p>
        </div>
        <div className="flex items-center gap-3">
          {runningCount > 0 && (
            <Badge variant="warning" className="animate-pulse">
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              {runningCount} running
            </Badge>
          )}
          <Button>
            <Play className="mr-2 h-4 w-4" /> New Experiment
          </Button>
        </div>
      </div>

      {experiments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 pt-10 pb-10">
            <FlaskConical className="h-16 w-16 text-muted-foreground/40" />
            <p className="text-lg font-medium">No experiments yet</p>
            <p className="text-sm text-muted-foreground">
              Launch your first ML experiment to track training runs.
            </p>
            <Button>
              <Play className="mr-2 h-4 w-4" /> Launch Experiment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Experiment Name</TableHead>
                  <TableHead>Model Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Hyperparameters</TableHead>
                  <TableHead>Best Metric</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {experiments.map((exp) => (
                  <TableRow
                    key={exp.id}
                    className="cursor-pointer"
                    onClick={() => setDetail(exp)}
                  >
                    <TableCell className="font-medium">{exp.name}</TableCell>
                    <TableCell>{exp.modelType}</TableCell>
                    <TableCell>
                      {exp.status === 'running' ? (
                        <Badge variant="warning" className="animate-pulse">
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          Running
                        </Badge>
                      ) : exp.status === 'completed' ? (
                        <Badge variant="success">Completed</Badge>
                      ) : exp.status === 'failed' ? (
                        <Badge variant="destructive">Failed</Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {exp.hyperparameters}
                    </TableCell>
                    <TableCell>{exp.bestMetric}</TableCell>
                    <TableCell>{exp.created}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); setDetail(exp) }}
                      >
                        <ArrowUpRight className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDetail(null)}>
          <Card className="w-full max-w-2xl mx-4" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" /> {detail.name}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setDetail(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>{detail.modelType}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {detail.status === 'running' ? (
                    <Badge variant="warning" className="animate-pulse">
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" /> Running
                    </Badge>
                  ) : detail.status === 'completed' ? (
                    <Badge variant="success">Completed</Badge>
                  ) : detail.status === 'failed' ? (
                    <Badge variant="destructive">Failed</Badge>
                  ) : (
                    <Badge variant="secondary">Draft</Badge>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Best Metric</p>
                  <p className="text-lg font-semibold">{detail.bestMetric || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-lg font-semibold">{detail.created}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hyperparameters</p>
                  <p className="text-sm font-mono">{detail.hyperparameters}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-3 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" /> Metrics Timeline
                </p>
                <div className="h-48 rounded-md border bg-muted/30 flex items-center justify-center text-sm text-muted-foreground">
                  {detail.status === 'running' ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Training in progress...
                    </span>
                  ) : detail.status === 'completed' ? (
                    <span>[Chart placeholder — accuracy / loss over epochs]</span>
                  ) : (
                    <span>No metrics available</span>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              {detail.status === 'running' && (
                <Button variant="destructive" size="sm">
                  <X className="mr-2 h-4 w-4" /> Stop
                </Button>
              )}
              {detail.status === 'completed' && (
                <Button size="sm">
                  <Rocket className="mr-2 h-4 w-4" /> Deploy Best
                </Button>
              )}
              {detail.status === 'failed' && (
                <Button size="sm">
                  <Play className="mr-2 h-4 w-4" /> Rerun
                </Button>
              )}
              {detail.status === 'draft' && (
                <Button size="sm">
                  <Play className="mr-2 h-4 w-4" /> Start
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
