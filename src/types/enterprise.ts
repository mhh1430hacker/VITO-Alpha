export type Role = 'super_admin' | 'company_admin' | 'employee'

export type PersonaId =
  | 'founder'
  | 'executive'
  | 'perfumer'
  | 'compliance'
  | 'researcher'
  | 'procurement'
  | 'finance'
  | 'laboratory'
  | 'analyst'

export interface Persona {
  id: PersonaId
  label: string
  subtitle: string
  tier: 'super_admin' | 'company_admin' | 'employee' | 'perfumer_tier'
  backendRoles: string[]
  icon: string
  color: string
  dashboardHref: string
  description: string
  capabilities: string[]
}

export const PERSONA_MAP: Record<string, PersonaId> = {
  admin: 'founder',
  executive: 'executive',
  master_perfumer: 'perfumer',
  compliance_officer: 'compliance',
  ai_engineer: 'researcher',
  ai_researcher: 'researcher',
  r_and_d_manager: 'researcher',
  procurement_manager: 'procurement',
  operations_manager: 'analyst',
  lab_scientist: 'laboratory',
}

export const PERSONAS: Persona[] = [
  {
    id: 'founder',
    label: 'Founder',
    subtitle: 'Platform Owner',
    tier: 'super_admin',
    backendRoles: ['admin'],
    icon: 'Building2',
    color: 'violet',
    dashboardHref: '/dashboard',
    description: 'Full platform visibility — infrastructure, billing, tenants, and security.',
    capabilities: ['System health', 'Tenant management', 'Billing overview', 'Audit trail', 'API access'],
  },
  {
    id: 'executive',
    label: 'Executive',
    subtitle: 'Business Leader',
    tier: 'company_admin',
    backendRoles: ['executive'],
    icon: 'TrendingUp',
    color: 'gold',
    dashboardHref: '/dashboard/executive',
    description: 'Revenue metrics, portfolio performance, and strategic insights.',
    capabilities: ['Revenue dashboards', 'Portfolio analytics', 'Market trends', 'Team oversight'],
  },
  {
    id: 'perfumer',
    label: 'Perfumer',
    subtitle: 'Creative Lead',
    tier: 'perfumer_tier',
    backendRoles: ['master_perfumer'],
    icon: 'FlaskConical',
    color: 'amber',
    dashboardHref: '/dashboard/perfumer',
    description: 'Fragrance creation, accord building, and formula optimization.',
    capabilities: ['Formulation Studio', 'Accord design', 'AI suggestions', 'Materials favorites'],
  },
  {
    id: 'compliance',
    label: 'Compliance',
    subtitle: 'Regulatory Expert',
    tier: 'company_admin',
    backendRoles: ['compliance_officer'],
    icon: 'ShieldCheck',
    color: 'teal',
    dashboardHref: '/dashboard/compliance',
    description: 'IFRA, REACH, CLP compliance monitoring and safety documentation.',
    capabilities: ['IFRA checker', 'REACH tracker', 'SDS generator', 'Compliance alerts'],
  },
  {
    id: 'researcher',
    label: 'Researcher',
    subtitle: 'AI & R&D',
    tier: 'company_admin',
    backendRoles: ['ai_engineer', 'ai_researcher', 'r_and_d_manager'],
    icon: 'Brain',
    color: 'violet',
    dashboardHref: '/dashboard/rd',
    description: 'ML model training, experiment tracking, and data-driven discovery.',
    capabilities: ['Model registry', 'Experiments', 'Embeddings', 'Predictions'],
  },
  {
    id: 'procurement',
    label: 'Procurement',
    subtitle: 'Supply Chain',
    tier: 'company_admin',
    backendRoles: ['procurement_manager'],
    icon: 'ShoppingCart',
    color: 'amber',
    dashboardHref: '/materials/suppliers',
    description: 'Supplier management, material sourcing, and cost optimization.',
    capabilities: ['Supplier directory', 'Contract management', 'Cost analysis', 'Inventory'],
  },
  {
    id: 'finance',
    label: 'Finance',
    subtitle: 'Budget & Billing',
    tier: 'company_admin',
    backendRoles: ['executive'],
    icon: 'CreditCard',
    color: 'gold',
    dashboardHref: '/admin/billing',
    description: 'Subscription management, cost tracking, and budget planning.',
    capabilities: ['Billing plans', 'Cost reports', 'Subscription management'],
  },
  {
    id: 'laboratory',
    label: 'Laboratory',
    subtitle: 'Lab Scientist',
    tier: 'employee',
    backendRoles: ['lab_scientist'],
    icon: 'TestTube',
    color: 'teal',
    dashboardHref: '/dashboard',
    description: 'Formulation testing, batch tracking, and quality control.',
    capabilities: ['Batch tracking', 'Formula testing', 'Quality reports', 'Task management'],
  },
  {
    id: 'analyst',
    label: 'Analyst',
    subtitle: 'Operations',
    tier: 'company_admin',
    backendRoles: ['operations_manager'],
    icon: 'BarChart3',
    color: 'teal',
    dashboardHref: '/dashboard/operations',
    description: 'Operational metrics, process optimization, and reporting.',
    capabilities: ['Operations dashboard', 'Performance metrics', 'Trend reports'],
  },
]

export function getPersona(backendRole: string): Persona {
  const personaId = PERSONA_MAP[backendRole] || 'analyst'
  return PERSONAS.find((p) => p.id === personaId) || PERSONAS[PERSONAS.length - 1]
}

export interface User {
  id: number
  email: string
  full_name: string
  role: Role
  is_active: boolean
  is_verified?: boolean
  company_id?: number
  username?: string
  phone?: string
  avatar_url?: string
  department?: string
  job_title?: string
  timezone?: string
  bio?: string
  created_at?: string
  last_login?: string
}

export interface Material {
  id: number
  name: string
  cas_number?: string
  smiles?: string
  supplier?: string
  cost_per_kg?: number
  availability?: string
  odor_profile?: Record<string, any>
  intensity?: number
  volatility?: string
  ifra_status?: string
  ifra_max_concentration?: number
  safety_notes?: string
  molecular_weight?: number
  logp?: number
  tpsa?: number
  category?: string
}

export interface FormulaIngredient {
  material_id: number
  material_name?: string
  concentration_percent: number
  notes?: string
}

export interface Formula {
  id: number
  name: string
  description?: string
  version: number
  status: 'draft' | 'under_review' | 'approved' | 'rejected' | 'archived'
  quality_score?: number
  commercial_score?: number
  stability_score?: number
  ethical_score?: number
  confidence_score?: number
  total_cost_per_kg?: number
  expected_selling_price?: number
  profit_margin?: number
  ifra_compliant: boolean
  created_at: string
  updated_at: string
  created_by?: number
  company_id?: number
  ingredients?: FormulaIngredient[]
  accord?: string
  project_id?: number
}

export interface Project {
  id: number
  name: string
  description?: string
  status: 'planning' | 'active' | 'completed' | 'cancelled'
  accord?: string
  target_launch_date?: string
  budget?: number
  team_lead_id?: number
  company_id?: number
  created_at: string
  updated_at: string
  formula_count?: number
}

export interface Supplier {
  id: number
  name: string
  contact_name?: string
  contact_email?: string
  contact_phone?: string
  status: 'active' | 'inactive' | 'pending'
  rating?: number
  payment_terms?: string
  company_id?: number
  created_at: string
  materials_supplied?: number
}

export interface SupplierContract {
  id: number
  supplier_id: number
  supplier_name?: string
  title: string
  start_date: string
  end_date: string
  value?: number
  status: 'active' | 'expiring_soon' | 'expired' | 'draft'
  auto_renew: boolean
  terms?: string
}

export interface InventoryItem {
  id: number
  material_id: number
  material_name?: string
  quantity_kg: number
  reorder_level: number
  location?: string
  last_restocked?: string
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
}

export interface BatchRecord {
  id: number
  batch_number: string
  material_id: number
  material_name?: string
  supplier_id?: number
  quantity_kg: number
  received_date: string
  quality_status: 'passed' | 'failed' | 'pending'
  expiry_date?: string
  notes?: string
}

export interface ComplianceRecord {
  id: number
  formula_id?: number
  material_id?: number
  regulation: 'IFRA' | 'REACH' | 'CLP' | 'OTHER'
  status: 'compliant' | 'violation' | 'pending_review'
  severity?: 'info' | 'warning' | 'critical'
  details?: Record<string, any>
  checked_at: string
  checked_by?: number
}

export interface AIExperiment {
  id: number
  name: string
  model_type: string
  status: 'running' | 'completed' | 'failed' | 'draft'
  parameters?: Record<string, any>
  metrics?: Record<string, number>
  dataset_id?: number
  created_by: number
  created_at: string
  completed_at?: string
}

export interface AIModel {
  id: number
  name: string
  type: string
  version: string
  status: 'active' | 'draft' | 'retired' | 'training'
  accuracy?: number
  last_trained?: string
  training_dataset_id?: number
  metadata?: Record<string, any>
}

export interface Dataset {
  id: number
  name: string
  description?: string
  record_count: number
  version: string
  schema?: Record<string, any>
  created_by: number
  created_at: string
}

export interface AuditEntry {
  id: number
  user_id?: number
  user_name?: string
  action: string
  resource_type: string
  resource_id?: number
  details?: Record<string, any>
  ip_address?: string
  created_at: string
}

export interface Notification {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  read: boolean
  created_at: string
  action_url?: string
}

export interface ComplianceAlert {
  id: number
  regulation: string
  title: string
  description: string
  severity: 'info' | 'warning' | 'critical'
  acknowledged: boolean
  created_at: string
  affected_formulas_count?: number
}

export interface Report {
  id: number
  name: string
  type: string
  format: 'pdf' | 'csv' | 'html'
  created_by: number
  created_at: string
  schedule?: string
  last_generated?: string
}

export interface Integration {
  id: number
  name: string
  type: string
  status: 'connected' | 'disconnected' | 'error'
  last_sync?: string
  config?: Record<string, any>
}

export interface KPIWidget {
  title: string
  value: number | string
  icon: string
  trend?: number
  color: string
  bgColor: string
}

export interface PredictionResult {
  quality_score: number
  commercial_score: number
  stability_score: number
  ethical_score: number
  confidence_score: number
  explanation?: string
  feature_importance?: Record<string, number>
}

export interface OptimizationParams {
  cost_ceiling?: number
  ifra_compliant: boolean
  target_accord?: string
  banned_materials?: number[]
  stability_minimum?: number
  quality_minimum?: number
  generations?: number
}
