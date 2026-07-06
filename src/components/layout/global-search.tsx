'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useUIStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import {
  Search,
  FileText,
  FlaskConical,
  Package,
  FolderKanban,
  Command,
  ArrowRight,
  Sparkles,
  Loader2,
} from 'lucide-react'

type SearchResult = {
  id: string
  type: 'formula' | 'material' | 'project' | 'supplier'
  title: string
  subtitle?: string
  href: string
}

const recentSearches: SearchResult[] = [
  { id: '1', type: 'formula', title: 'Rose Accord v3', subtitle: 'Updated 2h ago', href: '/formulations/library/1' },
  { id: '2', type: 'material', title: 'Bergamot EO', subtitle: 'In stock', href: '/materials/catalog/2' },
  { id: '3', type: 'project', title: 'Summer Collection 2026', subtitle: '12 formulas', href: '/projects/active/3' },
]

const searchables = [
  { id: 'f1', type: 'formula' as const, title: 'Rose Accord v3', subtitle: 'Floral - Rose', href: '/formulations/library/f1' },
  { id: 'f2', type: 'formula' as const, title: 'Oud Base', subtitle: 'Woody - Oud', href: '/formulations/library/f2' },
  { id: 'f3', type: 'formula' as const, title: 'Amber Fixative', subtitle: 'Amber - Warm', href: '/formulations/library/f3' },
  { id: 'f4', type: 'formula' as const, title: 'Citrus Top Note', subtitle: 'Citrus - Fresh', href: '/formulations/library/f4' },
  { id: 'm1', type: 'material' as const, title: 'Bergamot EO', subtitle: 'Citrus - Italy', href: '/materials/catalog/m1' },
  { id: 'm2', type: 'material' as const, title: 'Vanillin', subtitle: 'Sweet - Synthetic', href: '/materials/catalog/m2' },
  { id: 'm3', type: 'material' as const, title: 'Iso E Super', subtitle: 'Woody - Synthetic', href: '/materials/catalog/m3' },
  { id: 'p1', type: 'project' as const, title: 'Summer Collection 2026', subtitle: '12 formulas - Active', href: '/projects/active/p1' },
  { id: 'p2', type: 'project' as const, title: 'Luxury Home Line', subtitle: '8 formulas - Planning', href: '/projects/planning/p2' },
  { id: 's1', type: 'supplier' as const, title: 'Givaudan', subtitle: 'Switzerland', href: '/suppliers/directory/s1' },
  { id: 's2', type: 'supplier' as const, title: 'Firmenich', subtitle: 'Switzerland', href: '/suppliers/directory/s2' },
]

export function GlobalSearch() {
  const router = useRouter()
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [searchMode, setSearchMode] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(!commandPaletteOpen)
        if (!commandPaletteOpen) {
          setQuery('')
          setResults([])
          setSearchMode(false)
        }
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false)
        setQuery('')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [commandPaletteOpen, setCommandPaletteOpen])

  useEffect(() => {
    if (query.trim()) {
      const q = query.toLowerCase()
      const filtered = searchables.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.subtitle?.toLowerCase().includes(q) ||
          s.type.includes(q)
      )
      setResults(filtered)
      setSearchMode(true)
      setSelectedIndex(0)
    } else {
      setResults(searchables.slice(0, 5))
      setSearchMode(false)
    }
  }, [query])

  useEffect(() => {
    if (!commandPaletteOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
      }
      if (e.key === 'Enter' && results[selectedIndex]) {
        navigateTo(results[selectedIndex])
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [commandPaletteOpen, results, selectedIndex])

  const navigateTo = (result: SearchResult) => {
    setCommandPaletteOpen(false)
    setQuery('')
    router.push(result.href)
  }

  const typeIcon = (type: string) => {
    switch (type) {
      case 'formula':
        return FlaskConical
      case 'material':
        return Package
      case 'project':
        return FolderKanban
      default:
        return FileText
    }
  }

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm"
          onClick={() => setCommandPaletteOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-xl border bg-card shadow-2xl overflow-hidden"
          >
            <div className="flex items-center border-b px-4">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search formulas, materials, projects..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 border-0 bg-transparent px-3 py-3.5 text-sm outline-none placeholder:text-muted-foreground"
                autoFocus
              />
              <kbd className="hidden md:inline-flex h-5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <Command className="h-2.5 w-2.5" />
                K
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {results.length > 0 ? (
                <div className="space-y-0.5">
                  {!query && searchMode === false && (
                    <div className="px-2 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Recent
                    </div>
                  )}
                  {results.map((result, i) => {
                    const Icon = typeIcon(result.type)
                    return (
                      <button
                        key={result.id}
                        onClick={() => navigateTo(result)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                          i === selectedIndex ? 'bg-accent' : 'hover:bg-accent/60'
                        )}
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
                          <Icon className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium">{result.title}</p>
                          {result.subtitle && (
                            <p className="truncate text-xs text-muted-foreground">
                              {result.subtitle}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="rounded-md border bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium uppercase text-muted-foreground">
                            {result.type}
                          </span>
                          {i === selectedIndex && (
                            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              ) : query.trim() ? (
                <div className="flex flex-col items-center py-8 text-sm text-muted-foreground">
                  <Search className="mb-2 h-8 w-8" />
                  <p>No results found for &ldquo;{query}&rdquo;</p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  <div className="px-2 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Quick actions
                  </div>
                  {[
                    { icon: Sparkles, label: 'AI Generate Formula', desc: 'Create a new formula with AI', action: '/ai-lab/predictions' },
                    { icon: FlaskConical, label: 'New Formula Draft', desc: 'Start a blank formula', action: '/formulations/wizard' },
                    { icon: Package, label: 'Add Material', desc: 'Register a new material', action: '/materials/catalog' },
                    { icon: FolderKanban, label: 'Create Project', desc: 'Start a new project', action: '/projects/active' },
                  ].map((item, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setCommandPaletteOpen(false)
                        router.push(item.action)
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
                        <item.icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 border-t px-4 py-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <kbd className="inline-flex h-4 min-w-[16px] items-center justify-center rounded border bg-muted px-1 font-mono text-[10px]">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="inline-flex h-4 min-w-[16px] items-center justify-center rounded border bg-muted px-1 font-mono text-[10px]">↵</kbd>
                Open
              </span>
              <span className="flex items-center gap-1">
                <kbd className="inline-flex h-4 min-w-[16px] items-center justify-center rounded border bg-muted px-1 font-mono text-[10px]">Esc</kbd>
                Close
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
