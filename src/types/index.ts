export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'super_admin' | 'company_admin' | 'employee';
  is_active: boolean;
  is_verified?: boolean;
  company_id?: number;
  username?: string;
  phone?: string;
  avatar_url?: string;
  department?: string;
  job_title?: string;
  timezone?: string;
  bio?: string;
  created_at?: string;
  last_login?: string;
}

export interface Material {
  id: number;
  name: string;
  cas_number?: string;
  smiles?: string;
  supplier?: string;
  cost_per_kg?: number;
  availability?: string;
  odor_profile?: Record<string, any>;
  intensity?: number;
  volatility?: string;
  ifra_status?: string;
  ifra_max_concentration?: number;
  safety_notes?: string;
  molecular_weight?: number;
  logp?: number;
  tpsa?: number;
}

export interface FormulaIngredient {
  material_id: number;
  concentration_percent: number;
  notes?: string;
}

export interface Formula {
  id: number;
  name: string;
  description?: string;
  version: number;
  status: 'draft' | 'under_review' | 'approved' | 'rejected' | 'archived';
  quality_score?: number;
  commercial_score?: number;
  stability_score?: number;
  ethical_score?: number;
  confidence_score?: number;
  total_cost_per_kg?: number;
  expected_selling_price?: number;
  profit_margin?: number;
  ifra_compliant: boolean;
  created_at: string;
  updated_at: string;
  ingredients?: FormulaIngredient[];
}

export interface KPICards {
  total_projects: number;
  total_formulas: number;
  total_analyses: number;
  avg_quality_score: number;
  avg_commercial_score: number;
  avg_stability_score: number;
  avg_compliance_score: number;
  total_inventory_items: number;
}

export interface AnalysisResult {
  formula_id: number;
  quality_score: number;
  commercial_score: number;
  stability_score: number;
  ethical_score: number;
  confidence_score: number;
  explanation: string;
}

export interface OptimizationRequest {
  formula_id: number;
  objectives: {
    quality: number;
    cost: number;
    stability: number;
    compliance: number;
  };
  method: 'genetic' | 'bayesian' | 'multi_objective';
  generations?: number;
  population_size?: number;
}

export interface OptimizationResponse {
  optimized_formula: Array<{
    smiles: string;
    concentration: number;
    name: string;
  }>;
  original_scores: Record<string, number>;
  optimized_scores: Record<string, number>;
  improvement: Record<string, number>;
  method: string;
}
