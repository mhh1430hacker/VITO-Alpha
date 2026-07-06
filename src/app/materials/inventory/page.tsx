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
import { cn } from '@/lib/utils'
import {
  Package,
  Search,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react'

interface InventoryItem {
  id: number
  materialName: string
  quantity: number
  reorderLevel: number
  location: string
  status: 'green' | 'yellow' | 'red'
  lastRestocked: string
}

const MOCK_INVENTORY: InventoryItem[] = [
  { id: 1, materialName: 'Benzyl Acetate', quantity: 450, reorderLevel: 200, location: 'A-12', status: 'green', lastRestocked: '2026-06-10' },
  { id: 2, materialName: 'Linalool', quantity: 1200, reorderLevel: 300, location: 'B-04', status: 'green', lastRestocked: '2026-06-08' },
  { id: 3, materialName: 'Vanillin', quantity: 80, reorderLevel: 150, location: 'A-07', status: 'red', lastRestocked: '2026-05-20' },
  { id: 4, materialName: 'Coumarin', quantity: 320, reorderLevel: 100, location: 'C-09', status: 'green', lastRestocked: '2026-06-12' },
  { id: 5, materialName: 'Methyl Ionone', quantity: 560, reorderLevel: 250, location: 'B-11', status: 'green', lastRestocked: '2026-06-05' },
  { id: 6, materialName: 'Limonene', quantity: 2000, reorderLevel: 500, location: 'D-01', status: 'green', lastRestocked: '2026-06-01' },
  { id: 7, materialName: 'Ethyl Vanillin', quantity: 45, reorderLevel: 80, location: 'A-08', status: 'red', lastRestocked: '2026-04-15' },
  { id: 8, materialName: 'Geraniol', quantity: 670, reorderLevel: 200, location: 'C-03', status: 'green', lastRestocked: '2026-06-11' },
  { id: 9, materialName: 'Musk Ketone', quantity: 0, reorderLevel: 50, location: 'D-06', status: 'red', lastRestocked: '2026-03-01' },
  { id: 10, materialName: 'Hedione', quantity: 180, reorderLevel: 150, location: 'B-02', status: 'yellow', lastRestocked: '2026-06-14' },
  { id: 11, materialName: 'Iso E Super', quantity: 750, reorderLevel: 300, location: 'A-15', status: 'green', lastRestocked: '2026-06-13' },
  { id: 12, materialName: 'Galaxolide', quantity: 140, reorderLevel: 200, location: 'C-07', status: 'red', lastRestocked: '2026-05-28' },
]

const STATUS_CONFIG = {
  green: { label: 'In Stock', dot: 'bg-green-500' },
  yellow: { label: 'Low Stock', dot: 'bg-yellow-500' },
  red: { label: 'Critical', dot: 'bg-red-500' },
} as const

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setItems(MOCK_INVENTORY)
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const filtered = items.filter(i =>
    i.materialName.toLowerCase().includes(search.toLowerCase())
  )

  const lowStockItems = items.filter(i => i.quantity <= i.reorderLevel)
  const criticalItems = items.filter(i => i.quantity === 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">Inventory</h1>
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
            <h1 className="text-2xl font-bold">Inventory</h1>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Inventory</h1>
              <p className="text-sm text-muted-foreground">Real-time stock levels</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              {criticalItems.length > 0 && (
                <div className="flex items-center gap-1 text-red-600 font-semibold">
                  <AlertCircle className="h-4 w-4" />
                  {criticalItems.length} out of stock
                </div>
              )}
              {lowStockItems.length > 0 && (
                <div className="flex items-center gap-1 text-yellow-600 font-semibold">
                  <AlertTriangle className="h-4 w-4" />
                  {lowStockItems.length} low stock alerts
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {lowStockItems.length > 0 && (
          <Card className="mb-6 border-yellow-300 bg-yellow-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="h-4 w-4" />
                Low Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {lowStockItems.map(i => (
                  <div key={i.id} className="flex items-center justify-between bg-white dark:bg-gray-900 rounded border px-3 py-2 text-sm">
                    <span className="font-medium">{i.materialName}</span>
                    <span className={cn(i.quantity === 0 ? 'text-red-600' : 'text-yellow-600')}>
                      {i.quantity} kg
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search materials..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No inventory items found</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material Name</TableHead>
                    <TableHead>Quantity (kg)</TableHead>
                    <TableHead>Reorder Level</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Restocked</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(i => (
                    <TableRow key={i.id}>
                      <TableCell className="font-medium">{i.materialName}</TableCell>
                      <TableCell>
                        <span className={cn(
                          i.quantity === 0 && 'text-red-600 font-bold',
                          i.quantity > 0 && i.quantity <= i.reorderLevel && 'text-yellow-600 font-semibold',
                        )}>
                          {i.quantity}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{i.reorderLevel}</TableCell>
                      <TableCell>{i.location}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={cn('h-2.5 w-2.5 rounded-full', STATUS_CONFIG[i.status].dot)} />
                          <Badge
                            variant={
                              i.status === 'green' ? 'success' :
                              i.status === 'yellow' ? 'warning' : 'destructive'
                            }
                            className="text-xs"
                          >
                            {STATUS_CONFIG[i.status].label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {i.lastRestocked}
                        </div>
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
