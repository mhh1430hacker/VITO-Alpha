'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import { ROUTE_LABELS } from '@/lib/routes'

const DEFAULT_LABELS: Record<string, string> = {
  ...ROUTE_LABELS,
  dashboard: 'Dashboard',
  formulations: 'Formulations',
  wizard: 'Wizard',
  library: 'Library',
  archived: 'Archived',
  materials: 'Materials',
  catalog: 'Catalog',
  inventory: 'Inventory',
  suppliers: 'Suppliers',
  pricing: 'Pricing',
  alternatives: 'Alternatives',
  batch: 'Batch Tracking',
  directory: 'Directory',
  contracts: 'Contracts',
  'ai-lab': 'AI Lab',
  models: 'Models',
  experiments: 'Experiments',
  optimization: 'Optimization',
  explainability: 'Explainability',
  datasets: 'Datasets',
  embeddings: 'Embeddings',
  features: 'Feature Explorer',
  'embedding-dashboard': 'Embedding Dashboard',
  'similarity-explorer': 'Similarity Explorer',
  'recommendation-center': 'Recommendation Center',
  'semantic-search': 'Semantic Search',
  ifra: 'IFRA',
  reach: 'REACH',
  clp: 'CLP',
  sds: 'Safety Sheets',
  certificates: 'Certificates',
  alerts: 'Alerts',
  admin: 'Admin',
  sso: 'SSO/SAML',
  data: 'Data',
  'formulation-studio': 'Studio',
  compliance: 'Compliance',
  analytics: 'Analytics',
  performance: 'Performance',
  trends: 'Trends',
  reports: 'Reports',
  export: 'Export',
  'audit-logs': 'Audit Logs',
  'audit-trail': 'Audit Trail',
  users: 'Users',
  roles: 'Roles',
  teams: 'Teams',
  'api-keys': 'API Keys',
  billing: 'Billing',
  profile: 'Profile',
  preferences: 'Preferences',
  notifications: 'Notifications',
  integrations: 'Integrations',
  planning: 'Planning',
  active: 'Active',
  completed: 'Completed',
  projects: 'Projects',
  'super-intelligence': 'Super Intelligence',
}

export function Breadcrumbs() {
  const pathname = usePathname()

  if (pathname === '/dashboard' || pathname === '/') return null

  const segments = pathname.split('/').filter(Boolean)

  const breadcrumbs = segments.map((segment, i) => {
    const href = '/' + segments.slice(0, i + 1).join('/')
    const label = DEFAULT_LABELS[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
    return { label, href }
  })

  if (breadcrumbs.length === 0) return null

  return (
    <nav className="flex items-center gap-1 px-6 py-2.5 text-[12px] text-muted-foreground/50 bg-[#0A0D12]">
      <Link
        href="/dashboard"
        className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
      >
        Home
      </Link>
      {breadcrumbs.map((segment, i) => {
        const isLast = i === breadcrumbs.length - 1
        return (
          <span key={segment.href} className="flex items-center gap-1">
            <ChevronRight className="h-3 w-3 text-muted-foreground/30" />
            {isLast ? (
              <span className="text-foreground/70 font-medium">{segment.label}</span>
            ) : (
              <Link
                href={segment.href}
                className="hover:text-muted-foreground transition-colors"
              >
                {segment.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
