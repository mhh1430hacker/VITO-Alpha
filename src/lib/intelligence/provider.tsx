'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useIntelligence } from './hooks'
import type { UserProgress, StreakState, Suggestion, Achievement } from './types'

interface IntelligenceContextType {
  progress: UserProgress
  streak: StreakState
  track: (type: string, count?: number) => void
  knowledgeLevel: { label: string; color: string; nextAt: number }
  suggestions: Suggestion[]
  recentAchievements: (Achievement | undefined)[]
  lastUnlocked: Achievement | null
  clearLastUnlocked: () => void
  dismissSuggestion: (id: string) => void
  achievementProgress: { total: number; unlocked: number; percentage: number }
}

const IntelligenceContext = createContext<IntelligenceContextType | null>(null)

export function IntelligenceProvider({ children }: { children: ReactNode }) {
  const intelligence = useIntelligence()
  return (
    <IntelligenceContext.Provider value={intelligence}>
      {children}
    </IntelligenceContext.Provider>
  )
}

export function useIntelligenceContext() {
  const ctx = useContext(IntelligenceContext)
  if (!ctx) throw new Error('useIntelligenceContext must be used within IntelligenceProvider')
  return ctx
}
