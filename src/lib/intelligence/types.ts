export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: AchievementCategory
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  points: number
  condition: AchievementCondition
  unlockedAt?: string
}

export type AchievementCategory =
  | 'exploration'
  | 'creation'
  | 'mastery'
  | 'collaboration'
  | 'efficiency'
  | 'learning'
  | 'contribution'

export interface AchievementCondition {
  type: 'page_visit' | 'formula_count' | 'prediction_count' | 'streak_days' |
        'material_browse' | 'compliance_check' | 'ai_query' | 'report_generate' |
        'project_complete' | 'invite_team' | 'profile_complete' | 'daily_login'
  threshold: number
  metric?: string
}

export interface UserProgress {
  achievements: Record<string, Achievement>
  unlockedIds: string[]
  knowledgeScore: number
  currentStreak: number
  longestStreak: number
  lastActiveDate: string | null
  totalActions: number
  weeklyActivity: number[]
  skillLevels: Record<string, number>
}

export interface StreakState {
  current: number
  longest: number
  lastActive: string | null
  isActiveToday: boolean
  multiplier: number
}

export type KnowledgeDomain =
  | 'formulation'
  | 'materials'
  | 'ai_models'
  | 'compliance'
  | 'analytics'
  | 'platform'

export interface SkillBadge {
  domain: KnowledgeDomain
  level: 1 | 2 | 3 | 4 | 5
  label: string
  icon: string
  color: string
  description: string
}

export interface Suggestion {
  id: string
  title: string
  description: string
  action: string
  href: string
  category: 'tip' | 'discovery' | 'challenge' | 'shortcut' | 'insight'
  priority: number
  condition?: (progress: UserProgress) => boolean
  contextualHref?: (progress: UserProgress) => string
}
