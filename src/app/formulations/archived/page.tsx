'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import {
  Archive,
  RotateCcw,
  AlertCircle,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

interface ArchivedFormula {
  id: number
  name: string
  version: number
  original_status: string
  archived_date: string
  archived_by: string | null
  total_cost_per_kg: number | null
  accord: string | null
}

const MOCK_ARCHIVED: ArchivedFormula[] = [
  { id: 101, name: 'Spring Meadow', version: 1, original_status: 'rejected', archived_date: '2026-05-10T09:00:00Z', archived_by: 'Admin', total_cost_per_kg: 32.0, accord: 'Floral' },
  { id: 102, name: 'Night Musk', version: 2, original_status: 'approved', archived_date: '2026-04-22T14:30:00Z', archived_by: 'System', total_cost_per_kg: 95.0, accord: 'Oriental' },
  { id: 103, name: 'Ocean Breeze', version: 1, original_status: 'draft', archived_date: '2026-03-15T11:00:00Z', archived_by: 'Bob Smith', total_cost_per_kg: 48.0, accord: 'Aquatic' },
  { id: 104, name: 'Vanilla Dream', version: 3, original_status: 'rejected', archived_date: '2026-02-28T16:45:00Z', archived_by: 'Admin', total_cost_per_kg: 72.0, accord: 'Gourmand' },
  { id: 105, name: 'Pine Forest', version: 1, original_status: 'approved', archived_date: '2026-01-10T08:30:00Z', archived_by: 'System', total_cost_per_kg: 55.0, accord: 'Woody' },
]

const ITEMS_PER_PAGE = 5

export default function ArchivedFormulasPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [restoreTarget, setRestoreTarget] = useState<ArchivedFormula | null>(null)
  const [restoringId, setRestoringId] = useState<number | null>(null)

  const filtered = useMemo(() => {
    if (!search) return MOCK_ARCHIVED
    const q = search.toLowerCase()
    return MOCK_ARCHIVED.filter((f) =>
      f.name.toLowerCase().includes(q) ||
      f.accord?.toLowerCase().includes(q) ||
      f.original_status.toLowerCase().includes(q)
    )
  }, [search])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const handleRestore = async (formula: ArchivedFormula) => {
    setRestoringId(formula.id)
    await new Promise((r) => setTimeout(r, 800))
    setRestoringId(null)
    setRestoreTarget(null)
  }

  const getOriginalStatusBadge = (status: string) => {
    const variants: Record<string, 'secondary' | 'warning' | 'success' | 'destructive'> = {
      draft: 'secondary',
      review: 'warning',
      approved: 'success',
      rejected: 'destructive',
    }
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>
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
            <h1 className="text-2xl font-bold">Archived Formulas</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
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
            <CardTitle className="mb-2">Failed to load archived formulas</CardTitle>
            <CardDescription className="mb-6">{error}</CardDescription>
            <Button onClick={() => { setError(null); setLoading(false) }}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isAdmin = true

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Archived Formulas</h1>
          <p className="text-sm text-muted-foreground mt-1">Read-only view of historically archived formulations.</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search archived formulas..."
                className="pl-10"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              />
            </div>
          </CardContent>
        </Card>

        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Archive className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No archived formulas</h3>
              <p className="text-muted-foreground">
                Formulas that are archived will appear here for historical reference.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Original Status</TableHead>
                    <TableHead>Archived Date</TableHead>
                    <TableHead>Archived By</TableHead>
                    <TableHead>Accord</TableHead>
                    <TableHead>Cost/kg</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((formula) => (
                    <TableRow key={formula.id}>
                      <TableCell className="font-medium">{formula.name}</TableCell>
                      <TableCell>v{formula.version}</TableCell>
                      <TableCell>{getOriginalStatusBadge(formula.original_status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(formula.archived_date)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formula.archived_by || '—'}
                      </TableCell>
                      <TableCell>{formula.accord || '—'}</TableCell>
                      <TableCell>
                        {formula.total_cost_per_kg !== null
                          ? `$${formula.total_cost_per_kg.toFixed(2)}`
                          : '—'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">View</Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!isAdmin || restoringId === formula.id}
                            onClick={() => setRestoreTarget(formula)}
                          >
                            {restoringId === formula.id ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <RotateCcw className="h-4 w-4 mr-1" />
                            )}
                            Restore
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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

        {restoreTarget && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Restore Formula</CardTitle>
                <CardDescription>
                  Are you sure you want to restore <strong>{restoreTarget.name}</strong> (v{restoreTarget.version})?
                  It will be moved back to the active formula library.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setRestoreTarget(null)}>Cancel</Button>
                <Button onClick={() => handleRestore(restoreTarget)} disabled={restoringId === restoreTarget.id}>
                  {restoringId === restoreTarget.id ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Restoring...</>
                  ) : (
                    <><RotateCcw className="h-4 w-4 mr-2" /> Confirm Restore</>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
