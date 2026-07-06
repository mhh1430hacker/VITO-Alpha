'use client'

import { useMemo } from 'react'
import { AlphaConfig } from './config'

type DeploymentTarget = 'vercel' | 'localhost' | 'unknown'

interface AlphaEnvironmentType {
  isAlpha(): boolean
  isProduction(): boolean
  getDeploymentTarget(): DeploymentTarget
  getBackendURL(): string
  getFirebaseConfig(): null
  shouldRegisterServiceWorker(): boolean
  getAnalyticsProvider(): string
  getCacheStrategy(): string
  isReadOnly(): boolean
  getSessionStorageLimit(): number
  getMaxUploadSize(): number
  getAllowedOrigins(): string[]
  exportToJSON(): Record<string, unknown>
}

export const AlphaEnvironment: AlphaEnvironmentType = {
  isAlpha(): boolean {
    return AlphaConfig.enabled
  },

  isProduction(): boolean {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV) {
      const env = process.env.NODE_ENV.toLowerCase()
      return env.includes('prod') || env.includes('vercel')
    }
    return false
  },

  getDeploymentTarget(): DeploymentTarget {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname
      if (host.includes('vercel.app') || host.includes('vercel.com')) return 'vercel'
      if (host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.') || host.startsWith('10.')) {
        return 'localhost'
      }
    }
    if (typeof process !== 'undefined') {
      const env = process.env?.NODE_ENV ?? ''
      if (env.includes('vercel')) return 'vercel'
      if (env.includes('development') || env.includes('dev')) return 'localhost'
    }
    return 'unknown'
  },

  getBackendURL(): string {
    if (this.isAlpha()) return ''
    if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_BACKEND_URL) {
      return process.env.NEXT_PUBLIC_BACKEND_URL
    }
    return 'http://localhost:8000'
  },

  getFirebaseConfig(): null {
    return null
  },

  shouldRegisterServiceWorker(): boolean {
    if (this.isAlpha()) return false
    return !this.isProduction()
  },

  getAnalyticsProvider(): string {
    return this.isAlpha() ? 'none' : 'vercel'
  },

  getCacheStrategy(): string {
    return this.isAlpha() ? 'memory-only' : 'indexeddb'
  },

  isReadOnly(): boolean {
    return this.isAlpha()
  },

  getSessionStorageLimit(): number {
    return 5 * 1024 * 1024
  },

  getMaxUploadSize(): number {
    return this.isAlpha() ? 0 : 50 * 1024 * 1024
  },

  getAllowedOrigins(): string[] {
    if (this.isAlpha()) return ['*']
    if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_ALLOWED_ORIGINS) {
      return process.env.NEXT_PUBLIC_ALLOWED_ORIGINS.split(',').map((o) => o.trim())
    }
    return ['http://localhost:3000']
  },

  exportToJSON(): Record<string, unknown> {
    return {
      isAlpha: this.isAlpha(),
      isProduction: this.isProduction(),
      deploymentTarget: this.getDeploymentTarget(),
      backendURL: this.getBackendURL(),
      firebaseConfig: this.getFirebaseConfig(),
      serviceWorker: this.shouldRegisterServiceWorker(),
      analyticsProvider: this.getAnalyticsProvider(),
      cacheStrategy: this.getCacheStrategy(),
      readOnly: this.isReadOnly(),
      sessionStorageLimit: this.getSessionStorageLimit(),
      maxUploadSize: this.getMaxUploadSize(),
      allowedOrigins: this.getAllowedOrigins(),
      alphaConfig: {
        enabled: AlphaConfig.enabled,
        guestMode: AlphaConfig.guestMode,
        syntheticDataOnly: AlphaConfig.syntheticDataOnly,
        mode: isAlphaEnabled(),
      },
      timestamp: new Date().toISOString(),
    }
  },
}

function isAlphaEnabled(): string {
  return AlphaConfig.enabled ? 'alpha' : 'full'
}

export function useAlphaEnvironment(): AlphaEnvironmentType {
  return useMemo(() => AlphaEnvironment, [])
}
