export interface AIModelSource {
  model: string
  confidence: number
  trainedOn: string
  lastUpdated: string
}

export interface AIInsight {
  id: string
  type: 'prediction' | 'warning' | 'suggestion' | 'discovery' | 'pattern'
  title: string
  description: string
  confidence: number
  source: AIModelSource
  timestamp: string
  actionable: boolean
  actionLabel?: string
  actionHref?: string
}

// ── Module 1: Formula Accelerator ──
export interface FormulaVersion {
  id: string
  name: string
  version: number
  createdAt: string
  stabilityScore: number
  performanceScore: number
  notes: string
}

export interface AcceleratorSuggestion {
  id: string
  type: 'accord' | 'substitution' | 'modifier' | 'concentration'
  title: string
  description: string
  expectedImprovement: string
  confidence: number
}

// ── Module 2: Regulatory Intelligence ──
export interface RegulatoryCheck {
  id: string
  formulaId: string
  formulaName: string
  substance: string
  regulation: 'IFRA' | 'REACH' | 'CLP' | 'SDS'
  currentLimit: number
  currentConcentration: number
  status: 'compliant' | 'warning' | 'violation'
  daysUntilChange?: number
  newLimit?: number
  impactScore: number
  affectedFormulas: number
  aiRecommendation?: string
}

// ── Module 3: Knowledge Vault ──
export interface KnowledgeEntry {
  id: string
  title: string
  content: string
  author: string
  category: 'technique' | 'material_note' | 'formula_secret' | 'observation' | 'rule_of_thumb'
  tags: string[]
  createdAt: string
  lastUsed: string
  aiExtracted: boolean
  relatedFormulas: number
  usageCount: number
}

// ── Module 4: Material Intelligence ──
export interface MaterialAlert {
  id: string
  material: string
  type: 'price_surge' | 'shortage' | 'quality_issue' | 'alternative_available'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  alternativeId?: string
  alternativeName?: string
  priceChange?: number
}

// ── Module 5: Experiment Optimizer ──
export interface ExperimentResult {
  id: string
  experimentName: string
  hypothesis: string
  result: 'success' | 'partial' | 'failure'
  successScore: number
  aiPredictedScore: number
  learnings: string[]
  date: string
}

// ── Module 6: Success Predictor ──
export interface SuccessPrediction {
  id: string
  formulaName: string
  predictedSuccess: number
  confidence: number
  marketFit: number
  longevityScore: number
  appealScore: number
  comparableHits: string[]
  riskFactors: string[]
  recommendation: string
}

// ── Module 7: Report Studio ──
export interface ReportTemplate {
  id: string
  name: string
  targetRole: 'perfumer' | 'management' | 'compliance' | 'procurement' | 'marketing'
  metrics: string[]
  format: 'pdf' | 'dashboard' | 'email'
  aiGenerated: boolean
}

// ── Module 8: Data Ingestion ──
export interface IngestedRecord {
  id: string
  source: 'excel' | 'pdf' | 'csv' | 'manual'
  fileName: string
  recordCount: number
  aiProcessed: boolean
  importedAt: string
  status: 'pending' | 'processing' | 'completed' | 'error'
}

// ── Pain Point 9: Perfumery OS ──
export type PainPointId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export interface PainPoint {
  id: PainPointId
  title: string
  description: string
  icon: string
  module: string
  href: string
  aiFeature: string
  metrics: { label: string; value: string; trend: 'up' | 'down' | 'stable' }[]
}

export const PAIN_POINTS: PainPoint[] = [
  {
    id: 1, title: 'Formula Accelerator', description: 'Reduce development from months to days with AI-guided formulation',
    icon: '⚡', module: 'accelerator', href: '/intelligence/accelerator',
    aiFeature: 'AI predicts stability, performance, and optimal concentrations',
    metrics: [
      { label: 'Avg Dev Time', value: '↓ 67%', trend: 'down' },
      { label: 'AI Accuracy', value: '94%', trend: 'up' },
      { label: 'Iterations Saved', value: '142', trend: 'up' },
    ],
  },
  {
    id: 2, title: 'Regulatory Intelligence', description: 'Real-time compliance across IFRA, REACH, CLP with automated alerts',
    icon: '🛡️', module: 'compliance', href: '/intelligence/compliance',
    aiFeature: 'AI monitors regulatory changes and auto-checks all formulas',
    metrics: [
      { label: 'Compliance Rate', value: '99.7%', trend: 'up' },
      { label: 'Auto-Resolved', value: '234', trend: 'up' },
      { label: 'Active Alerts', value: '3', trend: 'down' },
    ],
  },
  {
    id: 3, title: 'Data Ingestion Hub', description: 'Import Excel, PDF, CSV — AI structures your legacy knowledge',
    icon: '📥', module: 'data-ingestion', href: '/intelligence/data-ingestion',
    aiFeature: 'AI parses unstructured data into structured formulas and materials',
    metrics: [
      { label: 'Records Parsed', value: '12.4K', trend: 'up' },
      { label: 'AI Accuracy', value: '97%', trend: 'up' },
      { label: 'Hours Saved', value: '340', trend: 'up' },
    ],
  },
  {
    id: 4, title: 'Knowledge Vault', description: 'Never lose a perfumer\'s expertise — AI captures and preserves it',
    icon: '🧠', module: 'knowledge-vault', href: '/intelligence/knowledge-vault',
    aiFeature: 'AI extracts patterns from notes and links them to formulas',
    metrics: [
      { label: 'Entries Captured', value: '847', trend: 'up' },
      { label: 'AI Discoveries', value: '63', trend: 'up' },
      { label: 'Patterns Found', value: '128', trend: 'up' },
    ],
  },
  {
    id: 5, title: 'Material Intelligence', description: 'Real-time material tracking, AI substitution, price predictions',
    icon: '📦', module: 'materials', href: '/intelligence/materials',
    aiFeature: 'AI predicts shortages, suggests alternatives, monitors quality',
    metrics: [
      { label: 'Materials Tracked', value: '640', trend: 'up' },
      { label: 'AI Substitutions', value: '89', trend: 'up' },
      { label: 'Cost Saved', value: '$47K', trend: 'up' },
    ],
  },
  {
    id: 6, title: 'Success Predictor', description: 'Know commercial potential before production — not after',
    icon: '🔮', module: 'success-predictor', href: '/intelligence/success-predictor',
    aiFeature: 'AI predicts market success by analyzing 200+ historical patterns',
    metrics: [
      { label: 'Prediction Accuracy', value: '88%', trend: 'up' },
      { label: 'Hits Identified', value: '34', trend: 'up' },
      { label: 'Flops Avoided', value: '12', trend: 'up' },
    ],
  },
  {
    id: 7, title: 'Experiment Optimizer', description: 'Transform 100 experiments into 50 successful ones',
    icon: '🔬', module: 'experiments', href: '/intelligence/experiments',
    aiFeature: 'AI learns from every failure to predict the next success',
    metrics: [
      { label: 'Success Rate', value: '↑ 43%', trend: 'up' },
      { label: 'Experiments Logged', value: '1,247', trend: 'up' },
      { label: 'AI Insights', value: '312', trend: 'up' },
    ],
  },
  {
    id: 8, title: 'Report Studio', description: 'One data set, infinite views — tailored for every role',
    icon: '📊', module: 'reports', href: '/intelligence/reports',
    aiFeature: 'AI generates role-specific reports with natural language',
    metrics: [
      { label: 'Reports Generated', value: '523', trend: 'up' },
      { label: 'Roles Supported', value: '6', trend: 'up' },
      { label: 'Hours Saved/Month', value: '18', trend: 'up' },
    ],
  },
  {
    id: 9, title: 'Perfumery OS', description: 'The only platform built from the ground up for fragrance creation',
    icon: '🎯', module: 'overview', href: '/intelligence',
    aiFeature: 'Unified intelligence layer across every module',
    metrics: [
      { label: 'Active Users', value: '128', trend: 'up' },
      { label: 'AI Actions Today', value: '2,401', trend: 'up' },
      { label: 'Uptime', value: '99.99%', trend: 'up' },
    ],
  },
]
