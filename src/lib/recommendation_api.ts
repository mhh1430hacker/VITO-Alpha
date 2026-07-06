import api from './api';

export interface AlternativeIngredientResponse {
  recommendation: Record<string, any>;
  alternatives: Array<{
    material_id: string;
    similarity_score: number;
    compatibility_score?: number;
    cost_impact?: number;
    reasoning?: string;
  }>;
}

export interface SupplierAlternativeResponse {
  recommendation: Record<string, any>;
  alternatives: Array<{
    supplier: string;
    price_estimate: number;
    lead_time_days: number;
    quality_score: number;
    region: string;
  }>;
}

export interface FormulaOptimizationResponse {
  recommendation: Record<string, any>;
  suggestions: Array<Record<string, any>>;
}

export interface IngredientRankingResponse {
  rankings: Array<{
    rank: number;
    material_id: string;
    importance_score: number;
    cost_percentage: number;
  }>;
}

export interface RecommendationListResponse {
  recommendations: Array<Record<string, any>>;
  total: number;
}

export const recommendationAPI = {
  findAlternatives: (material_id: string, max_results?: number, min_similarity?: number, include_cost_analysis?: boolean) =>
    api.post<AlternativeIngredientResponse>('/api/v1/recommendations/alternatives', null, {
      params: { material_id, max_results, min_similarity, include_cost_analysis },
    }),

  supplierAlternatives: (material_id: string, current_supplier?: string, region?: string, max_results?: number) =>
    api.post<SupplierAlternativeResponse>('/api/v1/recommendations/supplier-alternatives', null, {
      params: { material_id, current_supplier, region, max_results },
    }),

  formulaOptimizations: (formula_id: string, objective?: string, constraints?: Record<string, any>, max_suggestions?: number) =>
    api.post<FormulaOptimizationResponse>('/api/v1/recommendations/formula-optimization', null, {
      params: { formula_id, objective, max_suggestions },
    }),

  costReduction: (formula_id: string) =>
    api.post<FormulaOptimizationResponse>('/api/v1/recommendations/cost-reduction', null, {
      params: { formula_id },
    }),

  ingredientRankings: (formula_id: string) =>
    api.post<IngredientRankingResponse>('/api/v1/recommendations/ingredient-rankings', null, {
      params: { formula_id },
    }),

  listRecommendations: (params?: Record<string, any>) =>
    api.get<RecommendationListResponse>('/api/v1/recommendations', { params }),

  updateStatus: (recommendation_id: string, status: string) =>
    api.patch(`/api/v1/recommendations/${recommendation_id}/status`, null, { params: { status } }),

  recordFeedback: (recommendation_id: string, rating?: number, comment?: string, was_helpful?: boolean) =>
    api.post(`/api/v1/recommendations/${recommendation_id}/feedback`, { rating, comment, was_helpful }),
};
