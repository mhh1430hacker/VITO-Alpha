'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import {
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
  Save,
  Search,
  Plus,
  Trash2,
  FlaskConical,
  Beaker,
  DollarSign,
  ShieldCheck,
  SlidersHorizontal,
  TrendingUp,
  CheckCheck,
  History,
  AlertCircle,
  Loader2,
} from 'lucide-react'

const STEPS = [
  { id: 1, label: 'Create Formula' },
  { id: 2, label: 'Add Ingredients' },
  { id: 3, label: 'Cost Analysis' },
  { id: 4, label: 'Compliance Validation' },
  { id: 5, label: 'Optimization' },
  { id: 6, label: 'Prediction' },
  { id: 7, label: 'Approval' },
  { id: 8, label: 'Version' },
]

type WizardState = 'loading' | 'ready' | 'empty' | 'error' | 'validation_error' | 'saving' | 'saved'

interface FormulationData {
  name: string
  brief: string
  accord: string
  project: string
  notes: string
  ingredients: Array<{ material_id: number; name: string; weight_percent: number; cost_per_kg: number }>
  costCeiling: number
  ifraCompliant: boolean
  targetAccord: string
  bannedMaterials: number[]
  version: string
  changeLog: string
}

interface ComplianceResult {
  material_id: number
  material_name: string
  status: 'compliant' | 'violation' | 'pending_review'
  severity: 'info' | 'warning' | 'critical'
  details: string
}

interface PredictionScores {
  quality: number
  stability: number
  commercial: number
}

const initialData: FormulationData = {
  name: '',
  brief: '',
  accord: '',
  project: '',
  notes: '',
  ingredients: [],
  costCeiling: 100,
  ifraCompliant: true,
  targetAccord: '',
  bannedMaterials: [],
  version: '1.0.0',
  changeLog: '',
}

const accords = ['Floral', 'Oriental', 'Woody', 'Fresh', 'Fougère', 'Chypre', 'Gourmand', 'Citrus', 'Aquatic', 'Green']
const statuses = ['draft', 'review', 'approved', 'rejected', 'archived'] as const

export default function FormulationWizardPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [wizardState, setWizardState] = useState<WizardState>('ready')
  const [data, setData] = useState<FormulationData>(initialData)
  const [materialSearch, setMaterialSearch] = useState('')
  const [catalogMaterials, setCatalogMaterials] = useState<Array<{ id: number; name: string; cost_per_kg: number }>>([
    { id: 1, name: 'Limonene', cost_per_kg: 12.5 },
    { id: 2, name: 'Linalool', cost_per_kg: 18.3 },
    { id: 3, name: 'Coumarin', cost_per_kg: 45.0 },
    { id: 4, name: 'Vanillin', cost_per_kg: 62.0 },
    { id: 5, name: 'Musk Ketone', cost_per_kg: 88.0 },
    { id: 6, name: 'Citral', cost_per_kg: 22.0 },
    { id: 7, name: 'Geraniol', cost_per_kg: 15.5 },
    { id: 8, name: 'Eugenol', cost_per_kg: 28.0 },
  ])
  const [complianceResults, setComplianceResults] = useState<ComplianceResult[]>([])
  const [complianceLoading, setComplianceLoading] = useState(false)
  const [predictionScores, setPredictionScores] = useState<PredictionScores | null>(null)
  const [predictionLoading, setPredictionLoading] = useState(false)
  const [saveDraftState, setSaveDraftState] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null)

  const filteredCatalog = useMemo(() => {
    if (!materialSearch) return catalogMaterials
    return catalogMaterials.filter((m) =>
      m.name.toLowerCase().includes(materialSearch.toLowerCase())
    )
  }, [materialSearch, catalogMaterials])

  const totalWeight = useMemo(
    () => data.ingredients.reduce((sum, ing) => sum + ing.weight_percent, 0),
    [data.ingredients]
  )

  const totalCost = useMemo(
    () => data.ingredients.reduce((sum, ing) => sum + (ing.weight_percent / 100) * ing.cost_per_kg, 0),
    [data.ingredients]
  )

  const totalWeightValid = Math.abs(totalWeight - 100) < 0.01

  const handleAddIngredient = (material: typeof catalogMaterials[0]) => {
    if (data.ingredients.some((i) => i.material_id === material.id)) return
    setData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { material_id: material.id, name: material.name, weight_percent: 0, cost_per_kg: material.cost_per_kg }],
    }))
  }

  const handleRemoveIngredient = (materialId: number) => {
    setData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((i) => i.material_id !== materialId),
    }))
  }

  const handleWeightChange = (materialId: number, weight: number) => {
    setData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((i) =>
        i.material_id === materialId ? { ...i, weight_percent: weight } : i
      ),
    }))
  }

  const handleRunCompliance = async () => {
    setComplianceLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    const results: ComplianceResult[] = data.ingredients.map((ing) => ({
      material_id: ing.material_id,
      material_name: ing.name,
      status: Math.random() > 0.2 ? 'compliant' : ('violation' as const),
      severity: Math.random() > 0.7 ? 'warning' : 'info',
      details: Math.random() > 0.2 ? 'Within IFRA limits' : 'Exceeds IFRA max concentration',
    }))
    setComplianceResults(results)
    setComplianceLoading(false)
  }

  const handleRunPrediction = async () => {
    setPredictionLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setPredictionScores({
      quality: 75 + Math.random() * 20,
      stability: 65 + Math.random() * 25,
      commercial: 70 + Math.random() * 20,
    })
    setPredictionLoading(false)
  }

  const handleSaveDraft = async () => {
    setSaveDraftState('saving')
    await new Promise((r) => setTimeout(r, 800))
    setSaveDraftState('saved')
    setTimeout(() => setSaveDraftState('idle'), 2000)
  }

  const handleApproval = async (action: 'approve' | 'reject') => {
    setApprovalAction(action)
    await new Promise((r) => setTimeout(r, 600))
    setCompletedSteps((prev) => new Set(prev).add(7))
    setApprovalAction(null)
  }

  const handleNext = () => {
    if (currentStep < 8) {
      setCompletedSteps((prev) => new Set(prev).add(currentStep))
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1)
  }

  const handleStepClick = (stepId: number) => {
    if (completedSteps.has(stepId) || stepId === currentStep) {
      setCurrentStep(stepId)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
      draft: 'secondary',
      review: 'warning',
      approved: 'success',
      rejected: 'destructive',
      archived: 'default',
    }
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>
  }

  const getComplianceBadge = (status: ComplianceResult['status']) => {
    const variants: Record<string, 'success' | 'destructive' | 'warning'> = {
      compliant: 'success',
      violation: 'destructive',
      pending_review: 'warning',
    }
    return <Badge variant={variants[status]}>{status.replace('_', ' ')}</Badge>
  }

  if (wizardState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-lg">Loading wizard...</span>
      </div>
    )
  }

  if (wizardState === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <CardTitle className="mb-2">Something went wrong</CardTitle>
            <CardDescription className="mb-6">Failed to load the formulation wizard.</CardDescription>
            <Button onClick={() => setWizardState('ready')}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Formulation Wizard</h1>
          <div className="flex items-center gap-3">
            {saveDraftState === 'saving' && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Saving...
              </div>
            )}
            {saveDraftState === 'saved' && (
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4 mr-1" /> Draft saved
              </div>
            )}
            <Button variant="outline" size="sm" onClick={handleSaveDraft} disabled={saveDraftState === 'saving'}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="bg-white dark:bg-gray-900 rounded-lg border p-4 mb-6">
          <div className="flex items-center justify-between">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex items-center flex-1">
                <button
                  onClick={() => handleStepClick(step.id)}
                  disabled={!completedSteps.has(step.id) && step.id !== currentStep}
                  className={cn(
                    'flex items-center gap-2 text-sm transition-colors',
                    step.id === currentStep
                      ? 'text-primary font-semibold'
                      : completedSteps.has(step.id)
                        ? 'text-green-600 cursor-pointer hover:text-green-700'
                        : 'text-muted-foreground cursor-default'
                  )}
                >
                  {completedSteps.has(step.id) ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : step.id === currentStep ? (
                    <Circle className="h-5 w-5 fill-primary text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="hidden lg:inline">{step.label}</span>
                </button>
                {idx < STEPS.length - 1 && (
                  <Separator
                    className={cn(
                      'flex-1 mx-2',
                      completedSteps.has(step.id) ? 'bg-green-500' : 'bg-border'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Create Formula */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Create Formula</CardTitle>
              <CardDescription>Define the basic metadata for your new fragrance formula.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Formula Name</label>
                <Input
                  placeholder="e.g. Summer Breeze v2"
                  value={data.name}
                  onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Brief / Description</label>
                <textarea
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  placeholder="Describe the olfactory profile, target market, and inspiration..."
                  value={data.brief}
                  onChange={(e) => setData((prev) => ({ ...prev, brief: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Accord</label>
                <Select value={data.accord} onValueChange={(v) => setData((prev) => ({ ...prev, accord: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select accord family" />
                  </SelectTrigger>
                  <SelectContent>
                    {accords.map((a) => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Project</label>
                <Select value={data.project} onValueChange={(v) => setData((prev) => ({ ...prev, project: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="luxury-fresh">Luxury Fresh Collection</SelectItem>
                    <SelectItem value="oriental-night">Oriental Night</SelectItem>
                    <SelectItem value="woody-essentials">Woody Essentials</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Notes</label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  placeholder="Internal notes..."
                  value={data.notes}
                  onChange={(e) => setData((prev) => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Add Ingredients */}
        {currentStep === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Material Catalog</CardTitle>
                <CardDescription>Search and add materials to your composition.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search materials..."
                    className="pl-10"
                    value={materialSearch}
                    onChange={(e) => setMaterialSearch(e.target.value)}
                  />
                </div>
                <div className="space-y-1 max-h-[400px] overflow-y-auto">
                  {filteredCatalog.map((material) => (
                    <div
                      key={material.id}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium">{material.name}</p>
                        <p className="text-xs text-muted-foreground">${material.cost_per_kg.toFixed(2)}/kg</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAddIngredient(material)}
                        disabled={data.ingredients.some((i) => i.material_id === material.id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {filteredCatalog.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No materials found.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Composition</CardTitle>
                <CardDescription>
                  Set weight percentages.{' '}
                  <span className={cn('font-semibold', totalWeightValid ? 'text-green-600' : 'text-destructive')}>
                    Total: {totalWeight.toFixed(2)}%
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {data.ingredients.length === 0 ? (
                  <div className="text-center py-12">
                    <Beaker className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No ingredients added yet. Select from the catalog.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data.ingredients.map((ing) => (
                      <div key={ing.material_id} className="flex items-center gap-3 p-2 rounded-md border">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{ing.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            step={0.01}
                            className="w-20 h-8 text-sm"
                            value={ing.weight_percent || ''}
                            onChange={(e) => handleWeightChange(ing.material_id, parseFloat(e.target.value) || 0)}
                          />
                          <span className="text-xs text-muted-foreground w-4">%</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => handleRemoveIngredient(ing.material_id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Cost Analysis */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Cost Analysis</CardTitle>
              <CardDescription>Breakdown of raw material costs per kilogram.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Weight %</TableHead>
                    <TableHead>Cost/kg</TableHead>
                    <TableHead className="text-right">Contribution</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.ingredients.map((ing) => {
                    const contribution = (ing.weight_percent / 100) * ing.cost_per_kg
                    return (
                      <TableRow key={ing.material_id}>
                        <TableCell className="font-medium">{ing.name}</TableCell>
                        <TableCell>{ing.weight_percent.toFixed(2)}%</TableCell>
                        <TableCell>${ing.cost_per_kg.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${contribution.toFixed(2)}</TableCell>
                      </TableRow>
                    )
                  })}
                  {data.ingredients.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        No ingredients to analyze.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <Separator className="my-4" />
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Cost per kg</span>
                <span className="text-2xl font-bold text-primary">${totalCost.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Compliance Validation */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Compliance Validation</CardTitle>
              <CardDescription>Check all ingredients against IFRA and regulatory standards.</CardDescription>
            </CardHeader>
            <CardContent>
              {complianceResults.length === 0 ? (
                <div className="text-center py-12">
                  <ShieldCheck className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">Run compliance check to validate your formula.</p>
                  <Button onClick={handleRunCompliance} disabled={complianceLoading || data.ingredients.length === 0}>
                    {complianceLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Checking...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4 mr-2" /> Run Compliance Check
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complianceResults.map((r) => (
                      <TableRow key={r.material_id}>
                        <TableCell className="font-medium">{r.material_name}</TableCell>
                        <TableCell>{getComplianceBadge(r.status)}</TableCell>
                        <TableCell className="capitalize">{r.severity}</TableCell>
                        <TableCell>{r.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 5: Optimization */}
        {currentStep === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>Optimization Constraints</CardTitle>
              <CardDescription>Set parameters to guide the AI optimization engine.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Cost Ceiling: ${data.costCeiling.toFixed(0)}/kg
                </label>
                <input
                  type="range"
                  min={10}
                  max={500}
                  step={5}
                  className="w-full"
                  value={data.costCeiling}
                  onChange={(e) => setData((prev) => ({ ...prev, costCeiling: parseInt(e.target.value) }))}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$10</span>
                  <span>$500</span>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">IFRA Compliant Only</span>
                <Button
                  variant={data.ifraCompliant ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setData((prev) => ({ ...prev, ifraCompliant: !prev.ifraCompliant }))}
                >
                  {data.ifraCompliant ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium mb-1 block">Target Accord</label>
                <Select value={data.targetAccord} onValueChange={(v) => setData((prev) => ({ ...prev, targetAccord: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target accord" />
                  </SelectTrigger>
                  <SelectContent>
                    {accords.map((a) => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium mb-1 block">Banned Materials</label>
                <div className="flex flex-wrap gap-2">
                  {catalogMaterials
                    .filter((m) => data.bannedMaterials.includes(m.id))
                    .map((m) => (
                      <Badge key={m.id} variant="destructive" className="cursor-pointer" onClick={() => setData((prev) => ({ ...prev, bannedMaterials: prev.bannedMaterials.filter((id) => id !== m.id) }))}>
                        {m.name} &times;
                      </Badge>
                    ))}
                  <Select
                    value=""
                    onValueChange={(v) => {
                      const id = parseInt(v)
                      if (!data.bannedMaterials.includes(id)) {
                        setData((prev) => ({ ...prev, bannedMaterials: [...prev.bannedMaterials, id] }))
                      }
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Add material..." />
                    </SelectTrigger>
                    <SelectContent>
                      {catalogMaterials
                        .filter((m) => !data.bannedMaterials.includes(m.id))
                        .map((m) => (
                          <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 6: Prediction */}
        {currentStep === 6 && (
          <Card>
            <CardHeader>
              <CardTitle>AI Prediction</CardTitle>
              <CardDescription>Run AI models to predict quality, stability, and commercial performance.</CardDescription>
            </CardHeader>
            <CardContent>
              {predictionScores ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <p className="text-sm text-muted-foreground">Quality Score</p>
                      <p className="text-3xl font-bold text-blue-600">{predictionScores.quality.toFixed(1)}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <FlaskConical className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <p className="text-sm text-muted-foreground">Stability Score</p>
                      <p className="text-3xl font-bold text-green-600">{predictionScores.stability.toFixed(1)}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <DollarSign className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                      <p className="text-sm text-muted-foreground">Commercial Score</p>
                      <p className="text-3xl font-bold text-amber-600">{predictionScores.commercial.toFixed(1)}</p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">Run prediction to see AI-powered performance scores.</p>
                  <Button onClick={handleRunPrediction} disabled={predictionLoading}>
                    {predictionLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Predicting...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="h-4 w-4 mr-2" /> Run Prediction
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 7: Approval */}
        {currentStep === 7 && (
          <Card>
            <CardHeader>
              <CardTitle>Approval Summary</CardTitle>
              <CardDescription>Review all formula details before approving or rejecting.</CardDescription>
            </CardHeader>
            <CardContent>
              <Card className="bg-muted/50 mb-6">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Name</span>
                    <span className="text-sm">{data.name || '—'}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Accord</span>
                    <span className="text-sm">{data.accord || '—'}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Project</span>
                    <span className="text-sm">{data.project || '—'}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Ingredients</span>
                    <span className="text-sm">{data.ingredients.length} materials</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total Weight</span>
                    <span className={cn('text-sm font-semibold', totalWeightValid ? 'text-green-600' : 'text-destructive')}>
                      {totalWeight.toFixed(2)}% {!totalWeightValid && '(must be 100%)'}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total Cost/kg</span>
                    <span className="text-sm font-semibold">${totalCost.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">IFRA Compliant</span>
                    <span className="text-sm">{complianceResults.every((r) => r.status === 'compliant') ? 'Yes' : 'Pending'}</span>
                  </div>
                  {predictionScores && (
                    <>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Quality Score</span>
                        <span className="text-sm">{predictionScores.quality.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Stability Score</span>
                        <span className="text-sm">{predictionScores.stability.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Commercial Score</span>
                        <span className="text-sm">{predictionScores.commercial.toFixed(1)}</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              <div className="flex gap-4 justify-center">
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={() => handleApproval('reject')}
                  disabled={approvalAction !== null}
                >
                  {approvalAction === 'reject' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Reject Formula
                </Button>
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => handleApproval('approve')}
                  disabled={approvalAction !== null}
                >
                  {approvalAction === 'approve' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Approve Formula
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 8: Version */}
        {currentStep === 8 && (
          <Card>
            <CardHeader>
              <CardTitle>Version & Save</CardTitle>
              <CardDescription>Set version details and finalize your formula.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Version</label>
                <Input
                  placeholder="1.0.0"
                  value={data.version}
                  onChange={(e) => setData((prev) => ({ ...prev, version: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Change Log</label>
                <textarea
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  placeholder="Describe changes made in this version..."
                  value={data.changeLog}
                  onChange={(e) => setData((prev) => ({ ...prev, changeLog: e.target.value }))}
                />
              </div>
              <div className="pt-2">
                <Button className="w-full" size="lg" onClick={handleSaveDraft} disabled={saveDraftState === 'saving'}>
                  {saveDraftState === 'saving' ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
                  ) : (
                    <><CheckCheck className="h-4 w-4 mr-2" /> Save Final Version</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {currentStep < 8 && (
              <>
                {wizardState === 'validation_error' && (
                  <span className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" /> Please fix errors before continuing.
                  </span>
                )}
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
