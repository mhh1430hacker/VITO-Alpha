import api from './api';

export interface InferencePredictRequest {
  model_id: string;
  version?: string;
  input_data: Record<string, any>;
  use_cache?: boolean;
  request_metadata?: Record<string, any>;
}

export interface InferencePredictResponse {
  prediction_id: string;
  request_id: string;
  model_id: string;
  model_version: string;
  output_data: Record<string, any>;
  confidence_score?: number;
  uncertainty_score?: number;
  latency_ms: number;
  cache_hit: boolean;
  status: string;
  created_at: string;
}

export interface InferenceBatchRequest {
  model_id: string;
  version?: string;
  name: string;
  description?: string;
  items: Record<string, any>[];
  batch_size?: number;
  use_gpu?: boolean;
  parallel_workers?: number;
  timeout_seconds?: number;
}

export interface InferenceBatchResponse {
  batch_id: string;
  model_id: string;
  model_version: string;
  name: string;
  status: string;
  total_items: number;
  batch_size: number;
  use_gpu: boolean;
  parallel_workers: number;
  created_at: string;
}

export interface PredictionResponse {
  id: number;
  prediction_id: string;
  request_id: string;
  model_id: number;
  model_version_id: number;
  model_version_label?: string;
  output_data: Record<string, any>;
  confidence_score?: number;
  uncertainty_score?: number;
  entropy?: number;
  latency_ms?: number;
  gpu_used: boolean;
  status: string;
  error_message?: string;
  created_by?: number;
  created_at: string;
}

export interface PredictionListResponse {
  predictions: PredictionResponse[];
  total: number;
  page: number;
  page_size: number;
}

export interface DriftResponse {
  id: number;
  model_id: number;
  drift_type: string;
  metric_name: string;
  drift_score: number;
  direction: string;
  severity: string;
  alert_generated: boolean;
  alert_message?: string;
  created_at: string;
}

export interface DriftListResponse {
  drifts: DriftResponse[];
  total: number;
  page: number;
  page_size: number;
}

export interface DeploymentResponse {
  id: number;
  deployment_id: string;
  model_id: number;
  model_version_id: number;
  name: string;
  description?: string;
  strategy: string;
  status: string;
  traffic_percent: number;
  is_active: boolean;
  is_rolled_back: boolean;
  deployed_at: string;
  created_at: string;
}

export interface DeploymentHistoryResponse {
  id: number;
  deployment_id: number;
  event_type: string;
  reason?: string;
  status?: string;
  created_at: string;
}

export interface FeedbackResponse {
  id: number;
  prediction_id: number;
  feedback_type: string;
  original_output?: Record<string, any>;
  corrected_output?: Record<string, any>;
  rating?: number;
  comment?: string;
  is_used_for_retraining: boolean;
  created_at: string;
}

export interface ExplainabilityResponse {
  explanation_id: string;
  prediction_id: string;
  method: string;
  feature_importances: Record<string, number>;
  feature_names: string[];
  top_features: { name: string; importance: number; direction: string; contribution_pct: number }[];
  natural_language?: string;
  summary?: string;
  created_at: string;
}

export interface InferenceSummaryResponse {
  total_predictions: number;
  total_requests: number;
  success_rate: number;
  avg_latency_ms: number;
  p95_latency_ms: number;
  active_models: number;
  active_deployments: number;
  drift_alerts: number;
  pending_feedback: number;
  batch_jobs_running: number;
  cache_hit_rate: number;
  gpu_utilization_percent: number;
}

export const inferenceAPI = {
  predict: (data: InferencePredictRequest) =>
    api.post<InferencePredictResponse>('/api/v1/inference/predict', data),

  predictBatch: (data: InferenceBatchRequest) =>
    api.post<InferenceBatchResponse>('/api/v1/inference/predict/batch', data),

  listPredictions: (params?: { model_id?: string; status?: string; page?: number; page_size?: number }) =>
    api.get<PredictionListResponse>('/api/v1/inference/predictions', { params }),

  getPrediction: (predictionId: string) =>
    api.get<PredictionResponse>(`/api/v1/inference/predictions/${predictionId}`),

  getPredictionHistory: (params?: { model_id?: string; page?: number; page_size?: number }) =>
    api.get<PredictionListResponse>('/api/v1/inference/predictions/history', { params }),

  getPredictionConfidence: (predictionId: string) =>
    api.get(`/api/v1/inference/predictions/${predictionId}/confidence`),

  getPredictionMetrics: (params?: { model_id?: string; metric_name?: string; page?: number; page_size?: number }) =>
    api.get('/api/v1/inference/predictions/metrics', { params }),

  getDrift: (params?: { model_id?: string; drift_type?: string; severity?: string; page?: number; page_size?: number }) =>
    api.get<DriftListResponse>('/api/v1/inference/predictions/drift', { params }),

  retryPrediction: (prediction_id: string, reason?: string) =>
    api.post('/api/v1/inference/predictions/retry', { prediction_id, reason }),

  replayPredictions: (prediction_ids: string[], reason?: string) =>
    api.post('/api/v1/inference/predictions/replay', { prediction_ids, reason }),

  createFeedback: (data: { prediction_id: string; feedback_type: string; corrected_output?: Record<string, any>; rating?: number; comment?: string }) =>
    api.post<FeedbackResponse>('/api/v1/inference/feedback', data),

  listFeedback: (params?: { page?: number; page_size?: number }) =>
    api.get<FeedbackResponse[]>('/api/v1/inference/feedback', { params }),

  createDeployment: (data: { model_id: string; version: string; name: string; description?: string; strategy?: string; traffic_percent?: number; gpu_required?: boolean; gpu_type?: string; min_replicas?: number; max_replicas?: number; auto_scaling?: boolean; config?: Record<string, any> }) =>
    api.post<DeploymentResponse>('/api/v1/inference/deployments', data),

  listDeployments: (params?: { model_id?: string; active_only?: boolean; page?: number; page_size?: number }) =>
    api.get<DeploymentResponse[]>('/api/v1/inference/deployments', { params }),

  getDeploymentHistory: (deploymentId: string, params?: { page?: number; page_size?: number }) =>
    api.get<DeploymentHistoryResponse[]>(`/api/v1/inference/deployments/${deploymentId}/history`, { params }),

  rollbackDeployment: (deploymentId: string, reason?: string) =>
    api.post(`/api/v1/inference/deployments/${deploymentId}/rollback`, null, { params: { reason } }),

  explainPrediction: (predictionId: string, method?: string) =>
    api.get<ExplainabilityResponse>(`/api/v1/inference/predictions/${predictionId}/explain`, { params: { method } }),

  getDeploymentMetrics: (deploymentId: string) =>
    api.get(`/api/v1/inference/deployments/${deploymentId}/metrics`),

  getSummary: () =>
    api.get<InferenceSummaryResponse>('/api/v1/inference/summary'),
};
