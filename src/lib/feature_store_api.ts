import api from './api';

export interface FeatureDefinitionCreate {
  feature_id: string;
  name: string;
  description?: string;
  feature_type?: string;
  dtype?: string;
  entity_id?: string;
  group_name?: string;
  owner?: string;
  tags?: string[];
  extra_metadata?: Record<string, any>;
  source?: string;
}

export interface FeatureResponse {
  id: number;
  feature_id: string;
  name: string;
  description: string;
  feature_type: string;
  dtype: string;
  entity_id?: string;
  group_name?: string;
  owner?: string;
  tags: string[];
  extra_metadata: Record<string, any>;
  version: number;
  is_active: boolean;
  source?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FeatureGroupCreate {
  group_id: string;
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
  owner?: string;
  extra_metadata?: Record<string, any>;
}

export interface FeatureGroupResponse {
  id: number;
  group_id: string;
  name: string;
  description: string;
  category?: string;
  tags: string[];
  owner?: string;
  is_active: boolean;
  extra_metadata: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface FeatureSearchRequest {
  query: string;
  entity_id?: string;
  group_name?: string;
  page?: number;
  page_size?: number;
}

export interface FeatureListResponse {
  features: FeatureResponse[];
  total: number;
  page: number;
  page_size: number;
}

export interface FeatureSummary {
  total_features: number;
  active_features: number;
  groups_count: number;
  feature_types: Record<string, number>;
}

export const featureStoreAPI = {
  registerFeature: (data: FeatureDefinitionCreate) =>
    api.post<FeatureResponse>('/api/v1/features/register', data),

  listFeatures: (params?: Record<string, any>) =>
    api.get<FeatureListResponse>('/api/v1/features', { params }),

  getFeature: (featureId: string) =>
    api.get<FeatureResponse>(`/api/v1/features/${featureId}`),

  getFeatureVersions: (featureId: string) =>
    api.get(`/api/v1/features/${featureId}/versions`),

  createFeatureVersion: (featureId: string, data: Record<string, any>) =>
    api.post(`/api/v1/features/${featureId}/versions`, data),

  createGroup: (data: FeatureGroupCreate) =>
    api.post<FeatureGroupResponse>('/api/v1/features/groups', data),

  listGroups: (params?: Record<string, any>) =>
    api.get('/api/v1/features/groups', { params }),

  createValidation: (featureId: string, data: Record<string, any>) =>
    api.post(`/api/v1/features/${featureId}/validations`, data),

  recordFreshness: (featureId: string, status: string, expected_interval?: string, staleness_threshold?: number) =>
    api.post(`/api/v1/features/${featureId}/freshness`, null, { params: { status, expected_interval, staleness_threshold } }),

  getMetrics: (featureId: string, params?: Record<string, any>) =>
    api.get(`/api/v1/features/${featureId}/metrics`, { params }),

  getSummary: () =>
    api.get<FeatureSummary>('/api/v1/features/summary'),

  searchFeatures: (data: FeatureSearchRequest) =>
    api.post<FeatureListResponse>('/api/v1/features/search', data),

  materialize: (feature_ids: string[], target_type?: string, target_name?: string) =>
    api.post('/api/v1/features/materialize', null, { params: { feature_ids, target_type, target_name } }),

  listMaterializations: (params?: Record<string, any>) =>
    api.get('/api/v1/features/materializations', { params }),

  feastSync: (feature_view: string, feature_ids: string[], entities: string[]) =>
    api.post('/api/v1/features/feast/sync', null, { params: { feature_view, feature_ids, entities } }),

  createFeatureView: (name: string, feature_ids: string[], entities: string[], ttl?: string) =>
    api.post('/api/v1/features/feast/feature-view', null, { params: { name, feature_ids, entities, ttl } }),
};
