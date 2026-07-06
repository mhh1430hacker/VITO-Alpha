import api from './api';

export const knowledgeAPI = {
  // Status
  getStatus: () => api.get('/api/v1/knowledge/status'),
  getMetrics: () => api.get('/api/v1/knowledge/metrics'),

  // Bootstrap
  bootstrap: (seedCount = 1500) =>
    api.post(`/api/v1/knowledge/bootstrap?seed_count=${seedCount}`),

  // Discovery
  discover: (directories?: string) => {
    let url = '/api/v1/knowledge/discover'
    if (directories) url += `?directories=${encodeURIComponent(directories)}`
    return api.post(url)
  },

  // Normalization
  normalize: (datasetIds?: string) => {
    let url = '/api/v1/knowledge/normalize'
    if (datasetIds) url += `?dataset_ids=${encodeURIComponent(datasetIds)}`
    return api.post(url)
  },

  // Validation
  validate: () => api.post('/api/v1/knowledge/validate'),

  // Graph
  getGraph: () => api.get('/api/v1/knowledge/graph'),
  getCentrality: () => api.get('/api/v1/knowledge/graph/centrality'),
  getGraphPatterns: (minSupport = 2) =>
    api.get(`/api/v1/knowledge/graph/patterns?min_support=${minSupport}`),
  getCommunities: () => api.get('/api/v1/knowledge/graph/communities'),

  // Embeddings
  getEmbeddings: () => api.get('/api/v1/knowledge/embeddings'),
  searchEmbeddings: (query: string, topK = 10, model = 'minilm') =>
    api.post(`/api/v1/knowledge/embeddings/search?query=${encodeURIComponent(query)}&top_k=${topK}&model=${model}`),

  // Compliance
  getCompliance: (substance?: string) => {
    let url = '/api/v1/knowledge/compliance'
    if (substance) url += `?substance=${encodeURIComponent(substance)}`
    return api.get(url)
  },
  checkCompliance: (substance: string, concentration: number, regulation = 'IFRA') =>
    api.post(`/api/v1/knowledge/compliance/check?substance=${encodeURIComponent(substance)}&concentration=${concentration}&regulation=${regulation}`),

  // Query
  query: (query: string) =>
    api.post(`/api/v1/knowledge/query?query=${encodeURIComponent(query)}`),

  // Storage
  getRecords: (recordType?: string, limit = 100, offset = 0) => {
    let url = `/api/v1/knowledge/storage/records?limit=${limit}&offset=${offset}`
    if (recordType) url += `&record_type=${encodeURIComponent(recordType)}`
    return api.get(url)
  },

  // Training
  getTraining: (modelName?: string) => {
    let url = '/api/v1/knowledge/training'
    if (modelName) url += `?model_name=${encodeURIComponent(modelName)}`
    return api.get(url)
  },
  getModels: () => api.get('/api/v1/knowledge/training/models'),

  // Scheduler
  getScheduler: () => api.get('/api/v1/knowledge/scheduler'),
  runDaily: () => api.post('/api/v1/knowledge/scheduler/run'),

  // Reports
  getReports: (reportType = 'all') =>
    api.get(`/api/v1/knowledge/reports?report_type=${reportType}`),

  // Memory
  getMemory: (eventType?: string, limit = 100) => {
    let url = `/api/v1/knowledge/memory?limit=${limit}`
    if (eventType) url += `&event_type=${encodeURIComponent(eventType)}`
    return api.get(url)
  },

  // Reasoning
  reason: (query: string, maxSteps = 5) =>
    api.post(`/api/v1/knowledge/reason?query=${encodeURIComponent(query)}&max_steps=${maxSteps}`),
};

export default knowledgeAPI;
