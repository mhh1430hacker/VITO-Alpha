'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  Save,
  CheckCircle,
  LayoutDashboard,
  Languages,
  Monitor,
  Ruler,
} from 'lucide-react'

const DASHBOARD_OPTIONS = [
  { value: 'executive', label: 'Executive Overview' },
  { value: 'operations', label: 'Operations' },
  { value: 'rd', label: 'R&D Dashboard' },
  { value: 'perfumer', label: 'Perfumer Workspace' },
  { value: 'compliance', label: 'Compliance Dashboard' },
  { value: 'ai', label: 'AI Lab Dashboard' },
]

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'es', label: 'Spanish' },
  { value: 'ja', label: 'Japanese' },
]

type PageState = 'loading' | 'ready' | 'saved' | 'error'

export default function PreferencesPage() {
  const [pageState, setPageState] = useState<PageState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [defaultDashboard, setDefaultDashboard] = useState('executive')
  const [language, setLanguage] = useState('en')
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable')
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageState('ready')
    }, 700)
    return () => clearTimeout(timer)
  }, [])

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setPageState('saved')
      setTimeout(() => setPageState('ready'), 2000)
    }, 800)
  }

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">Preferences</h1>
            <p className="text-sm text-muted-foreground">Customize your experience</p>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Loading Preferences</CardTitle>
              <CardDescription>Loading your settings...</CardDescription>
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
            <h1 className="text-2xl font-bold">Preferences</h1>
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
          <h1 className="text-2xl font-bold">Preferences</h1>
          <p className="text-sm text-muted-foreground">Customize your experience</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-2xl">
        {pageState === 'saved' && (
          <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Preferences saved
          </div>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Interface Preferences</CardTitle>
            <CardDescription>Customize how the application looks and behaves</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Default Dashboard</p>
                  <p className="text-xs text-muted-foreground">Landing page after login</p>
                </div>
              </div>
              <Select value={defaultDashboard} onValueChange={setDefaultDashboard}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DASHBOARD_OPTIONS.map(o => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Languages className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Language</p>
                  <p className="text-xs text-muted-foreground">UI language preference</p>
                </div>
              </div>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGE_OPTIONS.map(o => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Density</p>
                  <p className="text-xs text-muted-foreground">Controls spacing in tables and lists</p>
                </div>
              </div>
              <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
                <button
                  className={cn('px-3 py-1.5 text-sm rounded-md transition-colors', density === 'comfortable' ? 'bg-white dark:bg-gray-900 shadow-sm font-medium' : 'text-muted-foreground')}
                  onClick={() => setDensity('comfortable')}
                >
                  Comfortable
                </button>
                <button
                  className={cn('px-3 py-1.5 text-sm rounded-md transition-colors', density === 'compact' ? 'bg-white dark:bg-gray-900 shadow-sm font-medium' : 'text-muted-foreground')}
                  onClick={() => setDensity('compact')}
                >
                  Compact
                </button>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Ruler className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Units</p>
                  <p className="text-xs text-muted-foreground">Measurement system</p>
                </div>
              </div>
              <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
                <button
                  className={cn('px-3 py-1.5 text-sm rounded-md transition-colors', units === 'metric' ? 'bg-white dark:bg-gray-900 shadow-sm font-medium' : 'text-muted-foreground')}
                  onClick={() => setUnits('metric')}
                >
                  Metric
                </button>
                <button
                  className={cn('px-3 py-1.5 text-sm rounded-md transition-colors', units === 'imperial' ? 'bg-white dark:bg-gray-900 shadow-sm font-medium' : 'text-muted-foreground')}
                  onClick={() => setUnits('imperial')}
                >
                  Imperial
                </button>
              </div>
            </div>
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
