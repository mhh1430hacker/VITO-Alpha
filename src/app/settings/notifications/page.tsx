'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  AlertCircle,
  Loader2,
  RefreshCw,
  Save,
  CheckCircle,
  Bell,
  BellOff,
  Mail,
  MessageSquare,
  Clock,
} from 'lucide-react'

interface NotificationEvent {
  key: string
  label: string
  inApp: boolean
  email: boolean
  slack: boolean
}

const EVENTS: NotificationEvent[] = [
  { key: 'ifra_violation', label: 'IFRA Violation', inApp: true, email: true, slack: true },
  { key: 'model_complete', label: 'Model Complete', inApp: true, email: false, slack: true },
  { key: 'prediction_ready', label: 'Prediction Ready', inApp: true, email: false, slack: false },
  { key: 'material_shortage', label: 'Material Shortage', inApp: true, email: true, slack: true },
  { key: 'certificate_expiry', label: 'Certificate Expiry', inApp: true, email: true, slack: false },
  { key: 'contract_expiry', label: 'Contract Expiry', inApp: true, email: true, slack: false },
  { key: 'regulation_update', label: 'Regulation Update', inApp: true, email: true, slack: true },
  { key: 'quality_incident', label: 'Quality Incident', inApp: true, email: true, slack: true },
  { key: 'project_milestone', label: 'Project Milestone', inApp: true, email: false, slack: false },
]

type PageState = 'loading' | 'ready' | 'error'

export default function NotificationsPage() {
  const [pageState, setPageState] = useState<PageState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [events, setEvents] = useState<NotificationEvent[]>([])
  const [quietHoursStart, setQuietHoursStart] = useState('22:00')
  const [quietHoursEnd, setQuietHoursEnd] = useState('07:00')
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setEvents(EVENTS)
      setPageState('ready')
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const toggleEvent = (key: string, channel: 'inApp' | 'email' | 'slack') => {
    setEvents(prev => prev.map(e =>
      e.key === key ? { ...e, [channel]: !e[channel] } : e
    ))
  }

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 800)
  }

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">Notification Preferences</h1>
            <p className="text-sm text-muted-foreground">Configure how you receive alerts</p>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Loading Preferences</CardTitle>
              <CardDescription>Loading notification settings...</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-10 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
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
            <h1 className="text-2xl font-bold">Notification Preferences</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <p className="text-red-600 mb-2 font-semibold">Failed to Load Preferences</p>
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Notification Preferences</h1>
          <p className="text-sm text-muted-foreground">Configure how you receive alerts</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-3xl">
        {saved && (
          <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Notification preferences saved
          </div>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Event Notifications</CardTitle>
            <CardDescription>Toggle notification channels per event type</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-medium text-muted-foreground px-4 py-3">Event</th>
                    <th className="text-center font-medium text-muted-foreground px-4 py-3">
                      <Bell className="h-4 w-4 inline" /> In-App
                    </th>
                    <th className="text-center font-medium text-muted-foreground px-4 py-3">
                      <Mail className="h-4 w-4 inline" /> Email
                    </th>
                    <th className="text-center font-medium text-muted-foreground px-4 py-3">
                      <MessageSquare className="h-4 w-4 inline" /> Slack/Teams
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {events.map(e => (
                    <tr key={e.key} className="border-b last:border-0">
                      <td className="px-4 py-3 font-medium">{e.label}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          className={cn(
                            'h-6 w-10 rounded-full transition-colors relative',
                            e.inApp ? 'bg-blue-600' : 'bg-gray-300',
                          )}
                          onClick={() => toggleEvent(e.key, 'inApp')}
                        >
                          <div className={cn(
                            'h-5 w-5 rounded-full bg-white dark:bg-gray-900 absolute top-0.5 transition-transform shadow-sm',
                            e.inApp ? 'translate-x-4' : 'translate-x-0.5',
                          )} />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          className={cn(
                            'h-6 w-10 rounded-full transition-colors relative',
                            e.email ? 'bg-blue-600' : 'bg-gray-300',
                          )}
                          onClick={() => toggleEvent(e.key, 'email')}
                        >
                          <div className={cn(
                            'h-5 w-5 rounded-full bg-white dark:bg-gray-900 absolute top-0.5 transition-transform shadow-sm',
                            e.email ? 'translate-x-4' : 'translate-x-0.5',
                          )} />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          className={cn(
                            'h-6 w-10 rounded-full transition-colors relative',
                            e.slack ? 'bg-blue-600' : 'bg-gray-300',
                          )}
                          onClick={() => toggleEvent(e.key, 'slack')}
                        >
                          <div className={cn(
                            'h-5 w-5 rounded-full bg-white dark:bg-gray-900 absolute top-0.5 transition-transform shadow-sm',
                            e.slack ? 'translate-x-4' : 'translate-x-0.5',
                          )} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quiet Hours</CardTitle>
            <CardDescription>Suppress notifications during specified hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Enable Quiet Hours</p>
                  <p className="text-xs text-muted-foreground">Mute notifications during off-hours</p>
                </div>
              </div>
              <button
                className={cn(
                  'h-6 w-10 rounded-full transition-colors relative',
                  quietHoursEnabled ? 'bg-blue-600' : 'bg-gray-300',
                )}
                onClick={() => setQuietHoursEnabled(!quietHoursEnabled)}
              >
                <div className={cn(
                  'h-5 w-5 rounded-full bg-white dark:bg-gray-900 absolute top-0.5 transition-transform shadow-sm',
                  quietHoursEnabled ? 'translate-x-4' : 'translate-x-0.5',
                )} />
              </button>
            </div>
            {quietHoursEnabled && (
              <div className="flex items-center gap-4 pl-8">
                <div>
                  <Label htmlFor="quiet-start" className="text-xs">From</Label>
                  <Input id="quiet-start" type="time" value={quietHoursStart} onChange={e => setQuietHoursStart(e.target.value)} className="w-32" />
                </div>
                <span className="text-muted-foreground mt-5">to</span>
                <div>
                  <Label htmlFor="quiet-end" className="text-xs">To</Label>
                  <Input id="quiet-end" type="time" value={quietHoursEnd} onChange={e => setQuietHoursEnd(e.target.value)} className="w-32" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            {saving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </main>
    </div>
  )
}
