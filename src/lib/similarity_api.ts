import api from './api';

export interface SimilarityResponse {
  source_a: string;
  source_b: string;
  similarity_score: number;
  metric: string;
  provider: string;
  dimension?: number;
}

export interface BatchSimilarityResponse {
  source_type: string;
  source_ids: string[];
  results: Array<{
    source_id: string;
    similarity_score: number;
  }>;
}

export interface FindSimilarResponse {
  source: string;
  source_type: string;
  results: Array<Record<string, any>>;
}

export const similarityAPI = {
  moleculeSimilarity: (molecule_a_id: string, molecule_b_id: string, metric?: string, provider?: string) =>
    api.post<SimilarityResponse>('/api/v1/similarity/molecule', null, {
      params: { molecule_a_id, molecule_b_id, metric, provider },
    }),

  fragranceSimilarity: (fragrance_a_id: string, fragrance_b_id: string, metric?: string, provider?: string) =>
    api.post<SimilarityResponse>('/api/v1/similarity/fragrance', null, {
      params: { fragrance_a_id, fragrance_b_id, metric, provider },
    }),

  materialSimilarity: (material_a_id: string, material_b_id: string, metric?: string) =>
    api.post<SimilarityResponse>('/api/v1/similarity/material', null, {
      params: { material_a_id, material_b_id, metric },
    }),

  formulaSimilarity: (formula_a_id: string, formula_b_id: string, metric?: string) =>
    api.post<SimilarityResponse>('/api/v1/similarity/formula', null, {
      params: { formula_a_id, formula_b_id, metric },
    }),

  supplierSimilarity: (supplier_a_id: string, supplier_b_id: string, metric?: string) =>
    api.post<SimilarityResponse>('/api/v1/similarity/supplier', null, {
      params: { supplier_a_id, supplier_b_id, metric },
    }),

  accordSimilarity: (accord_a_id: string, accord_b_id: string, metric?: string) =>
    api.post<SimilarityResponse>('/api/v1/similarity/accord', null, {
      params: { accord_a_id, accord_b_id, metric },
    }),

  marketSimilarity: (market_a_id: string, market_b_id: string, metric?: string) =>
    api.post<SimilarityResponse>('/api/v1/similarity/market', null, {
      params: { market_a_id, market_b_id, metric },
    }),

  batchSimilarity: (source_type: string, source_ids: string[], metric?: string) =>
    api.post<BatchSimilarityResponse>('/api/v1/similarity/batch', null, {
      params: { source_type, source_ids, metric },
    }),

  findSimilar: (source_type: string, source_id: string, k?: number, metric?: string) =>
    api.post<FindSimilarResponse>('/api/v1/similarity/find', null, {
      params: { source_type, source_id, k, metric },
    }),
};
