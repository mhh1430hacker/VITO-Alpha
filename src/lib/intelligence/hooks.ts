'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { loadProgress, saveProgress, recordAction, checkStreak, getKnowledgeLevel } from './engine'
import { getSuggestions } from './suggestions'
import type { UserProgress, StreakState, Suggestion, Achievement } from './types'
import { ACHIEVEMENTS } from './achievements'

export function useIntelligence() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress)
  const [lastUnlocked, setLastUnlocked] = useState<Achievement | null>(null)

  const streak = useMemo<StreakState>(() => checkStreak(progress), [progress])

  const track = useCallback((type: string, count: number = 1) => {
    setProgress(prev => {
      const updated = recordAction(prev, type, count)
      const unlocked = updated.unlockedIds.filter(id => !prev.unlockedIds.includes(id))
      if (unlocked.length > 0) {
        const ach = ACHIEVEMENTS.find(a => a.id === unlocked[unlocked.length - 1])
        if (ach) setLastUnlocked(ach)
      }
      return updated
    })
  }, [])

  const knowledgeLevel = useMemo(() => getKnowledgeLevel(progress.knowledgeScore), [progress.knowledgeScore])

  const suggestions = useMemo<Suggestion[]>(() => {
    return getSuggestions(progress).slice(0, 3)
  }, [progress])

  const recentAchievements = useMemo(() => {
    return progress.unlockedIds
      .map(id => ACHIEVEMENTS.find(a => a.id === id))
      .filter(Boolean)
      .reverse()
      .slice(0, 5)
  }, [progress.unlockedIds])

  const dismissSuggestion = useCallback((id: string) => {
    const dismissed = JSON.parse(localStorage.getItem('vito_dismissed_suggestions') || '[]')
    dismissed.push(id)
    localStorage.setItem('vito_dismissed_suggestions', JSON.stringify(dismissed))
  }, [])

  const clearLastUnlocked = useCallback(() => setLastUnlocked(null), [])

  const achievementProgress = useMemo(() => {
    const total = ACHIEVEMENTS.length
    const unlocked = progress.unlockedIds.length
    const percentage = total > 0 ? Math.round((unlocked / total) * 100) : 0
    return { total, unlocked, percentage }
  }, [progress.unlockedIds])

  return {
    progress,
    streak,
    track,
    knowledgeLevel,
    suggestions,
    recentAchievements,
    lastUnlocked,
    clearLastUnlocked,
    dismissSuggestion,
    achievementProgress,
  }
}

export function useTrackPageView(pageName: string) {
  const { track } = useIntelligence()

  useEffect(() => {
    if (pageName) {
      track('page_visit')
    }
  }, [pageName, track])
}
