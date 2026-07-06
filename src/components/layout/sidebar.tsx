'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useAuthStore, useSidebarStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { KnowledgeScore } from '@/components/intelligence/knowledge-score'
import { StreakIndicator } from '@/components/intelligence/streak-indicator'
import { useIntelligenceContext } from '@/lib/intelligence'
import { ProgressRing } from '@/components/intelligence/progress-ring'
import {
  LayoutDashboard, FlaskConical, Package, FolderKanban, Brain, ShieldCheck,
  BarChart3, Settings, ChevronLeft, ChevronRight, ChevronDown,
  Users, FileText, TestTube, Database, GitBranch, Beaker,
  Scale, Key, CreditCard, UserCircle, Link as LinkIcon,
  TrendingUp, Activity, Clock, MessageSquare,
  ArrowRightLeft, Lightbulb, Search, Receipt, Book,
  Sparkles, Globe, Map, Zap, LineChart,
  Building2, ExternalLink, MessageCircle, Star, PanelLeft,
  Layers, Radio,
} from 'lucide-react'

interface NavItem {
  id: string
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: string[]
  badge?: string | number
}

interface NavSection {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  roles: string[]
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    id: 'workspace',
    label: 'Workspace',
    icon: LayoutDashboard,
    roles: ['*'],
    items: [
      { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['*'] },
      { id: 'projects', label: 'Projects', href: '/projects/active', icon: FolderKanban, roles: ['*'] },
      { id: 'materials', label: 'Materials', href: '/materials/catalog', icon: Package, roles: ['*'] },
      { id: 'formulas', label: 'Formulas', href: '/formulations/library', icon: FlaskConical, roles: ['*'] },
    ],
  },
  {
    id: 'research',
    label: 'Research',
    icon: TestTube,
    roles: ['ai_engineer', 'ai_researcher', 'r_and_d_manager', 'master_perfumer', 'lab_scientist'],
    items: [
      { id: 'ai-lab', label: 'AI Lab', href: '/ai-lab', icon: Brain, roles: ['ai_engineer', 'ai_researcher', 'r_and_d_manager', 'master_perfumer'] },
      { id: 'formulation-studio', label: 'Studio', href: '/formulation-studio', icon: Beaker, roles: ['master_perfumer', 'r_and_d_manager', 'lab_scientist'] },
      { id: 'predictions', label: 'Predictions', href: '/ai-lab/predictions', icon: LineChart, roles: ['master_perfumer', 'r_and_d_manager', 'ai_engineer', 'lab_scientist'] },
      { id: 'experiments', label: 'Experiments', href: '/ai-lab/experiments', icon: TestTube, roles: ['ai_engineer', 'ai_researcher'] },
      { id: 'optimization', label: 'Optimization', href: '/ai-lab/optimization', icon: TrendingUp, roles: ['master_perfumer', 'r_and_d_manager', 'ai_engineer'] },
    ],
  },
  {
    id: 'business',
    label: 'Business',
    icon: Building2,
    roles: ['executive', 'admin', 'procurement_manager', 'operations_manager', 'r_and_d_manager'],
    items: [
      { id: 'executive', label: 'Executive', href: '/dashboard/executive', icon: TrendingUp, roles: ['executive', 'admin'] },
      { id: 'billing', label: 'Billing', href: '/admin/billing', icon: CreditCard, roles: ['admin', 'executive'] },
      { id: 'supplier-directory', label: 'Suppliers', href: '/suppliers/directory', icon: Globe, roles: ['procurement_manager', 'operations_manager', 'admin'] },
      { id: 'analytics', label: 'Analytics', href: '/analytics/performance', icon: BarChart3, roles: ['r_and_d_manager', 'executive', 'master_perfumer', 'admin'] },
      { id: 'cost-analysis', label: 'Cost Analysis', href: '/materials/pricing', icon: Receipt, roles: ['procurement_manager', 'operations_manager', 'r_and_d_manager', 'executive', 'admin'] },
    ],
  },
  {
    id: 'administration',
    label: 'Administration',
    icon: Settings,
    roles: ['admin', 'executive'],
    items: [
      { id: 'users', label: 'Users', href: '/admin/users', icon: Users, roles: ['admin'] },
      { id: 'teams', label: 'Teams', href: '/admin/teams', icon: Users, roles: ['admin', 'r_and_d_manager'] },
      { id: 'roles', label: 'Roles', href: '/admin/roles', icon: ShieldCheck, roles: ['admin'] },
      { id: 'audit-trail', label: 'Audit Trail', href: '/admin/audit-trail', icon: Clock, roles: ['admin', 'compliance_officer'] },
      { id: 'api-keys', label: 'API Keys', href: '/admin/api-keys', icon: Key, roles: ['admin', 'ai_engineer'] },
      { id: 'sso', label: 'SSO / SAML', href: '/admin/sso', icon: LinkIcon, roles: ['admin'] },
    ],
  },
  {
    id: 'platform',
    label: 'Platform',
    icon: Zap,
    roles: ['*'],
    items: [
      { id: 'ai-models', label: 'AI Models', href: '/ai-lab/models', icon: Brain, roles: ['ai_engineer', 'ai_researcher', 'r_and_d_manager', 'admin'] },
      { id: 'embeddings', label: 'Embeddings', href: '/ai-lab/embeddings', icon: GitBranch, roles: ['ai_engineer', 'ai_researcher', 'master_perfumer'] },
      { id: 'compliance-center', label: 'Compliance', href: '/compliance/ifra', icon: ShieldCheck, roles: ['compliance_officer', 'master_perfumer', 'r_and_d_manager', 'lab_scientist', 'operations_manager', 'executive', 'admin'] },
      { id: 'monitoring', label: 'Monitoring', href: '/dashboard/operations', icon: Radio, roles: ['admin', 'ai_engineer', 'operations_manager'] },
      { id: 'inventory', label: 'Inventory', href: '/materials/inventory', icon: Package, roles: ['operations_manager', 'procurement_manager', 'lab_scientist', 'admin'] },
      { id: 'super-intelligence', label: 'Super Intelligence', href: '/super-intelligence', icon: Sparkles, roles: ['*'] },
    ],
  },
  {
    id: 'intelligence',
    label: 'Intelligence Suite',
    icon: Brain,
    roles: ['*'],
    items: [
      { id: 'intel-hub', label: 'Intelligence Hub', href: '/intelligence', icon: Brain, roles: ['*'] },
      { id: 'intel-accelerator', label: 'Formula Accelerator', href: '/intelligence/accelerator', icon: Zap, roles: ['*'] },
      { id: 'intel-compliance', label: 'Regulatory AI', href: '/intelligence/compliance', icon: ShieldCheck, roles: ['*'] },
      { id: 'intel-ingestion', label: 'Data Ingestion', href: '/intelligence/data-ingestion', icon: Database, roles: ['*'] },
      { id: 'intel-knowledge', label: 'Knowledge Vault', href: '/intelligence/knowledge-vault', icon: Book, roles: ['*'] },
      { id: 'intel-materials', label: 'Material AI', href: '/intelligence/materials', icon: Package, roles: ['*'] },
      { id: 'intel-predictor', label: 'Success Predictor', href: '/intelligence/success-predictor', icon: TrendingUp, roles: ['*'] },
      { id: 'intel-experiments', label: 'Experiment Optimizer', href: '/intelligence/experiments', icon: TestTube, roles: ['*'] },
      { id: 'intel-reports', label: 'Report Studio', href: '/intelligence/reports', icon: BarChart3, roles: ['*'] },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: UserCircle,
    roles: ['*'],
    items: [
      { id: 'profile', label: 'Profile', href: '/settings/profile', icon: UserCircle, roles: ['*'] },
      { id: 'preferences', label: 'Preferences', href: '/settings/preferences', icon: Settings, roles: ['*'] },
      { id: 'notifications', label: 'Notifications', href: '/settings/notifications', icon: Sparkles, roles: ['*'] },
      { id: 'integrations', label: 'Integrations', href: '/settings/integrations', icon: LinkIcon, roles: ['admin', 'ai_engineer'] },
      { id: 'data', label: 'Data', href: '/settings/data', icon: Database, roles: ['admin'] },
    ],
  },
]

const footerResources = [
  { id: 'docs', label: 'Documentation', href: '#', icon: Book },
  { id: 'feedback', label: 'Feedback', href: '#', icon: MessageCircle },
  { id: 'roadmap', label: 'Roadmap', href: '#', icon: Map },
  { id: 'support', label: 'Support', href: '#', icon: MessageSquare },
]

function hasAccess(roles: string[], userRole: string | undefined): boolean {
  if (!userRole) return false
  if (roles.includes('*')) return true
  return roles.includes(userRole as string)
}

function roleLabel(role: string | undefined): string {
  if (!role) return 'User'
  return role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function roleEnvironment(role: string | undefined): string {
  if (!role) return 'Development'
  if (role === 'admin') return 'Production'
  return 'Staging'
}

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const { collapsed, sectionsExpanded, toggleCollapsed, toggleSection, setActiveSection } = useSidebarStore()
  const userRole = user?.role
  const { knowledgeLevel, streak, achievementProgress } = useIntelligenceContext()

  const handleNavClick = (itemId: string) => {
    setActiveSection(itemId)
  }

  const displayedSections = navSections.filter(section => {
    if (!hasAccess(section.roles, userRole)) return false
    return section.items.some(item => hasAccess(item.roles, userRole))
  })

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-border/60 bg-[#0A0D12] transition-all duration-300 h-screen sticky top-0 overflow-hidden z-30',
        collapsed ? 'w-[72px]' : 'w-[288px]'
      )}
    >
      <div className={cn(
        'flex items-center h-16 border-b border-border/60 px-5 shrink-0',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="font-semibold text-[15px] tracking-tight text-foreground/90 group-hover:text-foreground transition-colors">
              VITO
            </span>
          </Link>
        )}
        {collapsed && (
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <span className="text-white font-bold text-sm">V</span>
          </div>
        )}
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg"
            onClick={toggleCollapsed}
            aria-label="Collapse sidebar"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 scrollbar-thin space-y-6">
        {displayedSections.map((section) => {
          const visibleItems = section.items.filter((item) => hasAccess(item.roles, userRole))
          if (visibleItems.length === 0) return null

          const isExpanded = sectionsExpanded[section.id] ?? true

          return (
            <div key={section.id}>
              {!collapsed && (
                <div
                  onClick={() => toggleSection(section.id)}
                  className="px-2 mb-1 flex items-center justify-between cursor-pointer group select-none"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/50 group-hover:text-muted-foreground/70 transition-colors">
                    {section.label}
                  </span>
                  <motion.div
                    animate={{ rotate: isExpanded ? 0 : -90 }}
                    transition={{ duration: 0.15 }}
                  >
                    <ChevronDown className="h-3 w-3 text-muted-foreground/30" />
                  </motion.div>
                </div>
              )}

              <AnimatePresence initial={false}>
                {(collapsed || isExpanded) && (
                  <motion.div
                    initial={!collapsed ? { height: 0, opacity: 0 } : false}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-0.5 overflow-hidden"
                  >
                    {collapsed && (
                      <div className="flex items-center justify-center mb-1.5 pt-0.5">
                        <section.icon className="h-4 w-4 text-muted-foreground/40" />
                      </div>
                    )}
                    {visibleItems.map((item) => {
                      const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'))
                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => handleNavClick(item.id)}
                          title={collapsed ? item.label : undefined}
                          className={cn(
                            'flex items-center gap-2.5 rounded-lg transition-all duration-150 relative group/page',
                            collapsed ? 'justify-center px-0 py-2 mx-auto w-10' : 'px-2.5 py-2',
                            isActive
                              ? 'bg-violet-500/10 text-violet-400 font-medium shadow-[0_0_12px_rgba(139,92,246,0.08)]'
                              : 'text-muted-foreground/60 hover:text-foreground/80 hover:bg-white/[0.04] hover:translate-x-[2px]'
                          )}
                        >
                          {isActive && !collapsed && (
                            <motion.div
                              layoutId="sidebar-active-indicator"
                              className="absolute left-0 top-1.5 bottom-1.5 w-[4px] bg-violet-500 rounded-r-full"
                              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                            />
                          )}
                          <item.icon className={cn(
                            'shrink-0 transition-transform duration-150 group-hover/page:scale-105',
                            collapsed ? 'h-5 w-5' : 'h-4 w-4',
                            isActive ? 'text-violet-400' : 'text-muted-foreground/40 group-hover/page:text-foreground/60'
                          )} />
                          {!collapsed && (
                            <span className="text-[13px] truncate font-[450]">{item.label}</span>
                          )}
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </nav>

      {!collapsed && (
        <div className="border-t border-border/60 py-3 px-4 space-y-3 shrink-0">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/50">
              Resources
            </span>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5">
            {footerResources.map((res) => (
              <Link
                key={res.id}
                href={res.href}
                className="text-[11px] text-muted-foreground/50 hover:text-muted-foreground/80 transition-colors inline-flex items-center gap-1"
              >
                <res.icon className="h-3 w-3" />
                {res.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500/60 animate-pulse-soft" />
            <span className="text-[10px] text-muted-foreground/40 font-mono">v2.4.0</span>
            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-400/70">
              {roleEnvironment(userRole)}
            </span>
          </div>
        </div>
      )}

      <div className={cn(
        'border-t border-border/60 shrink-0',
        collapsed ? 'p-3' : 'p-4'
      )}>
        {collapsed ? (
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-violet-500/10 ring-1 ring-violet-500/20 flex items-center justify-center text-xs font-semibold text-violet-400">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <ProgressRing value={achievementProgress.unlocked} max={achievementProgress.total} size={32} strokeWidth={3} color="#a855f7" />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-violet-500/10 ring-1 ring-violet-500/20 flex items-center justify-center text-xs font-semibold text-violet-400 shrink-0">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold truncate text-foreground/80">{user?.full_name || 'User'}</p>
                <p className="text-[11px] text-muted-foreground/50 truncate">{roleLabel(userRole)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-white/[0.02] px-3 py-2">
              <KnowledgeScore score={streak.current * 3 + achievementProgress.unlocked * 5} level={knowledgeLevel} />
              <StreakIndicator streak={streak} />
            </div>

            <div className="flex items-center gap-3">
              <ProgressRing value={achievementProgress.unlocked} max={achievementProgress.total} size={36} strokeWidth={3} color="#a855f7" label="Achievements" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Mastery</span>
                  <span className="text-[10px] text-muted-foreground/40">{achievementProgress.percentage}%</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-violet-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${achievementProgress.percentage}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
