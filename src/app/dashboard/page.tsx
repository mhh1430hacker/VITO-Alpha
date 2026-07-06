'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/store'
import { useToast } from '@/components/ui/toast'
import { ROUTES } from '@/lib/routes'
import api from '@/lib/api'
import { useIntelligenceContext, useTrackPageView, ACHIEVEMENTS, isFirstRun } from '@/lib/intelligence'
import { FirstMission } from '@/components/quick-start/first-mission'
import { SmartSuggestion } from '@/components/intelligence/smart-suggestion'
import { StreakIndicator } from '@/components/intelligence/streak-indicator'
import { KnowledgeScore } from '@/components/intelligence/knowledge-score'
import { ProgressRing } from '@/components/intelligence/progress-ring'
import {
  Users, Building2, Shield, Key, History,
  BarChart3, ArrowRight, Activity, Sparkles,
  UserCircle, ChevronRight, Zap, TrendingUp, Globe, Terminal,
  FlaskConical, Lightbulb, Trophy, Brain,
} from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
}

export default function DashboardPage() {
  useTrackPageView('dashboard')
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const toast = useToast()
  const [mounted, setMounted] = useState(false)
  const [dashboardStats, setDashboardStats] = useState<Record<string, unknown> | null>(null)

  const {
    streak, knowledgeLevel, suggestions, recentAchievements,
    dismissSuggestion, achievementProgress,
  } = useIntelligenceContext()

  const [firstRun, setFirstRun] = useState(false)

  useEffect(() => {
    setMounted(true)
    setFirstRun(isFirstRun())
    if (!token || !user) {
      router.push('/login')
      return
    }
    if (user?.role === 'super_admin') {
      api.get('/api/v1/auth/admin/dashboard').then(r => {
        setDashboardStats(r.data)
      }).catch(() => {
        toast.warning('Dashboard stats unavailable', 'Some metrics could not be loaded')
      })
    }
  }, [token, user, router])

  if (!mounted || !user) return null

  const isAdmin = user.role === 'super_admin' || user.role === 'company_admin'

  const stats = [
    { label: 'Knowledge Score', value: knowledgeLevel.label, icon: Brain, color: 'from-violet-500 to-purple-500', sub: `${knowledgeLevel.nextAt < Infinity ? `Next: ${knowledgeLevel.nextAt}` : 'MAX'}` },
    { label: 'Day Streak', value: `${streak.current} days`, icon: Zap, color: 'from-amber-500 to-orange-500', sub: streak.isActiveToday ? 'Active today' : 'Log in now!' },
    { label: 'Achievements', value: `${achievementProgress.unlocked}/${achievementProgress.total}`, icon: Trophy, color: 'from-emerald-500 to-teal-500', sub: `${achievementProgress.percentage}% complete` },
    { label: 'Skill Level', value: 'Explorer', icon: TrendingUp, color: 'from-sky-500 to-blue-500', sub: `${streak.multiplier.toFixed(1)}x multiplier` },
  ]

  const adminLinks = [
    {
      section: 'Administration',
      items: [
        { href: ROUTES.DASHBOARD_EXECUTIVE, label: 'Executive Dashboard', icon: TrendingUp, desc: 'Revenue, KPIs, and business intelligence', color: 'from-violet-500 to-purple-500' },
        { href: ROUTES.ADMIN_USERS, label: 'User Management', icon: Users, desc: 'Provisioning, roles, and access controls', color: 'from-blue-500 to-indigo-500' },
        { href: ROUTES.ADMIN_TEAMS, label: 'Teams', icon: Building2, desc: 'Organization structure and collaboration', color: 'from-teal-500 to-cyan-500' },
      ]
    },
    {
      section: 'Security & Compliance',
      items: [
        { href: ROUTES.ADMIN_AUDIT_TRAIL, label: 'Audit Trail', icon: History, desc: 'Complete activity logs and traceability', color: 'from-amber-500 to-orange-500' },
        { href: ROUTES.ADMIN_ROLES, label: 'Roles & Permissions', icon: Shield, desc: 'RBAC configuration and policies', color: 'from-emerald-500 to-green-500' },
        { href: ROUTES.ADMIN_API_KEYS, label: 'API Keys', icon: Key, desc: 'Programmatic access management', color: 'from-sky-500 to-blue-500' },
      ]
    },
    {
      section: 'Platform',
      items: [
        { href: ROUTES.DASHBOARD_OPERATIONS, label: 'Operations', icon: Activity, desc: 'System health and monitoring', color: 'from-rose-500 to-red-500' },
        { href: ROUTES.ADMIN_BILLING, label: 'Billing', icon: BarChart3, desc: 'Plans, invoices, subscriptions', color: 'from-amber-500 to-orange-500' },
        { href: ROUTES.ANALYTICS_PERFORMANCE, label: 'Analytics', icon: TrendingUp, desc: 'Platform-wide analytics and insights', color: 'from-cyan-500 to-teal-500' },
      ]
    },
  ]

  const userLinks = [
    { href: ROUTES.DASHBOARD_PERFUMER, label: 'Perfumer Studio', icon: FlaskConical, desc: 'Creative workspace for fragrance design', color: 'from-violet-500 to-purple-500' },
    { href: ROUTES.FORMULATION_STUDIO, label: 'Formulation Studio', icon: Zap, desc: 'Design and refine fragrance formulas', color: 'from-blue-500 to-indigo-500' },
    { href: ROUTES.MATERIALS_CATALOG, label: 'Materials Catalog', icon: Globe, desc: 'Browse and manage raw materials', color: 'from-teal-500 to-cyan-500' },
    { href: ROUTES.AI_LAB, label: 'AI Lab', icon: Terminal, desc: 'ML models, predictions, and optimization', color: 'from-amber-500 to-orange-500' },
    { href: ROUTES.SETTINGS_PROFILE, label: 'Profile Settings', icon: UserCircle, desc: 'Manage your account preferences', color: 'from-slate-500 to-gray-500' },
  ]

  const sections = isAdmin ? adminLinks : [{ section: 'Workspace', items: userLinks }]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-8 space-y-8"
    >
      {/* First Mission for newcomers */}
      {firstRun && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <FirstMission onComplete={() => setFirstRun(false)} />
        </motion.div>
      )}

      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-end justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-foreground">
            {firstRun ? 'Let\'s Get Started' : `Welcome back, ${user.full_name?.split(' ')[0] || 'User'}`}
          </h1>
          <p className="mt-1 text-muted-foreground/50 text-[15px]">
            {firstRun ? 'Your first mission awaits — 3 steps to master VITO' : 'Olfactory Intelligence Command Center'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <KnowledgeScore score={streak.current * 3 + achievementProgress.unlocked * 5} level={knowledgeLevel} />
        </div>
      </motion.div>

      {/* Show minimal state during first mission */}
      {firstRun && (
        <motion.div variants={itemVariants} className="flex items-center gap-3 rounded-xl border border-violet-500/10 bg-violet-500/5 px-5 py-3">
          <span className="text-sm">💡</span>
          <p className="text-sm text-violet-300/80">
            Complete your first mission above to unlock the full dashboard experience.
          </p>
        </motion.div>
      )}

      {/* Intelligence KPI Strip */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label} variant="default" className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-1.5 rounded-lg bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <stat.icon className="h-3.5 w-3.5 text-white" />
                </div>
              </div>
              <p className="text-xl font-bold text-foreground tracking-tight">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground/50 mt-0.5 font-medium">{stat.label}</p>
              <p className="text-[10px] text-muted-foreground/30">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main Content: Smart Suggestions + Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Navigation sections */}
        <div className="lg:col-span-3 space-y-8">
          {sections.map((section) => (
            <motion.div key={section.section} variants={itemVariants}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/30 mb-4">
                {section.section}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {section.items.map((link) => (
                  <motion.div
                    key={link.href}
                    whileHover={{ y: -2 }}
                    onClick={() => router.push(link.href)}
                    className="group cursor-pointer"
                  >
                    <Card variant="default" className="h-full hover:border-violet-500/20 transition-colors">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${link.color} shadow-lg shrink-0`}>
                            <link.icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-[14px] text-foreground mb-1">{link.label}</h3>
                            <p className="text-[12px] text-muted-foreground/50 leading-relaxed">{link.desc}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground/20 group-hover:text-muted-foreground/50 transition-colors self-center shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right: Intelligence Sidebar */}
        <div className="space-y-4">
          <SmartSuggestion suggestions={suggestions} onDismiss={dismissSuggestion} />

          {/* Recent Achievements */}
          {recentAchievements.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                  Recent Rewards
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
              </div>
              {recentAchievements.slice(0, 4).map((ach) => ach && (
                <motion.div
                  key={ach.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 rounded-xl border border-white/5 p-3"
                  style={{ background: 'rgba(23,28,36,0.6)' }}
                >
                  <span className="text-xl">{ach.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{ach.title}</p>
                    <p className="text-[10px] text-white/40">+{ach.points} XP · {ach.rarity}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Achievement Progress */}
          <div className="rounded-xl border border-white/5 p-4" style={{ background: 'rgba(23,28,36,0.6)' }}>
            <div className="flex items-center gap-3 mb-3">
              <ProgressRing value={achievementProgress.unlocked} max={achievementProgress.total} size={40} strokeWidth={4} color="#a855f7" />
              <div>
                <p className="text-xs font-semibold text-white">Achievement Progress</p>
                <p className="text-[10px] text-white/40">{achievementProgress.unlocked} of {achievementProgress.total} unlocked</p>
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-violet-400"
                initial={{ width: 0 }}
                animate={{ width: `${achievementProgress.percentage}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
