import {
  LayoutDashboard, Shield, Server, Cpu, CreditCard, Lock,
  Activity, Store, Settings, Globe, Building2, Users,
  FlaskConical, Package, FileText, BarChart3, Bell, Scale,
  Brain, TrendingUp, DollarSign, BookOpen, Search,
  Sparkles, Home, CheckSquare, FolderKanban, Clock,
  UserCircle, Star, Lightbulb, Eye, GitBranch,
} from 'lucide-react'
import { ExperienceConfig, SidebarSection } from './types'

export const superAdminSidebar: SidebarSection[] = [
  {
    id: 'platform', label: 'Platform', icon: 'Server',
    items: [
      { id: 'overview', label: 'Overview', href: '/admin/platform', icon: 'LayoutDashboard' },
      { id: 'health', label: 'Health Monitor', href: '/admin/health', icon: 'Activity' },
      { id: 'incidents', label: 'Incident Management', href: '/admin/incidents', icon: 'Shield' },
      { id: 'audit', label: 'Audit Logs', href: '/admin/audit-trail', icon: 'Clock' },
    ],
  },
  {
    id: 'organizations', label: 'Organizations', icon: 'Building2',
    items: [
      { id: 'tenants', label: 'All Tenants', href: '/admin/tenants', icon: 'Building2' },
      { id: 'tenant-onboarding', label: 'Tenant Onboarding', href: '/admin/tenants/onboarding', icon: 'Users' },
      { id: 'usage', label: 'Usage Analytics', href: '/admin/usage', icon: 'BarChart3' },
    ],
  },
  {
    id: 'infrastructure', label: 'Infrastructure', icon: 'Server',
    items: [
      { id: 'cluster', label: 'Cluster Status', href: '/admin/cluster', icon: 'Server' },
      { id: 'gpu', label: 'GPU Allocation', href: '/admin/gpu', icon: 'Cpu' },
      { id: 'database', label: 'Database Health', href: '/admin/database', icon: 'Activity' },
      { id: 'cache', label: 'Cache Status', href: '/admin/cache', icon: 'Activity' },
      { id: 'storage', label: 'Storage', href: '/admin/storage', icon: 'Package' },
    ],
  },
  {
    id: 'models', label: 'Models', icon: 'Brain',
    items: [
      { id: 'registry', label: 'Model Registry', href: '/ai-lab/models', icon: 'Brain' },
      { id: 'training', label: 'Training Jobs', href: '/ai-lab/training', icon: 'Cpu' },
      { id: 'drift', label: 'Drift Monitor', href: '/admin/drift', icon: 'Activity' },
      { id: 'ab-experiments', label: 'A/B Experiments', href: '/ai-lab/experiments', icon: 'GitBranch' },
    ],
  },
  {
    id: 'billing', label: 'Billing', icon: 'CreditCard',
    items: [
      { id: 'invoices', label: 'All Invoices', href: '/admin/billing', icon: 'CreditCard' },
      { id: 'payouts', label: 'Payouts', href: '/admin/payouts', icon: 'DollarSign' },
      { id: 'tax', label: 'Tax Reports', href: '/admin/tax', icon: 'FileText' },
      { id: 'pricing', label: 'Pricing Config', href: '/admin/pricing', icon: 'Settings' },
    ],
  },
  {
    id: 'security', label: 'Security', icon: 'Lock',
    items: [
      { id: 'posture', label: 'Security Posture', href: '/admin/security', icon: 'Shield' },
      { id: 'access-reviews', label: 'Access Reviews', href: '/admin/access-reviews', icon: 'Users' },
      { id: 'siem', label: 'SIEM Dashboard', href: '/admin/siem', icon: 'Activity' },
      { id: 'api-keys', label: 'API Key Management', href: '/admin/api-keys', icon: 'Key' },
      { id: 'sso', label: 'SSO Configuration', href: '/admin/sso', icon: 'Link' },
    ],
  },
  {
    id: 'monitoring', label: 'Monitoring', icon: 'Activity',
    items: [
      { id: 'prometheus', label: 'Prometheus', href: '/admin/monitoring/prometheus', icon: 'Activity' },
      { id: 'grafana', label: 'Grafana', href: '/admin/monitoring/grafana', icon: 'BarChart3' },
      { id: 'pagerduty', label: 'PagerDuty', href: '/admin/monitoring/pagerduty', icon: 'Bell' },
      { id: 'status', label: 'Status Page', href: '/status', icon: 'Globe' },
    ],
  },
  {
    id: 'marketplace', label: 'Marketplace', icon: 'Store',
    items: [
      { id: 'partner-apps', label: 'Partner Apps', href: '/admin/marketplace', icon: 'Store' },
      { id: 'api-gateway', label: 'API Gateway', href: '/admin/api-gateway', icon: 'Server' },
      { id: 'sdk', label: 'SDK Downloads', href: '/admin/sdk', icon: 'Package' },
      { id: 'webhooks', label: 'Webhook Logs', href: '/admin/webhooks', icon: 'Link' },
    ],
  },
  {
    id: 'system', label: 'System Settings', icon: 'Settings',
    items: [
      { id: 'global-config', label: 'Global Config', href: '/admin/config', icon: 'Settings' },
      { id: 'feature-flags', label: 'Feature Flags', href: '/admin/feature-flags', icon: 'Settings' },
      { id: 'rate-limits', label: 'Rate Limits', href: '/admin/rate-limits', icon: 'Activity' },
      { id: 'maintenance', label: 'Maintenance Mode', href: '/admin/maintenance', icon: 'Shield' },
    ],
  },
]

export const companyAdminSidebar: SidebarSection[] = [
  {
    id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard',
    items: [
      { id: 'ai-insights', label: 'AI Insights Feed', href: '/dashboard/executive', icon: 'Sparkles' },
      { id: 'financial', label: 'Financial Overview', href: '/dashboard/executive/financial', icon: 'DollarSign' },
      { id: 'ai-health', label: 'AI & Product Health', href: '/dashboard/executive/ai-health', icon: 'Brain' },
      { id: 'team-activity', label: 'Team Activity', href: '/dashboard/executive/team', icon: 'Users' },
    ],
  },
  {
    id: 'projects', label: 'Projects', icon: 'FolderKanban',
    items: [
      { id: 'active-projects', label: 'Active Projects', href: '/projects/active', icon: 'FolderKanban' },
      { id: 'planning', label: 'Project Planning', href: '/projects/planning', icon: 'FileText' },
      { id: 'completed', label: 'Completed', href: '/projects/completed', icon: 'CheckSquare' },
    ],
  },
  {
    id: 'formulas', label: 'Formulas', icon: 'FlaskConical',
    items: [
      { id: 'library', label: 'Formula Library', href: '/formulations/library', icon: 'BookOpen' },
      { id: 'archived', label: 'Archived', href: '/formulations/archived', icon: 'Package' },
    ],
  },
  {
    id: 'materials', label: 'Materials', icon: 'Package',
    items: [
      { id: 'catalog', label: 'Catalog', href: '/materials/catalog', icon: 'Search' },
      { id: 'pricing', label: 'Pricing', href: '/materials/pricing', icon: 'DollarSign' },
      { id: 'alternatives', label: 'Alternatives', href: '/materials/alternatives', icon: 'GitBranch' },
    ],
  },
  {
    id: 'compliance', label: 'Compliance', icon: 'Scale',
    items: [
      { id: 'ifra', label: 'IFRA Status', href: '/compliance/ifra', icon: 'Scale' },
      { id: 'reach', label: 'REACH Status', href: '/compliance/reach', icon: 'Shield' },
      { id: 'audit-logs', label: 'Audit Logs', href: '/compliance/audit-logs', icon: 'Clock' },
      { id: 'alerts', label: 'Alerts', href: '/compliance/alerts', icon: 'Bell' },
    ],
  },
  {
    id: 'ai-lab', label: 'AI Lab', icon: 'Brain',
    items: [
      { id: 'recommendations', label: 'Recommendation Center', href: '/ai-lab/recommendation-center', icon: 'Lightbulb' },
      { id: 'predictions', label: 'Predictions', href: '/ai-lab/predictions', icon: 'Brain' },
      { id: 'explainability', label: 'Explainability', href: '/ai-lab/explainability', icon: 'Eye' },
    ],
  },
  {
    id: 'analytics', label: 'Analytics', icon: 'BarChart3',
    items: [
      { id: 'performance', label: 'Performance', href: '/analytics/performance', icon: 'TrendingUp' },
      { id: 'trends', label: 'Trends', href: '/analytics/trends', icon: 'Activity' },
      { id: 'reports', label: 'Reports', href: '/analytics/reports', icon: 'FileText' },
      { id: 'export', label: 'Export Center', href: '/analytics/export', icon: 'Package' },
    ],
  },
  {
    id: 'team', label: 'Team', icon: 'Users',
    items: [
      { id: 'members', label: 'Members', href: '/admin/users', icon: 'Users' },
      { id: 'roles', label: 'Roles & Permissions', href: '/admin/roles', icon: 'Lock' },
      { id: 'activity-log', label: 'Activity Log', href: '/admin/audit-trail', icon: 'Activity' },
    ],
  },
  {
    id: 'settings', label: 'Settings', icon: 'Settings',
    items: [
      { id: 'company-profile', label: 'Company Profile', href: '/settings/profile', icon: 'Building2' },
      { id: 'billing-plan', label: 'Billing & Plan', href: '/admin/billing', icon: 'CreditCard' },
      { id: 'integrations', label: 'Integrations', href: '/settings/integrations', icon: 'Link' },
      { id: 'notifications', label: 'Notifications', href: '/settings/notifications', icon: 'Bell' },
    ],
  },
]

export const perfumerSidebar: SidebarSection[] = [
  {
    id: 'home', label: 'Home', icon: 'Home',
    items: [
      { id: 'dashboard', label: 'My Dashboard', href: '/dashboard/perfumer', icon: 'LayoutDashboard' },
      { id: 'recent', label: 'Recent Activity', href: '/dashboard/perfumer/recent', icon: 'Clock' },
    ],
  },
  {
    id: 'my-formulas', label: 'My Formulas', icon: 'FlaskConical',
    items: [
      { id: 'active', label: 'Active', href: '/formulations/library?filter=active', icon: 'FlaskConical' },
      { id: 'drafts', label: 'Drafts', href: '/formulations/library?filter=draft', icon: 'FileText' },
      { id: 'published', label: 'Published', href: '/formulations/library?filter=approved', icon: 'CheckSquare' },
      { id: 'archived', label: 'Archived', href: '/formulations/archived', icon: 'Package' },
    ],
  },
  {
    id: 'create', label: 'Create Formula', icon: 'Sparkles',
    items: [
      { id: 'new-from-scratch', label: 'New from Scratch', href: '/formulations/wizard', icon: 'FlaskConical' },
      { id: 'from-template', label: 'From Template', href: '/formulations/wizard?mode=template', icon: 'FileText' },
      { id: 'ai-assisted', label: 'AI-Assisted', href: '/formulations/wizard?mode=ai', icon: 'Brain' },
      { id: 'from-brief', label: 'From Brief', href: '/formulations/wizard?mode=brief', icon: 'BookOpen' },
    ],
  },
  {
    id: 'materials', label: 'Materials', icon: 'Package',
    items: [
      { id: 'catalog', label: 'Browse Catalog', href: '/materials/catalog', icon: 'Search' },
      { id: 'favorites', label: 'Favorites', href: '/materials/catalog?filter=favorites', icon: 'Star' },
      { id: 'olfactory-search', label: 'Search by Family', href: '/materials/catalog?view=families', icon: 'Eye' },
    ],
  },
  {
    id: 'ai-assistant', label: 'AI Assistant', icon: 'Brain',
    items: [
      { id: 'recommendations', label: 'Recommendations for You', href: '/ai-lab/recommendation-center?view=personal', icon: 'Lightbulb' },
      { id: 'optimization', label: 'Formula Optimization', href: '/ai-lab/optimization', icon: 'TrendingUp' },
      { id: 'alternatives', label: 'Suggest Alternatives', href: '/materials/alternatives', icon: 'GitBranch' },
      { id: 'sensory', label: 'Sensory Predictions', href: '/ai-lab/predictions?view=sensory', icon: 'Eye' },
    ],
  },
  {
    id: 'favorites', label: 'Favorites', icon: 'Star',
    items: [
      { id: 'pinned-materials', label: 'Pinned Materials', href: '/materials/catalog?view=pinned', icon: 'Package' },
      { id: 'saved-formulas', label: 'Saved Formulas', href: '/formulations/library?view=saved', icon: 'FlaskConical' },
      { id: 'quick-actions', label: 'Quick Actions', href: '/formulations/wizard?mode=quick', icon: 'Sparkles' },
    ],
  },
  {
    id: 'notifications', label: 'Notifications', icon: 'Bell',
    items: [
      { id: 'compliance-alerts', label: 'Compliance Alerts', href: '/compliance/alerts', icon: 'Scale' },
      { id: 'team-updates', label: 'Team Updates', href: '/notifications?filter=team', icon: 'Users' },
      { id: 'ai-insights', label: 'AI Insights', href: '/notifications?filter=ai', icon: 'Brain' },
    ],
  },
]

export const employeeSidebar: SidebarSection[] = [
  {
    id: 'home', label: 'Home', icon: 'Home',
    items: [
      { id: 'dashboard', label: 'My Dashboard', href: '/home', icon: 'LayoutDashboard' },
      { id: 'search', label: 'Quick Search', href: '/home/search', icon: 'Search' },
    ],
  },
  {
    id: 'tasks', label: 'Tasks', icon: 'CheckSquare',
    items: [
      { id: 'my-tasks', label: 'My Tasks', href: '/home/tasks', icon: 'CheckSquare' },
      { id: 'completed', label: 'Completed', href: '/home/tasks?filter=completed', icon: 'CheckSquare' },
      { id: 'overdue', label: 'Overdue', href: '/home/tasks?filter=overdue', icon: 'Clock' },
    ],
  },
  {
    id: 'projects', label: 'Projects', icon: 'FolderKanban',
    items: [
      { id: 'my-projects', label: 'My Projects', href: '/projects/active?filter=mine', icon: 'FolderKanban' },
      { id: 'active', label: 'Active', href: '/projects/active', icon: 'FolderKanban' },
    ],
  },
  {
    id: 'notifications', label: 'Notifications', icon: 'Bell',
    items: [
      { id: 'all', label: 'All', href: '/notifications', icon: 'Bell' },
      { id: 'unread', label: 'Unread', href: '/notifications?filter=unread', icon: 'Bell' },
    ],
  },
  {
    id: 'settings', label: 'Settings', icon: 'Settings',
    items: [
      { id: 'profile', label: 'Profile', href: '/settings/profile', icon: 'UserCircle' },
      { id: 'preferences', label: 'Preferences', href: '/settings/preferences', icon: 'Settings' },
    ],
  },
]

export const experienceConfigs: Record<string, ExperienceConfig> = {
  super_admin: {
    tier: 'super_admin',
    personaId: 'founder',
    landingPage: '/admin/platform',
    sidebar: superAdminSidebar,
    aiDockQuickActions: [
      'Show system health summary',
      'Analyze tenant usage patterns',
      'Explain recent security events',
      'Predict infrastructure costs',
    ],
    density: 'compact',
    defaultTheme: 'dark',
    maxVisibleSections: 9,
    description: 'Platform operator managing infrastructure, tenants, and global configuration',
  },
  company_admin: {
    tier: 'company_admin',
    personaId: 'executive',
    landingPage: '/dashboard/executive',
    sidebar: companyAdminSidebar,
    aiDockQuickActions: [
      "Summarize this quarter's performance",
      'Show at-risk formulas',
      'Compare team productivity',
      'Predict renewal risks',
    ],
    density: 'comfortable',
    defaultTheme: 'light',
    maxVisibleSections: 9,
    description: 'Business leader overseeing R&D, costs, compliance, and team output',
  },
  perfumer: {
    tier: 'perfumer',
    personaId: 'perfumer',
    landingPage: '/dashboard/perfumer',
    sidebar: perfumerSidebar,
    aiDockQuickActions: [
      'Find alternatives for this ingredient',
      "Optimize this formula's cost",
      'Check IFRA compliance',
      'Predict sensory profile',
      'Compare with similar formulas',
    ],
    density: 'comfortable',
    defaultTheme: 'light',
    maxVisibleSections: 7,
    description: 'Creator focused on formula design, material exploration, and AI-assisted creation',
  },
  employee: {
    tier: 'employee',
    personaId: 'laboratory',
    landingPage: '/home',
    sidebar: employeeSidebar,
    aiDockQuickActions: [
      'Search for a material',
      "Check a formula's compliance",
      'Find documents',
    ],
    density: 'comfortable',
    defaultTheme: 'light',
    maxVisibleSections: 5,
    description: 'Task executor with limited scope — assigned formulas, tests, and simple searches',
  },
}
