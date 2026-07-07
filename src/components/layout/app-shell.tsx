'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Sidebar } from './sidebar'
import { TopBar } from './topbar'
import { Breadcrumbs } from './breadcrumbs'
import { AIAssistantDock } from './ai-assistant-dock'
import { GlobalSearch } from './global-search'
import { QuickActions } from './quick-actions'
import { DemoScriptBar } from '@/components/demo/demo-script-bar'
import { useAuthStore, useDemoStore } from '@/lib/store'
import { PUBLIC_ROUTES } from '@/lib/routes'
import { useIntelligenceContext } from '@/lib/intelligence'
import { AchievementToast } from '@/components/intelligence/achievement-toast'
import { Confetti } from '@/components/intelligence/confetti'
import { useAlpha } from '@/lib/alpha/provider'

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, token } = useAuthStore()
  const isPublic = PUBLIC_ROUTES.some(r => pathname === r || pathname.startsWith(`${r}/`))
  const [hydrated, setHydrated] = useState(false)
  const { isAlpha } = useAlpha()

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (isAlpha) return
    if (hydrated && !user && !isPublic) {
      router.push('/login')
    }
  }, [hydrated, user, router, isPublic, pathname, isAlpha])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        useDemoStore.getState().setDemoMode(!useDemoStore.getState().isDemoMode)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const { lastUnlocked, clearLastUnlocked, progress } = useIntelligenceContext()

  if (isPublic || isAlpha) return <>{children}</>

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0A0D12]">
        <div className="w-8 h-8 rounded-full border-2 border-violet-500/20 border-t-violet-500 animate-spin" />
      </div>
    )
  }

  if (!user || !token) return null

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0D12]">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-violet-500 focus:text-white focus:rounded-xl">
        Skip to content
      </a>
      <GlobalSearch />
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <Breadcrumbs />
        <main id="main-content" className="flex-1 overflow-y-auto" tabIndex={-1}>
          {children}
        </main>
      </div>
      <AIAssistantDock />
      <QuickActions />
      <DemoScriptBar />
      <AchievementToast achievement={lastUnlocked} onDismiss={clearLastUnlocked} />
      <Confetti trigger={!!lastUnlocked} />
    </div>
  )
}
