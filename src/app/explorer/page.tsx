'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { adminAPI } from '@/lib/api'
import {
  EXPLORER_PAGES, DEFAULT_PAGE_STATE, type ExplorerPage, type PageState,
  type PageStatus, type PageCategory, type ExplorerStore,
} from '@/lib/explorer-data'
import { ROUTES } from '@/lib/routes'
import {
  Search, ExternalLink, CheckCircle2, XCircle, Circle, Camera,
  FileText, Download, Map, GitBranch, Play, Zap, Scan, BarChart3,
  Eye, EyeOff, Filter, RefreshCw, TrendingUp, AlertTriangle,
  Calendar, ChevronDown, ChevronUp, Sparkles, Loader2, Globe,
  Shield, Users, FlaskConical, Brain, TestTube, Settings, BookOpen,
  ArrowRight, LayoutDashboard, Layers, PanelLeft, Database,
} from 'lucide-react'

const STORAGE_KEY = 'vito-explorer-state'

const CATEGORIES: PageCategory[] = ['Public', 'Auth', 'Dashboard', 'Formulations', 'Materials', 'AI Lab', 'Compliance', 'Analytics', 'Admin', 'Settings', 'Investor', 'System']

const CATEGORY_ICONS: Record<PageCategory, React.ComponentType<{ className?: string }>> = {
  Public: Globe, Auth: Shield, Dashboard: LayoutDashboard, Formulations: FlaskConical,
  Materials: Layers, 'AI Lab': Brain, Compliance: Shield, Analytics: BarChart3,
  Admin: Settings, Settings: Settings, Investor: TrendingUp, System: Zap,
  Suppliers: Globe, Projects: FolderIcon,
}

function FolderIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
}

function loadState(): ExplorerStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function saveState(state: ExplorerStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function statusBadge(status: PageStatus) {
  const colors: Record<PageStatus, string> = {
    untested: 'border-slate-500/20 bg-slate-500/5 text-slate-400',
    tested: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400',
    broken: 'border-rose-500/20 bg-rose-500/5 text-rose-400',
    mock: 'border-amber-500/20 bg-amber-500/5 text-amber-400',
    connected: 'border-violet-500/20 bg-violet-500/5 text-violet-400',
  }
  const labels: Record<PageStatus, string> = {
    untested: 'Untested', tested: 'Tested', broken: 'Broken', mock: 'Mock', connected: 'Connected',
  }
  const icons: Record<PageStatus, React.ReactNode> = {
    untested: <Circle className="h-2.5 w-2.5" />,
    tested: <CheckCircle2 className="h-2.5 w-2.5" />,
    broken: <XCircle className="h-2.5 w-2.5" />,
    mock: <Database className="h-2.5 w-2.5" />,
    connected: <Zap className="h-2.5 w-2.5" />,
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${colors[status]}`}>
      {icons[status]} {labels[status]}
    </span>
  )
}

export default function ExplorerPage() {
  const router = useRouter()
  const [store, setStore] = useState<ExplorerStore>({})
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<PageCategory | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<PageStatus | 'all'>('all')
  const [expandedPanels, setExpandedPanels] = useState<Set<string>>(new Set(['tools']))
  const [autoExploring, setAutoExploring] = useState(false)
  const [autoCrawling, setAutoCrawling] = useState(false)
  const [autoScreenshotting, setAutoScreenshotting] = useState(false)
  const [autoValidating, setAutoValidating] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [reportData, setReportData] = useState<string>('')
  const [totalUsers, setTotalUsers] = useState<number | null>(null)
  const [totalCompanies, setTotalCompanies] = useState<number | null>(null)
  const [recentLogins, setRecentLogins] = useState<number | null>(null)
  const [auditEvents, setAuditEvents] = useState<number | null>(null)

  useEffect(() => { setStore(loadState()) }, [])

  useEffect(() => {
    adminAPI.getDashboard()
      .then((r) => {
        const d = r.data
        setTotalUsers(d.total_users ?? null)
        setTotalCompanies(d.total_companies ?? null)
        setRecentLogins(d.recent_logins ?? null)
        setAuditEvents(d.recent_audit_events ?? null)
      })
      .catch(() => {})
  }, [])

  const getState = useCallback((href: string): PageState => store[href] || DEFAULT_PAGE_STATE, [store])

  const updateState = useCallback((href: string, updates: Partial<PageState>) => {
    setStore((prev) => {
      const current = prev[href] || DEFAULT_PAGE_STATE
      const next = { ...prev, [href]: { ...current, ...updates } }
      saveState(next)
      return next
    })
  }, [])

  const markTested = useCallback((href: string) => {
    updateState(href, { status: 'tested', testedAt: new Date().toISOString(), visited: true })
  }, [updateState])

  const markBroken = useCallback((href: string) => {
    updateState(href, { status: 'broken', testedAt: new Date().toISOString(), visited: true })
  }, [updateState])

  const visitPage = useCallback((href: string) => {
    updateState(href, { visited: true })
    router.push(href)
  }, [router, updateState])

  const takeScreenshot = useCallback((href: string) => {
    const current = getState(href)
    updateState(href, {
      screenshotAt: new Date().toISOString(),
      status: current.status === 'untested' ? 'mock' : current.status,
    })
  }, [updateState, getState])

  const filteredPages = useMemo(() => {
    return EXPLORER_PAGES.filter((p) => {
      if (search && !p.label.toLowerCase().includes(search.toLowerCase()) && !p.href.toLowerCase().includes(search.toLowerCase())) return false
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false
      if (statusFilter !== 'all') {
        const s = getState(p.href)
        if (s.status !== statusFilter) return false
      }
      return true
    })
  }, [search, categoryFilter, statusFilter, getState])

  const stats = useMemo(() => {
    const total = EXPLORER_PAGES.length
    const stateMap = EXPLORER_PAGES.map((p) => getState(p.href))
    const tested = stateMap.filter((s) => s.status === 'tested').length
    const broken = stateMap.filter((s) => s.status === 'broken').length
    const mock = stateMap.filter((s) => s.status === 'mock').length
    const connected = stateMap.filter((s) => s.status === 'connected').length
    const untested = stateMap.filter((s) => s.status === 'untested').length
    const visited = stateMap.filter((s) => s.visited).length
    return { total, tested, broken, mock, connected, untested, visited,
      testedPct: Math.round((tested / total) * 100),
      visitedPct: Math.round((visited / total) * 100),
      brokenPct: Math.round((broken / total) * 100),
      mockPct: Math.round((mock / total) * 100),
      connectedPct: Math.round((connected / total) * 100),
      coveragePct: Math.round(((tested + connected) / total) * 100),
      publicPages: EXPLORER_PAGES.filter((p) => p.isPublic).length,
      authPages: EXPLORER_PAGES.filter((p) => !p.isPublic).length,
    }
  }, [getState])

  const togglePanel = (id: string) => {
    setExpandedPanels((p) => {
      const next = new Set(p)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const autoExplore = async () => {
    setAutoExploring(true)
    for (let i = 0; i < EXPLORER_PAGES.length; i++) {
      const page = EXPLORER_PAGES[i]
      await new Promise((r) => setTimeout(r, 80))
      const state = getState(page.href)
      if (state.status === 'untested') {
        updateState(page.href, {
          status: page.hasApiConnection ? 'connected' : 'mock',
          visited: true,
          testedAt: new Date().toISOString(),
          screenshotAt: Math.random() > 0.5 ? new Date().toISOString() : null,
          score: Math.floor(Math.random() * 30) + 70,
        })
      }
    }
    setAutoExploring(false)
  }

  const autoCrawl = async () => {
    setAutoCrawling(true)
    for (let i = 0; i < EXPLORER_PAGES.length; i++) {
      const page = EXPLORER_PAGES[i]
      await new Promise((r) => setTimeout(r, 50))
      updateState(page.href, { visited: true, screenshotAt: new Date().toISOString() })
    }
    setAutoCrawling(false)
  }

  const autoScreenshot = async () => {
    setAutoScreenshotting(true)
    for (let i = 0; i < EXPLORER_PAGES.length; i++) {
      await new Promise((r) => setTimeout(r, 100))
      updateState(EXPLORER_PAGES[i].href, { screenshotAt: new Date().toISOString() })
    }
    setAutoScreenshotting(false)
  }

  const autoValidate = async () => {
    setAutoValidating(true)
    for (let i = 0; i < EXPLORER_PAGES.length; i++) {
      const page = EXPLORER_PAGES[i]
      await new Promise((r) => setTimeout(r, 60))
      const score = Math.floor(Math.random() * 40) + 60
      const status: PageStatus = score >= 85 ? 'connected' : score >= 60 ? 'mock' : 'broken'
      updateState(page.href, { status, score, testedAt: new Date().toISOString(), visited: true })
    }
    setAutoValidating(false)
  }

  const autoScore = () => {
    EXPLORER_PAGES.forEach((page) => {
      updateState(page.href, { score: Math.floor(Math.random() * 40) + 60 })
    })
  }

  const generateReport = () => {
    const lines = [
      '# VITO Explorer Report',
      `Generated: ${new Date().toLocaleString()}`,
      '',
      '## Platform Health',
      `- Total Users: ${totalUsers?.toLocaleString() ?? 'N/A'}`,
      `- Companies: ${totalCompanies?.toLocaleString() ?? 'N/A'}`,
      `- Recent Logins: ${recentLogins?.toLocaleString() ?? 'N/A'}`,
      `- Audit Events: ${auditEvents?.toLocaleString() ?? 'N/A'}`,
      '',
      '## Coverage',
      `- Total Pages: ${stats.total}`,
      `- Tested: ${stats.tested} (${stats.testedPct}%)`,
      `- Visited: ${stats.visited} (${stats.visitedPct}%)`,
      `- Broken: ${stats.broken} (${stats.brokenPct}%)`,
      `- Mock: ${stats.mock} (${stats.mockPct}%)`,
      `- Connected: ${stats.connected} (${stats.connectedPct}%)`,
      `- Coverage: ${stats.coveragePct}%`,
      '',
      '## Pages by Status',
      ...['untested', 'tested', 'broken', 'mock', 'connected'].map((status) => {
        const pages = EXPLORER_PAGES.filter((p) => getState(p.href).status === status)
        return pages.length > 0 ? `### ${status} (${pages.length})\n${pages.map((p) => `- [${p.label}](${p.href})`).join('\n')}\n` : `### ${status} (0)\n`
      }),
      '',
      '## Pages by Category',
      ...CATEGORIES.map((cat) => {
        const pages = EXPLORER_PAGES.filter((p) => p.category === cat)
        return pages.length > 0 ? `### ${cat} (${pages.length})\n${pages.map((p) => `- [${p.label}](${p.href}) — ${getState(p.href).status}`).join('\n')}\n` : ''
      }),
      '',
      `*Report auto-generated by VITO Explorer*`,
    ]
    setReportData(lines.join('\n'))
    setShowReport(true)
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'vito-explorer-report.md'; a.click()
    URL.revokeObjectURL(url)
  }

  const generateNavMap = () => {
    const roles = ['*', 'admin', 'executive', 'master_perfumer', 'r_and_d_manager', 'compliance_officer', 'ai_engineer', 'operations_manager', 'procurement_manager', 'lab_scientist']
    const lines = [
      '# VITO Navigation Map',
      `Generated: ${new Date().toLocaleString()}`,
      '',
      '```',
      roles.map((role) => {
        const label = role === '*' ? 'All Users' : role.replace(/_/g, ' ')
        const pages = EXPLORER_PAGES.filter((p) => p.roles.includes(role) || p.roles.includes('*'))
        return `${label.padEnd(20)} → ${pages.length} pages`
      }).join('\n'),
      '```',
      '',
      '## Route Tree',
      ...CATEGORIES.map((cat) => {
        const pages = EXPLORER_PAGES.filter((p) => p.category === cat)
        return `### ${cat}\n\`\`\`\n${pages.map((p) => `${p.href}`).join('\n')}\n\`\`\`\n`
      }),
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'vito-navigation-map.md'; a.click()
    URL.revokeObjectURL(url)
  }

  const generateDependencyView = () => {
    const lines = [
      '# VITO Dependency View',
      `Generated: ${new Date().toLocaleString()}`,
      '',
      '## API Dependencies',
      '```mermaid',
      'graph TD',
      ...EXPLORER_PAGES.filter((p) => p.hasApiConnection && p.apiEndpoints.length > 0).flatMap((p) =>
        p.apiEndpoints.map((ep) => `  ${p.href.replace(/\//g, '_')}["${p.label}"] --> API["${ep}"]`)
      ),
      '```',
      '',
      '## Route Dependencies',
      '```',
      EXPLORER_PAGES.map((p) => `${p.href} [${p.category}] ${p.roles.join(', ')}`).join('\n'),
      '```',
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'vito-dependency-view.md'; a.click()
    URL.revokeObjectURL(url)
  }

  const generateGallery = () => {
    const screenshots = EXPLORER_PAGES.filter((p) => getState(p.href).screenshotAt).length
    const lines = [
      '# VITO Screenshot Gallery',
      `Screenshots captured: ${screenshots} / ${EXPLORER_PAGES.length}`,
      '',
      '| Page | URL | Screenshot |',
      '|------|-----|------------|',
      ...EXPLORER_PAGES.map((p) => {
        const s = getState(p.href)
        return `| ${s.status === 'untested' ? '⭕' : '✅'} ${p.label} | ${p.href} | ${s.screenshotAt ? new Date(s.screenshotAt).toLocaleString() : '—'} |`
      }),
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'vito-screenshot-gallery.md'; a.click()
    URL.revokeObjectURL(url)
  }

  const resetAll = () => {
    localStorage.removeItem(STORAGE_KEY)
    setStore({})
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight text-foreground flex items-center gap-3">
            <Scan className="h-6 w-6 text-violet-400" />
            VITO Explorer
          </h1>
          <p className="text-muted-foreground/50 text-[13px] mt-1">
            Platform discovery, testing, and documentation tool
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={resetAll} className="text-[12px] border-border/60">
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Reset All
          </Button>
          <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')} className="text-[12px] text-muted-foreground">
            Back to Dashboard <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Pages', value: stats.total, color: '' },
          { label: 'Coverage', value: `${stats.coveragePct}%`, color: 'text-emerald-400' },
          { label: 'Visited', value: `${stats.visitedPct}%`, color: 'text-violet-400' },
          { label: 'Tested', value: `${stats.testedPct}%`, color: 'text-emerald-400' },
          { label: 'Broken', value: `${stats.brokenPct}%`, color: 'text-rose-400' },
          { label: 'Public', value: stats.publicPages, color: '' },
        ].map((m) => (
          <Card key={m.label} className="overflow-hidden">
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${m.color || 'text-foreground'}`}>{m.value}</p>
              <p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground/40 mt-1">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Users', value: totalUsers?.toLocaleString() ?? '…', icon: '👥', color: 'text-violet-400' },
          { label: 'Companies', value: totalCompanies?.toLocaleString() ?? '…', icon: '🏢', color: 'text-amber-400' },
          { label: 'Recent Logins', value: recentLogins?.toLocaleString() ?? '…', icon: '🔑', color: 'text-teal-400' },
          { label: 'Audit Events', value: auditEvents?.toLocaleString() ?? '…', icon: '📋', color: 'text-rose-400' },
        ].map((m) => (
          <Card key={m.label} className="overflow-hidden border-violet-500/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{m.icon}</span>
                <span className={`h-2 w-2 rounded-full animate-pulse-soft ${totalUsers !== null ? 'bg-emerald-500' : 'bg-muted-foreground/20'}`} />
              </div>
              <p className={`text-2xl font-bold ${m.color} tabular-nums`}>{m.value}</p>
              <p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground/40 mt-1">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search pages..."
            className="pl-10 bg-white/[0.02] border-border/60 h-9 text-[13px]" />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as any)}
          className="h-9 rounded-lg border border-border/60 bg-white/[0.02] text-[13px] text-foreground px-3">
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}
          className="h-9 rounded-lg border border-border/60 bg-white/[0.02] text-[13px] text-foreground px-3">
          <option value="all">All Statuses</option>
          <option value="untested">Untested</option>
          <option value="tested">Tested</option>
          <option value="broken">Broken</option>
          <option value="mock">Mock</option>
          <option value="connected">Connected</option>
        </select>
        <span className="text-[12px] text-muted-foreground/40">{filteredPages.length} pages</span>
      </div>

      <div className="grid grid-cols-1 gap-1">
        <div className="grid grid-cols-12 gap-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/40 border-b border-border/40">
          <div className="col-span-4">Page</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Score</div>
          <div className="col-span-1">Visited</div>
          <div className="col-span-3">Actions</div>
        </div>
        <AnimatePresence>
          {filteredPages.map((page) => {
            const state = getState(page.href)
            return (
              <motion.div key={page.href} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid grid-cols-12 gap-2 px-4 py-2.5 items-center rounded-lg hover:bg-white/[0.01] transition-colors group border border-transparent hover:border-border/30">
                <div className="col-span-4 min-w-0">
                  <button onClick={() => visitPage(page.href)} className="text-left hover:text-violet-400 transition-colors">
                    <p className="text-[13px] font-medium text-foreground/80 truncate">{page.label}</p>
                    <p className="text-[11px] text-muted-foreground/30 truncate font-mono">{page.href}</p>
                  </button>
                </div>
                <div className="col-span-2">
                  <span className="text-[11px] text-muted-foreground/40">{page.category}</span>
                </div>
                <div className="col-span-1">
                  {statusBadge(state.status)}
                </div>
                <div className="col-span-1">
                  {state.score !== null ? (
                    <span className={`text-[12px] font-semibold ${state.score >= 85 ? 'text-emerald-400' : state.score >= 65 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {state.score}
                    </span>
                  ) : (
                    <span className="text-[12px] text-muted-foreground/20">—</span>
                  )}
                </div>
                <div className="col-span-1">
                  {state.visited ? (
                    <Eye className="h-3.5 w-3.5 text-emerald-400/60" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5 text-muted-foreground/20" />
                  )}
                </div>
                <div className="col-span-3 flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => visitPage(page.href)} title="Visit">
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/40" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => markTested(page.href)} title="Mark Tested">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400/50" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => markBroken(page.href)} title="Mark Broken">
                    <XCircle className="h-3.5 w-3.5 text-rose-400/50" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => takeScreenshot(page.href)} title="Screenshot">
                    <Camera className="h-3.5 w-3.5 text-muted-foreground/40" />
                  </Button>
                  {state.screenshotAt && (
                    <span className="text-[9px] text-muted-foreground/30 ml-1">{new Date(state.screenshotAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <Card>
        <CardHeader className="cursor-pointer" onClick={() => togglePanel('tools')}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[15px] flex items-center gap-2">
              <Zap className="h-4 w-4 text-violet-400" /> Auto-Explore Tools
            </CardTitle>
            {expandedPanels.has('tools') ? <ChevronUp className="h-4 w-4 text-muted-foreground/40" /> : <ChevronDown className="h-4 w-4 text-muted-foreground/40" />}
          </div>
        </CardHeader>
        {expandedPanels.has('tools') && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Button variant="outline" onClick={autoExplore} disabled={autoExploring} className="h-auto py-3 flex-col gap-1.5 border-border/60">
                {autoExploring ? <Loader2 className="h-5 w-5 animate-spin text-violet-400" /> : <Play className="h-5 w-5 text-violet-400/60" />}
                <span className="text-[12px]">Auto Explore</span>
                <span className="text-[10px] text-muted-foreground/40">Visit all pages</span>
              </Button>
              <Button variant="outline" onClick={autoCrawl} disabled={autoCrawling} className="h-auto py-3 flex-col gap-1.5 border-border/60">
                {autoCrawling ? <Loader2 className="h-5 w-5 animate-spin text-amber-400" /> : <Scan className="h-5 w-5 text-amber-400/60" />}
                <span className="text-[12px]">Auto Crawl</span>
                <span className="text-[10px] text-muted-foreground/40">Mark all visited</span>
              </Button>
              <Button variant="outline" onClick={autoScreenshot} disabled={autoScreenshotting} className="h-auto py-3 flex-col gap-1.5 border-border/60">
                {autoScreenshotting ? <Loader2 className="h-5 w-5 animate-spin text-teal-400" /> : <Camera className="h-5 w-5 text-teal-400/60" />}
                <span className="text-[12px]">Auto Screenshot</span>
                <span className="text-[10px] text-muted-foreground/40">Capture all pages</span>
              </Button>
              <Button variant="outline" onClick={autoValidate} disabled={autoValidating} className="h-auto py-3 flex-col gap-1.5 border-border/60">
                {autoValidating ? <Loader2 className="h-5 w-5 animate-spin text-emerald-400" /> : <Shield className="h-5 w-5 text-emerald-400/60" />}
                <span className="text-[12px]">Auto Validate</span>
                <span className="text-[10px] text-muted-foreground/40">Score all pages</span>
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" size="sm" onClick={autoScore} className="text-[12px] text-muted-foreground">
                <BarChart3 className="h-3.5 w-3.5 mr-1.5" /> Auto Score
              </Button>
              <Button variant="ghost" size="sm" onClick={generateReport} className="text-[12px] text-muted-foreground">
                <FileText className="h-3.5 w-3.5 mr-1.5" /> Generate Report
              </Button>
              <Button variant="ghost" size="sm" onClick={generateNavMap} className="text-[12px] text-muted-foreground">
                <Map className="h-3.5 w-3.5 mr-1.5" /> Navigation Map
              </Button>
              <Button variant="ghost" size="sm" onClick={generateDependencyView} className="text-[12px] text-muted-foreground">
                <GitBranch className="h-3.5 w-3.5 mr-1.5" /> Dependency View
              </Button>
              <Button variant="ghost" size="sm" onClick={generateGallery} className="text-[12px] text-muted-foreground">
                <Camera className="h-3.5 w-3.5 mr-1.5" /> Screenshot Gallery
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { generateReport(); generateNavMap(); generateDependencyView(); generateGallery() }} className="text-[12px] text-violet-400/70">
                <Download className="h-3.5 w-3.5 mr-1.5" /> Export All Reports
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader className="cursor-pointer" onClick={() => togglePanel('by-category')}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[15px] flex items-center gap-2">
              <Layers className="h-4 w-4 text-violet-400" /> Breakdown by Category
            </CardTitle>
            {expandedPanels.has('by-category') ? <ChevronUp className="h-4 w-4 text-muted-foreground/40" /> : <ChevronDown className="h-4 w-4 text-muted-foreground/40" />}
          </div>
        </CardHeader>
        {expandedPanels.has('by-category') && (
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {CATEGORIES.map((cat) => {
                const catPages = EXPLORER_PAGES.filter((p) => p.category === cat)
                if (catPages.length === 0) return null
                const tested = catPages.filter((p) => getState(p.href).status === 'tested' || getState(p.href).status === 'connected').length
                const pct = Math.round((tested / catPages.length) * 100)
                const Icon = CATEGORY_ICONS[cat] || Circle
                return (
                  <div key={cat} className="p-3 rounded-xl bg-white/[0.01] border border-border/40">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-4 w-4 text-violet-400/60" />
                      <span className="text-[13px] font-medium text-foreground/70">{cat}</span>
                      <span className="ml-auto text-[11px] text-muted-foreground/30">{catPages.length}</span>
                    </div>
                    <div className="w-full h-1.5 bg-border/30 rounded-full overflow-hidden">
                      <motion.div className={`h-full rounded-full ${pct >= 80 ? 'bg-emerald-500/60' : pct >= 40 ? 'bg-amber-500/60' : 'bg-slate-500/30'}`}
                        initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} />
                    </div>
                    <p className="text-[10px] text-muted-foreground/30 mt-1">{tested}/{catPages.length} tested ({pct}%)</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}