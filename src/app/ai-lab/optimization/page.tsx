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
  GitBranch,
  Loader2,
  AlertCircle,
  AlertTriangle,
  Sliders,
  CheckSquare,
  Target,
  Ban,
  Replace,
  ArrowUpDown,
  FlaskConical,
  CheckCircle2,
  BarChart3,
  Lightbulb,
  Award,
} from 'lucide-react'

type PageState = 'loading' | 'ready' | 'optimizing' | 'optimized' | 'optimization_failed' | 'error'

interface Variant {
  id: number
  name: string
  score: number
  tradeoff: string
  cost: number
  stability: number
  quality: number
  ifraCompliant: boolean
  accord: string
}

const BANNED_MATERIALS = [
  'Lilial (BMHCA)',
  'Musk Xylene',
  'Musk Ambrette',
  'HICC (Lyral)',
  'Methyleugenol',
  'Coumarin (IFRA restricted)',
]

const TARGET_ACCORDS = [
  { value: 'floral', label: 'Floral' },
  { value: 'woody', label: 'Woody' },
  { value: 'oriental', label: 'Oriental' },
  { value: 'fresh', label: 'Fresh' },
  { value: 'gourmand', label: 'Gourmand' },
  { value: 'chypre', label: 'Chypre' },
  { value: 'fougere', label: 'Fougère' },
]

const MOCK_VARIANTS: Variant[] = [
  { id: 1, name: 'Variant A — Balanced', score: 92, tradeoff: 'Slight cost premium (+12%) for optimal stability and IFRA compliance', cost: 85, stability: 94, quality: 91, ifraCompliant: true, accord: 'floral' },
  { id: 2, name: 'Variant B — Cost-Optimized', score: 84, tradeoff: 'Lower cost (-8%) but reduced stability at high temperature; uses alternative fixatives', cost: 65, stability: 72, quality: 83, ifraCompliant: true, accord: 'floral' },
  { id: 3, name: 'Variant C — Premium', score: 76, tradeoff: 'Highest quality materials (+25% cost) with superior longevity but borderline IFRA compliance on one component', cost: 95, stability: 88, quality: 96, ifraCompliant: false, accord: 'floral' },
]

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-muted">
      <div
        className="h-full rounded-full bg-primary transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

export default function OptimizationPage() {
  const [pageState, setPageState] = useState<PageState>('loading')
  const [costCeiling, setCostCeiling] = useState(80)
  const [ifraCompliance, setIfraCompliance] = useState(true)
  const [targetAccord, setTargetAccord] = useState('')
  const [bannedMaterials, setBannedMaterials] = useState<string[]>([])
  const [stabilityMin, setStabilityMin] = useState(60)
  const [qualityMin, setQualityMin] = useState(70)
  const [progress, setProgress] = useState(0)
  const [variants, setVariants] = useState<Variant[] | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setPageState('ready'), 1000)
    return () => clearTimeout(t)
  }, [])

  function toggleBanned(material: string) {
    setBannedMaterials((prev) =>
      prev.includes(material) ? prev.filter((m) => m !== material) : [...prev, material]
    )
  }

  function startOptimization() {
    setPageState('optimizing')
    setProgress(0)
    setVariants(null)

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          return 100
        }
        return p + Math.random() * 10 + 3
      })
    }, 400)

    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      if (targetAccord && bannedMaterials.length > 2) {
        setPageState('optimization_failed')
      } else {
        setPageState('optimized')
        setVariants(MOCK_VARIANTS)
      }
    }, 4000)
  }

  if (pageState === 'loading') {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading optimization interface...</p>
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
            <p className="text-lg font-medium">Optimization Error</p>
            <p className="text-sm text-muted-foreground text-center">The optimizer encountered an unexpected error.</p>
            <Button variant="outline" onClick={() => setPageState('ready')}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isBusy = pageState === 'optimizing'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <GitBranch className="h-7 w-7" /> Formula Optimization
        </h1>
        <p className="text-muted-foreground mt-1">
          AI-powered constrained optimization of fragrance formulae
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sliders className="h-5 w-5" /> Constraints
              </CardTitle>
              <CardDescription>
                Define optimization boundaries
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Cost Ceiling</Label>
                  <span className="text-sm font-mono">${costCeiling}/kg</span>
                </div>
                <Input
                  type="range"
                  min={20}
                  max={200}
                  value={costCeiling}
                  onChange={(e) => setCostCeiling(Number(e.target.value))}
                  disabled={isBusy}
                  className="h-2 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$20</span>
                  <span>$200</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="ifra"
                  checked={ifraCompliance}
                  onChange={() => setIfraCompliance(!ifraCompliance)}
                  className="h-4 w-4 accent-primary"
                  disabled={isBusy}
                />
                <Label htmlFor="ifra" className="cursor-pointer">IFRA Compliance Required</Label>
              </div>

              <div className="space-y-2">
                <Label>Target Accord</Label>
                <Select onValueChange={setTargetAccord} value={targetAccord} disabled={isBusy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select accord..." />
                  </SelectTrigger>
                  <SelectContent>
                    {TARGET_ACCORDS.map((a) => (
                      <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Banned / Restricted Materials</Label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {BANNED_MATERIALS.map((m) => (
                    <label key={m} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={bannedMaterials.includes(m)}
                        onChange={() => toggleBanned(m)}
                        className="h-3.5 w-3.5 accent-primary"
                        disabled={isBusy}
                      />
                      {m}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Min Stability</Label>
                  <span className="text-sm font-mono">{stabilityMin}%</span>
                </div>
                <Input
                  type="range"
                  min={0}
                  max={100}
                  value={stabilityMin}
                  onChange={(e) => setStabilityMin(Number(e.target.value))}
                  disabled={isBusy}
                  className="h-2 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Min Quality</Label>
                  <span className="text-sm font-mono">{qualityMin}%</span>
                </div>
                <Input
                  type="range"
                  min={0}
                  max={100}
                  value={qualityMin}
                  onChange={(e) => setQualityMin(Number(e.target.value))}
                  disabled={isBusy}
                  className="h-2 cursor-pointer"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                disabled={isBusy || !targetAccord}
                onClick={startOptimization}
              >
                {isBusy ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    AI optimizing...
                  </>
                ) : (
                  <>
                    <GitBranch className="mr-2 h-4 w-4" /> Optimize
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {isBusy && (
            <Card>
              <CardContent className="pt-6 space-y-2">
                <ProgressBar value={Math.min(progress, 100)} />
                <p className="text-xs text-muted-foreground text-center">
                  Exploring formula space... {Math.round(Math.min(progress, 100))}%
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {pageState === 'optimization_failed' && (
            <Card>
              <CardContent className="flex flex-col items-center gap-4 pt-6 pb-6">
                <AlertTriangle className="h-12 w-12 text-yellow-500" />
                <p className="text-lg font-medium">Optimization Failed</p>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  No feasible solution found. Relax constraints (e.g., increase cost ceiling, reduce banned materials, or lower stability/quality minimums).
                </p>
                <Button variant="outline" onClick={() => setPageState('ready')}>
                  Adjust Constraints
                </Button>
              </CardContent>
            </Card>
          )}

          {pageState === 'ready' && !variants && (
            <Card>
              <CardContent className="flex flex-col items-center gap-4 pt-16 pb-16">
                <FlaskConical className="h-16 w-16 text-muted-foreground/40" />
                <p className="text-lg font-medium">Configure Constraints</p>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  Set your optimization constraints on the left, then click &quot;Optimize&quot; to generate formula variants.
                </p>
              </CardContent>
            </Card>
          )}

          {pageState === 'optimized' && variants && (
            <>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <p className="text-sm text-muted-foreground">
                  Optimization complete — {variants.length} variants generated
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {variants.map((v, i) => (
                  <Card
                    key={v.id}
                    className={cn(
                      'border-t-4',
                      i === 0 ? 'border-t-green-500' : i === 1 ? 'border-t-blue-500' : 'border-t-amber-500'
                    )}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          {i === 0 && <Award className="h-4 w-4 text-green-500" />}
                          {v.name}
                        </CardTitle>
                        <Badge variant={i === 0 ? 'success' : i === 1 ? 'default' : 'secondary'}>
                          Score: {v.score}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">{v.tradeoff}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Cost</p>
                          <p className="font-medium">${v.cost}/kg</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Stability</p>
                          <p className="font-medium">{v.stability}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Quality</p>
                          <p className="font-medium">{v.quality}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">IFRA OK</p>
                          {v.ifraCompliant ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <Ban className="h-4 w-4 text-destructive" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        <Replace className="mr-2 h-4 w-4" /> Apply Variant
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart3 className="h-5 w-5" /> Compare Variants
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Metric</TableHead>
                        {variants.map((v) => (
                          <TableHead key={v.id}>{v.name}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { label: 'Score', values: variants.map((v) => `${v.score}/100`) },
                        { label: 'Cost', values: variants.map((v) => `$${v.cost}/kg`) },
                        { label: 'Stability', values: variants.map((v) => `${v.stability}%`) },
                        { label: 'Quality', values: variants.map((v) => `${v.quality}%`) },
                        { label: 'IFRA Compliant', values: variants.map((v) => v.ifraCompliant ? '✓' : '✗') },
                      ].map((row) => (
                        <TableRow key={row.label}>
                          <TableCell className="font-medium">{row.label}</TableCell>
                          {row.values.map((v, i) => (
                            <TableCell key={i}>{v}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
