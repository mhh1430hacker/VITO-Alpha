'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { dashboardAPI } from '@/lib/api'
import { KPICards } from '@/types'
import { InventoryItem, BatchRecord, Supplier } from '@/types/enterprise'
import { cn } from '@/lib/utils'
import {
  Package, Truck, AlertTriangle, CheckCircle2, XCircle, Clock,
  AlertCircle, RefreshCw, Gauge, ClipboardList, ArrowUpDown
} from 'lucide-react'

interface SupplierPerformance {
  id: number
  name: string
  onTimeRate: number
  qualityRate: number
  avgLeadDays: number
}

const mockSuppliers: SupplierPerformance[] = [
  { id: 1, name: 'Givaudan SA', onTimeRate: 95, qualityRate: 98, avgLeadDays: 14 },
  { id: 2, name: 'Symrise AG', onTimeRate: 88, qualityRate: 92, avgLeadDays: 18 },
  { id: 3, name: 'IFF Inc', onTimeRate: 92, qualityRate: 95, avgLeadDays: 12 },
  { id: 4, name: 'Firmenich', onTimeRate: 78, qualityRate: 85, avgLeadDays: 21 },
]

const mockBatches: BatchRecord[] = [
  { id: 1, batch_number: 'B-2026-001', material_id: 1, material_name: 'Bergamot Oil', quantity_kg: 500, received_date: '2026-06-25', quality_status: 'passed', supplier_id: 1 },
  { id: 2, batch_number: 'B-2026-002', material_id: 2, material_name: 'Sandalwood Pure', quantity_kg: 200, received_date: '2026-06-24', quality_status: 'pending', supplier_id: 2 },
  { id: 3, batch_number: 'B-2026-003', material_id: 3, material_name: 'Vanillin Synthetic', quantity_kg: 1000, received_date: '2026-06-23', quality_status: 'failed', supplier_id: 3 },
  { id: 4, batch_number: 'B-2026-004', material_id: 4, material_name: 'Ambroxan', quantity_kg: 50, received_date: '2026-06-22', quality_status: 'passed', supplier_id: 1 },
]

const mockInventory: InventoryItem[] = [
  { id: 1, material_id: 1, material_name: 'Bergamot Oil', quantity_kg: 150, reorder_level: 200, status: 'low_stock' },
  { id: 2, material_id: 2, material_name: 'Sandalwood Pure', quantity_kg: 45, reorder_level: 100, status: 'low_stock' },
  { id: 3, material_id: 3, material_name: 'Vanillin Synthetic', quantity_kg: 0, reorder_level: 300, status: 'out_of_stock' },
  { id: 4, material_id: 4, material_name: 'Ambroxan', quantity_kg: 500, reorder_level: 100, status: 'in_stock' },
  { id: 5, material_id: 5, material_name: 'Hedione', quantity_kg: 1200, reorder_level: 400, status: 'in_stock' },
]

export default function OperationsDashboard() {
  const [kpi, setKpi] = useState<KPICards | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await dashboardAPI.getKPI()
      setKpi(res.data)
    } catch (err: any) {
      setError(err?.message || 'Failed to load operations dashboard')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-lg font-medium text-red-600">Failed to load dashboard</div>
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button onClick={loadDashboard} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" /> Retry
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-8 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="h-5 w-40 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-14 bg-muted rounded animate-pulse" />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="h-5 w-40 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-14 bg-muted rounded animate-pulse" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const shortageAlerts = mockInventory.filter(
    (i) => i.status === 'low_stock' || i.status === 'out_of_stock'
  )

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Operations Dashboard</h1>
          <p className="text-muted-foreground">Supply chain, inventory, and batch tracking</p>
        </div>
      </div>

      {shortageAlerts.length > 0 && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              {shortageAlerts.length} material shortage{shortageAlerts.length > 1 ? 's' : ''} detected
            </p>
            <p className="text-xs text-amber-600 mt-1">
              {shortageAlerts.filter((i) => i.status === 'out_of_stock').length} out of stock,
              {shortageAlerts.filter((i) => i.status === 'low_stock').length} below reorder level
            </p>
          </div>
          <Button size="sm" variant="outline" className="ml-auto shrink-0">
            <ClipboardList className="h-4 w-4 mr-1" /> View All
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'Inventory Items', value: kpi?.total_inventory_items ?? 0, icon: Package, color: 'text-blue-600', bgColor: 'bg-blue-100' },
          { title: 'In Stock', value: mockInventory.filter((i) => i.status === 'in_stock').length, icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-100' },
          { title: 'Low Stock', value: mockInventory.filter((i) => i.status === 'low_stock').length, icon: Gauge, color: 'text-amber-600', bgColor: 'bg-amber-100' },
          { title: 'Out of Stock', value: mockInventory.filter((i) => i.status === 'out_of_stock').length, icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100' },
        ].map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={cn('p-2 rounded-lg', card.bgColor)}>
                <card.icon className={cn('h-5 w-5', card.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {mockInventory.map((item) => {
          const statusConfig =
            item.status === 'in_stock'
              ? { variant: 'success' as const, color: 'text-green-600', bg: 'bg-green-50' }
              : item.status === 'low_stock'
                ? { variant: 'warning' as const, color: 'text-amber-600', bg: 'bg-amber-50' }
                : { variant: 'destructive' as const, color: 'text-red-600', bg: 'bg-red-50' }
          return (
            <Card key={item.id} className={cn('border-l-4', item.status === 'in_stock' ? 'border-l-green-500' : item.status === 'low_stock' ? 'border-l-amber-500' : 'border-l-red-500')}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{item.material_name}</CardTitle>
                  <Badge variant={statusConfig.variant}>{item.status.replace('_', ' ')}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.quantity_kg} <span className="text-sm font-normal text-muted-foreground">kg</span></div>
                <p className="text-xs text-muted-foreground mt-1">Reorder at {item.reorder_level} kg</p>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div
                    className={cn('h-2 rounded-full', item.status === 'in_stock' ? 'bg-green-500' : item.status === 'low_stock' ? 'bg-amber-500' : 'bg-red-500')}
                    style={{ width: `${Math.min((item.quantity_kg / item.reorder_level) * 100, 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Supplier Performance</CardTitle>
            <CardDescription>On-time delivery & quality rates</CardDescription>
          </CardHeader>
          <CardContent>
            {mockSuppliers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Truck className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-muted-foreground">No supplier data</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium text-muted-foreground">Supplier</th>
                      <th className="text-center py-2 font-medium text-muted-foreground">
                        <div className="flex items-center justify-center gap-1">
                          <Clock className="h-3 w-3" /> On-Time
                        </div>
                      </th>
                      <th className="text-center py-2 font-medium text-muted-foreground">
                        <div className="flex items-center justify-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Quality
                        </div>
                      </th>
                      <th className="text-center py-2 font-medium text-muted-foreground">Lead Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockSuppliers.map((s) => (
                      <tr key={s.id} className="border-b last:border-0">
                        <td className="py-3 font-medium">{s.name}</td>
                        <td className="text-center py-3">
                          <Badge variant={s.onTimeRate >= 90 ? 'success' : s.onTimeRate >= 80 ? 'warning' : 'destructive'}>
                            {s.onTimeRate}%
                          </Badge>
                        </td>
                        <td className="text-center py-3">
                          <Badge variant={s.qualityRate >= 90 ? 'success' : 'warning'}>
                            {s.qualityRate}%
                          </Badge>
                        </td>
                        <td className="text-center py-3 text-muted-foreground">{s.avgLeadDays}d</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Batches</CardTitle>
            <CardDescription>Latest quality control results</CardDescription>
          </CardHeader>
          <CardContent>
            {mockBatches.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Package className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-muted-foreground">No batch records</p>
              </div>
            ) : (
              <div className="space-y-3">
                {mockBatches.map((batch) => {
                  const statusIcon = batch.quality_status === 'passed'
                    ? { icon: CheckCircle2, color: 'text-green-600' }
                    : batch.quality_status === 'failed'
                      ? { icon: XCircle, color: 'text-red-600' }
                      : { icon: Clock, color: 'text-amber-600' }
                  return (
                    <div key={batch.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <statusIcon.icon className={cn('h-5 w-5 shrink-0', statusIcon.color)} />
                        <div>
                          <p className="text-sm font-medium">{batch.batch_number}</p>
                          <p className="text-xs text-muted-foreground">
                            {batch.material_name} &middot; {batch.quantity_kg}kg
                          </p>
                        </div>
                      </div>
                      <Badge variant={batch.quality_status === 'passed' ? 'success' : batch.quality_status === 'failed' ? 'destructive' : 'warning'}>
                        {batch.quality_status}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
