'use client'

import { useEffect, useState, useCallback } from 'react'
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
  RefreshCw,
  Key,
  Plus,
  X,
  Copy,
  Trash2,
  Ban,
  CheckCircle,
} from 'lucide-react'

interface ApiKey {
  id: number
  name: string
  prefix: string
  created: string
  lastUsed: string
  status: 'active' | 'revoked'
  permissions: string[]
}

const PERMISSION_OPTIONS = ['read:formulas', 'write:formulas', 'read:materials', 'write:materials', 'read:compliance', 'write:compliance', 'read:users', 'admin']

const MOCK_KEYS: ApiKey[] = [
  { id: 1, name: 'Production API Key', prefix: 'pk_prod_a1b2c3d4', created: '2026-01-15', lastUsed: '2026-06-29 09:30', status: 'active', permissions: ['read:formulas', 'read:materials'] },
  { id: 2, name: 'CI/CD Pipeline', prefix: 'pk_cicd_e5f6g7h8', created: '2026-03-01', lastUsed: '2026-06-28 22:15', status: 'active', permissions: ['read:formulas', 'write:formulas', 'read:materials'] },
  { id: 3, name: 'Legacy Integration', prefix: 'pk_legacy_i9j0k1l2', created: '2025-06-01', lastUsed: '2026-04-15', status: 'revoked', permissions: ['read:compliance'] },
  { id: 4, name: 'Partner Access', prefix: 'pk_part_m3n4o5p6', created: '2026-04-10', lastUsed: '2026-06-29 08:00', status: 'active', permissions: ['read:formulas', 'read:compliance', 'read:materials'] },
  { id: 5, name: 'Analytics Service', prefix: 'pk_anly_q7r8s9t0', created: '2026-05-20', lastUsed: '2026-06-27 14:45', status: 'active', permissions: ['read:formulas'] },
]

type PageState = 'loading' | 'ready' | 'empty' | 'error'

export default function AdminApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [pageState, setPageState] = useState<PageState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [genOpen, setGenOpen] = useState(false)
  const [genName, setGenName] = useState('')
  const [genPerms, setGenPerms] = useState<string[]>([])
  const [generating, setGenerating] = useState(false)
  const [newKeyValue, setNewKeyValue] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setKeys(MOCK_KEYS)
      setPageState('ready')
    }, 900)
    return () => clearTimeout(timer)
  }, [])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }, [])

  const togglePerm = (perm: string) => {
    setGenPerms(prev => prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm])
  }

  const handleGenerate = () => {
    if (!genName || genPerms.length === 0) return
    setGenerating(true)
    setTimeout(() => {
      const generatedKey = `pk_${genName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Math.random().toString(36).substring(2, 10)}`
      const newKey: ApiKey = {
        id: keys.length + 1,
        name: genName,
        prefix: generatedKey.substring(0, 16),
        created: new Date().toISOString().split('T')[0],
        lastUsed: '-',
        status: 'active',
        permissions: genPerms,
      }
      setKeys(prev => [newKey, ...prev])
      setNewKeyValue(generatedKey)
      setGenerating(false)
      showToast('API key generated successfully')
    }, 1200)
  }

  const handleRevoke = (id: number) => {
    setKeys(prev => prev.map(k => k.id === id ? { ...k, status: 'revoked' } : k))
    showToast('API key revoked')
  }

  const handleDelete = (id: number) => {
    setKeys(prev => prev.filter(k => k.id !== id))
    showToast('API key deleted')
  }

  const copyToClipboard = (val: string) => {
    navigator.clipboard?.writeText(val)
    showToast('Copied to clipboard')
  }

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">API Key Management</h1>
            <p className="text-sm text-muted-foreground">Manage API keys for programmatic access</p>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Loading API Keys</CardTitle>
              <CardDescription>Fetching API keys...</CardDescription>
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
            <h1 className="text-2xl font-bold">API Key Management</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <p className="text-red-600 mb-2 font-semibold">Failed to Load API Keys</p>
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
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">API Key Management</h1>
            </div>
            <Button onClick={() => setGenOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Generate Key
            </Button>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <Key className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No API keys generated yet.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg text-sm flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          {toast}
        </div>
      )}

      {genOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-lg mx-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Generate API Key</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => { setGenOpen(false); setGenName(''); setGenPerms([]); setNewKeyValue(null) }}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>Create a new API key for external integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {newKeyValue ? (
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 border border-green-200 rounded text-sm">
                    <p className="font-medium text-green-800 mb-1">Key generated successfully</p>
                    <p className="text-xs text-green-700 mb-2">Copy this key now. You won't be able to see it again.</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-white dark:bg-gray-900 border rounded px-2 py-1 text-xs font-mono break-all">{newKeyValue}</code>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(newKeyValue)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline" onClick={() => { setGenOpen(false); setGenName(''); setGenPerms([]); setNewKeyValue(null) }}>
                    Done
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="key-name">Key Name</Label>
                    <Input id="key-name" placeholder="e.g. Production Integration" value={genName} onChange={e => setGenName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Permissions</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {PERMISSION_OPTIONS.map(p => (
                        <label
                          key={p}
                          className={cn(
                            'flex items-center gap-2 p-2 rounded border cursor-pointer text-sm',
                            genPerms.includes(p) ? 'border-blue-300 bg-blue-50' : 'border-gray-200 dark:border-gray-700',
                          )}
                          onClick={() => togglePerm(p)}
                        >
                          <div className={cn('h-3.5 w-3.5 rounded border flex items-center justify-center', genPerms.includes(p) ? 'bg-blue-600 border-blue-600' : 'border-gray-300 dark:border-gray-600')}>
                            {genPerms.includes(p) && <CheckCircle className="h-2.5 w-2.5 text-white" />}
                          </div>
                          {p}
                        </label>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full" onClick={handleGenerate} disabled={!genName || genPerms.length === 0 || generating}>
                    {generating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Key className="h-4 w-4 mr-2" />}
                    {generating ? 'Generating...' : 'Generate Key'}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">API Key Management</h1>
            <p className="text-sm text-muted-foreground">{keys.filter(k => k.status === 'active').length} active keys</p>
          </div>
          <Button onClick={() => setGenOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Generate Key
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key Name</TableHead>
                  <TableHead>Prefix</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map(k => (
                  <TableRow key={k.id}>
                    <TableCell className="font-medium">{k.name}</TableCell>
                    <TableCell className="font-mono text-xs">{k.prefix}...</TableCell>
                    <TableCell className="text-xs">{k.created}</TableCell>
                    <TableCell className="text-xs">{k.lastUsed}</TableCell>
                    <TableCell>
                      <Badge variant={k.status === 'active' ? 'success' : 'secondary'}>
                        {k.status === 'active' ? 'Active' : 'Revoked'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {k.permissions.map(p => (
                          <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {k.status === 'active' && (
                          <Button size="sm" variant="ghost" title="Revoke" onClick={() => handleRevoke(k.id)}>
                            <Ban className="h-4 w-4 text-yellow-500" />
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" title="Delete" onClick={() => handleDelete(k.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
