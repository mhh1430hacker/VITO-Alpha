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
  Users,
  Plus,
  User,
  FolderKanban,
  X,
  UserPlus,
} from 'lucide-react'

interface TeamMember {
  id: number
  name: string
  role: string
  email: string
}

interface Team {
  id: number
  name: string
  lead: string
  membersCount: number
  projectsCount: number
  members: TeamMember[]
}

const MOCK_TEAMS: Team[] = [
  {
    id: 1, name: 'Fine Fragrance', lead: 'Maria Chen', membersCount: 8, projectsCount: 12,
    members: [
      { id: 1, name: 'Maria Chen', role: 'Lead Perfumer', email: 'maria@perfume.com' },
      { id: 2, name: 'Anna Kowalski', role: 'Senior Perfumer', email: 'anna@perfume.com' },
      { id: 3, name: 'David Park', role: 'Junior Perfumer', email: 'david@perfume.com' },
      { id: 4, name: 'Elena Rossi', role: 'Lab Technician', email: 'elena@perfume.com' },
    ],
  },
  {
    id: 2, name: 'R&D Innovation', lead: 'James Wilson', membersCount: 6, projectsCount: 8,
    members: [
      { id: 5, name: 'James Wilson', role: 'R&D Director', email: 'james@perfume.com' },
      { id: 6, name: 'Yuki Tanaka', role: 'Research Scientist', email: 'yuki@perfume.com' },
      { id: 7, name: 'Sarah Mitchell', role: 'Formulation Chemist', email: 'sarah@perfume.com' },
    ],
  },
  {
    id: 3, name: 'Compliance & Regulatory', lead: 'Sophie Lambert', membersCount: 4, projectsCount: 6,
    members: [
      { id: 8, name: 'Sophie Lambert', role: 'Compliance Manager', email: 'sophie@perfume.com' },
      { id: 9, name: 'Liam O\'Brien', role: 'Regulatory Specialist', email: 'liam@perfume.com' },
    ],
  },
  {
    id: 4, name: 'Supply Chain Operations', lead: 'Raj Patel', membersCount: 5, projectsCount: 4,
    members: [
      { id: 10, name: 'Raj Patel', role: 'Supply Chain Lead', email: 'raj@perfume.com' },
      { id: 11, name: 'Carlos Mendez', role: 'Procurement Specialist', email: 'carlos@perfume.com' },
    ],
  },
]

type PageState = 'loading' | 'ready' | 'empty' | 'error'

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [pageState, setPageState] = useState<PageState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setTeams(MOCK_TEAMS)
      setPageState('ready')
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">Team Management</h1>
            <p className="text-sm text-muted-foreground">Organize users into functional teams</p>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Loading Teams</CardTitle>
              <CardDescription>Fetching team data...</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
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
            <h1 className="text-2xl font-bold">Team Management</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <p className="text-red-600 mb-2 font-semibold">Failed to Load Teams</p>
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

  if (pageState === 'empty') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Team Management</h1>
            </div>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Team
            </Button>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No teams created yet.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const selected = selectedTeam !== null ? teams.find(t => t.id === selectedTeam) : null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Team Management</h1>
            <p className="text-sm text-muted-foreground">{teams.length} teams</p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={cn('grid gap-4', selected ? 'lg:col-span-2' : 'lg:col-span-3')}>
            <div className={cn('grid gap-4', selected ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3')}>
              {teams.map(t => (
                <Card
                  key={t.id}
                  className={cn(
                    'cursor-pointer transition-all hover:shadow-md',
                    selectedTeam === t.id && 'ring-2 ring-blue-500',
                  )}
                  onClick={() => setSelectedTeam(t.id === selectedTeam ? null : t.id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{t.name}</CardTitle>
                    <CardDescription className="text-xs">Lead: {t.lead}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {t.membersCount} members
                      </span>
                      <span className="flex items-center gap-1">
                        <FolderKanban className="h-3 w-3" />
                        {t.projectsCount} projects
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {selected && (
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{selected.name}</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedTeam(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>Lead: {selected.lead}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">{selected.members.length} members</span>
                    <Button size="sm" variant="outline">
                      <UserPlus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  <Separator className="mb-4" />
                  <div className="space-y-3">
                    {selected.members.map(m => (
                      <div key={m.id} className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                          {m.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{m.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{m.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
