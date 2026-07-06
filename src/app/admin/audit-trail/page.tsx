'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
  AlertCircle,
  Loader2,
  Search,
  RefreshCw,
  Download,
  History,
  FilterX,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
} from 'lucide-react'

interface AuditEntry {
  id: number
  timestamp: string
  user: string
  action: string
  resource: string
  ip: string
  details: string
}

const ACTION_TYPES = ['create', 'update', 'delete', 'view', 'export', 'login', 'approve', 'reject', 'configure']

const MOCK_LOGS: AuditEntry[] = [
  { id: 1, timestamp: '2026-06-29T10:15:00Z', user: 'liam@perfume.com', action: 'create', resource: 'User Account', ip: '10.0.0.5', details: 'Created new user account for carlos@perfume.com' },
  { id: 2, timestamp: '2026-06-29T09:45:00Z', user: 'maria@perfume.com', action: 'update', resource: 'Formula F-2026-0421', ip: '192.168.1.100', details: 'Modified concentration ratios in Rose Essence No.8' },
  { id: 3, timestamp: '2026-06-29T09:12:00Z', user: 'james@perfume.com', action: 'approve', resource: 'Compliance Check CC-0123', ip: '192.168.1.101', details: 'Approved IFRA compliance certificate for Ocean Breeze' },
  { id: 4, timestamp: '2026-06-29T08:30:00Z', user: 'sophie@perfume.com', action: 'export', resource: 'Report RPT-2026-0088', ip: '192.168.1.200', details: 'Exported quarterly compliance report as XLSX' },
  { id: 5, timestamp: '2026-06-29T08:00:00Z', user: 'raj@perfume.com', action: 'update', resource: 'Material M-1042', ip: '192.168.1.50', details: 'Updated supplier pricing for Benzyl Acetate' },
  { id: 6, timestamp: '2026-06-28T23:15:00Z', user: 'liam@perfume.com', action: 'login', resource: 'System', ip: '203.0.113.42', details: 'Successful login from unrecognized device' },
  { id: 7, timestamp: '2026-06-28T22:00:00Z', user: 'anna@perfume.com', action: 'create', resource: 'Formula F-2026-0422', ip: '192.168.1.102', details: 'Created new formula draft "White Musk Intense"' },
  { id: 8, timestamp: '2026-06-28T21:30:00Z', user: 'admin@perfume.com', action: 'configure', resource: 'SSO Settings', ip: '10.0.0.1', details: 'Updated SAML metadata URL for identity provider' },
  { id: 9, timestamp: '2026-06-28T20:00:00Z', user: 'sophie@perfume.com', action: 'reject', resource: 'Certificate CERT-034', ip: '192.168.1.200', details: 'Rejected expired CoA for Musk Ketone - requested renewal' },
  { id: 10, timestamp: '2026-06-28T19:00:00Z', user: 'james@perfume.com', action: 'delete', resource: 'Batch B-2026-0389', ip: '192.168.1.101', details: 'Deleted archived test batch for quality audit' },
  { id: 11, timestamp: '2026-06-28T18:15:00Z', user: 'maria@perfume.com', action: 'view', resource: 'Material M-1087', ip: '192.168.1.100', details: 'Viewed Hedione HC material safety data sheet' },
  { id: 12, timestamp: '2026-06-28T17:00:00Z', user: 'raj@perfume.com', action: 'update', resource: 'Contract C-004', ip: '192.168.1.50', details: 'Extended contract end date with Givaudan SA' },
]

const ACTION_VARIANT: Record<string, 'success' | 'warning' | 'destructive' | 'secondary' | 'default'> = {
  create: 'success',
  update: 'warning',
  delete: 'destructive',
  view: 'secondary',
  export: 'default',
  login: 'secondary',
  approve: 'success',
  reject: 'destructive',
  configure: 'default',
}

type PageState = 'loading' | 'ready' | 'empty' | 'filtered_empty' | 'error'

export default function AuditTrailPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([])
  const [pageState, setPageState] = useState<PageState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [filterUser, setFilterUser] = useState('')
  const [filterAction, setFilterAction] = useState('')
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLogs(MOCK_LOGS)
      setPageState('ready')
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const filtered = logs.filter(e => {
    const q = search.toLowerCase()
    if (q && !e.user.toLowerCase().includes(q) && !e.resource.toLowerCase().includes(q) && !e.details.toLowerCase().includes(q)) return false
    if (filterUser && !e.user.toLowerCase().includes(filterUser.toLowerCase())) return false
    if (filterAction && e.action !== filterAction) return false
    if (dateFrom && e.timestamp < new Date(dateFrom).toISOString()) return false
    if (dateTo && e.timestamp > new Date(dateTo + 'T23:59:59').toISOString()) return false
    return true
  })

  const hasFilters = search || filterUser || filterAction || dateFrom || dateTo

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">System Audit Trail</h1>
            <p className="text-sm text-muted-foreground">Immutable record of all system events and changes</p>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Loading Audit Trail</CardTitle>
              <CardDescription>Retrieving system logs...</CardDescription>
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
            <h1 className="text-2xl font-bold">System Audit Trail</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <p className="text-red-600 mb-2 font-semibold">Failed to Load Audit Trail</p>
              <p className="text-muted-foreground mb-6">{error || 'Database connection error.'}</p>
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
            <h1 className="text-2xl font-bold">System Audit Trail</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No audit log entries recorded yet.</p>
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
            <h1 className="text-2xl font-bold">System Audit Trail</h1>
            <p className="text-sm text-muted-foreground">Immutable record of all system events and changes</p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Search</label>
                <Input
                  placeholder="Search logs..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-48"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Date From</label>
                <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-40" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Date To</label>
                <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-40" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">User</label>
                <Input
                  placeholder="Filter by user..."
                  value={filterUser}
                  onChange={e => setFilterUser(e.target.value)}
                  className="w-40"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Action</label>
                <Select value={filterAction} onValueChange={v => setFilterAction(v)}>
                  <SelectTrigger className="w-36"><SelectValue placeholder="All" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    {ACTION_TYPES.map(a => (
                      <SelectItem key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setFilterUser(''); setFilterAction(''); setDateFrom(''); setDateTo('') }}>
                  <FilterX className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            {filtered.length === 0 ? (
              <div className="py-12 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No audit logs match your filters.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8"></TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(e => (
                    <>
                      <TableRow
                        key={e.id}
                        className="cursor-pointer"
                        onClick={() => setExpanded(expanded === e.id ? null : e.id)}
                      >
                        <TableCell>
                          {expanded === e.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </TableCell>
                        <TableCell className="font-mono text-xs whitespace-nowrap">
                          {new Date(e.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-xs">{e.user}</TableCell>
                        <TableCell>
                          <Badge variant={ACTION_VARIANT[e.action] || 'default'}>
                            {e.action.charAt(0).toUpperCase() + e.action.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs max-w-[160px] truncate">{e.resource}</TableCell>
                        <TableCell className="font-mono text-xs">{e.ip}</TableCell>
                        <TableCell className="text-xs max-w-[200px] truncate">{e.details}</TableCell>
                      </TableRow>
                      {expanded === e.id && (
                        <TableRow key={`${e.id}-expanded`}>
                          <TableCell colSpan={7} className="bg-gray-50 dark:bg-gray-950 px-8 py-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground text-xs">Event ID</span>
                                <p className="font-mono text-xs">evt_{String(e.id).padStart(6, '0')}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground text-xs">Timestamp (UTC)</span>
                                <p className="font-mono text-xs">{e.timestamp}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground text-xs">Full Resource Path</span>
                                <p className="font-mono text-xs">{e.resource}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground text-xs">IP Address</span>
                                <p className="font-mono text-xs">{e.ip}</p>
                              </div>
                              <div className="col-span-2">
                                <span className="text-muted-foreground text-xs">Description</span>
                                <p className="text-sm">{e.details}</p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
