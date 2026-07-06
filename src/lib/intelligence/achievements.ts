import type { Achievement } from './types'

export const ACHIEVEMENTS: Achievement[] = [
  // ── Exploration ──
  { id: 'first_steps', title: 'First Steps', description: 'Visit your first page beyond the dashboard', icon: '👣', category: 'exploration', rarity: 'common', points: 10, condition: { type: 'page_visit', threshold: 3 } },
  { id: 'explorer', title: 'Explorer', description: 'Visit 10 different pages', icon: '🧭', category: 'exploration', rarity: 'common', points: 25, condition: { type: 'page_visit', threshold: 10 } },
  { id: 'cartographer', title: 'Cartographer', description: 'Visit 30 different pages', icon: '🗺️', category: 'exploration', rarity: 'rare', points: 60, condition: { type: 'page_visit', threshold: 30 } },
  { id: 'omniscient', title: 'Omniscient', description: 'Visit 50 different pages — you know the platform inside out', icon: '👁️', category: 'exploration', rarity: 'epic', points: 150, condition: { type: 'page_visit', threshold: 50 } },

  // ── Creation ──
  { id: 'first_formula', title: 'First Creation', description: 'Create your first fragrance formula', icon: '✨', category: 'creation', rarity: 'common', points: 20, condition: { type: 'formula_count', threshold: 1 } },
  { id: 'formulator', title: 'Formulator', description: 'Create 5 formulas', icon: '⚗️', category: 'creation', rarity: 'common', points: 50, condition: { type: 'formula_count', threshold: 5 } },
  { id: 'master_formulator', title: 'Master Formulator', description: 'Create 25 formulas', icon: '🏺', category: 'creation', rarity: 'rare', points: 120, condition: { type: 'formula_count', threshold: 25 } },
  { id: 'prolific', title: 'Prolific Creator', description: 'Create 100 formulas', icon: '🌟', category: 'creation', rarity: 'epic', points: 300, condition: { type: 'formula_count', threshold: 100 } },

  // ── Mastery ──
  { id: 'prediction_novice', title: 'AI Apprentice', description: 'Run 3 AI predictions', icon: '🤖', category: 'mastery', rarity: 'common', points: 15, condition: { type: 'prediction_count', threshold: 3 } },
  { id: 'prediction_expert', title: 'AI Expert', description: 'Run 20 AI predictions', icon: '🧠', category: 'mastery', rarity: 'rare', points: 80, condition: { type: 'prediction_count', threshold: 20 } },
  { id: 'prediction_oracle', title: 'AI Oracle', description: 'Run 100 AI predictions', icon: '🔮', category: 'mastery', rarity: 'epic', points: 250, condition: { type: 'prediction_count', threshold: 100 } },
  { id: 'compliance_guardian', title: 'Compliance Guardian', description: 'Complete 10 compliance checks', icon: '🛡️', category: 'mastery', rarity: 'rare', points: 60, condition: { type: 'compliance_check', threshold: 10 } },

  // ── Learning ──
  { id: 'material_scholar', title: 'Material Scholar', description: 'Browse 50 different materials', icon: '📚', category: 'learning', rarity: 'common', points: 30, condition: { type: 'material_browse', threshold: 50 } },
  { id: 'material_sage', title: 'Material Sage', description: 'Browse 200 different materials', icon: '🧪', category: 'learning', rarity: 'rare', points: 100, condition: { type: 'material_browse', threshold: 200 } },
  { id: 'ai_curious', title: 'AI Curious', description: 'Ask 5 AI questions', icon: '❓', category: 'learning', rarity: 'common', points: 20, condition: { type: 'ai_query', threshold: 5 } },
  { id: 'ai_scholar', title: 'AI Scholar', description: 'Ask 50 AI questions', icon: '💡', category: 'learning', rarity: 'rare', points: 100, condition: { type: 'ai_query', threshold: 50 } },

  // ── Efficiency ──
  { id: 'report_wizard', title: 'Report Wizard', description: 'Generate 5 reports', icon: '📊', category: 'efficiency', rarity: 'common', points: 25, condition: { type: 'report_generate', threshold: 5 } },
  { id: 'report_master', title: 'Report Master', description: 'Generate 25 reports', icon: '📈', category: 'efficiency', rarity: 'rare', points: 90, condition: { type: 'report_generate', threshold: 25 } },

  // ── Streaks & Discipline ──
  { id: 'streak_3', title: 'Getting Started', description: '3-day login streak', icon: '🔥', category: 'efficiency', rarity: 'common', points: 15, condition: { type: 'streak_days', threshold: 3 } },
  { id: 'streak_7', title: 'Weekly Warrior', description: '7-day login streak', icon: '⚡', category: 'efficiency', rarity: 'rare', points: 50, condition: { type: 'streak_days', threshold: 7 } },
  { id: 'streak_30', title: 'Unstoppable', description: '30-day login streak', icon: '💎', category: 'efficiency', rarity: 'epic', points: 200, condition: { type: 'streak_days', threshold: 30 } },
  { id: 'streak_100', title: 'Legendary Dedication', description: '100-day login streak — you are the platform', icon: '👑', category: 'efficiency', rarity: 'legendary', points: 500, condition: { type: 'streak_days', threshold: 100 } },

  // ── Collaboration ──
  { id: 'team_builder', title: 'Team Builder', description: 'Invite 3 team members', icon: '👥', category: 'collaboration', rarity: 'common', points: 30, condition: { type: 'invite_team', threshold: 3 } },
  { id: 'org_builder', title: 'Org Builder', description: 'Invite 15 team members', icon: '🏢', category: 'collaboration', rarity: 'rare', points: 80, condition: { type: 'invite_team', threshold: 15 } },

  // ── Contribution ──
  { id: 'profile_perfect', title: 'Identity Established', description: 'Complete your profile', icon: '✅', category: 'contribution', rarity: 'common', points: 10, condition: { type: 'profile_complete', threshold: 1 } },
  { id: 'daily_devotion', title: 'Daily Devotion', description: 'Log in 5 days in a row', icon: '📅', category: 'contribution', rarity: 'common', points: 20, condition: { type: 'daily_login', threshold: 5 } },

  // ── Hidden / Secret ──
  { id: 'secret_explorer_all', title: 'The Architect', description: 'Visit every single page in the platform', icon: '🏆', category: 'exploration', rarity: 'legendary', points: 500, condition: { type: 'page_visit', threshold: 79 } },
  { id: 'secret_speed', title: 'Speed Demon', description: 'Complete 10 actions in under 2 minutes', icon: '⚡', category: 'efficiency', rarity: 'epic', points: 150, condition: { type: 'page_visit', threshold: 10 } },
]
