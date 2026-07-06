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
  Eye,
  Download,
  Calendar,
  Table as TableIcon,
  AlertTriangle,
  Award,
} from 'lucide-react'

interface Certificate {
  id: number
  name: string
  type: 'CoA' | 'IFRA' | 'REACH' | 'Allergen'
  issuedDate: string
  expiryDate: string
  status: 'valid' | 'expiring_soon' | 'expired'
}

const MOCK_CERTIFICATES: Certificate[] = [
  { id: 1, name: 'Benzyl Acetate - CoA #2024-01', type: 'CoA', issuedDate: '2024-01-15', expiryDate: '2025-01-15', status: 'expired' },
  { id: 2, name: 'Linalool - IFRA Certificate', type: 'IFRA', issuedDate: '2024-06-01', expiryDate: '2026-06-01', status: 'valid' },
  { id: 3, name: 'Coumarin - REACH Registration', type: 'REACH', issuedDate: '2023-03-10', expiryDate: '2026-09-10', status: 'valid' },
  { id: 4, name: 'Vanillin - Allergen Declaration', type: 'Allergen', issuedDate: '2024-09-01', expiryDate: '2026-09-01', status: 'valid' },
  { id: 5, name: 'Musk Ketone - CoA #2020-11', type: 'CoA', issuedDate: '2020-11-15', expiryDate: '2021-11-15', status: 'expired' },
  { id: 6, name: 'Limonene - IFRA Certificate', type: 'IFRA', issuedDate: '2025-01-10', expiryDate: '2025-08-10', status: 'expiring_soon' },
  { id: 7, name: 'Geraniol - REACH Registration', type: 'REACH', issuedDate: '2021-08-22', expiryDate: '2024-08-22', status: 'expired' },
  { id: 8, name: 'Hedione - CoA #2024-04', type: 'CoA', issuedDate: '2024-04-05', expiryDate: '2026-04-05', status: 'valid' },
  { id: 9, name: 'Rose Essence - Allergen Declaration', type: 'Allergen', issuedDate: '2025-03-01', expiryDate: '2026-03-01', status: 'valid' },
  { id: 10, name: 'Galaxolide - IFRA Certificate', type: 'IFRA', issuedDate: '2024-12-01', expiryDate: '2025-07-01', status: 'expiring_soon' },
]

const TYPE_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  CoA: 'default',
  IFRA: 'secondary',
  REACH: 'outline',
  Allergen: 'destructive',
}

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'destructive'> = {
  valid: 'success',
  expiring_soon: 'warning',
  expired: 'destructive',
}

type PageState = 'loading' | 'ready' | 'empty' | 'expiring_soon' | 'error'

export default function CertificatesPage() {
  const [data, setData] = useState<Certificate[]>([])
  const [pageState, setPageState] = useState<PageState>('loading')
  const [calendarView, setCalendarView] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(MOCK_CERTIFICATES)
      setPageState('ready')
    }, 900)
    return () => clearTimeout(timer)
  }, [])

  const expiringSoon = data.filter(c => c.status === 'expiring_soon').length
  const expired = data.filter(c => c.status === 'expired').length

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">Certificates Management</h1>
            <p className="text-sm text-muted-foreground">Track compliance certificates and expiry dates</p>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Loading Certificates</CardTitle>
              <CardDescription>Fetching certificate records...</CardDescription>
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

  if (pageState === 'empty') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">Certificates Management</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No certificates registered yet.</p>
              <Button>Upload Certificate</Button>
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
            <h1 className="text-2xl font-bold">Certificates Management</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <p className="text-red-600 mb-2 font-semibold">Failed to Load Certificates</p>
              <p className="text-muted-foreground mb-6">Unable to retrieve certificate data.</p>
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Certificates Management</h1>
            <p className="text-sm text-muted-foreground">Track compliance certificates and expiry dates</p>
          </div>
          <Button variant="outline" onClick={() => setCalendarView(!calendarView)}>
            {calendarView ? <TableIcon className="h-4 w-4 mr-2" /> : <Calendar className="h-4 w-4 mr-2" />}
            {calendarView ? 'Table View' : 'Calendar View'}
          </Button>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        {(expiringSoon > 0 || expired > 0) && (
          <Card className="mb-6 border-red-400 bg-red-50">
            <CardContent className="py-3 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-800">
                {expired} expired and {expiringSoon} expiring soon certificate(s) require immediate attention.
              </p>
            </CardContent>
          </Card>
        )}

        {calendarView ? (
          <Card>
            <CardHeader>
              <CardTitle>Expiry Calendar</CardTitle>
              <CardDescription>Upcoming certificate expirations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data
                  .filter(c => c.status !== 'valid')
                  .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
                  .map(c => (
                    <Card key={c.id} className={cn(
                      c.status === 'expired' ? 'border-red-300 bg-red-50' : 'border-yellow-300 bg-yellow-50',
                    )}>
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant={TYPE_VARIANT[c.type]}>{c.type}</Badge>
                          <Badge variant={STATUS_VARIANT[c.status]}>
                            {c.status === 'expiring_soon' ? 'Expiring Soon' : 'Expired'}
                          </Badge>
                        </div>
                        <p className="font-medium text-sm mb-1">{c.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Expires: <span className={cn('font-mono', c.status === 'expired' && 'text-red-600')}>{c.expiryDate}</span>
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                {data.filter(c => c.status !== 'valid').length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    <Award className="h-8 w-8 mx-auto mb-2" />
                    <p>No upcoming expirations. All certificates are valid.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Certificate Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Issued Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map(c => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>
                        <Badge variant={TYPE_VARIANT[c.type]}>{c.type}</Badge>
                      </TableCell>
                      <TableCell className="text-xs">{c.issuedDate}</TableCell>
                      <TableCell className={cn(
                        'text-xs',
                        c.status === 'expired' && 'text-red-600 font-semibold',
                        c.status === 'expiring_soon' && 'text-yellow-600 font-semibold',
                      )}>
                        {c.expiryDate}
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANT[c.status]}>
                          {c.status === 'expiring_soon' ? 'Expiring Soon' : c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Download className="h-4 w-4" />
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
      </main>
    </div>
  )
}
