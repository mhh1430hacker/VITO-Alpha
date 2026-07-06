'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
  Pencil,
  Copy,
  Shield,
  CheckCheck,
} from 'lucide-react'

interface Role {
  id: number
  name: string
  description: string
  usersCount: number
  permissionsCount: number
}

interface PermissionSection {
  section: string
  permissions: { key: string; label: string; granted: boolean }[]
}

const MOCK_ROLES: Role[] = [
  { id: 1, name: 'Administrator', description: 'Full system access with all permissions', usersCount: 3, permissionsCount: 48 },
  { id: 2, name: 'Master Perfumer', description: 'Create and modify formulations', usersCount: 12, permissionsCount: 32 },
  { id: 3, name: 'R&D Scientist', description: 'Access to lab tools and experiment data', usersCount: 8, permissionsCount: 24 },
  { id: 4, name: 'Quality Manager', description: 'Manage quality checks and certificates', usersCount: 5, permissionsCount: 20 },
  { id: 5, name: 'Compliance Officer', description: 'IFRA, REACH, and regulatory access', usersCount: 4, permissionsCount: 18 },
  { id: 6, name: 'Supply Chain', description: 'Material tracking and supplier management', usersCount: 6, permissionsCount: 15 },
]

const MOCK_PERMISSIONS: PermissionSection[] = [
  {
    section: 'Formulations',
    permissions: [
      { key: 'formula_view', label: 'View Formulas', granted: true },
      { key: 'formula_create', label: 'Create Formulas', granted: true },
      { key: 'formula_edit', label: 'Edit Formulas', granted: true },
      { key: 'formula_delete', label: 'Delete Formulas', granted: false },
      { key: 'formula_approve', label: 'Approve Formulas', granted: false },
    ],
  },
  {
    section: 'Materials',
    permissions: [
      { key: 'material_view', label: 'View Materials', granted: true },
      { key: 'material_create', label: 'Create Materials', granted: true },
      { key: 'material_edit', label: 'Edit Materials', granted: false },
      { key: 'material_delete', label: 'Delete Materials', granted: false },
    ],
  },
  {
    section: 'Compliance',
    permissions: [
      { key: 'compliance_view', label: 'View Compliance Data', granted: true },
      { key: 'compliance_edit', label: 'Edit Compliance Records', granted: false },
      { key: 'certificate_upload', label: 'Upload Certificates', granted: true },
      { key: 'certificate_delete', label: 'Delete Certificates', granted: false },
    ],
  },
  {
    section: 'Users & Admin',
    permissions: [
      { key: 'user_view', label: 'View Users', granted: false },
      { key: 'user_invite', label: 'Invite Users', granted: false },
      { key: 'user_disable', label: 'Disable Users', granted: false },
      { key: 'role_manage', label: 'Manage Roles', granted: false },
      { key: 'audit_view', label: 'View Audit Logs', granted: false },
    ],
  },
  {
    section: 'Projects',
    permissions: [
      { key: 'project_view', label: 'View Projects', granted: true },
      { key: 'project_create', label: 'Create Projects', granted: true },
      { key: 'project_edit', label: 'Edit Projects', granted: false },
      { key: 'project_delete', label: 'Delete Projects', granted: false },
    ],
  },
]

type PageState = 'loading' | 'ready' | 'error'

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [pageState, setPageState] = useState<PageState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<number | null>(null)
  const [permissions, setPermissions] = useState<PermissionSection[]>(MOCK_PERMISSIONS)

  useEffect(() => {
    const timer = setTimeout(() => {
      setRoles(MOCK_ROLES)
      setPageState('ready')
    }, 900)
    return () => clearTimeout(timer)
  }, [])

  const togglePermission = (sectionIdx: number, permKey: string) => {
    setPermissions(prev => prev.map((s, si) =>
      si === sectionIdx
        ? { ...s, permissions: s.permissions.map(p => p.key === permKey ? { ...p, granted: !p.granted } : p) }
        : s
    ))
  }

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">Role Manager</h1>
            <p className="text-sm text-muted-foreground">Define and manage access roles</p>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Loading Roles</CardTitle>
              <CardDescription>Fetching role definitions...</CardDescription>
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

  if (pageState === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">Role Manager</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <p className="text-red-600 mb-2 font-semibold">Failed to Load Roles</p>
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

  const selected = selectedRole !== null ? roles.find(r => r.id === selectedRole) : null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Role Manager</h1>
          <p className="text-sm text-muted-foreground">Define and manage access roles</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Roles</CardTitle>
                <CardDescription>{roles.length} roles defined</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Perms</TableHead>
                      <TableHead className="w-20">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.map(r => (
                      <TableRow
                        key={r.id}
                        className={cn('cursor-pointer', selectedRole === r.id && 'bg-blue-50')}
                        onClick={() => setSelectedRole(r.id)}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            {r.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-[160px] truncate">{r.description}</TableCell>
                        <TableCell className="text-xs">{r.usersCount}</TableCell>
                        <TableCell className="text-xs">{r.permissionsCount}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={e => { e.stopPropagation(); setSelectedRole(r.id) }}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={e => e.stopPropagation()}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="xl:col-span-2">
            {selected ? (
              <Card>
                <CardHeader>
                  <CardTitle>{selected.name} — Permissions</CardTitle>
                  <CardDescription>{selected.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {permissions.map((section, si) => (
                      <div key={section.section}>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-3">{section.section}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {section.permissions.map(p => (
                            <label
                              key={p.key}
                              className={cn(
                                'flex items-center gap-3 p-2 rounded border cursor-pointer transition-colors',
                                p.granted ? 'border-green-200 bg-green-50' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:bg-gray-950',
                              )}
                              onClick={() => togglePermission(si, p.key)}
                            >
                              <div className={cn(
                                'h-4 w-4 rounded border flex items-center justify-center transition-colors',
                                p.granted ? 'bg-green-600 border-green-600' : 'border-gray-300 dark:border-gray-600',
                              )}>
                                {p.granted && <CheckCheck className="h-3 w-3 text-white" />}
                              </div>
                              <span className="text-sm">{p.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-6" />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setSelectedRole(null)}>Cancel</Button>
                    <Button>Save Permissions</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Select a role from the table to edit its permissions.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
