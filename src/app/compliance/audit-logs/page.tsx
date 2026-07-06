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
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  AlertCircle,
  Loader2,
  Search,
  FileWarning,
  RefreshCw,
  Download,
  FileText,
  FileSpreadsheet,
  History,
  FilterX,
} from 'lucide-react'

interface AuditEntry {
  id: number
  timestamp: string
  user: string
  action: 'create' | 'update' | 'delete' | 'view' | 'export' | 'login' | 'approve' | 'reject'
  resourceType: string
  resourceId: string
  ipAddress: string
  details: string
}

const ACTIONS_LIST = ['create', 'update', 'delete', 'view', 'export', 'login', 'approve', 'reject']
const RESOURCE_TYPES = ['Formula', 'Material', 'Certificate', 'SDS', 'Compliance Check', 'User', 'Report', 'Batch']

const MOCK_LOGS: AuditEntry[] = [
  { id: 1, timestamp: '2026-06-29T09:15:00Z', user: 'jane.doe@prefoum.com', action: 'create', resourceType: 'Formula', resourceId: 'F-2026-0421', ipAddress: '192.168.1.100', details: 'Created new formula "Rose Essence No.8"' },
  { id: 2, timestamp: '2026-06-29T09:12:30Z', user: 'john.smith@prefoum.com', action: 'update', resourceType: 'Material', resourceId: 'M-1042', ipAddress: '192.168.1.101', details: 'Updated cost per kg for Benzyl Acetate' },
  { id: 3, timestamp: '2026-06-29T08:55:00Z', user: 'admin@prefoum.com', action: 'delete', resourceType: 'Formula', resourceId: 'F-2026-0389', ipAddress: '10.0.0.5', details: 'Deleted archived formula "Test Batch A"' },
  { id: 4, timestamp: '2026-06-29T08:30:00Z', user: 'sarah.lee@prefoum.com', action: 'export', resourceType: 'Report', resourceId: 'RPT-2026-0088', ipAddress: '192.168.1.200', details: 'Exported compliance report as PDF' },
  { id: 5, timestamp: '2026-06-29T08:00:00Z', user: 'jane.doe@prefoum.com', action: 'approve', resourceType: 'Compliance Check', resourceId: 'CC-2026-0123', ipAddress: '192.168.1.100', details: 'Approved IFRA compliance for "Ocean Breeze"' },
  { id: 6, timestamp: '2026-06-28T23:15:00Z', user: 'mike.brown@prefoum.com', action: 'login', resourceType: 'User', resourceId: 'U-042', ipAddress: '203.0.113.42', details: 'User login from new device' },
  { id: 7, timestamp: '2026-06-28T22:00:00Z', user: 'sarah.lee@prefoum.com', action: 'update', resourceType: 'SDS', resourceId: 'SDS-078', ipAddress: '192.168.1.200', details: 'Uploaded new SDS version for Linalool' },
  { id: 8, timestamp: '2026-06-28T21:45:00Z', user: 'admin@prefoum.com', action: 'reject', resourceType: 'Certificate', resourceId: 'CERT-034', ipAddress: '10.0.0.5', details: 'Rejected expired CoA for Musk Ketone' },
  { id: 9, timestamp: '2026-06-28T21:30:00Z', user: 'john.smith@prefoum.com', action: 'view', resourceType: 'Batch', resourceId: 'B-2026-0511', ipAddress: '192.168.1.101', details: 'Viewed batch production details' },
  { id: 10, timestamp: '2026-06-28T20:00:00Z', user: 'jane.doe@prefoum.com', action: 'create', resourceType: 'Material', resourceId: 'M-1087', ipAddress: '192.168.1.100', details: 'Created new material entry "Hedione HC"' },
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
}

type PageState = 'loading' | 'ready' | 'empty' | 'filtered_empty' | 'error'

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([])
  const [pageState, setPageState] = useState<PageState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [searchUser, setSearchUser] = useState('')
  const [filterAction, setFilterAction] = useState('')
  const [filterResource, setFilterResource] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setLogs(MOCK_LOGS)
      setPageState('ready')
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const filtered = logs.filter(e => {
    const q = searchUser.toLowerCase()
    if (q && !e.user.toLowerCase().includes(q)) return false
    if (filterAction && e.action !== filterAction) return false
    if (filterResource && e.resourceType !== filterResource) return false
    if (dateFrom && e.timestamp < new Date(dateFrom).toISOString()) return false
    if (dateTo && e.timestamp > new Date(dateTo + 'T23:59:59').toISOString()) return false
    return true
  })

  const hasFilters = searchUser || filterAction || filterResource || dateFrom || dateTo

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">Audit Logs</h1>
            <p className="text-sm text-muted-foreground">Immutable audit trail of all system actions</p>
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
            <h1 className="text-2xl font-bold">Audit Logs</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <p className="text-red-600 mb-2 font-semibold">Failed to Load Audit Logs</p>
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
            <h1 className="text-2xl font-bold">Audit Logs</h1>
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
            <h1 className="text-2xl font-bold">Audit Logs</h1>
            <p className="text-sm text-muted-foreground">Immutable audit trail of all system actions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
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
                  placeholder="Search user..."
                  value={searchUser}
                  onChange={e => setSearchUser(e.target.value)}
                  className="w-48"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Action</label>
                <Select value={filterAction} onValueChange={v => setFilterAction(v)}>
                  <SelectTrigger className="w-32"><SelectValue placeholder="All" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    {ACTIONS_LIST.map(a => (
                      <SelectItem key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Resource</label>
                <Select value={filterResource} onValueChange={v => setFilterResource(v)}>
                  <SelectTrigger className="w-40"><SelectValue placeholder="All" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Resources</SelectItem>
                    {RESOURCE_TYPES.map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={() => { setSearchUser(''); setFilterAction(''); setFilterResource(''); setDateFrom(''); setDateTo('') }}>
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
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource Type</TableHead>
                    <TableHead>Resource ID</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(e => (
                    <TableRow key={e.id}>
                      <TableCell className="font-mono text-xs whitespace-nowrap">
                        {new Date(e.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-xs">{e.user}</TableCell>
                      <TableCell>
                        <Badge variant={ACTION_VARIANT[e.action]}>
                          {e.action.charAt(0).toUpperCase() + e.action.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{e.resourceType}</TableCell>
                      <TableCell className="font-mono text-xs">{e.resourceId}</TableCell>
                      <TableCell className="font-mono text-xs">{e.ipAddress}</TableCell>
                      <TableCell className="text-xs max-w-[200px] truncate" title={e.details}>
                        {e.details}
                      </TableCell>
                    </TableRow>
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
