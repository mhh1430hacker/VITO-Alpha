'use client'

import { useState, useEffect, useCallback } from 'react'
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
  GitBranch, Loader2, AlertCircle, RefreshCw, Play, Search as SearchIcon,
  BarChart3, Share2, Layers, Zap,
} from 'lucide-react'
import { embeddingAPI, type EmbeddingResponse, type EmbeddingSummary } from '@/lib/embedding_api'

type PageState = 'loading' | 'ready' | 'error'

const PROVIDERS = ['morgan', 'maccs', 'rdkit', 'transformer', 'graph', 'gnn', 'custom']
const SOURCE_TYPES = ['molecule', 'fragrance', 'material', 'formula', 'text']

export default function EmbeddingDashboardPage() {
  const [pageState, setPageState] = useState<PageState>('loading')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [embeddings, setEmbeddings] = useState<EmbeddingResponse[]>([])
  const [summary, setSummary] = useState<EmbeddingSummary | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const [sourceType, setSourceType] = useState('')
  const [sourceId, setSourceId] = useState('')
  const [provider, setProvider] = useState('morgan')
  const [generating, setGenerating] = useState(false)

  const [searchSType, setSearchSType] = useState('')
  const [searchSId, setSearchSId] = useState('')
  const [searchProvider, setSearchProvider] = useState('')

  const [simSrcA, setSimSrcA] = useState('')
  const [simSrcB, setSimSrcB] = useState('')
  const [simType, setSimType] = useState('molecule')
  const [simResult, setSimResult] = useState<{ score: number; metric: string } | null>(null)
  const [simLoading, setSimLoading] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, any> = { page, page_size: 20 }
      if (searchSType) params.source_type = searchSType
      if (searchSId) params.source_id = searchSId
      if (searchProvider) params.provider = searchProvider
      const [embRes, sumRes] = await Promise.all([
        embeddingAPI.list(params),
        embeddingAPI.getSummary(),
      ])
      setEmbeddings(embRes.data.embeddings)
      setTotal(embRes.data.total)
      setSummary(sumRes.data)
      setPageState('ready')
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message || 'Failed to load embeddings')
      setPageState('error')
    } finally {
      setLoading(false)
    }
  }, [page, searchSType, searchSId, searchProvider])

  useEffect(() => { fetchData() }, [fetchData])

  const handleGenerate = useCallback(async () => {
    if (!sourceId) return
    setGenerating(true)
    try {
      await embeddingAPI.generate({ source_type: sourceType || 'molecule', source_id: sourceId, provider })
      fetchData()
    } catch (e: any) {
      alert(e.response?.data?.detail || e.message || 'Generation failed')
    } finally {
      setGenerating(false)
    }
  }, [sourceType, sourceId, provider, fetchData])

  const handleSimilarity = useCallback(async () => {
    if (!simSrcA || !simSrcB) return
    setSimLoading(true)
    setSimResult(null)
    try {
      const res = await embeddingAPI.similarity({
        source_type_a: simType, source_id_a: simSrcA,
        source_type_b: simType, source_id_b: simSrcB,
        provider: 'morgan', metric: 'cosine',
      })
      setSimResult({ score: res.data.similarity_score, metric: res.data.metric })
    } catch (e: any) {
      alert(e.response?.data?.detail || e.message || 'Similarity computation failed')
    } finally {
      setSimLoading(false)
    }
  }, [simType, simSrcA, simSrcB])

  if (pageState === 'loading') {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading embedding dashboard...</p>
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
            <p className="text-lg font-medium">Dashboard Error</p>
            <p className="text-sm text-muted-foreground text-center">{error}</p>
            <Button variant="outline" onClick={fetchData}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <GitBranch className="h-6 w-6" /> Embedding Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">Generate, search, and compare vector embeddings</p>
        </div>
        <Button variant="outline" onClick={fetchData} disabled={loading}>
          <RefreshCw className={cn('h-4 w-4 mr-2', loading && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4 pb-3">
              <p className="text-2xl font-bold">{summary.total_embeddings}</p>
              <p className="text-xs text-muted-foreground">Total Embeddings</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <p className="text-2xl font-bold">{PROVIDERS.length}</p>
              <p className="text-xs text-muted-foreground">Provider Types</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <p className="text-2xl font-bold">{SOURCE_TYPES.length}</p>
              <p className="text-xs text-muted-foreground">Source Types</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="overview"><Layers className="h-4 w-4 mr-2" />Overview</TabsTrigger>
          <TabsTrigger value="generate"><Zap className="h-4 w-4 mr-2" />Generate</TabsTrigger>
          <TabsTrigger value="similarity"><Share2 className="h-4 w-4 mr-2" />Similarity</TabsTrigger>
          <TabsTrigger value="metrics"><BarChart3 className="h-4 w-4 mr-2" />Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="flex gap-2">
            <Select value={searchSType} onValueChange={setSearchSType}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Source Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {SOURCE_TYPES.map(st => <SelectItem key={st} value={st}>{st}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={searchProvider} onValueChange={setSearchProvider}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Provider" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Providers</SelectItem>
                {PROVIDERS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input
              placeholder="Source ID..."
              value={searchSId}
              onChange={(e) => setSearchSId(e.target.value)}
              className="max-w-xs"
            />
            <Button variant="secondary" onClick={() => { setPage(1); fetchData() }}>
              <SearchIcon className="h-4 w-4 mr-2" /> Filter
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Embedding ID</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Dimension</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {embeddings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No embeddings generated yet.
                      </TableCell>
                    </TableRow>
                  ) : embeddings.map((e) => (
                    <TableRow key={e.embedding_id}>
                      <TableCell className="font-mono text-xs">{e.embedding_id}</TableCell>
                      <TableCell>{e.source_type}:<span className="font-mono text-xs">{e.source_id}</span></TableCell>
                      <TableCell><Badge variant="secondary">{e.provider}</Badge></TableCell>
                      <TableCell>{e.dimension}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{e.model_name || '-'}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {e.created_at ? new Date(e.created_at).toLocaleDateString() : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{total} total embedding{total !== 1 ? 's' : ''}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
              <Button variant="outline" size="sm" disabled={page * 20 >= total} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="generate" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Zap className="h-4 w-4" /> Generate Embedding</CardTitle>
                <CardDescription>Create a new embedding vector for a source entity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Source Type</Label>
                    <Select value={sourceType} onValueChange={setSourceType}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        {SOURCE_TYPES.map(st => <SelectItem key={st} value={st}>{st}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Provider</Label>
                    <Select value={provider} onValueChange={setProvider}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {PROVIDERS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Source ID *</Label>
                  <Input value={sourceId} onChange={(e) => setSourceId(e.target.value)} placeholder="e.g. CCO, rose, material-1" />
                </div>
                <Button onClick={handleGenerate} disabled={generating || !sourceId} className="w-full">
                  {generating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
                  Generate
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Share2 className="h-4 w-4" /> Compute Similarity</CardTitle>
                <CardDescription>Compare two entities using cosine similarity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label>Source Type</Label>
                  <Select value={simType} onValueChange={setSimType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SOURCE_TYPES.map(st => <SelectItem key={st} value={st}>{st}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Source A *</Label>
                    <Input value={simSrcA} onChange={(e) => setSimSrcA(e.target.value)} placeholder="e.g. CCO" />
                  </div>
                  <div className="space-y-1">
                    <Label>Source B *</Label>
                    <Input value={simSrcB} onChange={(e) => setSimSrcB(e.target.value)} placeholder="e.g. CC(=O)O" />
                  </div>
                </div>
                <Button onClick={handleSimilarity} disabled={simLoading || !simSrcA || !simSrcB} className="w-full">
                  {simLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Share2 className="h-4 w-4 mr-2" />}
                  Compare
                </Button>
                {simResult && (
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Similarity ({simResult.metric})</p>
                    <p className="text-3xl font-bold text-primary">{(simResult.score * 100).toFixed(1)}%</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="similarity" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Batch Similarity Search</CardTitle>
              <CardDescription>Search for similar embeddings by text or vector query</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center py-8">
                Use the Semantic Search page for full-text and vector search capabilities.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Embedding Metrics</CardTitle>
              <CardDescription>Performance and quality metrics for generated embeddings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center py-8">
                Embedding quality metrics will appear here once embeddings are generated.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
