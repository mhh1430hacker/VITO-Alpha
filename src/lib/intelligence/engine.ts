import type { UserProgress, StreakState, SkillBadge, KnowledgeDomain, Achievement } from './types'
import { ACHIEVEMENTS } from './achievements'

const STORAGE_KEY = 'vito_intelligence'

export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') return defaultProgress()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultProgress()
    return { ...defaultProgress(), ...JSON.parse(raw) }
  } catch {
    return defaultProgress()
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }
}

function defaultProgress(): UserProgress {
  return {
    achievements: {},
    unlockedIds: [],
    knowledgeScore: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    totalActions: 0,
    weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
    skillLevels: {},
  }
}

export function checkStreak(progress: UserProgress): StreakState {
  const today = new Date().toISOString().split('T')[0]
  const lastActive = progress.lastActiveDate

  let current = progress.currentStreak
  let longest = progress.longestStreak
  let isActiveToday = lastActive === today

  if (!isActiveToday && lastActive !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    if (lastActive === yesterday) {
      current = progress.currentStreak
    } else {
      current = 0
    }
  }

  const multiplier = Math.min(1 + current * 0.02, 3)

  return { current, longest, lastActive, isActiveToday, multiplier }
}

export function recordAction(progress: UserProgress, type: string, count: number = 1): UserProgress {
  const updated = { ...progress, totalActions: progress.totalActions + count }

  if (type === 'daily_login') {
    const today = new Date().toISOString().split('T')[0]
    updated.lastActiveDate = today
    const todayIndex = new Date().getDay()
    const weekly = [...updated.weeklyActivity]
    weekly[todayIndex] = (weekly[todayIndex] || 0) + 1
    updated.weeklyActivity = weekly

    if (today !== progress.lastActiveDate) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      if (progress.lastActiveDate === yesterday || !progress.lastActiveDate) {
        updated.currentStreak = progress.currentStreak + 1
      } else {
        updated.currentStreak = 1
      }
      updated.longestStreak = Math.max(updated.currentStreak, progress.longestStreak)
    }
  }

  const knowledgeScore = recalculateScore(updated)
  updated.knowledgeScore = knowledgeScore

  const newlyUnlocked = checkAchievements(updated)
  updated.unlockedIds = [...new Set([...updated.unlockedIds, ...newlyUnlocked.map(a => a.id)])]

  updated.achievements = { ...progress.achievements }
  for (const a of newlyUnlocked) {
    updated.achievements[a.id] = { ...a, unlockedAt: new Date().toISOString() }
  }

  saveProgress(updated)
  return updated
}

function recalculateScore(progress: UserProgress): number {
  const achievementPoints = progress.unlockedIds.reduce((sum, id) => {
    const ach = ACHIEVEMENTS.find(a => a.id === id)
    return sum + (ach?.points || 0)
  }, 0)
  const streakBonus = Math.floor(progress.currentStreak * 2)
  const activityBonus = progress.weeklyActivity.reduce((a, b) => a + b, 0) * 0.5
  return Math.floor(achievementPoints + streakBonus + activityBonus)
}

function checkAchievements(progress: UserProgress): Achievement[] {
  return ACHIEVEMENTS.filter(ach => {
    if (progress.unlockedIds.includes(ach.id)) return false
    return evaluateCondition(ach, progress)
  })
}

function evaluateCondition(ach: Achievement, progress: UserProgress): boolean {
  if (!ach.condition) return false
  const { type, threshold } = ach.condition

  switch (type) {
    case 'page_visit':
      return Object.keys(progress.achievements).filter(k => k.startsWith('visited_')).length >= threshold
    case 'streak_days':
      return progress.currentStreak >= threshold
    case 'daily_login':
      return progress.currentStreak >= threshold
    default:
      return false
  }
}

export const SKILL_BADGES: SkillBadge[] = [
  { domain: 'formulation', level: 1, label: 'Novice Blender', icon: '🌱', color: '#a1a1aa', description: 'Created your first formula' },
  { domain: 'formulation', level: 2, label: 'Apprentice Blender', icon: '🌿', color: '#22c55e', description: '5 formulas created' },
  { domain: 'formulation', level: 3, label: 'Skilled Blender', icon: '🌺', color: '#06b6d4', description: '15 formulas created' },
  { domain: 'formulation', level: 4, label: 'Master Blender', icon: '⚜️', color: '#a855f7', description: '40 formulas created' },
  { domain: 'formulation', level: 5, label: 'Grand Perfumer', icon: '👑', color: '#f59e0b', description: '100 formulas created' },
  { domain: 'materials', level: 1, label: 'Material Scout', icon: '🔍', color: '#a1a1aa', description: 'Browsed 10 materials' },
  { domain: 'materials', level: 2, label: 'Material Collector', icon: '📦', color: '#22c55e', description: '50 materials browsed' },
  { domain: 'materials', level: 3, label: 'Material Specialist', icon: '🧪', color: '#06b6d4', description: '150 materials browsed' },
  { domain: 'materials', level: 4, label: 'Material Scholar', icon: '📚', color: '#a855f7', description: '350 materials browsed' },
  { domain: 'materials', level: 5, label: 'Material Sage', icon: '🔮', color: '#f59e0b', description: '700 materials browsed' },
  { domain: 'ai_models', level: 1, label: 'AI Curious', icon: '🤖', color: '#a1a1aa', description: '1 AI prediction run' },
  { domain: 'ai_models', level: 2, label: 'AI Student', icon: '🧠', color: '#22c55e', description: '10 predictions run' },
  { domain: 'ai_models', level: 3, label: 'AI Practitioner', icon: '💡', color: '#06b6d4', description: '50 predictions run' },
  { domain: 'ai_models', level: 4, label: 'AI Expert', icon: '⚡', color: '#a855f7', description: '200 predictions run' },
  { domain: 'ai_models', level: 5, label: 'AI Oracle', icon: '🔮', color: '#f59e0b', description: '500 predictions run' },
  { domain: 'compliance', level: 1, label: 'Compliance Trainee', icon: '📋', color: '#a1a1aa', description: '1 compliance check' },
  { domain: 'compliance', level: 2, label: 'Compliance Monitor', icon: '✅', color: '#22c55e', description: '10 compliance checks' },
  { domain: 'compliance', level: 3, label: 'Compliance Guardian', icon: '🛡️', color: '#06b6d4', description: '50 compliance checks' },
  { domain: 'compliance', level: 4, label: 'Compliance Sentinel', icon: '🏰', color: '#a855f7', description: '150 compliance checks' },
  { domain: 'compliance', level: 5, label: 'Compliance Legend', icon: '👼', color: '#f59e0b', description: '500 compliance checks' },
  { domain: 'analytics', level: 1, label: 'Data Viewer', icon: '📊', color: '#a1a1aa', description: '1 report generated' },
  { domain: 'analytics', level: 2, label: 'Data Analyst', icon: '📈', color: '#22c55e', description: '10 reports generated' },
  { domain: 'analytics', level: 3, label: 'Data Scientist', icon: '📉', color: '#06b6d4', description: '50 reports generated' },
  { domain: 'analytics', level: 4, label: 'Data Master', icon: '📊', color: '#a855f7', description: '150 reports generated' },
  { domain: 'analytics', level: 5, label: 'Data Oracle', icon: '📜', color: '#f59e0b', description: '500 reports generated' },
  { domain: 'platform', level: 1, label: 'Platform Newcomer', icon: '🚀', color: '#a1a1aa', description: 'Complete onboarding' },
  { domain: 'platform', level: 2, label: 'Platform Regular', icon: '⭐', color: '#22c55e', description: '7-day active user' },
  { domain: 'platform', level: 3, label: 'Platform Expert', icon: '🌟', color: '#06b6d4', description: '30-day active user' },
  { domain: 'platform', level: 4, label: 'Platform Champion', icon: '🏆', color: '#a855f7', description: '90-day active user' },
  { domain: 'platform', level: 5, label: 'Platform Legend', icon: '👑', color: '#f59e0b', description: '365-day active user' },
]

export function getSkillBadge(domain: KnowledgeDomain, score: number, streaks: number): SkillBadge | null {
  const badges = SKILL_BADGES.filter(b => b.domain === domain)
  const effectiveScore = score + streaks * 5
  if (effectiveScore < 10) return null
  const idx = Math.min(Math.floor(effectiveScore / 50), badges.length - 1)
  return badges[idx] || null
}

export function getKnowledgeLevel(score: number): { label: string; color: string; nextAt: number } {
  if (score < 50) return { label: 'Novice', color: '#a1a1aa', nextAt: 50 }
  if (score < 150) return { label: 'Learner', color: '#22c55e', nextAt: 150 }
  if (score < 350) return { label: 'Practitioner', color: '#06b6d4', nextAt: 350 }
  if (score < 700) return { label: 'Expert', color: '#a855f7', nextAt: 700 }
  if (score < 1200) return { label: 'Master', color: '#f59e0b', nextAt: 1200 }
  return { label: 'Grandmaster', color: '#f97316', nextAt: Infinity }
}
