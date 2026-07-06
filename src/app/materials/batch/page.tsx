'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Search,
  Scan,
  AlertCircle,
  Package,
  Eye,
} from 'lucide-react'

interface BatchRecord {
  id: number
  batchNumber: string
  material: string
  supplier: string
  qty: number
  receivedDate: string
  qualityStatus: 'passed' | 'failed' | 'pending'
  expiry: string
}

const MOCK_BATCHES: BatchRecord[] = [
  { id: 1, batchNumber: 'BATCH-2026-001', material: 'Benzyl Acetate', supplier: 'Givaudan', qty: 100, receivedDate: '2026-06-01', qualityStatus: 'passed', expiry: '2027-06-01' },
  { id: 2, batchNumber: 'BATCH-2026-002', material: 'Linalool', supplier: 'Firmenich', qty: 250, receivedDate: '2026-06-03', qualityStatus: 'passed', expiry: '2027-06-03' },
  { id: 3, batchNumber: 'BATCH-2026-003', material: 'Vanillin', supplier: 'Symrise', qty: 50, receivedDate: '2026-05-20', qualityStatus: 'failed', expiry: '2026-11-20' },
  { id: 4, batchNumber: 'BATCH-2026-004', material: 'Coumarin', supplier: 'IFF', qty: 80, receivedDate: '2026-06-05', qualityStatus: 'passed', expiry: '2027-06-05' },
  { id: 5, batchNumber: 'BATCH-2026-005', material: 'Methyl Ionone', supplier: 'Givaudan', qty: 120, receivedDate: '2026-06-08', qualityStatus: 'passed', expiry: '2027-06-08' },
  { id: 6, batchNumber: 'BATCH-2026-006', material: 'Ethyl Vanillin', supplier: 'Symrise', qty: 25, receivedDate: '2026-04-15', qualityStatus: 'pending', expiry: '2026-10-15' },
  { id: 7, batchNumber: 'BATCH-2026-007', material: 'Geraniol', supplier: 'Takasago', qty: 90, receivedDate: '2026-06-10', qualityStatus: 'passed', expiry: '2027-06-10' },
  { id: 8, batchNumber: 'BATCH-2026-008', material: 'Limonene', supplier: 'Firmenich', qty: 500, receivedDate: '2026-05-28', qualityStatus: 'passed', expiry: '2027-05-28' },
  { id: 9, batchNumber: 'BATCH-2026-009', material: 'Hedione', supplier: 'Firmenich', qty: 60, receivedDate: '2026-06-12', qualityStatus: 'pending', expiry: '2027-06-12' },
  { id: 10, batchNumber: 'BATCH-2026-010', material: 'Iso E Super', supplier: 'Givaudan', qty: 150, receivedDate: '2026-06-14', qualityStatus: 'passed', expiry: '2027-06-14' },
  { id: 11, batchNumber: 'BATCH-2026-011', material: 'Galaxolide', supplier: 'Symrise', qty: 40, receivedDate: '2026-05-30', qualityStatus: 'failed', expiry: '2026-11-30' },
  { id: 12, batchNumber: 'BATCH-2026-012', material: 'Benzyl Acetate', supplier: 'Givaudan', qty: 75, receivedDate: '2026-06-15', qualityStatus: 'passed', expiry: '2027-06-15' },
]

const QUALITY_BADGE: Record<string, 'success' | 'destructive' | 'warning'> = {
  passed: 'success',
  failed: 'destructive',
  pending: 'warning',
}

export default function BatchPage() {
  const [batches, setBatches] = useState<BatchRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setBatches(MOCK_BATCHES)
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const filtered = batches.filter(b =>
    b.batchNumber.toLowerCase().includes(search.toLowerCase()) ||
    b.material.toLowerCase().includes(search.toLowerCase()) ||
    b.supplier.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">Batch Tracking</h1>
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
            <h1 className="text-2xl font-bold">Batch Tracking</h1>
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
          <h1 className="text-2xl font-bold">Batch Tracking</h1>
          <p className="text-sm text-muted-foreground">Lot-level traceability for all materials</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by batch#, material, or supplier..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Scan className="h-4 w-4 mr-2" />
            Scan QR
          </Button>
        </div>

        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {search ? 'No batches match your search' : 'No batch records found'}
              </p>
              {search && (
                <Button variant="outline" className="mt-4" onClick={() => setSearch('')}>
                  Clear Search
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
                    <TableHead>Batch#</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Qty (kg)</TableHead>
                    <TableHead>Received Date</TableHead>
                    <TableHead>Quality Status</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(b => (
                    <TableRow key={b.id}>
                      <TableCell className="font-mono text-xs font-medium">{b.batchNumber}</TableCell>
                      <TableCell className="font-medium">{b.material}</TableCell>
                      <TableCell>{b.supplier}</TableCell>
                      <TableCell>{b.qty}</TableCell>
                      <TableCell className="text-xs">{b.receivedDate}</TableCell>
                      <TableCell>
                        <Badge variant={QUALITY_BADGE[b.qualityStatus]}>
                          {b.qualityStatus.charAt(0).toUpperCase() + b.qualityStatus.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{b.expiry}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
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
