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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  Beaker, Loader2, AlertCircle, ArrowRightLeft, Search,
  Atom, FlaskConical, Package, FileText, Truck, Music,
  Globe, BarChart3,
} from 'lucide-react'
import { similarityAPI, type SimilarityResponse } from '@/lib/similarity_api'

type DomainType = 'molecule' | 'fragrance' | 'material' | 'formula' | 'supplier' | 'accord' | 'market'

const DOMAINS: { id: DomainType; label: string; icon: React.ElementType }[] = [
  { id: 'molecule', label: 'Molecule', icon: Atom },
  { id: 'fragrance', label: 'Fragrance', icon: Music },
  { id: 'material', label: 'Material', icon: Package },
  { id: 'formula', label: 'Formula', icon: FileText },
  { id: 'supplier', label: 'Supplier', icon: Truck },
  { id: 'accord', label: 'Accord', icon: FlaskConical },
  { id: 'market', label: 'Market', icon: Globe },
]

const METRICS = ['cosine', 'euclidean', 'tanimoto', 'jaccard', 'dot_product', 'manhattan', 'hamming']

interface CompareResult {
  score: number
  metric: string
  dimension?: number
}

interface FindResult {
  source_id: string
  similarity_score: number
}

export default function SimilarityExplorerPage() {
  const [sourceA, setSourceA] = useState('')
  const [sourceB, setSourceB] = useState('')
  const [domain, setDomain] = useState<DomainType>('molecule')
  const [metric, setMetric] = useState('tanimoto')
  const [compareResult, setCompareResult] = useState<CompareResult | null>(null)
  const [compareLoading, setCompareLoading] = useState(false)
  const [error, setError] = useState('')

  const [findSource, setFindSource] = useState('')
  const [findK, setFindK] = useState('10')
  const [findResults, setFindResults] = useState<FindResult[]>([])
  const [findLoading, setFindLoading] = useState(false)

  const handleCompare = useCallback(async () => {
    if (!sourceA || !sourceB) return
    setCompareLoading(true)
    setCompareResult(null)
    setError('')
    try {
      const domainAPI: Record<string, Function> = {
        molecule: similarityAPI.moleculeSimilarity,
        fragrance: similarityAPI.fragranceSimilarity,
        material: similarityAPI.materialSimilarity,
        formula: similarityAPI.formulaSimilarity,
        supplier: similarityAPI.supplierSimilarity,
        accord: similarityAPI.accordSimilarity,
        market: similarityAPI.marketSimilarity,
      }
      const res = await domainAPI[domain](sourceA, sourceB, metric)
      setCompareResult({ score: res.data.similarity_score, metric: res.data.metric, dimension: res.data.dimension })
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message || 'Comparison failed')
    } finally {
      setCompareLoading(false)
    }
  }, [sourceA, sourceB, domain, metric])

  const handleFindSimilar = useCallback(async () => {
    if (!findSource) return
    setFindLoading(true)
    setFindResults([])
    setError('')
    try {
      const res = await similarityAPI.findSimilar(domain, findSource, parseInt(findK) || 10, metric)
      setFindResults(res.data.results as FindResult[])
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message || 'Search failed')
    } finally {
      setFindLoading(false)
    }
  }, [findSource, domain, findK, metric])

  const DomainIcon = DOMAINS.find(d => d.id === domain)?.icon || Atom

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ArrowRightLeft className="h-6 w-6" /> Similarity Explorer
        </h1>
        <p className="text-sm text-muted-foreground">Compare molecules, fragrances, materials, formulas and more</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {DOMAINS.map((d) => (
          <Button
            key={d.id}
            variant={domain === d.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDomain(d.id)}
            className="gap-1.5"
          >
            <d.icon className="h-4 w-4" /> {d.label}
          </Button>
        ))}
      </div>

      {error && (
        <Card className="border-destructive/50">
          <CardContent className="flex items-center gap-3 pt-4 pb-4 text-destructive text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><ArrowRightLeft className="h-4 w-4" /> Pairwise Comparison</CardTitle>
            <CardDescription>Compare two entities with selected metric</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Source A</Label>
                <Input value={sourceA} onChange={(e) => setSourceA(e.target.value)} placeholder="e.g. CCO" />
              </div>
              <div className="space-y-1">
                <Label>Source B</Label>
                <Input value={sourceB} onChange={(e) => setSourceB(e.target.value)} placeholder="e.g. CC(=O)O" />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Metric</Label>
              <Select value={metric} onValueChange={setMetric}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {METRICS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleCompare} disabled={compareLoading || !sourceA || !sourceB} className="w-full">
              {compareLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <BarChart3 className="h-4 w-4 mr-2" />}
              Compare
            </Button>
            {compareResult && (
              <div className="text-center p-4 bg-muted rounded-lg space-y-1">
                <p className="text-xs text-muted-foreground">
                  <DomainIcon className="h-3 w-3 inline mr-1" />
                  {sourceA} vs {sourceB} &middot; {compareResult.metric}
                </p>
                <p className="text-4xl font-bold text-primary">
                  {(compareResult.score * 100).toFixed(1)}%
                </p>
                {compareResult.dimension && (
                  <p className="text-xs text-muted-foreground">Dimension: {compareResult.dimension}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Search className="h-4 w-4" /> Find Similar</CardTitle>
            <CardDescription>Find top-K most similar entities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Source ID</Label>
              <Input value={findSource} onChange={(e) => setFindSource(e.target.value)} placeholder="e.g. CCO" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>K results</Label>
                <Input type="number" value={findK} onChange={(e) => setFindK(e.target.value)} min={1} max={100} />
              </div>
              <div className="space-y-1">
                <Label>Metric</Label>
                <Select value={metric} onValueChange={setMetric}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {METRICS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleFindSimilar} disabled={findLoading || !findSource} className="w-full">
              {findLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
              Search
            </Button>
            {findResults.length > 0 && (
              <div className="space-y-2 mt-2">
                <Separator />
                <p className="text-xs text-muted-foreground font-medium">Results (top {findK})</p>
                {findResults.map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                    <span className="text-sm font-mono">{r.source_id}</span>
                    <Badge variant={r.similarity_score > 0.8 ? 'success' : r.similarity_score > 0.6 ? 'default' : 'secondary'}>
                      {(r.similarity_score * 100).toFixed(1)}%
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
