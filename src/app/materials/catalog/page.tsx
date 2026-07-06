'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
import { cn } from '@/lib/utils'
import {
  Package,
  Search,
  Upload,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  FileUp,
} from 'lucide-react'

interface CatalogMaterial {
  id: number
  name: string
  cas: string
  supplier: string
  costPerKg: number
  ifraStatus: 'compliant' | 'restricted' | 'banned'
  stockLevel: number
  lastUpdated: string
  category: string
}

const MOCK_MATERIALS: CatalogMaterial[] = [
  { id: 1, name: 'Benzyl Acetate', cas: '140-11-4', supplier: 'Givaudan', costPerKg: 12.50, ifraStatus: 'restricted', stockLevel: 450, lastUpdated: '2026-06-15', category: 'Ester' },
  { id: 2, name: 'Linalool', cas: '78-70-6', supplier: 'Firmenich', costPerKg: 8.20, ifraStatus: 'compliant', stockLevel: 1200, lastUpdated: '2026-06-14', category: 'Terpene' },
  { id: 3, name: 'Vanillin', cas: '121-33-5', supplier: 'Symrise', costPerKg: 15.00, ifraStatus: 'compliant', stockLevel: 890, lastUpdated: '2026-06-13', category: 'Aromatic' },
  { id: 4, name: 'Coumarin', cas: '91-64-5', supplier: 'IFF', costPerKg: 22.00, ifraStatus: 'restricted', stockLevel: 320, lastUpdated: '2026-06-12', category: 'Lactone' },
  { id: 5, name: 'Methyl Ionone', cas: '1335-46-2', supplier: 'Givaudan', costPerKg: 18.75, ifraStatus: 'compliant', stockLevel: 560, lastUpdated: '2026-06-15', category: 'Ketone' },
  { id: 6, name: 'Limonene', cas: '5989-27-5', supplier: 'Firmenich', costPerKg: 5.50, ifraStatus: 'restricted', stockLevel: 2000, lastUpdated: '2026-06-10', category: 'Terpene' },
  { id: 7, name: 'Ethyl Vanillin', cas: '121-32-4', supplier: 'Symrise', costPerKg: 45.00, ifraStatus: 'compliant', stockLevel: 180, lastUpdated: '2026-06-14', category: 'Aromatic' },
  { id: 8, name: 'Geraniol', cas: '106-24-1', supplier: 'Takasago', costPerKg: 11.30, ifraStatus: 'restricted', stockLevel: 670, lastUpdated: '2026-06-11', category: 'Terpene' },
  { id: 9, name: 'Musk Ketone', cas: '81-14-1', supplier: 'IFF', costPerKg: 55.00, ifraStatus: 'banned', stockLevel: 0, lastUpdated: '2026-05-01', category: 'Musk' },
  { id: 10, name: 'Hedione', cas: '24851-98-7', supplier: 'Firmenich', costPerKg: 32.00, ifraStatus: 'compliant', stockLevel: 410, lastUpdated: '2026-06-15', category: 'Ester' },
  { id: 11, name: 'Iso E Super', cas: '54464-57-2', supplier: 'Givaudan', costPerKg: 28.50, ifraStatus: 'compliant', stockLevel: 750, lastUpdated: '2026-06-14', category: 'Terpene' },
  { id: 12, name: 'Galaxolide', cas: '1222-05-5', supplier: 'Symrise', costPerKg: 38.00, ifraStatus: 'restricted', stockLevel: 290, lastUpdated: '2026-06-13', category: 'Musk' },
]

const STATUS_COLORS: Record<string, 'success' | 'warning' | 'destructive'> = {
  compliant: 'success',
  restricted: 'warning',
  banned: 'destructive',
}

export default function MaterialCatalogPage() {
  const [materials, setMaterials] = useState<CatalogMaterial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterCas, setFilterCas] = useState('')
  const [filterSupplier, setFilterSupplier] = useState('')
  const [filterIfra, setFilterIfra] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [expandedRow, setExpandedRow] = useState<number | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMaterials(MOCK_MATERIALS)
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const suppliers = [...new Set(MOCK_MATERIALS.map(m => m.supplier))]
  const categories = [...new Set(MOCK_MATERIALS.map(m => m.category))]

  const filtered = materials.filter(m => {
    const q = search.toLowerCase()
    if (q && !m.name.toLowerCase().includes(q) && !m.cas.toLowerCase().includes(q)) return false
    if (filterCas && m.cas !== filterCas) return false
    if (filterSupplier && m.supplier !== filterSupplier) return false
    if (filterIfra && m.ifraStatus !== filterIfra) return false
    if (filterCategory && m.category !== filterCategory) return false
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">Material Catalog</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">Material Catalog</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Material Catalog</h1>
          <p className="text-sm text-muted-foreground">Full fragrance material database</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name or CAS#..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={filterCas} onValueChange={v => setFilterCas(v)}>
              <SelectTrigger className="w-36"><SelectValue placeholder="CAS#" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All CAS#</SelectItem>
                {MOCK_MATERIALS.map(m => (
                  <SelectItem key={m.cas} value={m.cas}>{m.cas}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterSupplier} onValueChange={v => setFilterSupplier(v)}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Supplier" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Suppliers</SelectItem>
                {suppliers.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterIfra} onValueChange={v => setFilterIfra(v)}>
              <SelectTrigger className="w-36"><SelectValue placeholder="IFRA Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="compliant">Compliant</SelectItem>
                <SelectItem value="restricted">Restricted</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={v => setFilterCategory(v)}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline">
            <FileUp className="h-4 w-4 mr-2" />
            Import CSV
            <input type="file" accept=".csv" className="hidden" />
          </Button>
        </div>

        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                {search || filterCas || filterSupplier || filterIfra || filterCategory
                  ? 'No materials match your filters'
                  : 'No materials found'}
              </p>
              {(search || filterCas || filterSupplier || filterIfra || filterCategory) && (
                <Button variant="outline" onClick={() => { setSearch(''); setFilterCas(''); setFilterSupplier(''); setFilterIfra(''); setFilterCategory('') }}>
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8" />
                    <TableHead>Name</TableHead>
                    <TableHead>CAS#</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Cost/kg</TableHead>
                    <TableHead>IFRA Status</TableHead>
                    <TableHead>Stock Level</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(m => (
                    <>
                      <TableRow
                        key={m.id}
                        className="cursor-pointer"
                        onClick={() => setExpandedRow(expandedRow === m.id ? null : m.id)}
                      >
                        <TableCell>
                          {expandedRow === m.id
                            ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                        </TableCell>
                        <TableCell className="font-medium">{m.name}</TableCell>
                        <TableCell className="font-mono text-xs">{m.cas}</TableCell>
                        <TableCell>{m.supplier}</TableCell>
                        <TableCell>${m.costPerKg.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={STATUS_COLORS[m.ifraStatus]}>
                            {m.ifraStatus.charAt(0).toUpperCase() + m.ifraStatus.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={cn(
                            m.stockLevel === 0 && 'text-red-600 font-semibold',
                            m.stockLevel > 0 && m.stockLevel < 300 && 'text-yellow-600 font-semibold',
                          )}>
                            {m.stockLevel} kg
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{m.lastUpdated}</TableCell>
                      </TableRow>
                      {expandedRow === m.id && (
                        <TableRow key={`${m.id}-detail`}>
                          <TableCell colSpan={8} className="bg-gray-50 dark:bg-gray-950 p-4">
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Category:</span> {m.category}
                              </div>
                              <div>
                                <span className="font-medium">CAS#:</span> {m.cas}
                              </div>
                              <div>
                                <span className="font-medium">Supplier:</span> {m.supplier}
                              </div>
                              <div>
                                <span className="font-medium">Cost/kg:</span> ${m.costPerKg.toFixed(2)}
                              </div>
                              <div>
                                <span className="font-medium">Stock:</span> {m.stockLevel} kg
                              </div>
                              <div>
                                <span className="font-medium">Last Updated:</span> {m.lastUpdated}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
