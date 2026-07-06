import api from './api';

export interface TrainingJob {
  id: number;
  job_id: string;
  name: string;
  description?: string;
  status: string;
  priority: string;
  dataset_id?: number;
  schedule_id?: number;
  parent_job_id?: string;
  framework?: string;
  task_type?: string;
  seed?: number;
  hyperparameters?: Record<string, any>;
  training_config?: Record<string, any>;
  git_sha?: string;
  docker_image?: string;
  python_version?: string;
  gpu_type?: string;
  cuda_version?: string;
  worker_count?: number;
  runtime_seconds?: number;
  training_duration_seconds?: number;
  memory_used_mb?: number;
  cpu_usage_percent?: number;
  error_message?: string;
  retry_count: number;
  max_retries: number;
  model_registry_id?: number;
  model_registry_version_id?: number;
  experiment_name?: string;
  experiment_id?: string;
  run_id?: string;
  created_by?: number;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at?: string;
  run_count: number;
  artifact_count: number;
  metric_count: number;
}

export interface TrainingListResponse {
  jobs: TrainingJob[];
  total: number;
  page: number;
  page_size: number;
}

export interface TrainingActionResponse {
  success: boolean;
  message: string;
  job_id: string;
  new_status: string;
  timestamp: string;
}

export interface TrainingMetric {
  id: number;
  job_id: string;
  run_id?: string;
  epoch: number;
  step: number;
  metric_name: string;
  metric_value: number;
  split: string;
  recorded_at: string;
}

export interface TrainingLog {
  id: number;
  job_id: string;
  level: string;
  logger_name?: string;
  message: string;
  epoch?: number;
  step?: number;
  metadata?: Record<string, any>;
  traceback?: string;
  timestamp: string;
}

export interface TrainingArtifact {
  id: number;
  artifact_id: string;
  job_id: string;
  run_id?: string;
  artifact_type: string;
  name: string;
  description?: string;
  file_path?: string;
  file_size_bytes?: number;
  file_hash?: string;
  mime_type?: string;
  storage_uri?: string;
  storage_backend?: string;
  metadata?: Record<string, any>;
  tags?: Record<string, string>;
  created_by?: number;
  created_at: string;
}

export interface TrainingDataset {
  id: number;
  dataset_id: string;
  dataset_version?: string;
  name: string;
  description?: string;
  fingerprint?: string;
  checksum?: string;
  schema_hash?: string;
  origin?: string;
  source?: string;
  ingestion_time?: string;
  raw_reference?: string;
  processed_reference?: string;
  row_count?: number;
  column_count?: number;
  size_bytes?: number;
  split_train?: number;
  split_val?: number;
  split_test?: number;
  preprocessing_steps: string[];
  feature_columns: string[];
  target_columns: string[];
  metadata?: Record<string, any>;
  tags?: Record<string, string>;
  created_by?: number;
  created_at: string;
  updated_at?: string;
}

export interface TrainingRun {
  id: number;
  run_id: string;
  job_id: string;
  run_number: number;
  status: string;
  epoch: number;
  total_epochs: number;
  runtime_seconds?: number;
  loss?: number;
  validation_loss?: number;
  learning_rate?: number;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface TrainingCheckpoint {
  id: number;
  job_id: string;
  epoch: number;
  step: number;
  score?: number;
  file_path?: string;
  file_size_bytes?: number;
  file_hash?: string;
  is_best: boolean;
  is_latest: boolean;
  metrics_snapshot?: Record<string, any>;
  created_at: string;
}

export interface TrainingQueueEntry {
  id: number;
  job_id: string;
  position: number;
  priority: string;
  status: string;
  scheduled_at?: string;
  started_at?: string;
  completed_at?: string;
  worker_id?: string;
  scheduler_provider?: string;
  retry_count: number;
  last_error?: string;
  created_at: string;
  job?: TrainingJob;
}

export interface TrainingResource {
  id: number;
  resource_type: string;
  name: string;
  description?: string;
  gpu_type?: string;
  gpu_count: number;
  cpu_count: number;
  memory_gb: number;
  cuda_version?: string;
  docker_image?: string;
  is_available: boolean;
  is_allocated: boolean;
  cost_per_hour: number;
  created_at: string;
}

export interface TrainingSchedule {
  id: number;
  name: string;
  description?: string;
  frequency: string;
  cron_expression?: string;
  start_at?: string;
  end_at?: string;
  is_active: boolean;
  last_run_at?: string;
  next_run_at?: string;
  run_count: number;
  max_runs: number;
  created_by?: number;
  created_at: string;
  updated_at?: string;
}

export interface TrainingJobSummary {
  total_jobs: number;
  running: number;
  completed: number;
  failed: number;
  cancelled: number;
  retrying: number;
  paused: number;
  queued: number;
  scheduled: number;
  avg_duration_seconds: number;
  avg_memory_mb: number;
  total_errors: number;
  by_framework: Record<string, number>;
  by_task_type: Record<string, number>;
  by_priority: Record<string, number>;
  recent_runs: { job_id: string; name: string; status: string; started_at?: string }[];
  period_start: string;
  period_end: string;
}

export interface PromoteToRegistryResult {
  success: boolean;
  model_id: string;
  model_name: string;
  version: string;
  stage: string;
  status: string;
  message: string;
}

export interface ExperimentInfo {
  experiment_name: string;
  experiment_id?: string;
  job_count: number;
  run_count: number;
  best_metric?: number;
  last_run?: string;
  frameworks: string[];
}

export interface ExperimentComparison {
  experiment_name: string;
  jobs: TrainingJob[];
  metric_summary: Record<string, { min: number; max: number; mean: number; std: number }>;
  best_job?: string;
}

export interface DatasetLineage {
  dataset_id: string;
  dataset_name: string;
  origin?: string;
  source?: string;
  ingestion_time?: string;
  preprocessing_steps: string[];
  used_by_jobs: { job_id: string; name: string; status: string; created_at: string }[];
  parent_datasets: { dataset_id: string; name: string }[];
  child_datasets: { dataset_id: string; name: string }[];
}

export const trainingAPI = {
  start: (data: {
    job_id?: string;
    name: string;
    description?: string;
    dataset_id?: number;
    framework?: string;
    task_type?: string;
    hyperparameters?: Record<string, any>;
    training_config?: Record<string, any>;
    priority?: string;
    experiment_name?: string;
    seed?: number;
    worker_count?: number;
    gpu_type?: string;
    max_retries?: number;
    tags?: Record<string, string>;
  }) => api.post<TrainingJob>('/api/v1/training/start', data),

  cancel: (job_id: string) =>
    api.post<TrainingActionResponse>('/api/v1/training/cancel', null, { params: { job_id } }),

  retry: (job_id: string) =>
    api.post<TrainingActionResponse>('/api/v1/training/retry', null, { params: { job_id } }),

  pause: (job_id: string) =>
    api.post<TrainingActionResponse>('/api/v1/training/pause', null, { params: { job_id } }),

  resume: (job_id: string) =>
    api.post<TrainingActionResponse>('/api/v1/training/resume', null, { params: { job_id } }),

  list: (params?: {
    page?: number;
    page_size?: number;
    status?: string;
    experiment?: string;
    framework?: string;
    search?: string;
    sort_by?: string;
    sort_desc?: boolean;
  }) => api.get<TrainingListResponse>('/api/v1/training', { params }),

  get: (job_id: string) =>
    api.get<TrainingJob>(`/api/v1/training/${job_id}`),

  getMetrics: (job_id: string, params?: {
    metric_name?: string;
    epoch_from?: number;
    epoch_to?: number;
    split?: string;
    limit?: number;
  }) => api.get<TrainingMetric[]>(`/api/v1/training/${job_id}/metrics`, { params }),

  getLogs: (job_id: string, params?: {
    level?: string;
    epoch?: number;
    limit?: number;
    offset?: number;
  }) => api.get<TrainingLog[]>(`/api/v1/training/${job_id}/logs`, { params }),

  getArtifacts: (job_id: string, artifact_type?: string) =>
    api.get<TrainingArtifact[]>(`/api/v1/training/${job_id}/artifacts`, {
      params: artifact_type ? { artifact_type } : {},
    }),

  getJobDatasets: (job_id: string) =>
    api.get<TrainingDataset[]>(`/api/v1/training/${job_id}/datasets`),

  promote: (data: {
    job_id: string;
    model_name: string;
    model_id?: string;
    version?: string;
    registry_model_id?: number;
  }) => api.post<PromoteToRegistryResult>('/api/v1/training/promote', data),

  createCheckpoint: (data: {
    job_id: string;
    epoch: number;
    step?: number;
    score?: number;
    file_path?: string;
    file_size_bytes?: number;
    file_hash?: string;
    is_best?: boolean;
    is_latest?: boolean;
    metrics_snapshot?: Record<string, any>;
  }) => api.post<TrainingCheckpoint>('/api/v1/training/checkpoint', data),

  getCheckpoints: (job_id: string) =>
    api.get<TrainingCheckpoint[]>(`/api/v1/training/${job_id}/checkpoints`),

  getRuns: (job_id: string) =>
    api.get<TrainingRun[]>(`/api/v1/training/${job_id}/runs`),

  getQueue: (page = 1, pageSize = 20) =>
    api.get<TrainingQueueEntry[]>('/api/v1/training/queue', {
      params: { page, page_size: pageSize },
    }),

  getResources: () =>
    api.get<TrainingResource[]>('/api/v1/training/resources'),

  getExperiments: () =>
    api.get<ExperimentInfo[]>('/api/v1/training/experiments'),

  compareExperiments: (experimentName: string) =>
    api.get<ExperimentComparison>(`/api/v1/training/experiments/${encodeURIComponent(experimentName)}/compare`),

  getSummary: () =>
    api.get<TrainingJobSummary>('/api/v1/training/summary'),

  getDatasets: (page = 1, pageSize = 20) =>
    api.get<TrainingDataset[]>('/api/v1/training/datasets', {
      params: { page, page_size: pageSize },
    }),

  getDatasetLineage: (dataset_id: string) =>
    api.get<DatasetLineage>(`/api/v1/training/datasets/${dataset_id}/lineage`),

  getSchedules: () =>
    api.get<TrainingSchedule[]>('/api/v1/training/schedules'),

  createDataset: (data: {
    name: string;
    description?: string;
    dataset_id?: string;
    dataset_version?: string;
    fingerprint?: string;
    checksum?: string;
    schema_hash?: string;
    origin?: string;
    source?: string;
    raw_reference?: string;
    processed_reference?: string;
    row_count?: number;
    column_count?: number;
    size_bytes?: number;
    split_train?: number;
    split_val?: number;
    split_test?: number;
    preprocessing_steps?: string[];
    feature_columns?: string[];
    target_columns?: string[];
    metadata?: Record<string, any>;
    tags?: Record<string, string>;
  }) => api.post<TrainingDataset>('/api/v1/training/datasets', data),

  createResource: (data: {
    resource_type: string;
    name: string;
    description?: string;
    gpu_type?: string;
    gpu_count?: number;
    cpu_count?: number;
    memory_gb?: number;
    cuda_version?: string;
    docker_image?: string;
    is_available?: boolean;
    is_allocated?: boolean;
    cost_per_hour?: number;
  }) => api.post<TrainingResource>('/api/v1/training/resources', data),

  createSchedule: (data: {
    name: string;
    description?: string;
    frequency: string;
    cron_expression?: string;
    start_at?: string;
    end_at?: string;
    is_active?: boolean;
    max_runs?: number;
  }) => api.post<TrainingSchedule>('/api/v1/training/schedules', data),

  recordMetric: (job_id: string, metric_name: string, metric_value: number, params?: {
    epoch?: number;
    step?: number;
    split?: string;
  }) => api.post<TrainingMetric>('/api/v1/training/metrics', null, {
    params: { job_id, metric_name, metric_value, ...params },
  }),

  appendLog: (job_id: string, message: string, params?: {
    level?: string;
    epoch?: number;
    step?: number;
  }) => api.post<TrainingLog>('/api/v1/training/logs', null, {
    params: { job_id, message, ...params },
  }),
};
