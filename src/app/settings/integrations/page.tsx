'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  AlertCircle,
  Loader2,
  RefreshCw,
  CheckCircle,
  XCircle,
  Wifi,
  WifiOff,
  Database,
  Cloud,
  Warehouse,
  ShoppingCart,
  Link,
  Unlink,
  RefreshCw as SyncIcon,
} from 'lucide-react'

type IntegrationStatus = 'connected' | 'disconnected' | 'error' | 'syncing'

interface Integration {
  id: number
  name: string
  description: string
  icon: typeof Database
  status: IntegrationStatus
  lastSync: string | null
}

const MOCK_INTEGRATIONS: Integration[] = [
  { id: 1, name: 'ERP System', description: 'SAP S/4HANA — Materials, inventory, procurement', icon: Database, status: 'connected', lastSync: '2026-06-29 09:30' },
  { id: 2, name: 'LIMS', description: 'LabWare LIMS — Quality test results, batch records', icon: Warehouse, status: 'connected', lastSync: '2026-06-29 08:15' },
  { id: 3, name: 'Cloud Storage', description: 'AWS S3 — Document storage, SDS files', icon: Cloud, status: 'error', lastSync: '2026-06-28 14:00' },
  { id: 4, name: 'Data Warehouse', description: 'Snowflake — Analytics, reporting, dashboards', icon: Warehouse, status: 'disconnected', lastSync: null },
  { id: 5, name: 'Marketplace', description: 'Perfumer\'s Marketplace — Supplier catalog sync', icon: ShoppingCart, status: 'syncing', lastSync: '2026-06-29 09:00' },
]

type PageState = 'loading' | 'ready' | 'empty' | 'error'

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [pageState, setPageState] = useState<PageState>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntegrations(MOCK_INTEGRATIONS)
      setPageState('ready')
    }, 900)
    return () => clearTimeout(timer)
  }, [])

  const handleConnect = (id: number) => {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status: 'connected', lastSync: new Date().toLocaleString() } : i))
  }

  const handleDisconnect = (id: number) => {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status: 'disconnected', lastSync: null } : i))
  }

  const handleSync = (id: number) => {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status: 'syncing' } : i))
    setTimeout(() => {
      setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status: 'connected', lastSync: new Date().toLocaleString() } : i))
    }, 2000)
  }

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">Integrations</h1>
            <p className="text-sm text-muted-foreground">Connect external systems and services</p>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Loading Integrations</CardTitle>
              <CardDescription>Fetching integration statuses...</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
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
            <h1 className="text-2xl font-bold">Integrations</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <p className="text-red-600 mb-2 font-semibold">Failed to Load Integrations</p>
              <p className="text-muted-foreground mb-6">{error || 'Connection error.'}</p>
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
            <h1 className="text-2xl font-bold">Integrations</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <Link className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No integrations configured yet.</p>
              <Button>Browse Available Integrations</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const statusIcon = (status: IntegrationStatus) => {
    switch (status) {
      case 'connected': return <Wifi className="h-4 w-4 text-green-600" />
      case 'disconnected': return <WifiOff className="h-4 w-4 text-muted-foreground" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'syncing': return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
    }
  }

  const statusBadge = (status: IntegrationStatus) => {
    switch (status) {
      case 'connected': return <Badge variant="success"><CheckCircle className="h-3 w-3 mr-1" /> Connected</Badge>
      case 'disconnected': return <Badge variant="secondary"><XCircle className="h-3 w-3 mr-1" /> Disconnected</Badge>
      case 'error': return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" /> Error</Badge>
      case 'syncing': return <Badge variant="default"><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Syncing</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Integrations</h1>
          <p className="text-sm text-muted-foreground">Connect external systems and services</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-3xl">
        <div className="grid gap-4">
          {integrations.map(int => {
            const Icon = int.icon
            return (
              <Card key={int.id}>
                <CardContent className="py-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        'h-10 w-10 rounded-lg flex items-center justify-center',
                        int.status === 'connected' ? 'bg-green-100' : int.status === 'error' ? 'bg-red-100' : int.status === 'syncing' ? 'bg-blue-100' : 'bg-gray-100 dark:bg-gray-800',
                      )}>
                        <Icon className={cn(
                          'h-5 w-5',
                          int.status === 'connected' ? 'text-green-700' : int.status === 'error' ? 'text-red-700' : int.status === 'syncing' ? 'text-blue-700' : 'text-gray-500',
                        )} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{int.name}</h3>
                          {statusBadge(int.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{int.description}</p>
                        {int.lastSync && (
                          <p className="text-xs text-muted-foreground">Last sync: {int.lastSync}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {int.status === 'connected' && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleSync(int.id)} disabled={false}>
                            <SyncIcon className="h-4 w-4 mr-1" />
                            Sync
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDisconnect(int.id)}>
                            <Unlink className="h-4 w-4 mr-1" />
                            Disconnect
                          </Button>
                        </>
                      )}
                      {int.status === 'disconnected' && (
                        <Button size="sm" onClick={() => handleConnect(int.id)}>
                          <Link className="h-4 w-4 mr-1" />
                          Connect
                        </Button>
                      )}
                      {int.status === 'error' && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleSync(int.id)}>
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Retry
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDisconnect(int.id)}>
                            <Unlink className="h-4 w-4 mr-1" />
                            Disconnect
                          </Button>
                        </>
                      )}
                      {int.status === 'syncing' && (
                        <Button size="sm" variant="outline" disabled>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          Syncing...
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
