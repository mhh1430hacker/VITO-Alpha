'use client'

import Link from 'next/link'
import { Play, Clock, BarChart3, ChevronRight } from 'lucide-react'

const tutorials = [
  { title: 'Introduction to VITO', slug: 'intro-vito', level: 'beginner', duration: '10 min', description: 'A quick overview of the VITO platform and its core features.' },
  { title: 'Creating Your First Formulation', slug: 'first-formulation', level: 'beginner', duration: '15 min', description: 'Step-by-step guide to creating and analyzing your first fragrance formula.' },
  { title: 'Advanced AI Predictions', slug: 'advanced-predictions', level: 'advanced', duration: '20 min', description: 'Learn how to leverage VITO\'s AI models for accurate predictions.' },
  { title: 'Material Optimization', slug: 'material-optimization', level: 'intermediate', duration: '12 min', description: 'Optimize your material usage and find cost-effective alternatives.' },
  { title: 'Compliance Automation', slug: 'compliance-automation', level: 'intermediate', duration: '15 min', description: 'Automate IFRA, REACH, and CLP compliance checks.' },
  { title: 'API Integration', slug: 'api-integration-tutorial', level: 'advanced', duration: '25 min', description: 'Integrate VITO with your existing systems using the REST API.' },
]

const levels = [
  { id: 'all', label: 'All Levels' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
]

export default function TutorialsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tutorial Center</h1>
        <p className="text-sm text-muted-foreground">Learn how to get the most out of VITO.</p>
      </div>

      <div className="flex items-center gap-2">
        {levels.map((l) => (
          <button key={l.id} className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-muted transition-colors">{l.label}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tutorials.map((t) => (
          <Link key={t.slug} href={`/tutorials/${t.slug}`} className="rounded-xl border p-5 hover:shadow-md transition-shadow group">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <Play className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{t.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{t.description}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 capitalize">{t.level}</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {t.duration}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
