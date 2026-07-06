'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  AlertCircle,
  Loader2,
  FileWarning,
  RefreshCw,
  FileText,
  Upload,
  Eye,
  AlertTriangle,
} from 'lucide-react'

interface SDSRecord {
  id: number
  materialName: string
  sdsVersion: string
  uploadedDate: string
  expiryDate: string
  status: 'valid' | 'expiring' | 'expired'
}

const MOCK_SDS: SDSRecord[] = [
  { id: 1, materialName: 'Benzyl Acetate', sdsVersion: 'v3.2', uploadedDate: '2024-01-15', expiryDate: '2027-01-15', status: 'valid' },
  { id: 2, materialName: 'Linalool', sdsVersion: 'v2.1', uploadedDate: '2023-06-20', expiryDate: '2026-06-20', status: 'valid' },
  { id: 3, materialName: 'Coumarin', sdsVersion: 'v1.5', uploadedDate: '2023-03-10', expiryDate: '2026-03-10', status: 'expiring' },
  { id: 4, materialName: 'Vanillin', sdsVersion: 'v4.0', uploadedDate: '2024-09-01', expiryDate: '2027-09-01', status: 'valid' },
  { id: 5, materialName: 'Musk Ketone', sdsVersion: 'v2.3', uploadedDate: '2020-11-15', expiryDate: '2023-11-15', status: 'expired' },
  { id: 6, materialName: 'Limonene', sdsVersion: 'v5.1', uploadedDate: '2025-01-10', expiryDate: '2028-01-10', status: 'valid' },
  { id: 7, materialName: 'Geraniol', sdsVersion: 'v1.8', uploadedDate: '2021-08-22', expiryDate: '2024-08-22', status: 'expired' },
  { id: 8, materialName: 'Hedione', sdsVersion: 'v3.0', uploadedDate: '2024-04-05', expiryDate: '2027-04-05', status: 'valid' },
]

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'destructive'> = {
  valid: 'success',
  expiring: 'warning',
  expired: 'destructive',
}

type PageState = 'loading' | 'ready' | 'empty' | 'error'

export default function SDSPage() {
  const [data, setData] = useState<SDSRecord[]>([])
  const [pageState, setPageState] = useState<PageState>('loading')

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(MOCK_SDS)
      setPageState('ready')
    }, 900)
    return () => clearTimeout(timer)
  }, [])

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">Safety Data Sheets</h1>
            <p className="text-sm text-muted-foreground">Manage SDS documents for all materials</p>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Loading SDS Records</CardTitle>
              <CardDescription>Fetching safety data sheets...</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (pageState === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">Safety Data Sheets</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <p className="text-red-600 mb-2 font-semibold">Failed to Load SDS Records</p>
              <p className="text-muted-foreground mb-6">Unable to retrieve SDS data from the server.</p>
              <Button onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (pageState === 'empty') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">Safety Data Sheets</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <FileWarning className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No SDS records found. Upload safety data sheets for your materials.</p>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload SDS
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Safety Data Sheets</h1>
            <p className="text-sm text-muted-foreground">Manage SDS documents for all materials</p>
          </div>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload SDS
          </Button>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        {data.filter(s => s.status === 'expiring' || s.status === 'expired').length > 0 && (
          <Card className="mb-6 border-yellow-400 bg-yellow-50">
            <CardContent className="py-3 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                {data.filter(s => s.status === 'expired').length} expired and {data.filter(s => s.status === 'expiring').length} expiring SDS document(s) require attention.
              </p>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material Name</TableHead>
                  <TableHead>SDS Version</TableHead>
                  <TableHead>Uploaded Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map(s => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.materialName}</TableCell>
                    <TableCell className="font-mono text-xs">{s.sdsVersion}</TableCell>
                    <TableCell className="text-xs">{s.uploadedDate}</TableCell>
                    <TableCell className={cn(
                      'text-xs',
                      s.status === 'expired' && 'text-red-600 font-semibold',
                      s.status === 'expiring' && 'text-yellow-600 font-semibold',
                    )}>
                      {s.expiryDate}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[s.status]}>
                        {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
