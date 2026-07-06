'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore, useUIStore, useSidebarStore, useDemoStore, useInvestorStore, useAIAssistantStore, useWorkspaceStore } from '@/lib/store'
import { NotificationsButton } from './notifications-button'
import { cn } from '@/lib/utils'
import { DemoBadge } from '@/components/demo/demo-badge'
import { DemoModeToggle } from '@/components/demo/demo-mode-toggle'
import { DemoReset } from '@/components/demo/demo-reset'
import { PersonaBadge } from '@/components/ui/persona-badge'
import { motion } from 'framer-motion'
import {
  Search,
  ChevronDown,
  LogOut,
  UserCircle,
  Settings,
  Terminal,
  PanelLeftOpen,
  PanelLeftClose,
  Sparkles,
  TrendingUp,
  Building2,
  Bell,
  FlaskConical,
  Layers,
} from 'lucide-react'
import Link from 'next/link'

export function TopBar() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { collapsed, toggleCollapsed } = useSidebarStore()
  const { setCommandPaletteOpen } = useUIStore()
  const { setOpen: setAIOpen } = useAIAssistantStore()
  const { workspaces, activeWorkspaceId, setActiveWorkspace } = useWorkspaceStore()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [wsMenuOpen, setWsMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const wsMenuRef = useRef<HTMLDivElement>(null)

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setUserMenuOpen(false)
        setWsMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false)
      if (wsMenuRef.current && !wsMenuRef.current.contains(e.target as Node)) setWsMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <header className="h-16 border-b border-border/60 bg-[#0A0D12]/80 backdrop-blur-xl flex items-center px-4 gap-4 shrink-0 z-20">
      <div className="flex items-center gap-2">
        <button
          onClick={toggleCollapsed}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground/60 hover:text-foreground hover:bg-white/[0.04] transition-all duration-150"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>

        <div ref={wsMenuRef} className="relative">
          <button
            onClick={() => setWsMenuOpen(!wsMenuOpen)}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[13px] text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-all duration-150"
          >
            <Building2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline font-medium">{activeWorkspace?.name || 'Workspace'}</span>
            <ChevronDown className="h-3 w-3" />
          </button>
          {wsMenuOpen && (
            <div className="absolute left-0 top-full z-50 mt-1 w-56 overflow-hidden rounded-xl border border-border/60 bg-[#11161D] shadow-elevation-4 py-1.5">
              <div className="px-3 py-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/50">Workspaces</span>
              </div>
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => { setActiveWorkspace(ws.id); setWsMenuOpen(false) }}
                  className={cn(
                    'w-full px-3 py-2 text-left text-[13px] hover:bg-white/[0.04] flex items-center gap-3 transition-colors',
                    ws.id === activeWorkspaceId ? 'text-foreground font-medium' : 'text-muted-foreground'
                  )}
                >
                  <div className={cn(
                    'h-6 w-6 rounded bg-violet-500/10 flex items-center justify-center text-[10px] font-semibold',
                    ws.id === activeWorkspaceId ? 'text-violet-400' : 'text-muted-foreground'
                  )}>
                    {ws.name.charAt(0)}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="truncate">{ws.name}</p>
                    <p className="text-[11px] text-muted-foreground/50">{ws.memberCount} members</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex justify-center">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-[#0A0D12]/60 hover:border-border hover:bg-[#11161D] px-3.5 py-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-150 w-full max-w-[420px]"
        >
          <Search className="h-4 w-4 shrink-0 text-muted-foreground/50" />
          <span className="flex-1 text-left text-[13px]">Search anything...</span>
            <kbd className="hidden md:inline-flex h-6 select-none items-center gap-1 rounded-md border border-border/60 bg-[#171C24] px-2 font-mono text-[10px] font-medium text-muted-foreground/60">
              <Terminal className="h-3 w-3" />
              <span>K</span>
            </kbd>
        </button>
      </div>

      <div className="flex items-center gap-1">
        <PersonaBadge className="hidden sm:inline-flex" />
        <DemoBadge />

        <button
          onClick={() => setAIOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground/60 hover:text-violet-400 hover:bg-violet-500/10 transition-all duration-150"
          aria-label="AI Assistant"
        >
          <Sparkles className="h-4 w-4" />
        </button>

        <NotificationsButton />

        <div className="ml-1 w-px h-5 bg-border/60" />

        <div ref={userMenuRef} className="relative">
          <button
            className="flex h-8 items-center gap-2 rounded-lg px-2 text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-all duration-150"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            aria-label="User menu"
            aria-expanded={userMenuOpen}
          >
            <div className="h-6 w-6 rounded-full bg-violet-500/10 ring-1 ring-violet-500/20 flex items-center justify-center text-[11px] font-semibold text-violet-400">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <span className="text-[13px] font-medium hidden md:inline">{user?.full_name || 'User'}</span>
            <ChevronDown className="h-3 w-3 shrink-0" />
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 top-full z-50 mt-1 w-52 overflow-hidden rounded-xl border border-border/60 bg-[#11161D] shadow-elevation-4 py-1.5 animate-scale-in">
              <div className="px-3 py-2 border-b border-border/40">
                <p className="text-[13px] font-medium text-foreground truncate">{user?.full_name || 'User'}</p>
                <p className="text-[11px] text-muted-foreground/50 capitalize">{user?.role?.replace(/_/g, ' ')}</p>
              </div>
              <button
                className="w-full px-3 py-2 text-left text-[13px] hover:bg-white/[0.04] flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => { router.push('/settings/profile'); setUserMenuOpen(false) }}
              >
                <UserCircle className="h-4 w-4" /> Profile
              </button>
              <button
                className="w-full px-3 py-2 text-left text-[13px] hover:bg-white/[0.04] flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => { router.push('/settings/preferences'); setUserMenuOpen(false) }}
              >
                <Settings className="h-4 w-4" /> Settings
              </button>
              <div className="h-px bg-border/40 my-1" />
              <DemoModeToggle />
              <DemoReset />
              <div className="h-px bg-border/40 my-1" />
              <button
                className="w-full px-3 py-2 text-left text-[13px] hover:bg-white/[0.04] flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => {
                  const { isAuthenticated } = useInvestorStore.getState()
                  router.push(isAuthenticated ? '/investor' : '/investor/login')
                  setUserMenuOpen(false)
                }}
              >
                <TrendingUp className="h-4 w-4" /> Investor View
              </button>
              <div className="h-px bg-border/40 my-1" />
              <button
                className="w-full px-3 py-2 text-left text-[13px] hover:bg-white/[0.04] flex items-center gap-2.5 text-rose-400 transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
