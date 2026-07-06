'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Archive, Eye, Trash2, TrendingUp } from 'lucide-react'

interface CompletedProject {
  id: number
  name: string
  lead: string
  completed_date: string
  formulas: number
  launch_performance: 'excellent' | 'good' | 'average' | 'poor'
}

const MOCK_COMPLETED: CompletedProject[] = [
  { id: 1, name: 'Rose Petal Elixir', lead: 'Sophie Laurent', completed_date: '2025-12-01', formulas: 18, launch_performance: 'excellent' },
  { id: 2, name: 'Sandalwood Serenity', lead: 'Aisha Patel', completed_date: '2025-10-15', formulas: 14, launch_performance: 'good' },
  { id: 3, name: 'Bergamot Burst', lead: 'Marcus Webb', completed_date: '2025-09-20', formulas: 9, launch_performance: 'average' },
  { id: 4, name: 'Jasmine Nights', lead: 'Chen Wei', completed_date: '2025-07-05', formulas: 21, launch_performance: 'excellent' },
  { id: 5, name: 'Musk Ambience', lead: 'Yuki Tanaka', completed_date: '2025-05-30', formulas: 11, launch_performance: 'good' },
]

const perfBadge: Record<string, 'success' | 'secondary' | 'warning' | 'destructive'> = {
  excellent: 'success',
  good: 'secondary',
  average: 'warning',
  poor: 'destructive',
}

export default function CompletedProjectsPage() {
  const [projects, setProjects] = useState<CompletedProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setProjects(MOCK_COMPLETED)
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading completed projects...</div>
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
          <h1 className="text-2xl font-bold">Completed Projects</h1>
          <p className="text-sm text-muted-foreground">Post-launch project archive</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {projects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Archive className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No completed projects yet</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Project Archive</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Lead</TableHead>
                    <TableHead>Completed Date</TableHead>
                    <TableHead>Formulas</TableHead>
                    <TableHead>Launch Performance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map(project => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{project.lead}</TableCell>
                      <TableCell>{project.completed_date}</TableCell>
                      <TableCell>{project.formulas}</TableCell>
                      <TableCell>
                        <Badge variant={perfBadge[project.launch_performance]}>
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {project.launch_performance}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
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
