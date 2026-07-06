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
  Brain,
  Loader2,
  AlertCircle,
  FlaskConical,
  ArrowRight,
  BarChart3,
  FileText,
  TestTubes,
  Gauge,
  Info,
  Lightbulb,
} from 'lucide-react'

type PageState = 'loading' | 'ready' | 'empty' | 'error'

interface FeatureImportance {
  feature: string
  importance: number
  direction: 'positive' | 'negative'
}

interface MaterialContribution {
  material: string
  contribution: number
  role: string
}

const MOCK_FEATURES: FeatureImportance[] = [
  { feature: 'Linalool concentration', importance: 0.24, direction: 'positive' },
  { feature: 'Ethanol ratio', importance: 0.18, direction: 'positive' },
  { feature: 'Aldehyde C-12 presence', importance: 0.15, direction: 'positive' },
  { feature: 'Musk ketone level', importance: 0.12, direction: 'negative' },
  { feature: 'Terpene profile index', importance: 0.10, direction: 'positive' },
  { feature: 'Fixative strength', importance: 0.08, direction: 'positive' },
  { feature: 'pH balance', importance: 0.06, direction: 'negative' },
  { feature: 'Oxidation potential', importance: 0.04, direction: 'negative' },
  { feature: 'UV stability score', importance: 0.02, direction: 'positive' },
  { feature: 'Solvent polarity', importance: 0.01, direction: 'negative' },
]

const MOCK_MATERIALS: MaterialContribution[] = [
  { material: 'Linalool', contribution: 0.31, role: 'Core floral character' },
  { material: 'Ethanol', contribution: 0.22, role: 'Solvent / carrier' },
  { material: 'Aldehyde C-12', contribution: 0.18, role: 'Top note enhancer' },
  { material: 'Musk Ketone', contribution: -0.14, role: 'Base fixative' },
  { material: 'Terpineol', contribution: 0.09, role: 'Secondary floral' },
  { material: 'Citral', contribution: -0.06, role: 'Citrus modifier' },
]

const NARRATIVE = `The predicted quality score of 87/100 is primarily driven by high Linalool concentration (24% weight), which contributes to a strong floral character. The ethanol ratio (18%) and Aldehyde C-12 presence (15%) further boost the score. However, Musk Ketone level has a negative impact (−12%), slightly reducing the overall rating due to potential base-note heaviness. The formula shows strong stability (91%) and excellent safety compliance (94%), making it suitable for fine fragrance applications.`

export default function ExplainabilityPage() {
  const [pageState, setPageState] = useState<PageState>('loading')
  const [hasPrediction, setHasPrediction] = useState(false)

  useEffect(() => {
    let cancelled = false
    setTimeout(() => {
      if (cancelled) return
      setPageState('ready')
    }, 900)
    return () => { cancelled = true }
  }, [])

  if (pageState === 'loading') {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading explainability engine...</p>
        </div>
      </div>
    )
  }

  if (pageState === 'error') {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <p className="text-lg font-medium">Explainability Error</p>
            <p className="text-sm text-muted-foreground text-center">Could not load explainability data.</p>
            <Button variant="outline" onClick={() => setPageState('ready')}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!hasPrediction) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="h-7 w-7" /> Prediction Explainability
          </h1>
          <p className="text-muted-foreground mt-1">
            Understand why your formula scored the way it did
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center gap-4 pt-16 pb-16">
            <FlaskConical className="h-20 w-20 text-muted-foreground/30" />
            <p className="text-xl font-medium">Run a prediction first</p>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Explainability data is generated from prediction results. Head to the Prediction Engine to run a prediction, then return here for a full breakdown.
            </p>
            <Button asChild>
              <a href="/ai-lab/predictions">
                <ArrowRight className="mr-2 h-4 w-4" /> Go to Predictions
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Brain className="h-7 w-7" /> Prediction Explainability
        </h1>
        <p className="text-muted-foreground mt-1">
          Understand why your formula scored the way it did
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5" /> Feature Importance
          </CardTitle>
          <CardDescription>
            Top 10 features driving the prediction
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {MOCK_FEATURES.map((f) => (
            <div key={f.feature} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1.5">
                  {f.feature}
                  {f.direction === 'positive' ? (
                    <span className="text-xs text-green-600">(+){' '}</span>
                  ) : (
                    <span className="text-xs text-red-600">(−){' '}</span>
                  )}
                </span>
                <span className="text-muted-foreground">{(f.importance * 100).toFixed(0)}%</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-muted">
                <div
                  className={cn(
                    'h-full rounded-full',
                    f.direction === 'positive' ? 'bg-green-500' : 'bg-red-400'
                  )}
                  style={{ width: `${f.importance * 100}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" /> Why This Score?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">{NARRATIVE}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TestTubes className="h-5 w-5" /> Material Contribution Breakdown
          </CardTitle>
          <CardDescription>
            How each material affects the overall score
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Contribution</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="w-[200px]">Impact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_MATERIALS.map((m) => (
                <TableRow key={m.material}>
                  <TableCell className="font-medium">{m.material}</TableCell>
                  <TableCell>
                    <span className={cn(m.contribution > 0 ? 'text-green-600' : 'text-red-600')}>
                      {m.contribution > 0 ? '+' : ''}{(m.contribution * 100).toFixed(0)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{m.role}</TableCell>
                  <TableCell>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className={cn(
                          'h-full rounded-full',
                          m.contribution > 0 ? 'bg-green-500' : 'bg-red-400'
                        )}
                        style={{ width: `${Math.abs(m.contribution) * 100}%` }}
                      />
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
          <CardTitle className="flex items-center gap-2 text-lg">
            <Gauge className="h-5 w-5" /> Confidence Interval
          </CardTitle>
          <CardDescription>
            Prediction reliability range
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Overall confidence</span>
            <Badge variant="success">87% ± 5%</Badge>
          </div>
          <div className="relative h-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-500" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-1 bg-foreground rounded-full" />
            <div className="absolute top-1/2 left-1/2 translate-x-4 -translate-y-1/2 flex items-center gap-1">
              <span className="text-xs font-medium bg-background px-1 rounded">87%</span>
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0% — Low confidence</span>
            <span>100% — High confidence</span>
          </div>
          <div className="flex items-start gap-2 rounded-md bg-blue-50 p-3 text-sm text-blue-800">
            <Info className="h-4 w-4 mt-0.5 shrink-0" />
            <p>This prediction has high confidence (87% ± 5%). The narrow interval indicates strong agreement across ensemble models. Scores below 60% suggest the formula differs significantly from training data.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
