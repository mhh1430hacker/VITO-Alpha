'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ThumbsUp, ThumbsDown, ArrowLeft, Share2, Book } from 'lucide-react'

const articleData: Record<string, { title: string; content: string; category: string; sections: { id: string; title: string }[] }> = {
  'getting-started-vito': {
    title: 'Getting Started with VITO',
    category: 'Getting Started',
    sections: [
      { id: 'overview', title: 'Platform Overview' },
      { id: 'setup', title: 'Setting Up Your Account' },
      { id: 'first-steps', title: 'First Steps' },
      { id: 'next', title: 'Next Steps' },
    ],
    content: `## Platform Overview\n\nVITO (Virtual Intelligence for Olfactory Technology) is an enterprise-grade AI-powered fragrance formulation platform. It combines proprietary AI models, molecular science, and enterprise infrastructure to help fragrance houses create better formulations faster.\n\n## Setting Up Your Account\n\n1. Complete the onboarding wizard\n2. Set up your company profile\n3. Invite team members\n4. Configure integrations\n\n## First Steps\n\n1. Explore the Material Library\n2. Create your first formulation\n3. Run AI predictions\n4. Check compliance\n\n## Next Steps\n\n- Review the dashboard for insights\n- Set up your workspace preferences\n- Configure API access for custom integrations`,
  },
  'first-formula': {
    title: 'Creating Your First Formula',
    category: 'Formulations',
    sections: [
      { id: 'overview', title: 'Formula Overview' },
      { id: 'materials', title: 'Selecting Materials' },
      { id: 'blending', title: 'Blending Ratios' },
      { id: 'analyze', title: 'Analyzing Your Formula' },
    ],
    content: `## Formula Overview\n\nFormulas are the core building blocks in VITO. Each formula represents a fragrance composition with precise material ratios.\n\n## Selecting Materials\n\nBrowse the material library to find the ingredients you need. Use the search and filter capabilities to narrow down by odor profile, category, or compliance status.\n\n## Blending Ratios\n\nSpecify the percentage of each material in your formula. VITO will automatically validate that the total equals 100%.\n\n## Analyzing Your Formula\n\nOnce created, you can analyze your formula for:\n- Performance predictions\n- Stability estimates\n- Compliance checks\n- Cost analysis`,
  },
}

export default function ArticlePage() {
  const params = useParams()
  const slug = params.slug as string
  const article = articleData[slug] || {
    title: 'Article Not Found',
    category: 'General',
    sections: [{ id: 'not-found', title: 'Not Found' }],
    content: 'This article could not be found.',
  }
  const [helpful, setHelpful] = useState<boolean | null>(null)

  return (
    <div className="space-y-6 p-6">
      <Link href="/knowledge-base" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Knowledge Base
      </Link>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="mb-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">{article.category}</span>
          </div>
          <h1 className="text-3xl font-bold mb-8">{article.title}</h1>

          <div className="prose prose-sm max-w-none">
            {article.content.split('\n\n').map((paragraph, i) => {
              if (paragraph.startsWith('## ')) {
                const heading = paragraph.replace('## ', '')
                const id = heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                return <h2 key={i} id={id} className="text-xl font-bold mt-8 mb-4">{heading}</h2>
              } else if (paragraph.startsWith('- ')) {
                return <ul key={i} className="list-disc pl-5 space-y-1 mb-4">{paragraph.split('\n').map((line, j) => <li key={j} className="text-sm">{line.replace('- ', '')}</li>)}</ul>
              } else if (paragraph.startsWith('1. ')) {
                return <ol key={i} className="list-decimal pl-5 space-y-1 mb-4">{paragraph.split('\n').map((line, j) => <li key={j} className="text-sm">{line.replace(/^\d+\.\s*/, '')}</li>)}</ol>
              } else {
                return <p key={i} className="text-sm mb-4 leading-relaxed">{paragraph}</p>
              }
            })}
          </div>

          <div className="mt-12 pt-6 border-t">
            <p className="text-sm text-muted-foreground mb-3">Was this article helpful?</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setHelpful(true)} className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors ${helpful === true ? 'bg-green-50 border-green-200 text-green-700' : 'hover:bg-muted'}`}>
                <ThumbsUp className="h-4 w-4" /> Yes
              </button>
              <button onClick={() => setHelpful(false)} className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors ${helpful === false ? 'bg-red-50 border-red-200 text-red-700' : 'hover:bg-muted'}`}>
                <ThumbsDown className="h-4 w-4" /> No
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm hover:bg-muted ml-auto">
                <Share2 className="h-4 w-4" /> Share
              </button>
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-24">
            <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">On this page</p>
            <nav className="space-y-1">
              {article.sections.map((section) => (
                <a key={section.id} href={`#${section.id}`} className="block text-sm text-muted-foreground hover:text-foreground py-1 transition-colors">
                  {section.title}
                </a>
              ))}
            </nav>
            <div className="mt-8 pt-6 border-t">
              <div className="rounded-lg border p-4">
                <Book className="h-5 w-5 text-muted-foreground mb-2" />
                <p className="text-sm font-medium mb-1">Related Articles</p>
                <ul className="space-y-1">
                  <li><Link href="/knowledge-base" className="text-xs text-primary hover:underline">Knowledge Base Home</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
