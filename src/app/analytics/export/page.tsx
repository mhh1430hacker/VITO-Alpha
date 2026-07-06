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
  RefreshCw,
  FileWarning,
  Download,
  Trash2,
  X,
  FileUp,
  Database,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react'

interface ExportJob {
  id: number
  jobId: string
  type: string
  format: 'PDF' | 'CSV' | 'HTML' | 'XLSX'
  status: 'processing' | 'done' | 'failed'
  created: string
  size: string | null
}

const MOCK_JOBS: ExportJob[] = [
  { id: 1, jobId: 'EXP-2026-0042', type: 'Compliance Report', format: 'PDF', status: 'done', created: '2026-06-29 10:30', size: '2.4 MB' },
  { id: 2, jobId: 'EXP-2026-0041', type: 'Formula Summary', format: 'CSV', status: 'done', created: '2026-06-29 09:15', size: '1.1 MB' },
  { id: 3, jobId: 'EXP-2026-0040', type: 'Material Catalog', format: 'XLSX', status: 'processing', created: '2026-06-29 11:00', size: null },
  { id: 4, jobId: 'EXP-2026-0039', type: 'IFRA Violations', format: 'PDF', status: 'failed', created: '2026-06-28 22:00', size: null },
  { id: 5, jobId: 'EXP-2026-0038', type: 'Performance Overview', format: 'HTML', status: 'done', created: '2026-06-28 16:45', size: '4.7 MB' },
  { id: 6, jobId: 'EXP-2026-0037', type: 'Audit Logs', format: 'CSV', status: 'done', created: '2026-06-28 14:30', size: '0.8 MB' },
  { id: 7, jobId: 'EXP-2026-0036', type: 'Batch Production Data', format: 'XLSX', status: 'processing', created: '2026-06-29 11:05', size: null },
]

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'destructive'> = {
  done: 'success',
  processing: 'warning',
  failed: 'destructive',
}

const STATUS_ICON: Record<string, React.ElementType> = {
  done: CheckCircle2,
  processing: Clock,
  failed: XCircle,
}

type PageState = 'loading' | 'ready' | 'empty' | 'exporting' | 'error'

export default function ExportPage() {
  const [pageState, setPageState] = useState<PageState>('loading')
  const [jobs, setJobs] = useState<ExportJob[]>([])
  const [showModal, setShowModal] = useState(false)
  const [newExportType, setNewExportType] = useState('')
  const [newExportFormat, setNewExportFormat] = useState('')
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setJobs(MOCK_JOBS)
      setPageState('ready')
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleNewExport = () => {
    if (!newExportType || !newExportFormat) return
    setExporting(true)
    setTimeout(() => {
      const newJob: ExportJob = {
        id: jobs.length + 1,
        jobId: `EXP-2026-${String(jobs.length + 1).padStart(4, '0')}`,
        type: newExportType,
        format: newExportFormat as ExportJob['format'],
        status: 'processing',
        created: new Date().toLocaleString(),
        size: null,
      }
      setJobs(prev => [newJob, ...prev])
      setExporting(false)
      setShowModal(false)
      setNewExportType('')
      setNewExportFormat('')
    }, 1500)
  }

  const handleDelete = (id: number) => {
    setJobs(prev => prev.filter(j => j.id !== id))
  }

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">Export Center</h1>
            <p className="text-sm text-muted-foreground">Manage data export jobs and downloads</p>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Loading Export Jobs</CardTitle>
              <CardDescription>Fetching export queue...</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
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
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Export Center</h1>
              <p className="text-sm text-muted-foreground">Manage data export jobs and downloads</p>
            </div>
            <Button onClick={() => setShowModal(true)}>
              <FileUp className="h-4 w-4 mr-2" />
              New Export
            </Button>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No export jobs yet. Start a new export to download your data.</p>
              <Button onClick={() => setShowModal(true)}>
                <FileUp className="h-4 w-4 mr-2" />
                Start New Export
              </Button>
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
            <h1 className="text-2xl font-bold">Export Center</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <p className="text-red-600 mb-2 font-semibold">Failed to Load Export Jobs</p>
              <p className="text-muted-foreground mb-6">Unable to retrieve the export queue.</p>
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
            <h1 className="text-2xl font-bold">Export Center</h1>
            <p className="text-sm text-muted-foreground">Manage data export jobs and downloads</p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <FileUp className="h-4 w-4 mr-2" />
            New Export
          </Button>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map(j => {
                  const StatIcon = STATUS_ICON[j.status]
                  return (
                    <TableRow key={j.id}>
                      <TableCell className="font-mono text-xs font-medium">{j.jobId}</TableCell>
                      <TableCell className="text-sm">{j.type}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{j.format}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {j.status === 'processing' ? (
                            <Loader2 className="h-3 w-3 animate-spin text-yellow-600" />
                          ) : (
                            <StatIcon className={cn(
                              'h-3 w-3',
                              j.status === 'done' && 'text-green-600',
                              j.status === 'failed' && 'text-red-600',
                            )} />
                          )}
                          <Badge variant={STATUS_VARIANT[j.status]}>
                            {j.status.charAt(0).toUpperCase() + j.status.slice(1)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{j.created}</TableCell>
                      <TableCell className="text-xs">{j.size || '—'}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" disabled={j.status !== 'done'}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(j.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">New Export</CardTitle>
                <CardDescription>Configure your data export</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Export Type</label>
                  <Select value={newExportType} onValueChange={setNewExportType}>
                    <SelectTrigger><SelectValue placeholder="Select type..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Compliance Report">Compliance Report</SelectItem>
                      <SelectItem value="Formula Summary">Formula Summary</SelectItem>
                      <SelectItem value="Material Catalog">Material Catalog</SelectItem>
                      <SelectItem value="Audit Logs">Audit Logs</SelectItem>
                      <SelectItem value="Performance Overview">Performance Overview</SelectItem>
                      <SelectItem value="IFRA Violations">IFRA Violations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Format</label>
                  <Select value={newExportFormat} onValueChange={setNewExportFormat}>
                    <SelectTrigger><SelectValue placeholder="Select format..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="CSV">CSV</SelectItem>
                      <SelectItem value="HTML">HTML</SelectItem>
                      <SelectItem value="XLSX">XLSX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={handleNewExport} disabled={!newExportType || !newExportFormat || exporting}>
                  {exporting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Export Job...
                    </>
                  ) : (
                    <>
                      <FileUp className="h-4 w-4 mr-2" />
                      Create Export
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
