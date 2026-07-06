import type { Suggestion, UserProgress } from './types'

interface SuggestionDef {
  id: string
  title: string
  description: string
  action: string
  href: string
  category: 'tip' | 'discovery' | 'challenge' | 'shortcut' | 'insight'
  priority: number
  contextualHref?: (progress: UserProgress) => string
  check: (p: UserProgress) => boolean
}

const ALL_SUGGESTIONS: SuggestionDef[] = [
  {
    id: 'try_explorer',
    title: 'Map the Unknown',
    description: 'The VITO Explorer reveals every corner of the platform. See what you haven\'t discovered yet.',
    action: 'Open Explorer',
    href: '/explorer',
    category: 'discovery',
    priority: 90,
    check: (p) => !p.unlockedIds.includes('cartographer') && !p.unlockedIds.includes('omniscient'),
  },
  {
    id: 'streak_alert',
    title: 'Don\'t Break Your Streak!',
    description: 'You\'re on a roll. One more day and you\'ll unlock the next level.',
    action: 'Keep Going',
    href: '/dashboard',
    category: 'insight',
    priority: 100,
    check: (p) => p.currentStreak >= 2 && p.currentStreak < 7,
  },
  {
    id: 'try_ai',
    title: 'Your AI is Waiting',
    description: 'Run an AI prediction to discover unexpected accords and novel blends.',
    action: 'Try AI',
    href: '/ai-predictions',
    category: 'discovery',
    priority: 80,
    check: (p) => !p.unlockedIds.includes('prediction_novice'),
  },
  {
    id: 'try_materials',
    title: 'Explore the Material Library',
    description: 'Over 600 materials are catalogued. Each has a story — and an accord waiting to be found.',
    action: 'Browse Materials',
    href: '/materials',
    category: 'discovery',
    priority: 70,
    check: (p) => !p.unlockedIds.includes('material_scholar'),
  },
  {
    id: 'shortcut_shift',
    title: 'Keyboard Shortcut: Cmd+K',
    description: 'Press Cmd+K to search anything instantly. It\'s the fastest way around.',
    action: 'Try It',
    href: '#',
    category: 'shortcut',
    priority: 60,
    check: (p) => p.totalActions < 50,
  },
  {
    id: 'challenge_3_day',
    title: 'Challenge: 3-Day Streak',
    description: 'Log in for 3 consecutive days to earn the "Getting Started" badge. You\'re almost there.',
    action: 'Accept Challenge',
    href: '/dashboard',
    category: 'challenge',
    priority: 85,
    check: (p) => p.currentStreak < 3 && p.totalActions > 10,
  },
  {
    id: 'try_reports',
    title: 'Visualize Your Impact',
    description: 'Generate a report to see your formulation patterns and success rates.',
    action: 'Create Report',
    href: '/reports',
    category: 'insight',
    priority: 65,
    check: (p) => !p.unlockedIds.includes('report_wizard'),
  },
  {
    id: 'invite_team',
    title: 'Collaboration Multiplier',
    description: 'Invite a teammate. Shared knowledge compounds faster than solo work.',
    action: 'Invite',
    href: '/team',
    category: 'insight',
    priority: 55,
    check: (p) => !p.unlockedIds.includes('team_builder'),
  },
  {
    id: 'find_secrets',
    title: 'Hidden Achievements Wait',
    description: 'Some badges are secret. Visit every page or complete rapid-fire actions to unlock legendaries.',
    action: 'Hunt Secrets',
    href: '/explorer',
    category: 'challenge',
    priority: 40,
    check: (p) => p.unlockedIds.length > 10 && p.unlockedIds.length < 20,
  },
  {
    id: 'compliance_review',
    title: 'Stay Ahead of Regulations',
    description: 'Run a compliance check on your latest formula. Safety first, innovation second.',
    action: 'Check Compliance',
    href: '/compliance',
    category: 'tip',
    priority: 50,
    check: (p) => !p.unlockedIds.includes('compliance_guardian'),
  },
]

export function getSuggestions(progress: UserProgress) {
  let dismissed: string[] = []
  try { dismissed = JSON.parse(localStorage.getItem('vito_dismissed_suggestions') || '[]') } catch {} 
  return ALL_SUGGESTIONS
    .filter(s => !dismissed.includes(s.id) && s.check(progress))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3)
    .map(({ check: _check, ...rest }) => rest)
}
