import { ExperienceTier, ExperienceConfig } from './types'
import { resolveExperienceTierFromBackendRole } from './types'
import { experienceConfigs } from './config'
import { useAuthStore } from '@/lib/store'

export function getExperienceConfig(backendRole: string): ExperienceConfig {
  const tier = resolveExperienceTierFromBackendRole(backendRole)
  return experienceConfigs[tier] || experienceConfigs.employee
}

export function useExperienceConfig(): ExperienceConfig {
  const { user } = useAuthStore()
  if (!user?.role) return experienceConfigs.employee
  return getExperienceConfig(user.role)
}

export function useExperienceTier(): ExperienceTier {
  const config = useExperienceConfig()
  return config.tier
}
