'use client'

import { useMemo } from 'react'

export type AlphaMode = 'guest' | 'demo' | 'full'

interface AlphaFeatures {
  landing: boolean
  signup: boolean
  onboarding: boolean
  dashboard: boolean
  aiCopilot: boolean
  intelligenceHub: boolean
  knowledgeVault: boolean
  formulaAccelerator: boolean
  compliance: boolean
  explorer: boolean
  demoGenerator: boolean
  investor: boolean
  roiCalculator: boolean
  formulationStudio: boolean
  scheduler: boolean
  autonomousRetraining: boolean
  backgroundJobs: boolean
  prometheus: boolean
  grafana: boolean
  heavyVKD: boolean
  redisDependency: boolean
  trainingCoordinator: boolean
  knowledgeUpdates: boolean
  persistentUserStorage: boolean
  realTimeCollaboration: boolean
  apiKeys: boolean
  billing: boolean
  enterpriseSSO: boolean
}

interface AlphaUISettings {
  bannerVisible: boolean
  bannerColor: string
  watermarkAlpha: boolean
}

interface AlphaConfigType {
  enabled: boolean
  guestMode: boolean
  syntheticDataOnly: boolean
  maxVisitors: number
  sessionTimeoutMinutes: number
  features: AlphaFeatures
  ui: AlphaUISettings
  isFeatureEnabled(name: string): boolean
}

const isAlphaEnabled = (): boolean => {
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_ALPHA_MODE === 'true') {
    return true
  }
  return false
}

const alphaEnabled = isAlphaEnabled()

export const AlphaConfig: AlphaConfigType = {
  enabled: alphaEnabled,
  guestMode: alphaEnabled,
  syntheticDataOnly: alphaEnabled,
  maxVisitors: 500,
  sessionTimeoutMinutes: 30,
  features: {
    landing: true,
    signup: true,
    onboarding: true,
    dashboard: true,
    aiCopilot: true,
    intelligenceHub: true,
    knowledgeVault: true,
    formulaAccelerator: true,
    compliance: true,
    explorer: true,
    demoGenerator: true,
    investor: true,
    roiCalculator: true,
    formulationStudio: true,
    scheduler: false,
    autonomousRetraining: false,
    backgroundJobs: false,
    prometheus: false,
    grafana: false,
    heavyVKD: false,
    redisDependency: false,
    trainingCoordinator: false,
    knowledgeUpdates: false,
    persistentUserStorage: false,
    realTimeCollaboration: false,
    apiKeys: false,
    billing: false,
    enterpriseSSO: false,
  },
  ui: {
    bannerVisible: true,
    bannerColor: 'amber',
    watermarkAlpha: true,
  },
  isFeatureEnabled(name: string): boolean {
    return (this.features as unknown as Record<string, boolean>)[name] ?? false
  },
}

export function getAlphaMode(): AlphaMode {
  if (!AlphaConfig.enabled) return 'full'
  return AlphaConfig.guestMode ? 'guest' : 'demo'
}

export function useAlphaConfig(): AlphaConfigType {
  return useMemo(() => AlphaConfig, [])
}
