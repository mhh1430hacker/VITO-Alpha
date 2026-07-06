'use client'

import { useState, useEffect, useCallback } from 'react'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  TrendingUp,
  Loader2,
  AlertCircle,
  AlertTriangle,
  Clock,
  Ban,
  Download,
  Beaker,
  Atom,
  Cpu,
  Shield,
  GitFork,
  Brain,
  FlaskConical,
  CheckCircle2,
  Play,
  Gauge,
  BarChart3,
  Timer,
} from 'lucide-react'

type PageState = 'loading' | 'ready' | 'running_single' | 'running_batch' | 'complete' | 'low_confidence' | 'error' | 'timeout' | 'model_unavailable'

const FORMULA_LIBRARY = [
  { value: 'floral-rose', label: 'Floral Rose Accord' },
  { value: 'woody-sandalwood', label: 'Woody Sandalwood Base' },
  { value: 'citrus-fresh', label: 'Citrus Fresh Top' },
  { value: 'oriental-amber', label: 'Oriental Amber Blend' },
  { value: 'green-tea', label: 'Green Tea Accord' },
]

const MODELS = [
  { id: 'molecular', label: 'Molecular GNN', icon: Atom },
  { id: 'commercial', label: 'Commercial Predictor', icon: TrendingUp },
  { id: 'sensory', label: 'Sensory Evaluator', icon: Brain },
  { id: 'safety', label: 'Safety Checker', icon: Shield },
  { id: 'fusion', label: 'Fusion Ensemble', icon: GitFork },
]

interface ScoreCard {
  model: string
  quality: number
  commercial: number
  safety: number
  luxury: number
  stability: number
}

const MOCK_RESULTS: ScoreCard[] = [
  { model: 'Molecular GNN', quality: 87, commercial: 72, safety: 94, luxury: 68, stability: 91 },
  { model: 'Commercial Predictor', quality: 0, commercial: 81, safety: 0, luxury: 0, stability: 0 },
  { model: 'Sensory Evaluator', quality: 79, commercial: 0, safety: 0, luxury: 74, stability: 0 },
  { model: 'Safety Checker', quality: 0, commercial: 0, safety: 96, luxury: 0, stability: 0 },
  { model: 'Fusion Ensemble', quality: 85, commercial: 78, safety: 92, luxury: 71, stability: 88 },
]

const FEATURE_IMPORTANCE = [
  { feature: 'Linalool concentration', impact: 0.24 },
  { feature: 'Ethanol ratio', impact: 0.18 },
  { feature: 'Aldehyde C-12 presence', impact: 0.15 },
  { feature: 'Musk ketone level', impact: 0.12 },
  { feature: 'Terpene profile index', impact: 0.10 },
  { feature: 'Fixative strength', impact: 0.08 },
  { feature: 'pH balance', impact: 0.06 },
  { feature: 'Oxidation potential', impact: 0.04 },
  { feature: 'UV stability score', impact: 0.02 },
  { feature: 'Solvent polarity', impact: 0.01 },
]

function ProgressBar({ value, label }: { value: number; label?: string }) {
  return (
    <div className="space-y-1">
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
      <div className="h-2 w-full rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

export default function PredictionsPage() {
  const [pageState, setPageState] = useState<PageState>('loading')
  const [selectedFormula, setSelectedFormula] = useState('')
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [results, setResults] = useState<ScoreCard[] | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setPageState('ready'), 800)
    return () => clearTimeout(t)
  }, [])

  const toggleModel = useCallback((id: string) => {
    setSelectedModels((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }, [])

  function runPrediction() {
    if (!selectedFormula) return
    if (selectedModels.length === 0) return

    setPageState('running_single')
    setProgress(0)
    setResults(null)
    setErrorMsg(null)

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          return 100
        }
        return p + Math.random() * 15 + 2
      })
    }, 300)

    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)

      const confidence = 0.65 + Math.random() * 0.3
      if (confidence < 0.45) {
        setPageState('low_confidence')
      } else {
        setPageState('complete')
      }
      setResults(MOCK_RESULTS)
    }, 3500)
  }

  function exportResults() {
    const data = JSON.stringify({ formula: selectedFormula, models: selectedModels, results }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prediction-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function renderState() {
    switch (pageState) {
      case 'loading':
        return (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Loading prediction interface...</p>
            </div>
          </div>
        )
      case 'error':
        return (
          <div className="flex items-center justify-center h-[60vh]">
            <Card className="w-full max-w-md">
              <CardContent className="flex flex-col items-center gap-4 pt-6">
                <AlertCircle className="h-12 w-12 text-destructive" />
                <p className="text-lg font-medium">Interface Error</p>
                <p className="text-sm text-muted-foreground text-center">{errorMsg || 'Something went wrong'}</p>
                <Button variant="outline" onClick={() => setPageState('ready')}>
                  <RotateCw className="mr-2 h-4 w-4" /> Retry
                </Button>
              </CardContent>
            </Card>
          </div>
        )
      case 'timeout':
        return (
          <div className="flex items-center justify-center h-[60vh]">
            <Card className="w-full max-w-md">
              <CardContent className="flex flex-col items-center gap-4 pt-6">
                <Clock className="h-12 w-12 text-muted-foreground" />
                <p className="text-lg font-medium">Prediction Timed Out</p>
                <p className="text-sm text-muted-foreground text-center">The prediction took longer than expected. Try with fewer models.</p>
                <Button onClick={() => setPageState('ready')}>
                  <Play className="mr-2 h-4 w-4" /> Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        )
      case 'model_unavailable':
        return (
          <div className="flex items-center justify-center h-[60vh]">
            <Card className="w-full max-w-md">
              <CardContent className="flex flex-col items-center gap-4 pt-6">
                <Ban className="h-12 w-12 text-destructive" />
                <p className="text-lg font-medium">Model Unavailable</p>
                <p className="text-sm text-muted-foreground text-center">One or more selected models are currently offline. Check the Model Registry.</p>
                <Button onClick={() => setPageState('ready')}>
                  Back
                </Button>
              </CardContent>
            </Card>
          </div>
        )
      default:
        return null
    }
  }

  const stateBanner = renderState()
  if (stateBanner) return stateBanner

  const isRunning = pageState === 'running_single' || pageState === 'running_batch'
  const isComplete = pageState === 'complete' || pageState === 'low_confidence'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <TrendingUp className="h-7 w-7" /> Prediction Engine
        </h1>
        <p className="text-muted-foreground mt-1">
          Run AI-powered predictions on fragrance formulae
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Beaker className="h-5 w-5" /> Formula Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Formula Library</Label>
                <Select onValueChange={setSelectedFormula} value={selectedFormula}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a formula..." />
                  </SelectTrigger>
                  <SelectContent>
                    {FORMULA_LIBRARY.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ingredient Adjustments</Label>
                <div className="grid grid-cols-2 gap-3">
                  {['Linalool', 'Ethanol', 'Aldehyde C-12', 'Musk Ketone', 'Terpineol', 'Citral'].map((ing) => (
                    <div key={ing} className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder={ing}
                        className="h-9 text-sm"
                        disabled={isRunning}
                      />
                      <span className="text-xs text-muted-foreground w-6">%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {isComplete && results && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart3 className="h-5 w-5" /> Prediction Scores
                  </CardTitle>
                  <CardDescription>
                    Per-model score breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {results.map((r) => (
                    <Card key={r.model} className="border-l-4 border-l-primary">
                      <CardContent className="pt-4">
                        <p className="font-medium mb-3">{r.model}</p>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          {[
                            { label: 'Quality', value: r.quality, color: 'bg-blue-500' },
                            { label: 'Commercial', value: r.commercial, color: 'bg-green-500' },
                            { label: 'Safety', value: r.safety, color: 'bg-amber-500' },
                            { label: 'Luxury', value: r.luxury, color: 'bg-purple-500' },
                            { label: 'Stability', value: r.stability, color: 'bg-cyan-500' },
                          ].map((s) => (
                            <div key={s.label} className="space-y-1">
                              <p className="text-xs text-muted-foreground">{s.label}</p>
                              <p className="text-lg font-bold">{s.value > 0 ? s.value : '—'}</p>
                              {s.value > 0 && (
                                <div className="h-1.5 w-full rounded-full bg-muted">
                                  <div
                                    className={cn('h-full rounded-full', s.color)}
                                    style={{ width: `${s.value}%` }}
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Brain className="h-5 w-5" /> Why This Score?
                  </CardTitle>
                  <CardDescription>
                    SHAP/CAMEO feature contribution analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {FEATURE_IMPORTANCE.map((f) => (
                    <div key={f.feature} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{f.feature}</span>
                        <span className="text-muted-foreground">{(f.impact * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
                          style={{ width: `${f.impact * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground mt-4">
                    Feature importance derived from SHAP values averaged across all active models. Higher percentage = greater influence on prediction.
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Cpu className="h-5 w-5" /> Model Selector
              </CardTitle>
              <CardDescription>
                Choose models for prediction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {MODELS.map((m) => {
                const Icon = m.icon
                const checked = selectedModels.includes(m.id)
                return (
                  <label
                    key={m.id}
                    className={cn(
                      'flex items-center gap-3 rounded-md border p-3 cursor-pointer transition-colors',
                      checked && 'border-primary bg-primary/5',
                      isRunning && 'opacity-50 pointer-events-none'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleModel(m.id)}
                      className="h-4 w-4 accent-primary"
                      disabled={isRunning}
                    />
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{m.label}</span>
                  </label>
                )
              })}
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button
                className="w-full"
                size="lg"
                disabled={!selectedFormula || selectedModels.length === 0 || isRunning}
                onClick={runPrediction}
              >
                {isRunning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" /> Run Prediction
                  </>
                )}
              </Button>
              {isRunning && (
                <div className="w-full space-y-1">
                  <ProgressBar value={Math.min(progress, 100)} label="Predicting..." />
                  <p className="text-xs text-muted-foreground text-right">
                    Est. {Math.max(1, Math.round((100 - progress) / 20))}s remaining
                  </p>
                </div>
              )}
            </CardFooter>
          </Card>

          {isComplete && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Gauge className="h-5 w-5" /> Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Overall Quality</span>
                  <span className="text-xl font-bold">85</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Avg Commercial</span>
                  <span className="text-xl font-bold">77</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Safety Score</span>
                  <span className="text-xl font-bold">94</span>
                </div>
                {pageState === 'low_confidence' && (
                  <div className="flex items-center gap-2 rounded-md bg-yellow-50 p-2 text-sm text-yellow-800">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    Low confidence — verify with additional tests
                  </div>
                )}
                <Separator />
                <Button variant="outline" className="w-full" onClick={exportResults}>
                  <Download className="mr-2 h-4 w-4" /> Export Results
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function RotateCw(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 2v6h-6" />
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M3 22v-6h6" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    </svg>
  )
}

function Separator() {
  return <div className="h-px w-full bg-border" />
}
