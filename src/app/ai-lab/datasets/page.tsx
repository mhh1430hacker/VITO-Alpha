'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import {
  Database,
  Loader2,
  AlertCircle,
  FlaskConical,
  Upload,
  Trash2,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  Eye,
} from 'lucide-react'

type PageState = 'loading' | 'ready' | 'empty' | 'importing' | 'error'

interface Dataset {
  id: number
  name: string
  description: string
  records: number
  version: string
  schema: number
  created: string
}

const MOCK_DATASETS: Dataset[] = [
  { id: 1, name: 'FragranceDB-v3', description: 'Master fragrance composition database', records: 15420, version: '3.1.0', schema: 24, created: '2026-06-01' },
  { id: 2, name: 'MarketData-2026', description: 'Market pricing and consumer preference data', records: 8900, version: '1.2.0', schema: 18, created: '2026-05-15' },
  { id: 3, name: 'StabilityTestSet-v2', description: 'Accelerated stability test results', records: 4300, version: '2.0.1', schema: 12, created: '2026-04-20' },
  { id: 4, name: 'IFRA-51st', description: 'IFRA 51st Amendment compliance dataset', records: 2100, version: '1.0.0', schema: 8, created: '2026-06-10' },
  { id: 5, name: 'AccordLibrary-v1', description: 'Accord formulation templates', records: 620, version: '1.1.0', schema: 15, created: '2026-03-10' },
]

export default function DatasetsPage() {
  const [pageState, setPageState] = useState<PageState>('loading')
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [importProgress, setImportProgress] = useState(0)
  const [importFileName, setImportFileName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false
    setTimeout(() => {
      if (cancelled) return
      setDatasets(MOCK_DATASETS)
      setPageState(datasets.length === 0 && !cancelled ? 'empty' : 'ready')
    }, 1000)
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleUpload() {
    fileInputRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setPageState('importing')
    setImportFileName(file.name)
    setImportProgress(0)

    const interval = setInterval(() => {
      setImportProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          return 100
        }
        return p + Math.random() * 12 + 3
      })
    }, 300)

    setTimeout(() => {
      clearInterval(interval)
      setImportProgress(100)
      setTimeout(() => {
        const newDataset: Dataset = {
          id: Date.now(),
          name: file.name.replace(/\.[^/.]+$/, ''),
          description: 'Imported dataset',
          records: Math.floor(Math.random() * 5000) + 100,
          version: '1.0.0',
          schema: Math.floor(Math.random() * 20) + 5,
          created: new Date().toISOString().split('T')[0],
        }
        setDatasets((prev) => [newDataset, ...prev])
        setPageState('ready')
      }, 500)
    }, 3000)
  }

  function handleDelete(id: number) {
    setDatasets((prev) => prev.filter((d) => d.id !== id))
  }

  if (pageState === 'loading') {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading datasets...</p>
        </div>
      </div>
    )
  }

  if (pageState === 'error') {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <p className="text-lg font-medium">Failed to load datasets</p>
            <p className="text-sm text-muted-foreground text-center">Could not connect to the dataset registry.</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Database className="h-7 w-7" /> Dataset Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage training and evaluation datasets
          </p>
        </div>
        <div className="flex items-center gap-3">
          {pageState === 'importing' && (
            <Badge variant="warning" className="animate-pulse">
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              Importing {importFileName}...
            </Badge>
          )}
          <Button onClick={handleUpload} disabled={pageState === 'importing'}>
            <Upload className="mr-2 h-4 w-4" /> Upload Dataset
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.json,.parquet,.xlsx"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {pageState === 'importing' && (
        <Card>
          <CardContent className="pt-6 pb-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">{importFileName}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {Math.round(importProgress)}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${importProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {importProgress < 100
                  ? 'Validating schema and ingesting records...'
                  : 'Import complete!'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {pageState === 'empty' && datasets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 pt-16 pb-16">
            <Database className="h-20 w-20 text-muted-foreground/30" />
            <p className="text-xl font-medium">No datasets found</p>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Upload a CSV, JSON, Parquet, or Excel file to get started. Datasets are versioned and schema-validated automatically.
            </p>
            <Button onClick={handleUpload}>
              <Upload className="mr-2 h-4 w-4" /> Upload Your First Dataset
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dataset Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Schema</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {datasets.map((ds) => (
                  <TableRow key={ds.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                      {ds.name}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {ds.description}
                    </TableCell>
                    <TableCell>{ds.records.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{ds.version}</Badge>
                    </TableCell>
                    <TableCell>{ds.schema} columns</TableCell>
                    <TableCell>{ds.created}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(ds.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Delete</span>
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
    </div>
  )
}
