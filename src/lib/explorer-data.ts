import { ROUTES } from '@/lib/routes'

export type PageCategory =
  | 'Public' | 'Auth' | 'Dashboard' | 'Formulations' | 'Materials'
  | 'Suppliers' | 'Projects' | 'AI Lab' | 'Compliance' | 'Analytics'
  | 'Admin' | 'Settings' | 'Investor' | 'System'

export type PageStatus = 'untested' | 'tested' | 'broken' | 'mock' | 'connected'

export interface ExplorerPage {
  href: string
  label: string
  description: string
  category: PageCategory
  roles: string[]
  isPublic: boolean
  hasApiConnection: boolean
  apiEndpoints: string[]
}

export interface PageState {
  status: PageStatus
  visited: boolean
  testedAt: string | null
  screenshotAt: string | null
  notes: string
  score: number | null
}

export type ExplorerStore = Record<string, PageState>

export const EXPLORER_PAGES: ExplorerPage[] = [
  { href: ROUTES.HOME, label: 'Home', description: 'Marketing landing page', category: 'Public', roles: ['*'], isPublic: true, hasApiConnection: false, apiEndpoints: [] },
  { href: ROUTES.LOGIN, label: 'Login', description: 'User authentication', category: 'Auth', roles: ['*'], isPublic: true, hasApiConnection: true, apiEndpoints: ['POST /api/v1/auth/login'] },
  { href: ROUTES.SIGNUP, label: 'Sign Up', description: 'Enterprise registration wizard', category: 'Auth', roles: ['*'], isPublic: true, hasApiConnection: true, apiEndpoints: ['POST /api/v1/demo/provision'] },
  { href: ROUTES.PRICING, label: 'Pricing', description: 'Subscription plans', category: 'Public', roles: ['*'], isPublic: true, hasApiConnection: false, apiEndpoints: [] },
  { href: ROUTES.ROI_CALCULATOR, label: 'ROI Calculator', description: 'Return on investment tool', category: 'Public', roles: ['*'], isPublic: true, hasApiConnection: false, apiEndpoints: [] },
  { href: ROUTES.TUTORIALS, label: 'Tutorials', description: 'Guided learning', category: 'Public', roles: ['*'], isPublic: true, hasApiConnection: false, apiEndpoints: [] },
  { href: ROUTES.KNOWLEDGE_BASE, label: 'Knowledge Base', description: 'Documentation center', category: 'Public', roles: ['*'], isPublic: true, hasApiConnection: false, apiEndpoints: [] },
  { href: ROUTES.ENTERPRISE, label: 'Enterprise', description: 'Enterprise sales page', category: 'Public', roles: ['*'], isPublic: true, hasApiConnection: false, apiEndpoints: [] },
  { href: ROUTES.ONBOARDING, label: 'Onboarding', description: 'New user setup wizard', category: 'Auth', roles: ['*'], isPublic: false, hasApiConnection: true, apiEndpoints: ['POST /api/v1/onboarding/start'] },

  { href: ROUTES.DASHBOARD, label: 'Dashboard', description: 'Main command center', category: 'Dashboard', roles: ['*'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/dashboard/kpi', 'GET /api/v1/auth/admin/dashboard'] },
  { href: ROUTES.DASHBOARD_EXECUTIVE, label: 'Executive Dashboard', description: 'Revenue and KPI metrics', category: 'Dashboard', roles: ['executive', 'admin'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/dashboard/kpi'] },
  { href: ROUTES.DASHBOARD_PERFUMER, label: 'Perfumer Dashboard', description: 'Creative workspace overview', category: 'Dashboard', roles: ['master_perfumer'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/dashboard/kpi'] },
  { href: ROUTES.DASHBOARD_RD, label: 'R&D Dashboard', description: 'Research and development', category: 'Dashboard', roles: ['r_and_d_manager'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/dashboard/kpi'] },
  { href: ROUTES.DASHBOARD_OPERATIONS, label: 'Operations Dashboard', description: 'System health monitoring', category: 'Dashboard', roles: ['operations_manager', 'admin'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/dashboard/kpi'] },
  { href: ROUTES.DASHBOARD_AI, label: 'AI Dashboard', description: 'AI performance metrics', category: 'Dashboard', roles: ['ai_engineer', 'ai_researcher'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/dashboard/kpi'] },
  { href: ROUTES.DASHBOARD_COMPLIANCE, label: 'Compliance Dashboard', description: 'Regulatory overview', category: 'Dashboard', roles: ['compliance_officer'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/dashboard/kpi'] },

  { href: ROUTES.FORMULATION_STUDIO, label: 'Formulation Studio', description: 'Formula design workspace', category: 'Formulations', roles: ['master_perfumer', 'r_and_d_manager', 'lab_scientist'], isPublic: false, hasApiConnection: true, apiEndpoints: ['POST /api/v1/formulas', 'POST /api/v1/optimize'] },
  { href: ROUTES.FORMULATIONS_LIBRARY, label: 'Formula Library', description: 'Browse all formulas', category: 'Formulations', roles: ['master_perfumer', 'r_and_d_manager', 'lab_scientist', 'compliance_officer', 'executive', 'admin'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/formulas'] },
  { href: ROUTES.FORMULATIONS_WIZARD, label: 'Formulation Wizard', description: 'Step-by-step formula builder', category: 'Formulations', roles: ['master_perfumer', 'r_and_d_manager', 'lab_scientist'], isPublic: false, hasApiConnection: true, apiEndpoints: ['POST /api/v1/formulas'] },
  { href: ROUTES.FORMULATIONS_ARCHIVED, label: 'Archived Formulas', description: 'Archived formula storage', category: 'Formulations', roles: ['admin'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/formulas'] },

  { href: ROUTES.MATERIALS_CATALOG, label: 'Materials Catalog', description: 'Browse all materials', category: 'Materials', roles: ['*'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/materials'] },
  { href: ROUTES.MATERIALS_INVENTORY, label: 'Inventory', description: 'Stock management', category: 'Materials', roles: ['operations_manager', 'procurement_manager', 'lab_scientist', 'admin'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/materials'] },
  { href: ROUTES.MATERIALS_SUPPLIERS, label: 'Material Suppliers', description: 'Supplier assignments', category: 'Materials', roles: ['procurement_manager', 'operations_manager', 'compliance_officer', 'admin'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/materials'] },
  { href: ROUTES.MATERIALS_PRICING, label: 'Pricing Analysis', description: 'Material cost tracking', category: 'Materials', roles: ['procurement_manager', 'operations_manager', 'r_and_d_manager', 'executive', 'admin'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/materials'] },
  { href: ROUTES.MATERIALS_BATCH, label: 'Batch Tracking', description: 'Batch quality records', category: 'Materials', roles: ['operations_manager', 'compliance_officer', 'lab_scientist', 'admin'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/materials'] },
  { href: ROUTES.MATERIALS_ALTERNATIVES, label: 'Material Alternatives', description: 'Find substitute materials', category: 'Materials', roles: ['master_perfumer', 'r_and_d_manager', 'compliance_officer'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/materials'] },

  { href: ROUTES.AI_LAB, label: 'AI Lab', description: 'AI experimentation hub', category: 'AI Lab', roles: ['ai_engineer', 'ai_researcher', 'r_and_d_manager', 'master_perfumer'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/super-intelligence'] },
  { href: ROUTES.AI_LAB_TRAINING, label: 'Training Jobs', description: 'Model training orchestration', category: 'AI Lab', roles: ['ai_engineer', 'ai_researcher'], isPublic: false, hasApiConnection: true, apiEndpoints: ['POST /api/v1/training'] },
  { href: ROUTES.AI_LAB_PREDICTIONS, label: 'Predictions', description: 'Run AI predictions', category: 'AI Lab', roles: ['master_perfumer', 'r_and_d_manager', 'ai_engineer', 'lab_scientist'], isPublic: false, hasApiConnection: true, apiEndpoints: ['POST /api/v1/inference/predict'] },
  { href: ROUTES.AI_LAB_MODELS, label: 'Model Registry', description: 'Manage ML models', category: 'AI Lab', roles: ['ai_engineer', 'ai_researcher', 'r_and_d_manager', 'admin'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/model-registry'] },
  { href: ROUTES.AI_LAB_EMBEDDINGS, label: 'Embeddings', description: 'Vector representations', category: 'AI Lab', roles: ['ai_engineer', 'ai_researcher', 'master_perfumer'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/embeddings'] },
  { href: ROUTES.AI_LAB_SIMILARITY, label: 'Similarity Explorer', description: 'Explore material similarity', category: 'AI Lab', roles: ['ai_engineer', 'ai_researcher', 'master_perfumer', 'r_and_d_manager'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/similarity'] },
  { href: ROUTES.AI_LAB_SEMANTIC, label: 'Semantic Search', description: 'Natural language material search', category: 'AI Lab', roles: ['*'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/search'] },
  { href: ROUTES.AI_LAB_OPTIMIZATION, label: 'Optimization', description: 'Formula cost optimization', category: 'AI Lab', roles: ['master_perfumer', 'r_and_d_manager', 'ai_engineer'], isPublic: false, hasApiConnection: true, apiEndpoints: ['POST /api/v1/optimize'] },
  { href: ROUTES.AI_LAB_EXPERIMENTS, label: 'Experiments', description: 'AI experiment tracking', category: 'AI Lab', roles: ['ai_engineer', 'ai_researcher'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/experiments'] },
  { href: ROUTES.AI_LAB_DATASETS, label: 'Datasets', description: 'Training data management', category: 'AI Lab', roles: ['ai_engineer', 'ai_researcher'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/datasets'] },
  { href: ROUTES.AI_LAB_FEATURES, label: 'Feature Explorer', description: 'Feature engineering', category: 'AI Lab', roles: ['ai_engineer', 'ai_researcher', 'r_and_d_manager', 'admin'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/features'] },
  { href: ROUTES.AI_LAB_EXPLAINABILITY, label: 'Explainability', description: 'Model interpretation', category: 'AI Lab', roles: ['master_perfumer', 'r_and_d_manager', 'compliance_officer'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/explainability'] },
  { href: ROUTES.AI_LAB_INFERENCE, label: 'Inference', description: 'Real-time predictions', category: 'AI Lab', roles: ['ai_engineer', 'ai_researcher'], isPublic: false, hasApiConnection: true, apiEndpoints: ['POST /api/v1/inference'] },
  { href: ROUTES.AI_LAB_RECOMMENDATIONS, label: 'Recommendation Center', description: 'AI-driven recommendations', category: 'AI Lab', roles: ['master_perfumer', 'r_and_d_manager', 'procurement_manager', 'ai_engineer'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/recommendations'] },

  { href: ROUTES.SUPER_INTELLIGENCE, label: 'Super Intelligence', description: 'Advanced AI chat', category: 'AI Lab', roles: ['*'], isPublic: false, hasApiConnection: true, apiEndpoints: ['POST /api/v1/super-intelligence'] },

  { href: ROUTES.PROJECTS_ACTIVE, label: 'Active Projects', description: 'Current projects', category: 'Projects', roles: ['*'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/projects'] },
  { href: ROUTES.PROJECTS_PLANNING, label: 'Project Planning', description: 'Project roadmap', category: 'Projects', roles: ['r_and_d_manager', 'executive', 'admin'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/projects'] },
  { href: ROUTES.PROJECTS_COMPLETED, label: 'Completed Projects', description: 'Finished projects', category: 'Projects', roles: ['*'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/projects'] },

  { href: ROUTES.COMPLIANCE_IFRA, label: 'IFRA Compliance', description: 'IFRA standards checker', category: 'Compliance', roles: ['compliance_officer', 'master_perfumer', 'r_and_d_manager'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/compliance/ifra'] },
  { href: ROUTES.COMPLIANCE_REACH, label: 'REACH Compliance', description: 'REACH regulation tracking', category: 'Compliance', roles: ['compliance_officer', 'procurement_manager'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/compliance/reach'] },
  { href: ROUTES.COMPLIANCE_CLP, label: 'CLP Compliance', description: 'CLP regulation dashboard', category: 'Compliance', roles: ['compliance_officer', 'lab_scientist'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/compliance/clp'] },
  { href: ROUTES.COMPLIANCE_SDS, label: 'Safety Data Sheets', description: 'SDS management', category: 'Compliance', roles: ['compliance_officer', 'lab_scientist', 'operations_manager'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/compliance/sds'] },
  { href: ROUTES.COMPLIANCE_CERTIFICATES, label: 'Certificates', description: 'Compliance certificates', category: 'Compliance', roles: ['compliance_officer', 'admin'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/compliance/certificates'] },
  { href: ROUTES.COMPLIANCE_ALERTS, label: 'Compliance Alerts', description: 'Regulatory alerts', category: 'Compliance', roles: ['compliance_officer', 'r_and_d_manager', 'master_perfumer'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/compliance/alerts'] },
  { href: ROUTES.COMPLIANCE_AUDIT, label: 'Audit Logs', description: 'Compliance audit trail', category: 'Compliance', roles: ['compliance_officer', 'admin', 'executive'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/audit-logs'] },

  { href: ROUTES.ANALYTICS_PERFORMANCE, label: 'Performance Analytics', description: 'Platform performance metrics', category: 'Analytics', roles: ['r_and_d_manager', 'executive', 'master_perfumer', 'admin'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/analytics/performance'] },
  { href: ROUTES.ANALYTICS_TRENDS, label: 'Trends', description: 'Market trend analysis', category: 'Analytics', roles: ['r_and_d_manager', 'executive'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/analytics/trends'] },
  { href: ROUTES.ANALYTICS_REPORTS, label: 'Reports', description: 'Generated reports', category: 'Analytics', roles: ['*'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/analytics/reports'] },
  { href: ROUTES.ANALYTICS_EXPORT, label: 'Export Center', description: 'Data export tools', category: 'Analytics', roles: ['*'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/analytics/export'] },

  { href: ROUTES.ADMIN_USERS, label: 'User Management', description: 'Manage platform users', category: 'Admin', roles: ['admin'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/auth/users'] },
  { href: ROUTES.ADMIN_TEAMS, label: 'Teams', description: 'Team organization', category: 'Admin', roles: ['admin', 'r_and_d_manager'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/auth/scim/v2/Groups'] },
  { href: ROUTES.ADMIN_ROLES, label: 'Roles', description: 'RBAC configuration', category: 'Admin', roles: ['admin'], isPublic: false, hasApiConnection: true, apiEndpoints: ['PUT /api/v1/auth/users/{id}/role'] },
  { href: ROUTES.ADMIN_BILLING, label: 'Billing Admin', description: 'Subscription management', category: 'Admin', roles: ['admin', 'executive'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/billing/plans'] },
  { href: ROUTES.ADMIN_API_KEYS, label: 'API Keys', description: 'API key management', category: 'Admin', roles: ['admin', 'ai_engineer'], isPublic: false, hasApiConnection: true, apiEndpoints: ['POST /api/v1/auth/api-keys'] },
  { href: ROUTES.ADMIN_AUDIT_TRAIL, label: 'Audit Trail', description: 'System audit logs', category: 'Admin', roles: ['admin', 'compliance_officer'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/auth/audit-logs'] },
  { href: ROUTES.ADMIN_SSO, label: 'SSO / SAML', description: 'Single sign-on config', category: 'Admin', roles: ['admin'], isPublic: false, hasApiConnection: true, apiEndpoints: ['POST /api/v1/auth/sso/{provider}'] },

  { href: ROUTES.SETTINGS_PROFILE, label: 'Profile Settings', description: 'User profile management', category: 'Settings', roles: ['*'], isPublic: false, hasApiConnection: true, apiEndpoints: ['PUT /api/v1/auth/me'] },
  { href: ROUTES.SETTINGS_PREFERENCES, label: 'Preferences', description: 'User preferences', category: 'Settings', roles: ['*'], isPublic: false, hasApiConnection: true, apiEndpoints: ['PUT /api/v1/auth/me/notifications'] },
  { href: ROUTES.SETTINGS_NOTIFICATIONS, label: 'Notifications', description: 'Notification settings', category: 'Settings', roles: ['*'], isPublic: false, hasApiConnection: false, apiEndpoints: [] },
  { href: ROUTES.SETTINGS_INTEGRATIONS, label: 'Integrations', description: 'Third-party connections', category: 'Settings', roles: ['admin', 'ai_engineer'], isPublic: false, hasApiConnection: false, apiEndpoints: [] },
  { href: ROUTES.SETTINGS_DATA, label: 'Data Management', description: 'Data export and privacy', category: 'Settings', roles: ['admin'], isPublic: false, hasApiConnection: false, apiEndpoints: [] },

  { href: ROUTES.BILLING, label: 'Billing', description: 'Subscription and invoices', category: 'Settings', roles: ['admin', 'executive'], isPublic: false, hasApiConnection: true, apiEndpoints: ['GET /api/v1/billing/plans'] },

  { href: ROUTES.INVESTOR, label: 'Investor Portal', description: 'Investment information', category: 'Investor', roles: ['*'], isPublic: true, hasApiConnection: false, apiEndpoints: [] },
  { href: ROUTES.INVESTOR_LOGIN, label: 'Investor Login', description: 'Investor authentication', category: 'Investor', roles: ['*'], isPublic: true, hasApiConnection: false, apiEndpoints: [] },
  { href: ROUTES.INVESTOR_DASHBOARD, label: 'Investor Dashboard', description: 'Investment KPIs', category: 'Investor', roles: ['*'], isPublic: false, hasApiConnection: false, apiEndpoints: [] },

  { href: ROUTES.EXPLORER, label: 'Explorer', description: 'Platform exploration tool', category: 'System', roles: ['admin'], isPublic: false, hasApiConnection: false, apiEndpoints: [] },
]

export const DEFAULT_PAGE_STATE: PageState = {
  status: 'untested',
  visited: false,
  testedAt: null,
  screenshotAt: null,
  notes: '',
  score: null,
}

export const STATUS_COLORS: Record<PageStatus, string> = {
  untested: 'slate',
  tested: 'emerald',
  broken: 'rose',
  mock: 'amber',
  connected: 'violet',
}

export const STATUS_ICONS: Record<PageStatus, string> = {
  untested: 'Circle',
  tested: 'CheckCircle2',
  broken: 'XCircle',
  mock: 'Database',
  connected: 'PlugZap',
}
