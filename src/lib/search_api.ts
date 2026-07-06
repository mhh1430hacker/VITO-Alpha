import api from './api';

export interface SearchResult {
  id: string;
  text: string;
  description?: string;
  type: string;
  score: number;
  metadata?: Record<string, any>;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  search_type: string;
  latency_ms: number;
}

export interface AutocompleteResponse {
  suggestions: Array<{
    text: string;
    type: string;
  }>;
}

export interface GlobalSearchResponse {
  feature_results: SearchResult[];
  model_results: SearchResult[];
  formula_results: SearchResult[];
  material_results: SearchResult[];
  total_results: number;
  latency_ms: number;
}

export const searchAPI = {
  search: (query: string, search_type?: string, domains?: string[], page?: number, page_size?: number) =>
    api.post<SearchResponse>('/api/v1/search', { query, search_type, domains, page, page_size }),

  hybridSearch: (query: string, keyword_weight?: number, vector_weight?: number, domains?: string[], page?: number, page_size?: number) =>
    api.post<SearchResponse>('/api/v1/search/hybrid', { query, keyword_weight, vector_weight, domains, page, page_size }),

  autocomplete: (query: string, domains?: string[]) =>
    api.post<AutocompleteResponse>('/api/v1/search/autocomplete', { query, domains }),

  globalSearch: (query: string, limit_per_type?: number) =>
    api.post<GlobalSearchResponse>('/api/v1/search/global', { query, limit_per_type }),
};
