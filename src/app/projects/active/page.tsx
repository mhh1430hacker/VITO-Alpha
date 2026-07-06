'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { FlaskConical, Calendar, User, Beaker } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Project {
  id: number
  name: string
  status: 'planning' | 'active' | 'completed' | 'cancelled'
  lead: string
  formula_count: number
  target_launch: string
  accord: string
}

const MOCK_PROJECTS: Project[] = [
  { id: 1, name: 'Amber Floral EDP', status: 'active', lead: 'Sophie Laurent', formula_count: 12, target_launch: '2026-09-15', accord: 'Amber Floral' },
  { id: 2, name: 'Fresh Citrus Cologne', status: 'active', lead: 'Marcus Webb', formula_count: 8, target_launch: '2026-08-01', accord: 'Citrus' },
  { id: 3, name: 'Woody Oud Intense', status: 'active', lead: 'Aisha Patel', formula_count: 15, target_launch: '2026-11-20', accord: 'Woody' },
  { id: 4, name: 'Gourmand Vanilla', status: 'planning', lead: 'Liam O\'Connor', formula_count: 3, target_launch: '2027-01-10', accord: 'Gourmand' },
  { id: 5, name: 'Oceanic Aquatic', status: 'active', lead: 'Yuki Tanaka', formula_count: 9, target_launch: '2026-10-05', accord: 'Aquatic' },
  { id: 6, name: 'Green Tea Revitalize', status: 'active', lead: 'Chen Wei', formula_count: 6, target_launch: '2026-07-15', accord: 'Green' },
]

const statusVariant: Record<string, 'default' | 'secondary' | 'success' | 'destructive'> = {
  planning: 'secondary',
  active: 'success',
  completed: 'default',
  cancelled: 'destructive',
}

export default function ActiveProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setProjects(MOCK_PROJECTS)
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading active projects...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-lg text-destructive">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Active Projects</h1>
          <p className="text-sm text-muted-foreground">Currently running and planned projects</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {projects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FlaskConical className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No projects found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <Card
                key={project.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <Badge variant={statusVariant[project.status]}>
                      {project.status}
                    </Badge>
                  </div>
                  <CardDescription>{project.accord} Accord</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{project.lead}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Beaker className="h-4 w-4" />
                      <span>{project.formula_count} formulas</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Launch: {project.target_launch}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
