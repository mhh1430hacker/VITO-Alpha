'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  CheckCircle2,
  Bell,
  BellOff,
  Info,
} from 'lucide-react'

type AlertType = 'IFRA' | 'REACH' | 'CLP' | 'General'
type Severity = 'critical' | 'warning' | 'info'
type AlertStatus = 'new' | 'acknowledged'

interface ComplianceAlert {
  id: number
  type: AlertType
  severity: Severity
  title: string
  description: string
  date: string
  affectedFormulas: number
  status: AlertStatus
}

const MOCK_ALERTS: ComplianceAlert[] = [
  {
    id: 1, type: 'IFRA', severity: 'critical', status: 'new',
    title: 'Musk Ketone exceeds IFRA limit in 3 formulas',
    description: 'Musk Ketone concentration exceeds the 0.5% maximum allowed under IFRA 51st Amendment in Amber Wood, Midnight Oud, and Vanilla Dream.',
    date: '2026-06-29T08:00:00Z', affectedFormulas: 3,
  },
  {
    id: 2, type: 'REACH', severity: 'warning', status: 'new',
    title: 'Coumarin REACH registration expiring soon',
    description: 'REACH registration for Coumarin (CAS 91-64-5) will expire on 2027-03-15. Renewal application must be submitted within 90 days.',
    date: '2026-06-28T14:00:00Z', affectedFormulas: 5,
  },
  {
    id: 3, type: 'CLP', severity: 'info', status: 'new',
    title: 'CLP classification update available',
    description: 'The EU has published updates to CLP hazard classifications for 12 substances. Review and update your SDS documentation accordingly.',
    date: '2026-06-27T10:00:00Z', affectedFormulas: 0,
  },
  {
    id: 4, type: 'General', severity: 'critical', status: 'acknowledged',
    title: 'Certificate expiry: CoA for Benzyl Acetate',
    description: 'The Certificate of Analysis for Benzyl Acetate expired on 2025-01-15. A new certificate is required for batch release.',
    date: '2026-06-25T09:00:00Z', affectedFormulas: 8,
  },
  {
    id: 5, type: 'IFRA', severity: 'warning', status: 'new',
    title: 'Limonene restricted usage update',
    description: 'IFRA has updated the restriction for Limonene in leave-on products. Maximum allowed concentration reduced from 2.0% to 1.5%.',
    date: '2026-06-24T16:00:00Z', affectedFormulas: 2,
  },
  {
    id: 6, type: 'REACH', severity: 'info', status: 'acknowledged',
    title: 'SVHC candidate list updated',
    description: 'ECHA has added 5 new substances to the SVHC candidate list. Review your supply chain for these substances.',
    date: '2026-06-20T12:00:00Z', affectedFormulas: 0,
  },
]

const SEVERITY_ICON: Record<Severity, React.ElementType> = {
  critical: AlertCircle,
  warning: AlertCircle,
  info: Info,
}

const SEVERITY_COLOR: Record<Severity, string> = {
  critical: 'text-red-600',
  warning: 'text-yellow-600',
  info: 'text-blue-600',
}

const SEVERITY_BG: Record<Severity, string> = {
  critical: 'bg-red-50 border-red-200',
  warning: 'bg-yellow-50 border-yellow-200',
  info: 'bg-blue-50 border-blue-200',
}

const TYPE_VARIANT: Record<AlertType, 'destructive' | 'warning' | 'default' | 'secondary'> = {
  IFRA: 'destructive',
  REACH: 'warning',
  CLP: 'default',
  General: 'secondary',
}

const ALERT_TYPES: AlertType[] = ['IFRA', 'REACH', 'CLP', 'General']
const SEVERITIES: Severity[] = ['critical', 'warning', 'info']

type PageState = 'loading' | 'ready' | 'empty' | 'error'

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([])
  const [pageState, setPageState] = useState<PageState>('loading')
  const [filterType, setFilterType] = useState('')
  const [filterSeverity, setFilterSeverity] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [acknowledged, setAcknowledged] = useState<Set<number>>(new Set())

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlerts(MOCK_ALERTS)
      setPageState('ready')
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const handleAcknowledge = (id: number) => {
    setAcknowledged(prev => new Set(prev).add(id))
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'acknowledged' } : a))
  }

  const filtered = alerts.filter(a => {
    if (filterType && a.type !== filterType) return false
    if (filterSeverity && a.severity !== filterSeverity) return false
    if (filterStatus && a.status !== filterStatus) return false
    return true
  })

  const newCount = alerts.filter(a => a.status === 'new' && !acknowledged.has(a.id)).length

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">Compliance Alerts</h1>
            <p className="text-sm text-muted-foreground">Real-time compliance monitoring alerts</p>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Loading Alerts</CardTitle>
              <CardDescription>Fetching latest compliance alerts...</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
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
            <h1 className="text-2xl font-bold">Compliance Alerts</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <p className="text-red-600 mb-2 font-semibold">Failed to Load Alerts</p>
              <p className="text-muted-foreground mb-6">Unable to retrieve compliance alerts from the server.</p>
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
            <h1 className="text-2xl font-bold">Compliance Alerts</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card className="border-green-400">
            <CardContent className="py-12 text-center">
              <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-500" />
              <h2 className="text-xl font-bold text-green-700 mb-2">All Clear</h2>
              <p className="text-muted-foreground">No compliance alerts. Everything is up to date.</p>
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
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Compliance Alerts</h1>
              {newCount > 0 && (
                <Badge variant="destructive" className="rounded-full">{newCount} new</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">Real-time compliance monitoring alerts</p>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Select value={filterType} onValueChange={v => setFilterType(v)}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {ALERT_TYPES.map(t => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterSeverity} onValueChange={v => setFilterSeverity(v)}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Severity" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              {SEVERITIES.map(s => (
                <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={v => setFilterStatus(v)}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="acknowledged">Acknowledged</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BellOff className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No alerts match your filters.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filtered.map(a => {
              const SevIcon = SEVERITY_ICON[a.severity]
              return (
                <Card key={a.id} className={cn('border-l-4', SEVERITY_BG[a.severity])}>
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <SevIcon className={cn('h-5 w-5 mt-0.5 shrink-0', SEVERITY_COLOR[a.severity])} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Badge variant={TYPE_VARIANT[a.type]}>{a.type}</Badge>
                            <Badge variant={
                              a.severity === 'critical' ? 'destructive' : a.severity === 'warning' ? 'warning' : 'secondary'
                            }>
                              {a.severity.charAt(0).toUpperCase() + a.severity.slice(1)}
                            </Badge>
                            {a.status === 'new' && !acknowledged.has(a.id) && (
                              <Badge variant="default" className="bg-blue-500">New</Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-sm">{a.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{a.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{new Date(a.date).toLocaleString()}</span>
                            {a.affectedFormulas > 0 && (
                              <span>{a.affectedFormulas} affected formula(s)</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {a.status === 'new' && !acknowledged.has(a.id) ? (
                          <Button size="sm" variant="outline" onClick={() => handleAcknowledge(a.id)}>
                            <Bell className="h-3 w-3 mr-1" />
                            Acknowledge
                          </Button>
                        ) : (
                          <Badge variant="secondary" className="whitespace-nowrap">
                            <BellOff className="h-3 w-3 mr-1" />
                            Acknowledged
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
