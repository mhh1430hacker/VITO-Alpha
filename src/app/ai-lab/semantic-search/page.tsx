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
  Search, Loader2, AlertCircle, Globe, SlidersHorizontal,
  Type, Hash, Lightbulb, Database, Beaker, Package,
} from 'lucide-react'
import { searchAPI, type SearchResult } from '@/lib/search_api'

const DOMAINS = ['feature', 'model', 'formula', 'material']

const DOMAIN_ICONS: Record<string, React.ElementType> = {
  feature: Database,
  model: Beaker,
  formula: Package,
  material: Package,
}

export default function SemanticSearchPage() {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('keyword')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [total, setTotal] = useState(0)
  const [latency, setLatency] = useState(0)
  const [searchType, setSearchType] = useState('keyword')

  const [globalResults, setGlobalResults] = useState<Record<string, SearchResult[]> | null>(null)
  const [globalTotal, setGlobalTotal] = useState(0)

  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<string[]>([])
  const [showAutocomplete, setShowAutocomplete] = useState(false)

  const [keywordWeight, setKeywordWeight] = useState(0.5)
  const [vectorWeight, setVectorWeight] = useState(0.5)

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setResults([])
    try {
      if (activeTab === 'hybrid') {
        const res = await searchAPI.hybridSearch(query, keywordWeight, vectorWeight, DOMAINS)
        setResults(res.data.results)
        setTotal(res.data.total)
        setLatency(res.data.latency_ms)
        setSearchType('hybrid')
      } else if (activeTab === 'global') {
        const res = await searchAPI.globalSearch(query, 5)
        setGlobalResults({
          features: res.data.feature_results,
          models: res.data.model_results,
          formulas: res.data.formula_results,
          materials: res.data.material_results,
        })
        setGlobalTotal(res.data.total_results)
        setLatency(res.data.latency_ms)
        setSearchType('global')
      } else {
        const res = await searchAPI.search(query, 'keyword', DOMAINS)
        setResults(res.data.results)
        setTotal(res.data.total)
        setLatency(res.data.latency_ms)
        setSearchType('keyword')
      }
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message || 'Search failed')
    } finally {
      setLoading(false)
    }
  }, [query, activeTab, keywordWeight, vectorWeight])

  const handleAutocomplete = useCallback(async (val: string) => {
    setQuery(val)
    if (val.trim().length < 2) { setShowAutocomplete(false); return }
    try {
      const res = await searchAPI.autocomplete(val, DOMAINS)
      setAutocompleteSuggestions(res.data.suggestions.map(s => s.text))
      setShowAutocomplete(res.data.suggestions.length > 0)
    } catch {
      setShowAutocomplete(false)
    }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Search className="h-6 w-6" /> Semantic Search
        </h1>
        <p className="text-sm text-muted-foreground">Search across features, models, formulas, and materials</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="keyword"><Type className="h-4 w-4 mr-2" />Keyword</TabsTrigger>
          <TabsTrigger value="hybrid"><SlidersHorizontal className="h-4 w-4 mr-2" />Hybrid</TabsTrigger>
          <TabsTrigger value="global"><Globe className="h-4 w-4 mr-2" />Global</TabsTrigger>
        </TabsList>

        <div className="mt-4 space-y-4">
          <div className="relative">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  placeholder="Search across features, models, formulas, materials..."
                  value={query}
                  onChange={(e) => handleAutocomplete(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pr-10"
                />
                {showAutocomplete && (
                  <Card className="absolute top-full left-0 right-0 z-10 mt-1 shadow-lg">
                    <CardContent className="p-2">
                      {autocompleteSuggestions.map((s, i) => (
                        <button
                          key={i}
                          className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-muted transition-colors"
                          onClick={() => { setQuery(s); setShowAutocomplete(false); }}
                        >
                          {s}
                        </button>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
              <Button onClick={handleSearch} disabled={loading || !query.trim()}>
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                Search
              </Button>
            </div>
          </div>

          {activeTab === 'hybrid' && (
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs">Keyword Weight: {keywordWeight.toFixed(1)}</Label>
                    <input
                      type="range" min={0} max={1} step={0.1}
                      value={keywordWeight}
                      onChange={(e) => setKeywordWeight(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Vector Weight: {vectorWeight.toFixed(1)}</Label>
                    <input
                      type="range" min={0} max={1} step={0.1}
                      value={vectorWeight}
                      onChange={(e) => setVectorWeight(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </Tabs>

      {error && (
        <Card className="border-destructive/50">
          <CardContent className="flex items-center gap-3 pt-4 pb-4 text-destructive text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </CardContent>
        </Card>
      )}

      {searchType !== 'global' && results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{total} result{total !== 1 ? 's' : ''} found in {latency.toFixed(0)}ms</span>
            <Badge variant="outline">{searchType} search</Badge>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((r, i) => {
                    const Icon = DOMAIN_ICONS[r.type] || Database
                    return (
                      <TableRow key={i}>
                        <TableCell>
                          <Badge variant="outline" className="gap-1">
                            <Icon className="h-3 w-3" /> {r.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{r.text}</TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                          {r.description || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={r.score > 0.8 ? 'success' : r.score > 0.5 ? 'default' : 'secondary'}>
                            {(r.score * 100).toFixed(0)}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {searchType === 'global' && globalResults && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{globalTotal} total result{globalTotal !== 1 ? 's' : ''} found in {latency.toFixed(0)}ms</span>
            <Badge variant="outline">global search</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(globalResults).map(([key, items]) => {
              if (!items || items.length === 0) return null
              const Icon = DOMAIN_ICONS[key.replace('_results', '')] || Database
              return (
                <Card key={key}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 capitalize">
                      <Icon className="h-4 w-4" /> {key.replace('_results', '')}
                      <Badge variant="secondary" className="ml-auto">{items.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {items.map((r: any, i: number) => (
                      <div key={i} className="flex items-center justify-between px-4 py-2 text-sm border-b last:border-0 hover:bg-muted/50">
                        <span className="font-medium">{r.text || r.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {(r.score * 100).toFixed(0)}%
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {!loading && results.length === 0 && searchType !== 'global' && query && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 pt-12 pb-12">
            <Search className="h-16 w-16 text-muted-foreground/30" />
            <p className="text-lg font-medium">No results found</p>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Try different keywords, use hybrid search, or expand your search globally.
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && !query && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 pt-16 pb-16">
            <Globe className="h-20 w-20 text-muted-foreground/30" />
            <p className="text-lg font-medium">Search across the platform</p>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Use keyword search for exact matches, hybrid search for semantic similarity, or global search to find everything at once.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
