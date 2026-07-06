'use client'

import { AlphaDataProvider, type AlphaDataset } from './data-provider'
import type { AlphaConfig } from './config'

export type WorkspaceRole = 'perfumer' | 'manager' | 'compliance' | 'executive' | 'guest'

export interface DemoWorkspace {
  id: string
  name: string
  createdAt: string
  expiresAt: string
  data: AlphaDataset
  role: WorkspaceRole
  completionPercentage: number
}

const STORAGE_KEY = 'vito_alpha_workspaces'
const MAX_WORKSPACES = 5
const EXPIRY_MS = 30 * 60 * 1000

function generateId(): string {
  return `ws-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function isExpired(workspace: DemoWorkspace): boolean {
  return new Date(workspace.expiresAt).getTime() < Date.now()
}

function loadFromStorage(): DemoWorkspace[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: DemoWorkspace[] = JSON.parse(raw)
    return parsed.filter((w) => !isExpired(w))
  } catch {
    return []
  }
}

function saveToStorage(workspaces: DemoWorkspace[]): void {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(workspaces))
}

function getRoleCompletionPercentage(role: WorkspaceRole): number {
  switch (role) {
    case 'perfumer':
      return 65
    case 'manager':
      return 72
    case 'compliance':
      return 88
    case 'executive':
      return 55
    case 'guest':
      return 15
  }
}

export class DemoWorkspaceFactory {
  private static instance: DemoWorkspaceFactory

  static getInstance(): DemoWorkspaceFactory {
    if (!DemoWorkspaceFactory.instance) {
      DemoWorkspaceFactory.instance = new DemoWorkspaceFactory()
    }
    return DemoWorkspaceFactory.instance
  }

  private constructor() {}

  private cleanExpired(): DemoWorkspace[] {
    const workspaces = loadFromStorage()
    const valid = workspaces.filter((w) => !isExpired(w))
    if (valid.length !== workspaces.length) {
      saveToStorage(valid)
    }
    return valid
  }

  createWorkspace(name: string = 'My Workspace'): DemoWorkspace {
    let workspaces = this.cleanExpired()
    if (workspaces.length >= MAX_WORKSPACES) {
      workspaces = workspaces.slice(workspaces.length - MAX_WORKSPACES + 1)
    }

    const provider = AlphaDataProvider.getInstance()
    const dataset = provider.getDatasets()

    const workspace: DemoWorkspace = {
      id: generateId(),
      name,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + EXPIRY_MS).toISOString(),
      data: dataset,
      role: 'guest',
      completionPercentage: 15,
    }

    workspaces.push(workspace)
    saveToStorage(workspaces)
    return workspace
  }

  getWorkspace(id: string): DemoWorkspace | null {
    const workspaces = this.cleanExpired()
    const workspace = workspaces.find((w) => w.id === id)
    if (workspace && isExpired(workspace)) return null
    return workspace ?? null
  }

  listWorkspaces(): DemoWorkspace[] {
    return this.cleanExpired()
  }

  deleteWorkspace(id: string): void {
    const workspaces = this.cleanExpired()
    const filtered = workspaces.filter((w) => w.id !== id)
    saveToStorage(filtered)
  }

  createQuickstartWorkspace(): DemoWorkspace {
    let workspaces = this.cleanExpired()
    if (workspaces.length >= MAX_WORKSPACES) {
      workspaces = workspaces.slice(workspaces.length - MAX_WORKSPACES + 1)
    }

    const provider = AlphaDataProvider.getInstance()
    const fullDataset = provider.getDatasets()

    const quickstartData: AlphaDataset = {
      ...fullDataset,
      formulas: fullDataset.formulas.filter((f: { name: string }) =>
        ['Amber Rush', 'Solaire de Nuit', 'Jardin Céleste'].includes(f.name)
      ),
      materials: fullDataset.materials.slice(0, 3),
      complianceStatus: {
        ifraCompliant: true,
        reachCompliant: false,
        pendingReviews: 2,
        nextAuditDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      aiInsights: [
        {
          id: 'ai-1',
          title: 'Cost Optimization Detected',
          description: 'Amber Rush formula can reduce cost by 12% by substituting Bergamot with a synthetic alternative.',
          confidence: 0.87,
          category: 'optimization',
        },
        {
          id: 'ai-2',
          title: 'Sillage Enhancement',
          description: 'Adding 0.5% of Iso E Super would improve projection by an estimated 15%.',
          confidence: 0.92,
          category: 'performance',
        },
        {
          id: 'ai-3',
          title: 'Market Trend Alert',
          description: 'Amber-woody fragrances are up 23% in Q2 2026. Consider accelerating this formula.',
          confidence: 0.95,
          category: 'market',
        },
      ],
    }

    const workspace: DemoWorkspace = {
      id: generateId(),
      name: 'Quickstart Demo',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + EXPIRY_MS).toISOString(),
      data: quickstartData,
      role: 'guest',
      completionPercentage: 40,
    }

    workspaces.push(workspace)
    saveToStorage(workspaces)
    return workspace
  }

  createOnboardingWorkspace(userName: string, role: WorkspaceRole): DemoWorkspace {
    let workspaces = this.cleanExpired()
    if (workspaces.length >= MAX_WORKSPACES) {
      workspaces = workspaces.slice(workspaces.length - MAX_WORKSPACES + 1)
    }

    const provider = AlphaDataProvider.getInstance()
    const fullDataset = provider.getDatasets()

    const roleBasedData: AlphaDataset = {
      ...fullDataset,
      formulas:
        role === 'perfumer'
          ? fullDataset.formulas.filter((f: { name: string }) => ['Amber Rush', 'Cuir Impérial', 'Fleur de Nacre'].includes(f.name))
          : role === 'compliance'
            ? fullDataset.formulas.filter((f: { name: string }) => ['Bois Mystique', 'Ambre Gris'].includes(f.name))
            : fullDataset.formulas.slice(0, 5),
      aiInsights: [
        {
          id: 'onboard-1',
          title: `Welcome, ${userName}`,
          description:
            role === 'perfumer'
              ? 'Explore your formula library and start creating with AI-assisted composition.'
              : role === 'manager'
                ? 'Review team productivity metrics and upcoming project deadlines.'
                : role === 'compliance'
                  ? 'Monitor IFRA/REACH compliance status across all active formulas.'
                  : role === 'executive'
                    ? 'View portfolio performance, cost trends, and market intelligence.'
                    : 'Discover VITO features with this guided overview.',
          confidence: 1.0,
          category: 'onboarding',
        },
        {
          id: 'onboard-2',
          title: 'Getting Started',
          description: `${role.charAt(0).toUpperCase() + role.slice(1)}-specific workflows are pre-configured. Try the quick actions panel.`,
          confidence: 1.0,
          category: 'onboarding',
        },
        {
          id: 'onboard-3',
          title: 'Demo Session Active',
          description: 'This workspace contains synthetic data. No real formulas or materials are stored.',
          confidence: 1.0,
          category: 'onboarding',
        },
      ],
    }

    const workspace: DemoWorkspace = {
      id: generateId(),
      name: `${userName}'s Workspace`,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + EXPIRY_MS).toISOString(),
      data: roleBasedData,
      role,
      completionPercentage: getRoleCompletionPercentage(role),
    }

    workspaces.push(workspace)
    saveToStorage(workspaces)
    return workspace
  }
}

export function useDemoWorkspace(): DemoWorkspace | null {
  if (typeof window === 'undefined') return null
  const factory = DemoWorkspaceFactory.getInstance()
  const workspaces = factory.listWorkspaces()
  if (workspaces.length > 0) return workspaces[0]
  return factory.createWorkspace()
}
