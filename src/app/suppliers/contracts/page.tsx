'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertTriangle, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Contract {
  id: number
  supplier: string
  title: string
  start_date: string
  end_date: string
  value: number
  status: 'active' | 'expiring_soon' | 'expired' | 'draft'
  auto_renew: boolean
}

const MOCK_CONTRACTS: Contract[] = [
  { id: 1, supplier: 'Givaudan SA', title: 'Raw Materials Supply 2025', start_date: '2025-01-01', end_date: '2026-12-31', value: 1200000, status: 'active', auto_renew: true },
  { id: 2, supplier: 'Firmenich SA', title: 'Fragrance Compounds Q1-Q4', start_date: '2025-03-01', end_date: '2025-12-31', value: 980000, status: 'expiring_soon', auto_renew: false },
  { id: 3, supplier: 'IFF Inc', title: 'Natural Isolates Agreement', start_date: '2024-06-01', end_date: '2025-06-01', value: 750000, status: 'expired', auto_renew: false },
  { id: 4, supplier: 'Symrise AG', title: 'Aroma Chemicals Framework', start_date: '2025-02-01', end_date: '2027-01-31', value: 2100000, status: 'active', auto_renew: true },
  { id: 5, supplier: 'Takasago Corp', title: 'Proposal - Specialty Ingredients', start_date: '2025-07-01', end_date: '2026-06-30', value: 320000, status: 'draft', auto_renew: false },
]

const statusConfig = {
  active: { variant: 'success' as const, label: 'Active' },
  expiring_soon: { variant: 'warning' as const, label: 'Expiring Soon' },
  expired: { variant: 'destructive' as const, label: 'Expired' },
  draft: { variant: 'secondary' as const, label: 'Draft' },
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setContracts(MOCK_CONTRACTS)
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading contracts...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-lg text-destructive">Error: {error}</div>
      </div>
    )
  }

  const expiringSoon = contracts.filter(c => c.status === 'expiring_soon')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Contracts Management</h1>
          <p className="text-sm text-muted-foreground">Supplier agreements and renewals</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {expiringSoon.length > 0 && (
          <Card className="mb-6 border-yellow-300 bg-yellow-50">
            <CardContent className="flex items-center gap-3 py-4">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <span className="font-medium text-yellow-800">
                  {expiringSoon.length} contract{expiringSoon.length > 1 ? 's' : ''} expiring soon
                </span>
                <span className="text-yellow-700 ml-1">
                  — {expiringSoon.map(c => c.supplier).join(', ')}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {contracts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No contracts found</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Contracts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Auto-Renew</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contracts.map(contract => (
                    <TableRow
                      key={contract.id}
                      className={cn(
                        contract.status === 'expiring_soon' && 'bg-yellow-50/50',
                        contract.status === 'expired' && 'bg-red-50/50'
                      )}
                    >
                      <TableCell className="font-medium">{contract.supplier}</TableCell>
                      <TableCell>{contract.title}</TableCell>
                      <TableCell>{contract.start_date}</TableCell>
                      <TableCell>{contract.end_date}</TableCell>
                      <TableCell>${contract.value.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[contract.status].variant}>
                          {statusConfig[contract.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          'text-sm font-medium',
                          contract.auto_renew ? 'text-green-600' : 'text-muted-foreground'
                        )}>
                          {contract.auto_renew ? 'Yes' : 'No'}
                        </span>
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
