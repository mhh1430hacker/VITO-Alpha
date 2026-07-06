'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Map, ArrowLeft, ArrowUp, Clock, CheckCircle2, Target, Lightbulb, Wrench } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface RoadmapItem {
  id: string; title: string; description: string; status: string;
  category: string; votes: number; eta: string | null;
}

const statusIcon: Record<string, React.ReactNode> = {
  completed: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
  in_progress: <Wrench className="h-4 w-4 text-amber-400" />,
  planned: <Target className="h-4 w-4 text-violet-400" />,
  research: <Lightbulb className="h-4 w-4 text-teal-400" />,
}

const statusColor: Record<string, string> = {
  completed: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400',
  in_progress: 'border-amber-500/20 bg-amber-500/5 text-amber-400',
  planned: 'border-violet-500/20 bg-violet-500/5 text-violet-400',
  research: 'border-teal-500/20 bg-teal-500/5 text-teal-400',
}

export default function RoadmapPage() {
  const router = useRouter()
  const [items, setItems] = useState<RoadmapItem[]>([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/alpha/roadmap')
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .catch(() => {
        // Fallback static data
        setItems([
          { id: '1', title: 'Real-time AI Predictions', description: 'Live inference for stability and longevity.', status: 'in_progress', category: 'AI', votes: 187, eta: 'Q3 2026' },
          { id: '2', title: 'SAML/SSO Enterprise Login', description: 'Okta, Azure AD, AUTH0 support.', status: 'planned', category: 'Platform', votes: 156, eta: 'Q3 2026' },
          { id: '3', title: 'Formula Version Control', description: 'Git-like versioning for formulas.', status: 'planned', category: 'Core', votes: 143, eta: 'Q4 2026' },
          { id: '4', title: 'Compliance Dashboard V2', description: 'Multi-regulation matrix with SDS generation.', status: 'in_progress', category: 'Compliance', votes: 104, eta: 'Q3 2026' },
          { id: '5', title: 'Olfactory Similarity Search', description: 'Search by olfactory profile embeddings.', status: 'completed', category: 'AI', votes: 98, eta: null },
          { id: '6', title: 'Team Workspaces', description: 'Shared workspaces with approval flows.', status: 'in_progress', category: 'Core', votes: 87, eta: 'Q3 2026' },
          { id: '7', title: 'SDK & Public API', description: 'REST API + SDKs for programmatic access.', status: 'planned', category: 'Platform', votes: 72, eta: 'Q4 2026' },
          { id: '8', title: 'Carbon Footprint Calculator', description: 'Sustainability scoring for formulations.', status: 'research', category: 'Compliance', votes: 65, eta: '2027' },
        ])
      })
  }, [])

  const filtered = filter === 'all' ? items : items.filter((i) => i.status === filter)
  const categories = ['all', 'in_progress', 'planned', 'research', 'completed']

  return (
    <div className="min-h-screen bg-[#0A0D12] p-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.push('/alpha')} className="text-muted-foreground/40 hover:text-muted-foreground text-[13px] mb-6 flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" /> Alpha Portal
        </button>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <Map className="h-6 w-6 text-teal-400" /> Public Roadmap
            </h1>
            <p className="text-muted-foreground/50 text-[13px] mt-1">Vote on features you need. What we are building and why.</p>
          </div>
        </div>
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((c) => (
            <button key={c} onClick={() => setFilter(c)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${filter === c ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' : 'bg-white/[0.02] text-muted-foreground/50 border border-border/40'}`}>
              {c === 'all' ? 'All' : c.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {filtered.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="hover:border-violet-500/10 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-[15px] font-semibold text-foreground">{item.title}</h3>
                        <Badge variant="outline" className={statusColor[item.status] || ''}>
                          {statusIcon[item.status]} <span className="ml-1">{item.status.replace('_', ' ')}</span>
                        </Badge>
                      </div>
                      <p className="text-[13px] text-muted-foreground/50 mb-3">{item.description}</p>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-[10px] border-border/40 text-muted-foreground/40">{item.category}</Badge>
                        {item.eta && <span className="text-[11px] text-muted-foreground/30 flex items-center gap-1"><Clock className="h-3 w-3" /> {item.eta}</span>}
                      </div>
                    </div>
                    <button onClick={async () => {
                      try {
                        await fetch(`http://localhost:8000/api/v1/alpha/roadmap/${item.id}/vote`, { method: 'POST' })
                        setItems((prev) => prev.map((it) => it.id === item.id ? { ...it, votes: it.votes + 1 } : it))
                      } catch {}
                    }} className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl border border-border/40 hover:border-violet-500/20 hover:bg-violet-500/5 transition-colors group shrink-0 ml-4">
                      <ArrowUp className="h-4 w-4 text-muted-foreground/30 group-hover:text-violet-400 transition-colors" />
                      <span className="text-[14px] font-bold text-foreground/70">{item.votes}</span>
                      <span className="text-[9px] text-muted-foreground/30">votes</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
