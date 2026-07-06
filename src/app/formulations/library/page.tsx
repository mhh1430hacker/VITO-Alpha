'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Download,
  Copy,
  AlertCircle,
  Loader2,
} from 'lucide-react'

type ViewMode = 'table' | 'grid'
type SortField = 'name' | 'version' | 'status' | 'quality_score' | 'total_cost_per_kg' | 'ifra_compliant' | 'created_at'
type SortDir = 'asc' | 'desc'

interface LibraryFormula {
  id: number
  name: string
  version: number
  status: 'draft' | 'review' | 'approved' | 'rejected' | 'archived'
  quality_score: number | null
  total_cost_per_kg: number | null
  ifra_compliant: boolean
  accord: string | null
  project: string | null
  created_at: string
  created_by: string | null
}

const MOCK_FORMULAS: LibraryFormula[] = [
  { id: 1, name: 'Summer Breeze', version: 2, status: 'approved', quality_score: 88.5, total_cost_per_kg: 45.2, ifra_compliant: true, accord: 'Fresh', project: 'Luxury Fresh', created_at: '2026-06-15T10:30:00Z', created_by: 'Alice Chen' },
  { id: 2, name: 'Oriental Night', version: 1, status: 'draft', quality_score: null, total_cost_per_kg: 62.0, ifra_compliant: false, accord: 'Oriental', project: 'Oriental Night', created_at: '2026-06-20T14:00:00Z', created_by: 'Bob Smith' },
  { id: 3, name: 'Woody Essentials', version: 3, status: 'review', quality_score: 76.3, total_cost_per_kg: 38.5, ifra_compliant: true, accord: 'Woody', project: 'Woody Essentials', created_at: '2026-06-18T09:15:00Z', created_by: 'Carol Davis' },
  { id: 4, name: 'Citrus Splash', version: 1, status: 'rejected', quality_score: 45.0, total_cost_per_kg: 22.0, ifra_compliant: true, accord: 'Citrus', project: 'Luxury Fresh', created_at: '2026-06-10T16:45:00Z', created_by: 'David Lee' },
  { id: 5, name: 'Gourmand Delight', version: 2, status: 'approved', quality_score: 91.2, total_cost_per_kg: 78.0, ifra_compliant: false, accord: 'Gourmand', project: null, created_at: '2026-05-28T11:00:00Z', created_by: 'Alice Chen' },
  { id: 6, name: 'Aquatic Mist', version: 1, status: 'draft', quality_score: null, total_cost_per_kg: 55.0, ifra_compliant: true, accord: 'Aquatic', project: 'Fresh Waters', created_at: '2026-06-22T08:30:00Z', created_by: 'Eve Wang' },
]

const ITEMS_PER_PAGE = 5

export default function FormulaLibraryPage() {
  const [search, setSearch] = useState('')
  const [filterAccord, setFilterAccord] = useState('')
  const [filterIfra, setFilterIfra] = useState('')
  const [filterProject, setFilterProject] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  const filtered = useMemo(() => {
    let result = [...MOCK_FORMULAS]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter((f) => f.name.toLowerCase().includes(q))
    }
    if (filterAccord && filterAccord !== 'all') result = result.filter((f) => f.accord === filterAccord)
    if (filterIfra) result = result.filter((f) => (filterIfra === 'yes' ? f.ifra_compliant : !f.ifra_compliant))
    if (filterProject && filterProject !== 'all') result = result.filter((f) => f.project === filterProject)
    if (filterStatus && filterStatus !== 'all') result = result.filter((f) => f.status === filterStatus)

    result.sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]
      if (aVal === null) return 1
      if (bVal === null) return -1
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [search, filterAccord, filterIfra, filterProject, filterStatus, sortField, sortDir])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
    setPage(1)
  }

  const handleSelectAll = () => {
    if (selectedIds.size === paginated.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(paginated.map((f) => f.id)))
    }
  }

  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const getStatusBadge = (status: LibraryFormula['status']) => {
    const variants: Record<string, 'secondary' | 'warning' | 'success' | 'destructive' | 'default'> = {
      draft: 'secondary',
      review: 'warning',
      approved: 'success',
      rejected: 'destructive',
      archived: 'default',
    }
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  const sortIndicator = (field: SortField) => {
    if (sortField !== field) return null
    return (
      <ArrowUpDown className={cn('h-3 w-3 ml-1 inline', sortDir === 'desc' && 'rotate-180')} />
    )
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">Formula Library</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
          ))}
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <CardTitle className="mb-2">Failed to load formulas</CardTitle>
            <CardDescription className="mb-6">{error}</CardDescription>
            <Button onClick={() => { setError(null); setLoading(false) }}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Formula Library</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Card className="mb-6">
          <CardContent className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search formulas by name..."
                className="pl-10"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={filterAccord} onValueChange={(v) => { setFilterAccord(v); setPage(1) }}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Accord" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accords</SelectItem>
                  <SelectItem value="Fresh">Fresh</SelectItem>
                  <SelectItem value="Oriental">Oriental</SelectItem>
                  <SelectItem value="Woody">Woody</SelectItem>
                  <SelectItem value="Floral">Floral</SelectItem>
                  <SelectItem value="Citrus">Citrus</SelectItem>
                  <SelectItem value="Gourmand">Gourmand</SelectItem>
                  <SelectItem value="Aquatic">Aquatic</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterIfra} onValueChange={(v) => { setFilterIfra(v); setPage(1) }}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="IFRA Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All IFRA</SelectItem>
                  <SelectItem value="yes">Compliant</SelectItem>
                  <SelectItem value="no">Non-Compliant</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterProject} onValueChange={(v) => { setFilterProject(v); setPage(1) }}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  <SelectItem value="Luxury Fresh">Luxury Fresh</SelectItem>
                  <SelectItem value="Oriental Night">Oriental Night</SelectItem>
                  <SelectItem value="Woody Essentials">Woody Essentials</SelectItem>
                  <SelectItem value="Fresh Waters">Fresh Waters</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(1) }}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {selectedIds.size > 0 && (
              <>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export ({selectedIds.size})
                </Button>
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Compare
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{filtered.length} formulas</span>
            <Button
              variant={viewMode === 'table' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <FlaskConical className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No formulas yet</h3>
              <p className="text-muted-foreground mb-6">Create your first formula using the formulation wizard.</p>
              <Button>Create Formula</Button>
            </CardContent>
          </Card>
        ) : viewMode === 'table' ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={selectedIds.size === paginated.length && paginated.length > 0}
                        onChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                      Name {sortIndicator('name')}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('version')}>
                      Version {sortIndicator('version')}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                      Status {sortIndicator('status')}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('quality_score')}>
                      Quality {sortIndicator('quality_score')}
                    </TableHead>
<TableHead className="cursor-pointer" onClick={() => handleSort('total_cost_per_kg')}> 
                      Cost/kg {sortIndicator('total_cost_per_kg')}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('ifra_compliant')}>
                      IFRA {sortIndicator('ifra_compliant')}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('created_at')}>
                      Created {sortIndicator('created_at')}
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((formula) => (
                    <TableRow key={formula.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          className="h-4 w-4"
                          checked={selectedIds.has(formula.id)}
                          onChange={() => handleSelectOne(formula.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{formula.name}</TableCell>
                      <TableCell>v{formula.version}</TableCell>
                      <TableCell>{getStatusBadge(formula.status)}</TableCell>
                      <TableCell>
                        {formula.quality_score !== null ? (
                          <span className={cn(
                            'font-semibold',
                            formula.quality_score >= 80 ? 'text-green-600' : formula.quality_score >= 60 ? 'text-amber-600' : 'text-destructive'
                          )}>
                            {formula.quality_score.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {formula.total_cost_per_kg !== null
                          ? `$${formula.total_cost_per_kg.toFixed(2)}`
                          : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell>
                        <Badge variant={formula.ifra_compliant ? 'success' : 'destructive'}>
                          {formula.ifra_compliant ? 'Pass' : 'Fail'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(formula.created_at)}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map((formula) => (
              <Card key={formula.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{formula.name}</CardTitle>
                    {getStatusBadge(formula.status)}
                  </div>
                  <CardDescription>v{formula.version}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quality</span>
                    <span className="font-medium">
                      {formula.quality_score !== null ? formula.quality_score.toFixed(1) : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost/kg</span>
                    <span className="font-medium">
                      {formula.total_cost_per_kg !== null ? `$${formula.total_cost_per_kg.toFixed(2)}` : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IFRA</span>
                    <Badge variant={formula.ifra_compliant ? 'success' : 'destructive'}>
                      {formula.ifra_compliant ? 'Pass' : 'Fail'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span>{formatDate(formula.created_at)}</span>
                  </div>
                  <Button className="w-full mt-2" variant="outline" size="sm">View Details</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
