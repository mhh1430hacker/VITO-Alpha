import api from './api';

export interface ModelTag {
  id: number;
  key: string;
  value: string;
}

export interface ModelApproval {
  id: number;
  reviewer_id: number;
  reviewer_name?: string;
  status: string;
  comments?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface ModelDeployment {
  id: number;
  environment: string;
  status: string;
  deployment_url?: string;
  deployment_config?: Record<string, any>;
  deployed_by?: number;
  deployed_at: string;
  updated_at?: string;
}

export interface ModelVersion {
  id: number;
  model_id: number;
  version_number: number;
  semantic_version: string;
  stage: string;
  status: string;
  model_file_path?: string;
  model_file_size_bytes?: number;
  model_file_hash?: string;
  framework_version?: string;
  metrics?: Record<string, any>;
  hyperparameters?: Record<string, any>;
  artifacts?: Record<string, any>;
  dataset_name?: string;
  dataset_version?: string;
  dataset_lineage?: Record<string, any>;
  experiment_name?: string;
  experiment_id?: string;
  run_id?: string;
  experiment_lineage?: Record<string, any>;
  parent_version_id?: number;
  training_job_id?: string;
  training_duration_seconds?: number;
  training_code_version?: string;
  created_by?: number;
  created_at: string;
  updated_at?: string;
  tags: ModelTag[];
  approvals: ModelApproval[];
  deployments: ModelDeployment[];
}

export interface RegisteredModel {
  id: number;
  model_id: string;
  name: string;
  description?: string;
  task_type: string;
  framework: string;
  owner?: string;
  created_by?: number;
  company_id?: number;
  input_schema?: Record<string, any>;
  output_schema?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  tags: ModelTag[];
  versions: ModelVersion[];
}

export interface ModelListResponse {
  models: RegisteredModel[];
  total: number;
  page: number;
  page_size: number;
}

export interface LineageNode {
  id: string;
  type: string;
  label: string;
  metadata: Record<string, any>;
}

export interface LineageEdge {
  source: string;
  target: string;
  type: string;
  metadata: Record<string, any>;
}

export interface LineageGraph {
  nodes: LineageNode[];
  edges: LineageEdge[];
}

export interface CompareResponse {
  model_id: string;
  model_name: string;
  version_a: ModelVersion;
  version_b: ModelVersion;
  metric_diffs: Record<string, number | null>;
  parameter_diffs: Record<string, any>;
}

export interface AuditEntry {
  id: number;
  model_id: string;
  version?: string;
  action: string;
  actor?: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface AuditTrailResponse {
  entries: AuditEntry[];
  total: number;
  page: number;
  page_size: number;
}

export const modelRegistryAPI = {
  list: (params?: {
    page?: number;
    page_size?: number;
    task_type?: string;
    framework?: string;
    owner?: string;
    search?: string;
  }) => api.get<ModelListResponse>('/api/v1/models', { params }),

  get: (modelId: string) =>
    api.get<RegisteredModel>(`/api/v1/models/${modelId}`),

  register: (data: {
    model_id: string;
    name: string;
    description?: string;
    task_type?: string;
    framework?: string;
    owner?: string;
    version?: string;
    metrics?: Record<string, any>;
    hyperparameters?: Record<string, any>;
    dataset_name?: string;
    experiment_name?: string;
    run_id?: string;
    tags?: { key: string; value: string }[];
  }) => api.post<RegisteredModel>('/api/v1/models/register', data),

  promote: (data: {
    model_id: string;
    version: string;
    target_stage: 'development' | 'staging' | 'production' | 'archived';
    reason?: string;
  }) => api.post<ModelVersion>('/api/v1/models/promote', data),

  archive: (data: { model_id: string; version?: string }) =>
    api.post<RegisteredModel>('/api/v1/models/archive', data),

  rollback: (data: {
    model_id: string;
    target_version: string;
    reason?: string;
  }) => api.post<ModelVersion>('/api/v1/models/rollback', data),

  tag: (data: {
    model_id: string;
    version?: string;
    tags: { key: string; value: string }[];
  }) => api.post<RegisteredModel>('/api/v1/models/tag', data),

  approve: (data: {
    model_id: string;
    version: string;
    status: 'approved' | 'rejected' | 'changes_requested';
    comments?: string;
  }) => api.post<ModelVersion>('/api/v1/models/approve', data),

  deploy: (data: {
    model_id: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
    deployment_config?: Record<string, any>;
  }) => api.post<ModelVersion>('/api/v1/models/deploy', data),

  getVersion: (modelId: string, version: string) =>
    api.get<ModelVersion>(`/api/v1/models/${modelId}/versions/${version}`),

  compare: (data: {
    model_id: string;
    version_a: string;
    version_b: string;
  }) => api.post<CompareResponse>('/api/v1/models/compare', data),

  getLineage: (modelId: string, version?: string) =>
    api.get<LineageGraph>(`/api/v1/models/${modelId}/lineage`, {
      params: version ? { version } : {},
    }),

  getAuditTrail: (modelId: string, page = 1, pageSize = 50) =>
    api.get<AuditTrailResponse>(
      `/api/v1/models/${modelId}/audit-trail`,
      { params: { page, page_size: pageSize } }
    ),

  mlflowImport: (data: {
    mlflow_tracking_uri: string;
    experiment_id?: string;
    run_id?: string;
    model_name?: string;
  }) => api.post<RegisteredModel>('/api/v1/models/mlflow/import', data),

  mlflowExport: (data: {
    model_id: string;
    version: string;
    mlflow_tracking_uri: string;
    experiment_name?: string;
  }) => api.post('/api/v1/models/mlflow/export', data),
};
