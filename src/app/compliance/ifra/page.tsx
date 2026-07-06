'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Play,
  FileWarning,
  FlaskConical,
  Wrench,
} from 'lucide-react'

interface Violation {
  materialName: string
  maxAllowed: number
  current: number
  diff: number
  suggestedReplacement: string
  autoFixAvailable: boolean
}

interface CheckResult {
  formulaName: string
  compliant: boolean
  violations: Violation[]
  checkedAt: string
  standardsVersion: string
}

interface BatchProgress {
  current: number
  total: number
  completed: string[]
  failed: string[]
}

const FORMULAS = [
  'Rose Essence No.7',
  'Ocean Breeze',
  'Amber Wood',
  'Citrus Splash',
  'Midnight Oud',
  'Lavender Fields',
  'Vanilla Dream',
  'Jasmine Silk',
]

const MOCK_PASS_RESULT: CheckResult = {
  formulaName: 'Rose Essence No.7',
  compliant: true,
  violations: [],
  checkedAt: '2026-06-29T10:30:00Z',
  standardsVersion: 'IFRA 51st Amendment',
}

const MOCK_FAIL_RESULT: CheckResult = {
  formulaName: 'Amber Wood',
  compliant: false,
  violations: [
    {
      materialName: 'Musk Ketone',
      maxAllowed: 0.5,
      current: 2.1,
      diff: 1.6,
      suggestedReplacement: 'Galaxolide 50%',
      autoFixAvailable: true,
    },
    {
      materialName: 'Coumarin',
      maxAllowed: 1.0,
      current: 1.8,
      diff: 0.8,
      suggestedReplacement: 'Dihydrocoumarin',
      autoFixAvailable: true,
    },
    {
      materialName: 'Methyl Eugenol',
      maxAllowed: 0.01,
      current: 0.05,
      diff: 0.04,
      suggestedReplacement: 'None available',
      autoFixAvailable: false,
    },
  ],
  checkedAt: '2026-06-29T10:32:00Z',
  standardsVersion: 'IFRA 51st Amendment',
}

const BATCH_FORMULAS = ['Rose Essence No.7', 'Ocean Breeze', 'Amber Wood', 'Citrus Splash', 'Midnight Oud']
const BATCH_RESULTS: CheckResult[] = [
  { formulaName: 'Rose Essence No.7', compliant: true, violations: [], checkedAt: '2026-06-29T10:30:00Z', standardsVersion: 'IFRA 51st Amendment' },
  { formulaName: 'Ocean Breeze', compliant: true, violations: [], checkedAt: '2026-06-29T10:30:01Z', standardsVersion: 'IFRA 51st Amendment' },
  { formulaName: 'Amber Wood', compliant: false, violations: [
    { materialName: 'Musk Ketone', maxAllowed: 0.5, current: 2.1, diff: 1.6, suggestedReplacement: 'Galaxolide 50%', autoFixAvailable: true },
  ], checkedAt: '2026-06-29T10:30:02Z', standardsVersion: 'IFRA 51st Amendment' },
  { formulaName: 'Citrus Splash', compliant: false, violations: [
    { materialName: 'Limonene', maxAllowed: 2.0, current: 3.5, diff: 1.5, suggestedReplacement: 'Limonene (stabilized)', autoFixAvailable: true },
  ], checkedAt: '2026-06-29T10:30:03Z', standardsVersion: 'IFRA 51st Amendment' },
  { formulaName: 'Midnight Oud', compliant: true, violations: [], checkedAt: '2026-06-29T10:30:04Z', standardsVersion: 'IFRA 51st Amendment' },
]

type PageState = 'loading' | 'ready' | 'pass' | 'violation' | 'batch_mode' | 'error' | 'standards_outdated'

export default function IFRACheckPage() {
  const [pageState, setPageState] = useState<PageState>('ready')
  const [selectedFormula, setSelectedFormula] = useState('')
  const [result, setResult] = useState<CheckResult | null>(null)
  const [batchProgress, setBatchProgress] = useState<BatchProgress | null>(null)
  const [batchResults, setBatchResults] = useState<CheckResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [appliedFixes, setAppliedFixes] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (pageState === 'loading') {
      const timer = setTimeout(() => {
        if (selectedFormula === 'Amber Wood') {
          setResult(MOCK_FAIL_RESULT)
          setPageState('violation')
        } else if (selectedFormula === 'OUTDATED_STANDARDS') {
          setPageState('standards_outdated')
        } else {
          setResult(MOCK_PASS_RESULT)
          setPageState('pass')
        }
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [pageState, selectedFormula])

  const handleCheck = () => {
    if (!selectedFormula) return
    setError(null)
    setResult(null)
    setPageState('loading')
  }

  const handleBatchCheck = () => {
    setError(null)
    setBatchResults([])
    setBatchProgress({ current: 0, total: BATCH_FORMULAS.length, completed: [], failed: [] })
    setPageState('batch_mode')

    let idx = 0
    const interval = setInterval(() => {
      if (idx < BATCH_FORMULAS.length) {
        const r = BATCH_RESULTS[idx]
        setBatchResults(prev => [...prev, r])
        setBatchProgress(prev => prev ? {
          ...prev,
          current: prev.current + 1,
          completed: r.compliant ? [...prev.completed, BATCH_FORMULAS[idx]] : prev.completed,
          failed: !r.compliant ? [...prev.failed, BATCH_FORMULAS[idx]] : prev.failed,
        } : null)
        idx++
      } else {
        clearInterval(interval)
      }
    }, 800)
  }

  const handleApplyFix = (violationIdx: number) => {
    setAppliedFixes(prev => new Set(prev).add(violationIdx))
  }

  const handleSimulateError = () => {
    setError('Failed to connect to compliance service. Please check your network connection and try again.')
    setPageState('error')
  }

  const handleStandardsOutdated = () => {
    setPageState('standards_outdated')
  }

  const renderSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
      ))}
    </div>
  )

  const renderHeader = (extra?: React.ReactNode) => (
    <header className="bg-white dark:bg-gray-900 border-b">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">IFRA Compliance Checker</h1>
          <p className="text-sm text-muted-foreground">Validate formulas against IFRA standards</p>
        </div>
        {extra}
      </div>
    </header>
  )

  const renderFormulaSelector = () => (
    <div className="flex flex-wrap items-end gap-4 mb-6">
      <div className="flex-1 min-w-[200px]">
        <label className="text-sm font-medium mb-1 block">Select Formula</label>
        <Select value={selectedFormula} onValueChange={setSelectedFormula}>
          <SelectTrigger><SelectValue placeholder="Choose a formula..." /></SelectTrigger>
          <SelectContent>
            {FORMULAS.map(f => (
              <SelectItem key={f} value={f}>{f}</SelectItem>
            ))}
            <SelectItem value="OUTDATED_STANDARDS">[Demo] Old Standards Test</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleCheck} disabled={!selectedFormula || pageState === 'loading'}>
        <FlaskConical className="h-4 w-4 mr-2" />
        Check Compliance
      </Button>
      <Button variant="outline" onClick={handleBatchCheck} disabled={pageState === 'loading'}>
        <Play className="h-4 w-4 mr-2" />
        Batch Check (5 formulas)
      </Button>
      <Button variant="ghost" size="icon" onClick={handleSimulateError} title="Simulate error">
        <AlertCircle className="h-4 w-4" />
      </Button>
    </div>
  )

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {renderHeader()}
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Checking Compliance</CardTitle>
              <CardDescription>Validating {selectedFormula} against IFRA standards...</CardDescription>
            </CardHeader>
            <CardContent className="py-12">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Analyzing formula ingredients...</p>
                <div className="w-full max-w-md">{renderSkeleton()}</div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (pageState === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {renderHeader()}
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <p className="text-red-600 mb-2 font-semibold">Check Failed</p>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={() => { setError(null); setPageState('ready') }}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (pageState === 'standards_outdated') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {renderHeader()}
        <main className="container mx-auto px-6 py-8">
          <Card className="border-yellow-400">
            <CardContent className="py-12 text-center">
              <FileWarning className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
              <h2 className="text-xl font-semibold mb-2">Standards Outdated</h2>
              <p className="text-muted-foreground mb-2">
                The current IFRA standards database is from <strong>IFRA 50th Amendment</strong>.
              </p>
              <p className="text-muted-foreground mb-6">
                Latest available: <strong>IFRA 51st Amendment</strong>. Please update to ensure accurate compliance checking.
              </p>
              <div className="flex justify-center gap-3">
                <Button>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Update Standards
                </Button>
                <Button variant="outline" onClick={() => setPageState('ready')}>
                  Check Anyway
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (pageState === 'batch_mode') {
    const allDone = batchProgress && batchProgress.current >= batchProgress.total
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {renderHeader()}
        <main className="container mx-auto px-6 py-8">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Batch Check Progress</CardTitle>
              <CardDescription>
                {batchProgress ? `${batchProgress.current} / ${batchProgress.total} formulas checked` : 'Initializing...'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {batchProgress && (
                <div className="space-y-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}
                    />
                  </div>
                  <div className="flex gap-6 text-sm">
                    <span className="text-green-600">Passed: {batchProgress.completed.length}</span>
                    <span className="text-red-600">Failed: {batchProgress.failed.length}</span>
                  </div>
                </div>
              )}
              {allDone && batchResults.length > 0 && (
                <div className="mt-6 space-y-3">
                  {batchResults.map((r, i) => (
                    <div key={i} className={cn(
                      'flex items-center justify-between p-3 rounded-lg border',
                      r.compliant ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200',
                    )}>
                      <div className="flex items-center gap-3">
                        {r.compliant
                          ? <CheckCircle2 className="h-5 w-5 text-green-600" />
                          : <AlertTriangle className="h-5 w-5 text-red-600" />
                        }
                        <span className="font-medium">{r.formulaName}</span>
                      </div>
                      <Badge variant={r.compliant ? 'success' : 'destructive'}>
                        {r.compliant ? 'Compliant' : `${r.violations.length} violation(s)`}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
              {!allDone && (
                <div className="flex items-center gap-3 mt-4 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking {BATCH_FORMULAS[batchProgress?.current ?? 0]}...
                </div>
              )}
              {allDone && (
                <Button className="mt-6" onClick={() => { setPageState('ready'); setBatchResults([]); setBatchProgress(null) }}>
                  Done
                </Button>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {renderHeader()}
      <main className="container mx-auto px-6 py-8">
        {renderFormulaSelector()}

        {pageState === 'pass' && result && (
          <Card className="border-green-400">
            <CardContent className="py-8 text-center">
              <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-500" />
              <h2 className="text-2xl font-bold text-green-700 mb-2">All Compliant</h2>
              <p className="text-muted-foreground mb-1">
                <span className="font-medium">{result.formulaName}</span> passes all IFRA standards.
              </p>
              <p className="text-xs text-muted-foreground">
                Checked against {result.standardsVersion} | {new Date(result.checkedAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        )}

        {pageState === 'violation' && result && !result.compliant && (
          <Card className="border-red-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-5 w-5" />
                Violations Found
              </CardTitle>
              <CardDescription>
                {result.formulaName} — {result.violations.length} non-compliant material(s) detected
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Max Allowed %</TableHead>
                    <TableHead>Current %</TableHead>
                    <TableHead>Diff</TableHead>
                    <TableHead>Suggested Replacement</TableHead>
                    <TableHead className="w-28">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.violations.map((v, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{v.materialName}</TableCell>
                      <TableCell>{v.maxAllowed}%</TableCell>
                      <TableCell className="text-red-600 font-semibold">{v.current}%</TableCell>
                      <TableCell className="text-red-600">+{v.diff}%</TableCell>
                      <TableCell>
                        {v.autoFixAvailable
                          ? <span className="text-green-600">{v.suggestedReplacement}</span>
                          : <span className="text-muted-foreground italic">{v.suggestedReplacement}</span>
                        }
                      </TableCell>
                      <TableCell>
                        {v.autoFixAvailable ? (
                          appliedFixes.has(i) ? (
                            <Badge variant="success" className="whitespace-nowrap">Applied</Badge>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => handleApplyFix(i)}>
                              <Wrench className="h-3 w-3 mr-1" />
                              Apply Fix
                            </Button>
                          )
                        ) : (
                          <Badge variant="secondary" className="whitespace-nowrap">No Fix</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {appliedFixes.size > 0 && (
                <div className="p-4 bg-green-50 border-t border-green-200">
                  <div className="flex items-center gap-2 text-green-700 text-sm">
                    <CheckCircle2 className="h-4 w-4" />
                    {appliedFixes.size} auto-fix(es) applied successfully. Re-check to verify compliance.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {pageState === 'ready' && (
          <Card>
            <CardContent className="py-12 text-center">
              <FlaskConical className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Select a formula and click "Check Compliance" to validate against IFRA standards.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
