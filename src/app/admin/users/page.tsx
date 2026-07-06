'use client'

import { useEffect, useState, useCallback } from 'react'
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
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import {
  AlertCircle,
  Loader2,
  RefreshCw,
  UserPlus,
  Pencil,
  Trash2,
  Ban,
  CheckCircle,
  XCircle,
  Mail,
  Users,
  X,
} from 'lucide-react'

interface User {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  last_login: string
}

const MOCK_USERS: User[] = [
  { id: 1, name: 'Maria Chen', email: 'maria@perfume.com', role: 'master_perfumer', status: 'active', last_login: '2026-06-28' },
  { id: 2, name: 'James Wilson', email: 'james@perfume.com', role: 'quality_manager', status: 'active', last_login: '2026-06-29' },
  { id: 3, name: 'Sophie Lambert', email: 'sophie@perfume.com', role: 'compliance_officer', status: 'inactive', last_login: '2026-06-15' },
  { id: 4, name: 'Raj Patel', email: 'raj@perfume.com', role: 'supply_chain', status: 'active', last_login: '2026-06-28' },
  { id: 5, name: 'Anna Kowalski', email: 'anna@perfume.com', role: 'master_perfumer', status: 'active', last_login: '2026-06-27' },
  { id: 6, name: 'Liam O\'Brien', email: 'liam@perfume.com', role: 'admin', status: 'active', last_login: '2026-06-29' },
  { id: 7, name: 'Yuki Tanaka', email: 'yuki@perfume.com', role: 'r_d_scientist', status: 'inactive', last_login: '2026-05-20' },
  { id: 8, name: 'Carlos Mendez', email: 'carlos@perfume.com', role: 'sales', status: 'active', last_login: '2026-06-26' },
]

const ROLE_OPTIONS = ['admin', 'master_perfumer', 'r_d_scientist', 'quality_manager', 'compliance_officer', 'supply_chain', 'sales']

const ROLE_BADGE: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  admin: 'destructive',
  master_perfumer: 'default',
  r_d_scientist: 'secondary',
  quality_manager: 'outline',
  compliance_officer: 'secondary',
  supply_chain: 'outline',
  sales: 'default',
}

type PageState = 'loading' | 'ready' | 'empty' | 'error'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [pageState, setPageState] = useState<PageState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('')
  const [inviting, setInviting] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setUsers(MOCK_USERS)
      setPageState('ready')
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }, [])

  const handleInvite = () => {
    if (!inviteEmail || !inviteRole) return
    setInviting(true)
    setTimeout(() => {
      const newUser: User = {
        id: users.length + 1,
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: inviteRole,
        status: 'inactive',
        last_login: '-',
      }
      setUsers(prev => [newUser, ...prev])
      setInviting(false)
      setInviteOpen(false)
      setInviteEmail('')
      setInviteRole('')
      showToast(`Invitation sent to ${inviteEmail}`)
    }, 1200)
  }

  const handleDisable = (id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u))
    showToast('User status updated')
  }

  const handleDelete = (id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id))
    showToast('User removed')
  }

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-sm text-muted-foreground">Manage system users and their access</p>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Loading Users</CardTitle>
              <CardDescription>Fetching user records...</CardDescription>
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
            <h1 className="text-2xl font-bold">User Management</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <p className="text-red-600 mb-2 font-semibold">Failed to Load Users</p>
              <p className="text-muted-foreground mb-6">{error || 'Unable to connect to the server.'}</p>
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
              <h1 className="text-2xl font-bold">User Management</h1>
            </div>
            <Button onClick={() => setInviteOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite User
            </Button>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No users found. Invite your first user.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const activeCount = users.filter(u => u.status === 'active').length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg text-sm flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          {toast}
        </div>
      )}

      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Invite User</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => { setInviteOpen(false); setInviteEmail(''); setInviteRole('') }}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>Send an invitation to join the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invite-email">Email Address</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="user@company.com"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invite-role">Role</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger id="invite-role"><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map(r => (
                      <SelectItem key={r} value={r}>{r.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleInvite} disabled={!inviteEmail || !inviteRole || inviting}>
                {inviting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Mail className="h-4 w-4 mr-2" />}
                {inviting ? 'Sending...' : 'Send Invitation'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-sm text-muted-foreground">{activeCount} active users</p>
          </div>
          <Button onClick={() => setInviteOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite User
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(u => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <Badge variant={ROLE_BADGE[u.role] || 'secondary'}>
                        {u.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.status === 'active' ? 'success' : 'secondary'}>
                        {u.status === 'active' ? (
                          <><CheckCircle className="h-3 w-3 mr-1 inline" /> Active</>
                        ) : (
                          <><XCircle className="h-3 w-3 mr-1 inline" /> Inactive</>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{u.last_login}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" title="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" title={u.status === 'active' ? 'Disable' : 'Enable'} onClick={() => handleDisable(u.id)}>
                          <Ban className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" title="Delete" onClick={() => handleDelete(u.id)}>
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
