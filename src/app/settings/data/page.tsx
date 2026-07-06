'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  AlertCircle,
  Loader2,
  RefreshCw,
  HardDrive,
  Upload,
  Archive,
  RotateCcw,
  FileUp,
  Download,
  Save,
  CheckCircle,
} from 'lucide-react'

const RETENTION_OPTIONS = [
  { value: '30', label: '30 days' },
  { value: '60', label: '60 days' },
  { value: '90', label: '90 days' },
  { value: '180', label: '180 days' },
  { value: '365', label: '365 days' },
]

type PageState = 'loading' | 'ready' | 'importing' | 'error'

export default function DataManagementPage() {
  const [pageState, setPageState] = useState<PageState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [storageUsed, setStorageUsed] = useState(45)
  const [storageTotal, setStorageTotal] = useState(100)
  const [retentionDays, setRetentionDays] = useState('90')
  const [importingIfra, setImportingIfra] = useState(false)
  const [importingMaterials, setImportingMaterials] = useState(false)
  const [savingRetention, setSavingRetention] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageState('ready')
    }, 900)
    return () => clearTimeout(timer)
  }, [])

  const handleImportIfra = () => {
    setImportingIfra(true)
    setTimeout(() => {
      setImportingIfra(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 2500)
  }

  const handleImportMaterials = () => {
    setImportingMaterials(true)
    setTimeout(() => {
      setImportingMaterials(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 2500)
  }

  const handleSaveRetention = () => {
    setSavingRetention(true)
    setTimeout(() => {
      setSavingRetention(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 600)
  }

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">Data Management</h1>
            <p className="text-sm text-muted-foreground">Storage, imports, and data lifecycle</p>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Loading Data</CardTitle>
              <CardDescription>Fetching storage information...</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
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
            <h1 className="text-2xl font-bold">Data Management</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <p className="text-red-600 mb-2 font-semibold">Failed to Load Data</p>
              <p className="text-muted-foreground mb-6">{error || 'Server error.'}</p>
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

  const storagePct = Math.round((storageUsed / storageTotal) * 100)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Data Management</h1>
          <p className="text-sm text-muted-foreground">Storage, imports, and data lifecycle</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-2xl">
        {saved && (
          <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Operation completed successfully
          </div>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Storage Usage</CardTitle>
            <CardDescription>Current storage consumption across all data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-3">
              <HardDrive className="h-8 w-8 text-muted-foreground" />
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{storageUsed} GB used</span>
                  <span className="text-muted-foreground">{storageTotal} GB total</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      storagePct > 90 ? 'bg-red-500' : storagePct > 70 ? 'bg-yellow-500' : 'bg-blue-500',
                    )}
                    style={{ width: `${storagePct}%` }}
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {storagePct}% capacity used
              {storagePct > 80 && ' — Consider archiving old data or upgrading your plan'}
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Data Retention</CardTitle>
            <CardDescription>Configure how long data is kept before automatic cleanup</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Retention Period</p>
                <p className="text-xs text-muted-foreground">Automatic data cleanup policy</p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={retentionDays} onValueChange={setRetentionDays}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RETENTION_OPTIONS.map(o => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="sm" onClick={handleSaveRetention} disabled={savingRetention}>
                  {savingRetention ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Bulk Import</CardTitle>
            <CardDescription>Import data from external sources</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-3">
                <FileUp className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Import IFRA Updates</p>
                  <p className="text-xs text-muted-foreground">Upload latest IFRA standards amendment file</p>
                </div>
              </div>
              <Button size="sm" onClick={handleImportIfra} disabled={importingIfra}>
                {importingIfra ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Upload className="h-4 w-4 mr-1" />}
                {importingIfra ? 'Importing...' : 'Import'}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-3">
                <FileUp className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Import Material Catalog</p>
                  <p className="text-xs text-muted-foreground">Upload supplier material catalog CSV/XLSX</p>
                </div>
              </div>
              <Button size="sm" onClick={handleImportMaterials} disabled={importingMaterials}>
                {importingMaterials ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Upload className="h-4 w-4 mr-1" />}
                {importingMaterials ? 'Importing...' : 'Import'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Archive & Restore</CardTitle>
            <CardDescription>Manage archived data and restore when needed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-3">
                <Archive className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Archive Old Formulas</p>
                  <p className="text-xs text-muted-foreground">Move formulas older than retention period to cold storage</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                <Archive className="h-4 w-4 mr-1" />
                Archive Now
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Restore from Archive</p>
                  <p className="text-xs text-muted-foreground">Browse and restore archived data</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" />
                Browse Archive
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
