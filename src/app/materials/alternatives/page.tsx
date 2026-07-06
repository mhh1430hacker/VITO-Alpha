'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  GitBranch,
  Search,
  AlertCircle,
  FlaskConical,
} from 'lucide-react'

interface Alternative {
  id: number
  name: string
  cas: string
  costPerKg: number
  ifraStatus: 'compliant' | 'restricted' | 'banned'
  similarityScore: number
  properties: string[]
  notes: string
}

interface MaterialOption {
  name: string
  cas: string
  alternatives: Alternative[]
}

const MOCK_ALTERNATIVES: Record<string, MaterialOption> = {
  'Benzyl Acetate': {
    name: 'Benzyl Acetate',
    cas: '140-11-4',
    alternatives: [
      { id: 1, name: 'Phenyl Ethyl Acetate', cas: '103-45-7', costPerKg: 14.20, ifraStatus: 'compliant', similarityScore: 0.92, properties: ['Sweet', 'Rose-like', 'Fruity'], notes: 'Excellent direct substitute, slightly sweeter profile' },
      { id: 2, name: 'Benzyl Propionate', cas: '122-63-4', costPerKg: 13.00, ifraStatus: 'compliant', similarityScore: 0.85, properties: ['Sweet', 'Fruity', 'Balsamic'], notes: 'Good alternative, similar olfactory profile' },
      { id: 3, name: 'Benzyl Alcohol', cas: '100-51-6', costPerKg: 7.50, ifraStatus: 'compliant', similarityScore: 0.65, properties: ['Faint', 'Aromatic', 'Sweet'], notes: 'Lower intensity, acceptable in some bases' },
    ],
  },
  'Coumarin': {
    name: 'Coumarin',
    cas: '91-64-5',
    alternatives: [
      { id: 4, name: 'Dihydrocoumarin', cas: '119-84-6', costPerKg: 25.00, ifraStatus: 'compliant', similarityScore: 0.95, properties: ['Sweet', 'Hay-like', 'Warm'], notes: 'Nearly identical, IFRA compliant substitute' },
      { id: 5, name: '6-Methyl Coumarin', cas: '92-48-8', costPerKg: 28.50, ifraStatus: 'restricted', similarityScore: 0.88, properties: ['Sweet', 'Herbal', 'Warm'], notes: 'Still restricted but less restrictive than Coumarin' },
      { id: 6, name: 'Tonka Bean Absolute', cas: '8046-22-8', costPerKg: 85.00, ifraStatus: 'compliant', similarityScore: 0.78, properties: ['Sweet', 'Vanillic', 'Spicy'], notes: 'Natural alternative, much higher cost' },
    ],
  },
  'Limonene': {
    name: 'Limonene',
    cas: '5989-27-5',
    alternatives: [
      { id: 7, name: 'Orange Terpenes', cas: '8028-48-6', costPerKg: 4.20, ifraStatus: 'compliant', similarityScore: 0.90, properties: ['Citrus', 'Fresh', 'Zesty'], notes: 'Cost-effective natural alternative' },
      { id: 8, name: 'Valencene', cas: '4630-07-3', costPerKg: 35.00, ifraStatus: 'compliant', similarityScore: 0.80, properties: ['Citrus', 'Sweet', 'Orange-like'], notes: 'Higher cost but excellent citrus profile' },
      { id: 9, name: 'Alpha-Pinene', cas: '80-56-8', costPerKg: 6.00, ifraStatus: 'compliant', similarityScore: 0.60, properties: ['Pine', 'Fresh', 'Terpenic'], notes: 'Different profile, works in fresh accords' },
    ],
  },
  'Musk Ketone': {
    name: 'Musk Ketone',
    cas: '81-14-1',
    alternatives: [
      { id: 10, name: 'Ethylene Brassylate', cas: '105-95-3', costPerKg: 32.00, ifraStatus: 'compliant', similarityScore: 0.85, properties: ['Musky', 'Sweet', 'Soft'], notes: 'IFRA compliant macrocyclic musk' },
      { id: 11, name: 'Galaxolide 50%', cas: '1222-05-5', costPerKg: 19.00, ifraStatus: 'restricted', similarityScore: 0.82, properties: ['Clean', 'Musky', 'Slightly Sweet'], notes: 'Industry standard alternative, some restrictions' },
      { id: 12, name: 'Ambrettolide', cas: '28645-51-4', costPerKg: 55.00, ifraStatus: 'compliant', similarityScore: 0.80, properties: ['Musky', 'Fruity', 'Warm'], notes: 'Premium natural musk alternative' },
    ],
  },
}

const ALL_MATERIAL_NAMES = Object.keys(MOCK_ALTERNATIVES)

export default function AlternativesPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [data, setData] = useState<MaterialOption | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const suggestions = ALL_MATERIAL_NAMES.filter(n =>
    n.toLowerCase().includes(search.toLowerCase()) && n !== selected
  )

  const handleSearch = (value: string) => {
    setSearch(value)
    setError(null)
  }

  const handleSelect = (name: string) => {
    setSelected(name)
    setSearch('')
    setLoading(true)
    setError(null)

    setTimeout(() => {
      const match = MOCK_ALTERNATIVES[name]
      if (match) {
        setData(match)
      } else {
        setError('No alternatives data available for this material')
        setData(null)
      }
      setLoading(false)
    }, 600)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Material Alternatives</h1>
          <p className="text-sm text-muted-foreground">Find IFRA-compliant substitutions</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Search for a Material</CardTitle>
            <CardDescription>Enter a fragrance material name to see its alternatives ranked by similarity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="e.g. Benzyl Acetate, Coumarin, Limonene..."
                value={search}
                onChange={e => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            {suggestions.length > 0 && search && (
              <div className="mt-2 border rounded-md bg-white dark:bg-gray-900 shadow-sm">
                {suggestions.map(s => (
                  <button
                    key={s}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:bg-gray-950 transition-colors"
                    onClick={() => handleSelect(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {loading && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {data && !loading && (
          <>
            <Card className="mb-6 border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FlaskConical className="h-5 w-5" />
                  {data.name}
                  <span className="text-sm font-normal text-muted-foreground">({data.cas})</span>
                </CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Alternative Substitutions</CardTitle>
                <CardDescription>Ranked by similarity score — higher is closer</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Alternative</TableHead>
                      <TableHead>CAS#</TableHead>
                      <TableHead>Cost/kg</TableHead>
                      <TableHead>IFRA Status</TableHead>
                      <TableHead>Similarity</TableHead>
                      <TableHead>Properties</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.alternatives
                      .sort((a, b) => b.similarityScore - a.similarityScore)
                      .map(a => (
                        <TableRow key={a.id}>
                          <TableCell className="font-medium">{a.name}</TableCell>
                          <TableCell className="font-mono text-xs">{a.cas}</TableCell>
                          <TableCell className="font-mono">${a.costPerKg.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                a.ifraStatus === 'compliant' ? 'success' :
                                a.ifraStatus === 'restricted' ? 'warning' : 'destructive'
                              }
                            >
                              {a.ifraStatus.charAt(0).toUpperCase() + a.ifraStatus.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full bg-blue-600"
                                  style={{ width: `${a.similarityScore * 100}%` }}
                                />
                              </div>
                              <span className="text-xs font-mono">{(a.similarityScore * 100).toFixed(0)}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {a.properties.map(p => (
                                <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-[200px]">
                            {a.notes}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}

        {!data && !loading && !error && !selected && (
          <Card>
            <CardContent className="py-12 text-center">
              <GitBranch className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Search for a material above to see its IFRA-compliant alternatives</p>
            </CardContent>
          </Card>
        )}

        {selected && data && data.alternatives.length === 0 && !loading && (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No alternatives found for {selected}</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
