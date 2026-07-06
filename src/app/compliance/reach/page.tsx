'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  AlertCircle,
  Loader2,
  Search,
  FileWarning,
  RefreshCw,
  FlaskConical,
  Eye,
} from 'lucide-react'

interface REACHSunstance {
  id: number
  substance: string
  cas: string
  registrationStatus: 'registered' | 'pending' | 'expired'
  tonnageBand: string
  sunsetDate: string | null
  authorizationStatus: 'approved' | 'pending_review' | 'not_required'
}

const MOCK_DATA: REACHSunstance[] = [
  { id: 1, substance: 'Benzyl Acetate', cas: '140-11-4', registrationStatus: 'registered', tonnageBand: '100-1000 tpa', sunsetDate: null, authorizationStatus: 'not_required' },
  { id: 2, substance: 'Linalool', cas: '78-70-6', registrationStatus: 'registered', tonnageBand: '1000+ tpa', sunsetDate: null, authorizationStatus: 'not_required' },
  { id: 3, substance: 'Coumarin', cas: '91-64-5', registrationStatus: 'pending', tonnageBand: '10-100 tpa', sunsetDate: '2027-03-15', authorizationStatus: 'pending_review' },
  { id: 4, substance: 'Musk Ketone', cas: '81-14-1', registrationStatus: 'expired', tonnageBand: '1-10 tpa', sunsetDate: '2025-12-01', authorizationStatus: 'pending_review' },
  { id: 5, substance: 'Vanillin', cas: '121-33-5', registrationStatus: 'registered', tonnageBand: '100-1000 tpa', sunsetDate: null, authorizationStatus: 'not_required' },
  { id: 6, substance: 'Methyl Eugenol', cas: '93-15-2', registrationStatus: 'pending', tonnageBand: '10-100 tpa', sunsetDate: '2026-09-30', authorizationStatus: 'pending_review' },
  { id: 7, substance: 'Galaxolide', cas: '1222-05-5', registrationStatus: 'registered', tonnageBand: '1000+ tpa', sunsetDate: null, authorizationStatus: 'approved' },
  { id: 8, substance: 'Limonene', cas: '5989-27-5', registrationStatus: 'registered', tonnageBand: '1000+ tpa', sunsetDate: null, authorizationStatus: 'not_required' },
]

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'destructive'> = {
  registered: 'success',
  pending: 'warning',
  expired: 'destructive',
}

type PageState = 'loading' | 'ready' | 'empty' | 'error'

export default function REACHPage() {
  const [data, setData] = useState<REACHSunstance[]>([])
  const [pageState, setPageState] = useState<PageState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(MOCK_DATA)
      setPageState('ready')
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const filtered = data.filter(s => {
    const q = search.toLowerCase()
    if (q && !s.substance.toLowerCase().includes(q) && !s.cas.toLowerCase().includes(q)) return false
    if (filterStatus && s.registrationStatus !== filterStatus) return false
    return true
  })

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">REACH Compliance Tracker</h1>
            <p className="text-sm text-muted-foreground">EU REACH regulation monitoring</p>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Loading Substances</CardTitle>
              <CardDescription>Fetching REACH registration data...</CardDescription>
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
            <h1 className="text-2xl font-bold">REACH Compliance Tracker</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <p className="text-red-600 mb-2 font-semibold">Failed to Load Data</p>
              <p className="text-muted-foreground mb-6">{error || 'Unable to connect to REACH database.'}</p>
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
            <h1 className="text-2xl font-bold">REACH Compliance Tracker</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <FileWarning className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No REACH substances registered yet.</p>
              <Button>
                <FlaskConical className="h-4 w-4 mr-2" />
                Register Substance
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
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">REACH Compliance Tracker</h1>
          <p className="text-sm text-muted-foreground">EU REACH regulation monitoring</p>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search substance or CAS#..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={filterStatus} onValueChange={v => setFilterStatus(v)}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="registered">Registered</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No substances match your search criteria.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Substance</TableHead>
                    <TableHead>CAS#</TableHead>
                    <TableHead>Registration Status</TableHead>
                    <TableHead>Tonnage Band</TableHead>
                    <TableHead>Sunset Date</TableHead>
                    <TableHead>Authorization Status</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(s => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.substance}</TableCell>
                      <TableCell className="font-mono text-xs">{s.cas}</TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANT[s.registrationStatus]}>
                          {s.registrationStatus.charAt(0).toUpperCase() + s.registrationStatus.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{s.tonnageBand}</TableCell>
                      <TableCell>
                        {s.sunsetDate ? (
                          <span className={cn(
                            'font-mono text-xs',
                            new Date(s.sunsetDate) < new Date() && 'text-red-600 font-semibold',
                          )}>
                            {s.sunsetDate}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={s.authorizationStatus === 'approved' ? 'success' : s.authorizationStatus === 'pending_review' ? 'warning' : 'secondary'}>
                          {s.authorizationStatus.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
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
