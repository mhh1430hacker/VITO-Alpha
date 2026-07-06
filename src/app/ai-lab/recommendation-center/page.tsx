'use client'

import { useState, useCallback } from 'react'
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  Lightbulb, Loader2, AlertCircle, RefreshCw, TrendingUp,
  DollarSign, BarChart3, CheckCircle, XCircle, ThumbsUp, MessageSquare,
  Search, Truck,
} from 'lucide-react'
import { recommendationAPI } from '@/lib/recommendation_api'

export default function RecommendationCenterPage() {
  const [activeTab, setActiveTab] = useState('alternatives')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [materialId, setMaterialId] = useState('')
  const [altResult, setAltResult] = useState<Record<string, any> | null>(null)
  const [altLoading, setAltLoading] = useState(false)

  const [supplierMatId, setSupplierMatId] = useState('')
  const [supplierRegion, setSupplierRegion] = useState('')
  const [supplierResult, setSupplierResult] = useState<Record<string, any> | null>(null)
  const [supplierLoading, setSupplierLoading] = useState(false)

  const [formulaId, setFormulaId] = useState('')
  const [objective, setObjective] = useState('cost')
  const [formulaResult, setFormulaResult] = useState<Record<string, any> | null>(null)
  const [formulaLoading, setFormulaLoading] = useState(false)

  const [costFormulaId, setCostFormulaId] = useState('')
  const [costResult, setCostResult] = useState<Record<string, any> | null>(null)
  const [costLoading, setCostLoading] = useState(false)

  const [recs, setRecs] = useState<any[]>([])
  const [recsTotal, setRecsTotal] = useState(0)
  const [recsLoading, setRecsLoading] = useState(false)

  const handleFindAlternatives = useCallback(async () => {
    if (!materialId) return
    setAltLoading(true)
    setAltResult(null)
    setError('')
    try {
      const res = await recommendationAPI.findAlternatives(materialId, 10, 0.7, true)
      setAltResult(res.data)
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message || 'Failed to find alternatives')
    } finally {
      setAltLoading(false)
    }
  }, [materialId])

  const handleSupplierAlts = useCallback(async () => {
    if (!supplierMatId) return
    setSupplierLoading(true)
    setSupplierResult(null)
    setError('')
    try {
      const res = await recommendationAPI.supplierAlternatives(supplierMatId, undefined, supplierRegion || undefined, 10)
      setSupplierResult(res.data)
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message || 'Failed to find supplier alternatives')
    } finally {
      setSupplierLoading(false)
    }
  }, [supplierMatId, supplierRegion])

  const handleFormulaOpt = useCallback(async () => {
    if (!formulaId) return
    setFormulaLoading(true)
    setFormulaResult(null)
    setError('')
    try {
      const res = await recommendationAPI.formulaOptimizations(formulaId, objective, {}, 5)
      setFormulaResult(res.data)
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message || 'Failed to optimize')
    } finally {
      setFormulaLoading(false)
    }
  }, [formulaId, objective])

  const handleCostReduction = useCallback(async () => {
    if (!costFormulaId) return
    setCostLoading(true)
    setCostResult(null)
    setError('')
    try {
      const res = await recommendationAPI.costReduction(costFormulaId)
      setCostResult(res.data)
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message || 'Failed to analyze costs')
    } finally {
      setCostLoading(false)
    }
  }, [costFormulaId])

  const fetchRecommendations = useCallback(async () => {
    setRecsLoading(true)
    try {
      const res = await recommendationAPI.listRecommendations({ page: 1, page_size: 20 })
      setRecs(res.data.recommendations)
      setRecsTotal(res.data.total)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setRecsLoading(false)
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Lightbulb className="h-6 w-6" /> Recommendation Center
          </h1>
          <p className="text-sm text-muted-foreground">AI-powered ingredient alternatives, formula optimization, and cost reduction</p>
        </div>
      </div>

      {error && (
        <Card className="border-destructive/50">
          <CardContent className="flex items-center gap-3 pt-4 pb-4 text-destructive text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-3xl grid-cols-5">
          <TabsTrigger value="alternatives"><Lightbulb className="h-4 w-4 mr-2" />Alternatives</TabsTrigger>
          <TabsTrigger value="suppliers"><Truck className="h-4 w-4 mr-2" />Suppliers</TabsTrigger>
          <TabsTrigger value="optimization"><TrendingUp className="h-4 w-4 mr-2" />Optimization</TabsTrigger>
          <TabsTrigger value="cost"><DollarSign className="h-4 w-4 mr-2" />Cost Reduction</TabsTrigger>
          <TabsTrigger value="history"><BarChart3 className="h-4 w-4 mr-2" />History</TabsTrigger>
        </TabsList>

        <TabsContent value="alternatives" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Find Alternative Ingredients</CardTitle>
              <CardDescription>Discover chemically similar alternatives with cost and compliance analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 max-w-md">
                <Input value={materialId} onChange={(e) => setMaterialId(e.target.value)} placeholder="Material ID (e.g. material-1)" />
                <Button onClick={handleFindAlternatives} disabled={altLoading || !materialId}>
                  {altLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                  Search
                </Button>
              </div>
              {altResult && (
                <div className="space-y-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">{altResult.recommendation?.title || 'Alternatives Found'}</p>
                    <p className="text-xs text-muted-foreground">{altResult.recommendation?.description}</p>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Material</TableHead>
                        <TableHead>Similarity</TableHead>
                        <TableHead>Compatibility</TableHead>
                        <TableHead>Cost Impact</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {altResult.alternatives?.map((alt: any, i: number) => (
                        <TableRow key={i}>
                          <TableCell className="font-mono text-xs">{alt.material_id || alt.alternative_material_id}</TableCell>
                          <TableCell>
                            <Badge variant={alt.similarity_score > 0.8 ? 'success' : 'default'}>
                              {(alt.similarity_score * 100).toFixed(0)}%
                            </Badge>
                          </TableCell>
                          <TableCell>{alt.compatibility_score ? `${(alt.compatibility_score * 100).toFixed(0)}%` : '-'}</TableCell>
                          <TableCell className={cn(alt.cost_impact != null && alt.cost_impact < 0 ? 'text-green-600' : 'text-red-600')}>
                            {alt.cost_impact != null ? `${alt.cost_impact > 0 ? '+' : ''}${alt.cost_impact}` : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Supplier Alternatives</CardTitle>
              <CardDescription>Find alternative suppliers for your materials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label>Material ID</Label>
                  <Input value={supplierMatId} onChange={(e) => setSupplierMatId(e.target.value)} placeholder="material-1" />
                </div>
                <div className="space-y-1">
                  <Label>Region (optional)</Label>
                  <Select value={supplierRegion} onValueChange={setSupplierRegion}>
                    <SelectTrigger><SelectValue placeholder="Any region" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any</SelectItem>
                      <SelectItem value="EU">EU</SelectItem>
                      <SelectItem value="US">US</SelectItem>
                      <SelectItem value="APAC">APAC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSupplierAlts} disabled={supplierLoading || !supplierMatId} className="w-full">
                    {supplierLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                    Search
                  </Button>
                </div>
              </div>
              {supplierResult && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>Price Est.</TableHead>
                      <TableHead>Lead Time</TableHead>
                      <TableHead>Quality</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supplierResult.alternatives?.map((alt: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{alt.supplier}</TableCell>
                        <TableCell><Badge variant="outline">{alt.region}</Badge></TableCell>
                        <TableCell>${alt.price_estimate?.toFixed(2) || '-'}</TableCell>
                        <TableCell>{alt.lead_time_days || '-'} days</TableCell>
                        <TableCell>
                          <Badge variant={alt.quality_score >= 90 ? 'success' : alt.quality_score >= 75 ? 'default' : 'secondary'}>
                            {alt.quality_score || '-'}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Formula Optimization</CardTitle>
              <CardDescription>Optimize formulas for cost, performance, or compliance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label>Formula ID</Label>
                  <Input value={formulaId} onChange={(e) => setFormulaId(e.target.value)} placeholder="formula-1" />
                </div>
                <div className="space-y-1">
                  <Label>Objective</Label>
                  <Select value={objective} onValueChange={setObjective}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cost">Cost</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={handleFormulaOpt} disabled={formulaLoading || !formulaId} className="w-full">
                    {formulaLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <TrendingUp className="h-4 w-4 mr-2" />}
                    Optimize
                  </Button>
                </div>
              </div>
              {formulaResult && (
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">{formulaResult.recommendation?.title}</p>
                    <p className="text-xs text-muted-foreground">{formulaResult.recommendation?.description}</p>
                  </div>
                  {formulaResult.suggestions?.map((s: any, i: number) => (
                    <Card key={i} className="border-l-4 border-l-primary">
                      <CardContent className="pt-3 pb-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">Suggestion {i + 1}</p>
                          <Badge variant="secondary">Score: {(s.score * 100).toFixed(0)}%</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{s.description || JSON.stringify(s)}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cost" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cost Reduction Analysis</CardTitle>
              <CardDescription>Identify cost-saving opportunities in your formulas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 max-w-md">
                <Input value={costFormulaId} onChange={(e) => setCostFormulaId(e.target.value)} placeholder="Formula ID (e.g. formula-1)" />
                <Button onClick={handleCostReduction} disabled={costLoading || !costFormulaId}>
                  {costLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <DollarSign className="h-4 w-4 mr-2" />}
                  Analyze
                </Button>
              </div>
              {costResult && (
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">{costResult.recommendation?.title || 'Cost Analysis'}</p>
                    <p className="text-xs text-muted-foreground">{costResult.recommendation?.description}</p>
                  </div>
                  {costResult.suggestions?.map((s: any, i: number) => (
                    <Card key={i} className="border-l-4 border-l-green-500">
                      <CardContent className="pt-3 pb-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">Suggestion {i + 1}</p>
                          <Badge variant="success">
                            <DollarSign className="h-3 w-3 mr-1" />
                            {s.savings ? `Save ${s.savings}` : `Score: ${(s.score * 100).toFixed(0)}%`}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{s.description || JSON.stringify(s)}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4" /> Recommendation History
              </CardTitle>
              <CardDescription>View past recommendations and their outcomes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" size="sm" onClick={fetchRecommendations} disabled={recsLoading}>
                <RefreshCw className={cn('h-4 w-4 mr-2', recsLoading && 'animate-spin')} />
                Load History
              </Button>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        {recsLoading ? 'Loading...' : 'No recommendations yet. Generate one above.'}
                      </TableCell>
                    </TableRow>
                  ) : recs.map((r: any) => (
                    <TableRow key={r.recommendation_id}>
                      <TableCell className="font-mono text-xs">{r.recommendation_id}</TableCell>
                      <TableCell><Badge variant="secondary">{r.recommendation_type}</Badge></TableCell>
                      <TableCell className="text-xs">{r.source_type}:{r.source_id}</TableCell>
                      <TableCell className="font-medium">{r.title}</TableCell>
                      <TableCell>{(r.score * 100).toFixed(0)}%</TableCell>
                      <TableCell>
                        <Badge variant={r.status === 'accepted' ? 'success' : r.status === 'rejected' ? 'destructive' : 'secondary'}>
                          {r.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
