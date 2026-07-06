import { Role, PersonaId, getPersona, type Persona } from '@/types/enterprise'

export type ExperienceTier = 'super_admin' | 'company_admin' | 'perfumer' | 'employee'

export interface SidebarSection {
  id: string
  label: string
  icon: string
  items: SidebarItem[]
}

export interface SidebarItem {
  id: string
  label: string
  href: string
  icon: string
}

export interface ExperienceConfig {
  tier: ExperienceTier
  personaId: PersonaId
  landingPage: string
  sidebar: SidebarSection[]
  aiDockQuickActions: string[]
  density: 'compact' | 'comfortable'
  defaultTheme: 'light' | 'dark'
  maxVisibleSections: number
  description: string
}

export function resolveExperienceTier(role: Role): ExperienceTier {
  const mapping: Record<Role, ExperienceTier> = {
    super_admin: 'super_admin',
    company_admin: 'company_admin',
    employee: 'employee',
  }
  return mapping[role] || 'employee'
}

export function resolveExperienceTierFromBackendRole(backendRole: string): ExperienceTier {
  const superAdminRoles = ['admin']
  const companyAdminRoles = ['executive', 'r_and_d_manager', 'operations_manager', 'procurement_manager', 'compliance_officer', 'ai_engineer', 'ai_researcher']
  const perfumerRoles = ['master_perfumer']
  const employeeRoles = ['lab_scientist']

  if (superAdminRoles.includes(backendRole)) return 'super_admin'
  if (companyAdminRoles.includes(backendRole)) return 'company_admin'
  if (perfumerRoles.includes(backendRole)) return 'perfumer'
  if (employeeRoles.includes(backendRole)) return 'employee'
  return 'employee'
}
