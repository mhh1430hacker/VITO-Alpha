import api from './api';

export interface EmbeddingGenerateRequest {
  source_type: string;
  source_id: string;
  provider?: string;
  model_name?: string;
  model_version?: string;
  parameters?: Record<string, any>;
}

export interface EmbeddingSearchRequest {
  query_text?: string;
  query_embedding_id?: string;
  query_vector?: number[];
  provider?: string;
  metric?: string;
  k?: number;
  filters?: Record<string, any>;
}

export interface EmbeddingResponse {
  embedding_id: string;
  source_type: string;
  source_id: string;
  provider: string;
  model_name?: string;
  model_version?: string;
  dimension: number;
  extra_metadata: Record<string, any>;
  tags: string[];
  created_at?: string;
}

export interface EmbeddingSimilarityRequest {
  source_type_a: string;
  source_id_a: string;
  source_type_b: string;
  source_id_b: string;
  provider?: string;
  metric?: string;
}

export interface EmbeddingSimilarityResponse {
  source_a: string;
  source_b: string;
  similarity_score: number;
  metric: string;
  provider?: string;
}

export interface EmbeddingSearchResponse {
  search_id: string;
  query_text?: string;
  results: Array<Record<string, any>>;
  total_results: number;
  latency_ms?: number;
}

export interface EmbeddingListResponse {
  embeddings: EmbeddingResponse[];
  total: number;
  page: number;
  page_size: number;
}

export interface EmbeddingSummary {
  total_embeddings: number;
  by_provider: string;
}

export const embeddingAPI = {
  generate: (data: EmbeddingGenerateRequest) =>
    api.post<EmbeddingResponse & { vector: number[] }>('/api/v1/embeddings/generate', data),

  list: (params?: Record<string, any>) =>
    api.get<EmbeddingListResponse>('/api/v1/embeddings', { params }),

  get: (embeddingId: string) =>
    api.get(`/api/v1/embeddings/${embeddingId}`),

  search: (data: EmbeddingSearchRequest) =>
    api.post<EmbeddingSearchResponse>('/api/v1/embeddings/search', data),

  similarity: (data: EmbeddingSimilarityRequest) =>
    api.post<EmbeddingSimilarityResponse>('/api/v1/embeddings/similarity', data),

  getLineage: (embeddingId: string) =>
    api.get(`/api/v1/embeddings/${embeddingId}/lineage`),

  getSummary: () =>
    api.get<EmbeddingSummary>('/api/v1/embeddings/summary'),
};
