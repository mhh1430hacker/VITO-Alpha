export interface AICollaboratorMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  confidence?: number
  citations?: Citation[]
  expectedImpact?: ImpactEstimate
  suggestedActions?: SuggestedAction[]
  riskAssessment?: RiskAssessment
}

export interface Citation {
  ref: number
  source: string
  excerpt: string
  documentId: string
  page?: number
}

export interface ImpactEstimate {
  costSavings?: { min: number; max: number; unit: string; confidence: number }
  qualityImpact?: { direction: 'positive' | 'negative' | 'neutral'; magnitude: number; confidence: number }
  stabilityImpact?: { direction: 'positive' | 'negative' | 'neutral'; monthsShelfLife: number; confidence: number }
  complianceImpact?: { before: string; after: string; regulation: string; confidence: number }
}

export interface SuggestedAction {
  label: string
  description: string
  action: string
  icon: string
  confidence: number
}

export interface RiskAssessment {
  overallRisk: 'low' | 'moderate' | 'high'
  factors: RiskFactor[]
  mitigationSuggestions: string[]
}

export interface RiskFactor {
  name: string
  severity: 'low' | 'moderate' | 'high'
  probability: number
  impact: string
}

export type CollaboratorCapability =
  | 'reduce_cost'
  | 'improve_longevity'
  | 'improve_stability'
  | 'generate_accord'
  | 'suggest_alternatives'
  | 'predict_success'
  | 'compare_formulas'
  | 'explain_compliance'
  | 'optimize_formula'
  | 'estimate_commercial'
  | 'suggest_positioning'
  | 'rag_query'

export interface CapabilityConfig {
  id: CollaboratorCapability
  label: string
  description: string
  icon: string
  requiresContext: boolean
  contextTypes: ('formula' | 'material' | 'project' | 'none')[]
  estimatedLatencyMs: number
  minConfidenceThreshold: number
}

export const COLLABORATOR_CAPABILITIES: CapabilityConfig[] = [
  {
    id: 'reduce_cost',
    label: 'Reduce Cost',
    description: 'Analyze formula and suggest cost-saving ingredient substitutions',
    icon: 'DollarSign',
    requiresContext: true,
    contextTypes: ['formula'],
    estimatedLatencyMs: 3200,
    minConfidenceThreshold: 0.70,
  },
  {
    id: 'improve_longevity',
    label: 'Improve Longevity',
    description: 'Suggest base note adjustments to extend fragrance duration on skin',
    icon: 'Clock',
    requiresContext: true,
    contextTypes: ['formula'],
    estimatedLatencyMs: 2800,
    minConfidenceThreshold: 0.72,
  },
  {
    id: 'improve_stability',
    label: 'Improve Stability',
    description: 'Identify ingredients prone to degradation and suggest stabilizers',
    icon: 'Shield',
    requiresContext: true,
    contextTypes: ['formula'],
    estimatedLatencyMs: 3400,
    minConfidenceThreshold: 0.72,
  },
  {
    id: 'generate_accord',
    label: 'Generate Accord',
    description: 'Create a novel fragrance accord from a text description',
    icon: 'Sparkles',
    requiresContext: false,
    contextTypes: ['none'],
    estimatedLatencyMs: 4500,
    minConfidenceThreshold: 0.70,
  },
  {
    id: 'suggest_alternatives',
    label: 'Suggest Alternatives',
    description: 'Find molecularly similar materials with better profiles',
    icon: 'GitBranch',
    requiresContext: true,
    contextTypes: ['material', 'formula'],
    estimatedLatencyMs: 2400,
    minConfidenceThreshold: 0.75,
  },
  {
    id: 'predict_success',
    label: 'Predict Success',
    description: 'Estimate commercial viability and consumer hedonic response',
    icon: 'TrendingUp',
    requiresContext: true,
    contextTypes: ['formula'],
    estimatedLatencyMs: 3100,
    minConfidenceThreshold: 0.75,
  },
  {
    id: 'compare_formulas',
    label: 'Compare Formulas',
    description: 'Multi-dimensional comparison of two or more formulas',
    icon: 'GitBranch',
    requiresContext: true,
    contextTypes: ['formula'],
    estimatedLatencyMs: 2800,
    minConfidenceThreshold: 0.65,
  },
  {
    id: 'explain_compliance',
    label: 'Explain Compliance',
    description: 'Explain IFRA restrictions and regulatory status in plain language',
    icon: 'Scale',
    requiresContext: true,
    contextTypes: ['formula', 'material'],
    estimatedLatencyMs: 2200,
    minConfidenceThreshold: 0.85,
  },
  {
    id: 'optimize_formula',
    label: 'Optimize Formula',
    description: 'Multi-objective optimization balancing cost, quality, and compliance',
    icon: 'Settings',
    requiresContext: true,
    contextTypes: ['formula'],
    estimatedLatencyMs: 5200,
    minConfidenceThreshold: 0.68,
  },
  {
    id: 'estimate_commercial',
    label: 'Estimate Commercial Potential',
    description: 'Revenue forecasting, market positioning, and pricing optimization',
    icon: 'DollarSign',
    requiresContext: true,
    contextTypes: ['formula', 'project'],
    estimatedLatencyMs: 3800,
    minConfidenceThreshold: 0.68,
  },
  {
    id: 'suggest_positioning',
    label: 'Suggest Premium Positioning',
    description: 'Analyze market landscape and recommend premium positioning strategy',
    icon: 'Star',
    requiresContext: true,
    contextTypes: ['formula'],
    estimatedLatencyMs: 3500,
    minConfidenceThreshold: 0.65,
  },
  {
    id: 'rag_query',
    label: 'Ask Knowledge Base',
    description: 'Search IFRA docs, safety sheets, research papers, and internal knowledge',
    icon: 'Search',
    requiresContext: false,
    contextTypes: ['none'],
    estimatedLatencyMs: 1800,
    minConfidenceThreshold: 0.65,
  },
]
