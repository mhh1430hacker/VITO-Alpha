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
  FileText,
  Download,
  Eye,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  FileBarChart,
  Repeat,
  Play,
} from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
  icon: React.ElementType
}

interface GeneratedReport {
  id: number
  name: string
  template: string
  format: string
  generatedAt: string
  status: 'ready' | 'generating'
  size: string
}

const TEMPLATES: Template[] = [
  { id: 'formula-summary', name: 'Formula Summary', description: 'Overview of all formulas with key metrics', icon: FileBarChart },
  { id: 'compliance-report', name: 'Compliance Report', description: 'IFRA, REACH, and CLP compliance status', icon: FileText },
  { id: 'performance-overview', name: 'Performance Overview', description: 'Quality scores, costs, and success rates', icon: FileSpreadsheet },
  { id: 'custom', name: 'Custom Report', description: 'Build your own report with custom parameters', icon: FileBarChart },
]

const PREVIOUS_REPORTS: GeneratedReport[] = [
  { id: 1, name: 'Q2 2026 Compliance Report', template: 'Compliance Report', format: 'PDF', generatedAt: '2026-06-28 14:30', status: 'ready', size: '2.4 MB' },
  { id: 2, name: 'June Formula Summary', template: 'Formula Summary', format: 'CSV', generatedAt: '2026-06-27 09:00', status: 'ready', size: '1.1 MB' },
  { id: 3, name: 'H1 Performance Overview', template: 'Performance Overview', format: 'PDF', generatedAt: '2026-06-25 16:45', status: 'ready', size: '4.7 MB' },
  { id: 4, name: 'IFRA Violation Report', template: 'Custom Report', format: 'HTML', generatedAt: '2026-06-20 11:15', status: 'ready', size: '0.8 MB' },
]

type PageState = 'loading' | 'ready' | 'generating' | 'empty' | 'error'

export default function ReportsPage() {
  const [pageState, setPageState] = useState<PageState>('loading')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [scheduleRecurring, setScheduleRecurring] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [reports, setReports] = useState<GeneratedReport[]>(PREVIOUS_REPORTS)

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageState('ready')
    }, 900)
    return () => clearTimeout(timer)
  }, [])

  const handleGenerate = () => {
    setPageState('generating')
    setGenerationProgress(0)
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          const newReport: GeneratedReport = {
            id: reports.length + 1,
            name: `${selectedTemplate === 'formula-summary' ? 'Formula Summary' : selectedTemplate === 'compliance-report' ? 'Compliance Report' : selectedTemplate === 'performance-overview' ? 'Performance Overview' : 'Custom Report'} - ${new Date().toLocaleDateString()}`,
            template: selectedTemplate ? TEMPLATES.find(t => t.id === selectedTemplate)?.name || 'Report' : 'Report',
            format: 'PDF',
            generatedAt: new Date().toLocaleString(),
            status: 'ready',
            size: '1.2 MB',
          }
          setReports(prev => [newReport, ...prev])
          setPageState('ready')
          return 100
        }
        return prev + 20
      })
    }, 600)
  }

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">Report Builder</h1>
            <p className="text-sm text-muted-foreground">Generate custom compliance and performance reports</p>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="py-8">
                  <div className="h-20 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardContent className="py-8">
              <div className="h-48 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
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
            <h1 className="text-2xl font-bold">Report Builder</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <FileWarning className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No reports generated yet. Use the template selector above to create your first report.</p>
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
            <h1 className="text-2xl font-bold">Report Builder</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <p className="text-red-600 mb-2 font-semibold">Failed to Load Report Builder</p>
              <p className="text-muted-foreground mb-6">An error occurred while initializing the report builder.</p>
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
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Report Builder</h1>
          <p className="text-sm text-muted-foreground">Generate custom compliance and performance reports</p>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        <h2 className="text-sm font-semibold text-muted-foreground mb-4">SELECT TEMPLATE</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {TEMPLATES.map(t => {
            const Icon = t.icon
            const isSelected = selectedTemplate === t.id
            return (
              <Card
                key={t.id}
                className={cn(
                  'cursor-pointer transition-all hover:border-primary',
                  isSelected && 'border-primary ring-1 ring-primary',
                )}
                onClick={() => setSelectedTemplate(t.id)}
              >
                <CardContent className="py-4 text-center">
                  <Icon className={cn('h-8 w-8 mx-auto mb-2', isSelected ? 'text-primary' : 'text-muted-foreground')} />
                  <h3 className="font-semibold text-sm">{t.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{t.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {selectedTemplate && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-sm">Report Configuration</CardTitle>
              <CardDescription>Configure your {TEMPLATES.find(t => t.id === selectedTemplate)?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Date Range</label>
                  <div className="flex items-center gap-2">
                    <Input type="date" className="w-full text-xs" defaultValue="2026-01-01" />
                    <span className="text-xs">to</span>
                    <Input type="date" className="w-full text-xs" defaultValue="2026-06-29" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Data Source</label>
                  <Select defaultValue="all">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Formulas</SelectItem>
                      <SelectItem value="active">Active Only</SelectItem>
                      <SelectItem value="archived">Archived Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Format</label>
                  <Select defaultValue="PDF">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="CSV">CSV</SelectItem>
                      <SelectItem value="HTML">HTML</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Button
                  variant={scheduleRecurring ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setScheduleRecurring(!scheduleRecurring)}
                >
                  <Repeat className="h-4 w-4 mr-1" />
                  Recurring
                </Button>
                {scheduleRecurring && (
                  <Select defaultValue="monthly">
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <Button onClick={handleGenerate}>
                <Play className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        )}

        {pageState === 'generating' && (
          <Card className="mb-8 border-blue-400">
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-700">Generating Report...</p>
                  <div className="w-full bg-blue-100 rounded-full h-2 mt-2">
                    <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${generationProgress}%` }} />
                  </div>
                </div>
                <span className="text-xs text-blue-600 font-mono">{generationProgress}%</span>
              </div>
            </CardContent>
          </Card>
        )}

        <Separator className="my-6" />
        <h2 className="text-sm font-semibold text-muted-foreground mb-4">PREVIOUSLY GENERATED</h2>

        {reports.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No reports generated yet.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Generated</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map(r => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell className="text-xs">{r.template}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{r.format}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{r.generatedAt}</TableCell>
                      <TableCell className="text-xs">{r.size}</TableCell>
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
