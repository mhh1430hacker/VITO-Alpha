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
import { cn } from '@/lib/utils'
import {
  Atom,
  Loader2,
  AlertCircle,
  FlaskConical,
  Search,
  GitBranch,
  Beaker,
  Hash,
  Thermometer,
  Droplets,
  Weight,
  AlertTriangle,
  ArrowRight,
  CircleDot,
} from 'lucide-react'

type PageState = 'loading' | 'ready' | 'empty' | 'error'

interface Neighbor {
  id: number
  name: string
  smiles: string
  similarity: number
}

interface MoleculeDetail {
  name: string
  smiles: string
  molecularWeight: number
  logP: number
  boilingPoint: number
  vaporPressure: number
  odorType: string
}

const MOCK_SEARCH_RESULTS: Neighbor[] = [
  { id: 1, name: 'Linalool', smiles: 'CC(C)=CCCC(C)(O)C=C', similarity: 0.97 },
  { id: 2, name: 'Geraniol', smiles: 'CC(C)=CCCC(C)=CCO', similarity: 0.88 },
  { id: 3, name: 'Citronellol', smiles: 'CC(C)=CCCC(C)CCO', similarity: 0.82 },
  { id: 4, name: 'Nerol', smiles: 'CC(C)=CCCC(C)=CCO', similarity: 0.79 },
  { id: 5, name: 'Farnesol', smiles: 'CC(C)=CCCC(C)=CCCC(C)=CCO', similarity: 0.71 },
  { id: 6, name: 'Linalyl Acetate', smiles: 'CC(C)=CCCC(C)(C=C)OC(C)=O', similarity: 0.65 },
]

const MOCK_DETAIL: MoleculeDetail = {
  name: 'Linalool',
  smiles: 'CC(C)=CCCC(C)(O)C=C',
  molecularWeight: 154.25,
  logP: 2.97,
  boilingPoint: 198,
  vaporPressure: 0.018,
  odorType: 'Floral, Lavender-like',
}

const CANDIDATE_MOLECULES = ['Linalool', 'Geraniol', 'Citronellol', 'Nerol', 'Farnesol', 'Coumarin', 'Vanillin', 'Eugenol', 'Limonene', 'Alpha-Pinene']

export default function EmbeddingsPage() {
  const [pageState, setPageState] = useState<PageState>('loading')
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [neighbors, setNeighbors] = useState<Neighbor[] | null>(null)
  const [selectedMolecule, setSelectedMolecule] = useState<MoleculeDetail | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setPageState('ready'), 1000)
    return () => clearTimeout(t)
  }, [])

  const handleSearch = useCallback(() => {
    if (!query.trim()) return
    setSearching(true)
    setNeighbors(null)
    setSelectedMolecule(null)

    setTimeout(() => {
      setNeighbors(MOCK_SEARCH_RESULTS)
      setSelectedMolecule(MOCK_DETAIL)
      setSearching(false)
    }, 1500)
  }, [query])

  function handleCandidateClick(name: string) {
    setQuery(name)
    setSearching(true)
    setNeighbors(null)
    setSelectedMolecule(null)

    setTimeout(() => {
      setNeighbors(MOCK_SEARCH_RESULTS)
      setSelectedMolecule({ ...MOCK_DETAIL, name })
      setSearching(false)
    }, 1200)
  }

  if (pageState === 'loading') {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading embedding space...</p>
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
            <p className="text-lg font-medium">Embedding Error</p>
            <p className="text-sm text-muted-foreground text-center">Could not load the molecular embedding index.</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
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
          <Atom className="h-7 w-7" /> Molecular Embeddings
        </h1>
        <p className="text-muted-foreground mt-1">
          Explore molecular similarity via learned embeddings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Search className="h-5 w-5" /> Search Molecules
              </CardTitle>
              <CardDescription>
                Enter a molecule name or SMILES string
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Linalool, CC(C)=CCCC(C)(O)C=C..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  disabled={searching}
                />
                <Button onClick={handleSearch} disabled={searching || !query.trim()}>
                  {searching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  <span className="sr-only">Search</span>
                </Button>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Quick select:</p>
                <div className="flex flex-wrap gap-1.5">
                  {CANDIDATE_MOLECULES.map((name) => (
                    <button
                      key={name}
                      onClick={() => handleCandidateClick(name)}
                      disabled={searching}
                      className="rounded-full border px-2.5 py-0.5 text-xs hover:bg-muted transition-colors disabled:opacity-50"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {searching && (
            <Card>
              <CardContent className="flex items-center justify-center gap-3 pt-6 pb-6">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Searching embedding space for &quot;{query}&quot;...
                </p>
              </CardContent>
            </Card>
          )}

          {!searching && neighbors === null && (
            <Card>
              <CardContent className="flex flex-col items-center gap-4 pt-16 pb-16">
                <Atom className="h-20 w-20 text-muted-foreground/30" />
                <p className="text-lg font-medium">Search for a molecule</p>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  Enter a molecule name or SMILES string to find its nearest neighbors in the embedding space.
                </p>
              </CardContent>
            </Card>
          )}

          {!searching && neighbors && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <GitBranch className="h-5 w-5" /> Nearest Neighbors
                  </CardTitle>
                  <CardDescription>
                    t-SNE / UMAP 2D projection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative h-72 w-full rounded-md border bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50 overflow-hidden">
                    {neighbors.map((n, i) => {
                      const x = ((n.similarity * 100 + i * 7) % 90) + 5
                      const y = ((n.similarity * 50 + i * 13) % 80) + 10
                      return (
                        <div
                          key={n.id}
                          className={cn(
                            'absolute h-3 w-3 rounded-full border-2 border-white shadow-sm transition-transform hover:scale-150 cursor-pointer',
                            i === 0 ? 'bg-primary' : 'bg-muted-foreground/60'
                          )}
                          style={{ left: `${x}%`, top: `${y}%` }}
                          title={`${n.name} (${(n.similarity * 100).toFixed(0)}%)`}
                        />
                      )
                    })}
                    <p className="absolute bottom-2 left-2 text-xs text-muted-foreground">
                      t-SNE 2D projection (visual placeholder)
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Beaker className="h-5 w-5" /> Neighbor Table
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left font-medium text-muted-foreground p-3 pl-6">Name</th>
                        <th className="text-left font-medium text-muted-foreground p-3">SMILES</th>
                        <th className="text-right font-medium text-muted-foreground p-3 pr-6">Similarity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {neighbors.map((n, i) => (
                        <tr
                          key={n.id}
                          className={cn(
                            'border-b last:border-0 cursor-pointer hover:bg-muted/50',
                            i === 0 && 'bg-primary/5'
                          )}
                          onClick={() => setSelectedMolecule({ ...MOCK_DETAIL, name: n.name })}
                        >
                          <td className="p-3 pl-6 font-medium">{n.name}</td>
                          <td className="p-3 font-mono text-xs text-muted-foreground max-w-[200px] truncate">
                            {n.smiles}
                          </td>
                          <td className="p-3 pr-6 text-right">
                            <Badge variant={n.similarity > 0.9 ? 'success' : n.similarity > 0.75 ? 'default' : 'secondary'}>
                              {(n.similarity * 100).toFixed(0)}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          {selectedMolecule ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Atom className="h-5 w-5" /> {selectedMolecule.name}
                </CardTitle>
                <CardDescription className="font-mono text-xs break-all">
                  {selectedMolecule.smiles}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Weight className="h-3 w-3" /> MW
                    </div>
                    <p className="font-medium">{selectedMolecule.molecularWeight} g/mol</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Droplets className="h-3 w-3" /> logP
                    </div>
                    <p className="font-medium">{selectedMolecule.logP}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Thermometer className="h-3 w-3" /> Boiling Pt
                    </div>
                    <p className="font-medium">{selectedMolecule.boilingPoint} °C</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Hash className="h-3 w-3" /> Vapor Pressure
                    </div>
                    <p className="font-medium">{selectedMolecule.vaporPressure} mmHg</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Odor Type</p>
                  <Badge variant="secondary">{selectedMolecule.odorType}</Badge>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 pt-10 pb-10">
                <CircleDot className="h-12 w-12 text-muted-foreground/30" />
                <p className="text-sm font-medium">Select a molecule</p>
                <p className="text-xs text-muted-foreground text-center">
                  Click on a neighbor or search to see molecular details.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
