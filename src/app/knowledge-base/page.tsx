'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Book, FileText, ThumbsUp, ThumbsDown, ChevronRight } from 'lucide-react'

const categories = [
  { name: 'Getting Started', slug: 'getting-started', count: 12 },
  { name: 'Formulations', slug: 'formulations', count: 18 },
  { name: 'Materials', slug: 'materials', count: 15 },
  { name: 'AI Predictions', slug: 'ai-predictions', count: 10 },
  { name: 'Compliance', slug: 'compliance', count: 14 },
  { name: 'Integrations', slug: 'integrations', count: 8 },
  { name: 'Billing', slug: 'billing', count: 6 },
  { name: 'Troubleshooting', slug: 'troubleshooting', count: 20 },
]

const articles = [
  { title: 'Getting Started with VITO', category: 'Getting Started', excerpt: 'Learn the basics of the VITO platform.', views: 1520, helpful: 95, slug: 'getting-started-vito' },
  { title: 'Creating Your First Formula', category: 'Formulations', excerpt: 'Step-by-step guide to creating formulations.', views: 2300, helpful: 92, slug: 'first-formula' },
  { title: 'Understanding AI Predictions', category: 'AI Predictions', excerpt: 'How VITO generates predictions.', views: 1800, helpful: 88, slug: 'ai-predictions-explained' },
  { title: 'IFRA Compliance Guide', category: 'Compliance', excerpt: 'Ensuring your formulations meet IFRA standards.', views: 2100, helpful: 96, slug: 'ifra-compliance' },
  { title: 'Material Library Management', category: 'Materials', excerpt: 'Managing your material catalog.', views: 1200, helpful: 90, slug: 'material-library' },
  { title: 'API Integration Guide', category: 'Integrations', excerpt: 'Connect VITO with your existing tools.', views: 980, helpful: 87, slug: 'api-integration' },
]

export default function KnowledgeBasePage() {
  const [query, setQuery] = useState('')

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Knowledge Base</h1>
        <p className="text-sm text-muted-foreground">Search articles, guides, and documentation.</p>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input className="w-full rounded-lg border bg-background pl-9 pr-4 py-2.5 text-sm" placeholder="Search the knowledge base..." value={query} onChange={e => setQuery(e.target.value)} />
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-1">
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Categories</p>
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/knowledge-base?category=${cat.slug}`} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors">
              <span>{cat.name}</span>
              <span className="text-xs text-muted-foreground">{cat.count}</span>
            </Link>
          ))}
        </div>

        <div className="md:col-span-3 space-y-4">
          {filtered.map((article) => (
            <Link key={article.slug} href={`/knowledge-base/${article.slug}`} className="block rounded-xl border p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold">{article.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{article.excerpt}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5">{article.category}</span>
                <span>{article.views.toLocaleString()} views</span>
                <span className="inline-flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> {article.helpful}% helpful</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
