import api from './api';

export interface MaterialInput {
  name: string;
  percentage: number;
}

export interface FormulaInput {
  name: string;
  materials: MaterialInput[];
  perfumer?: string;
}

export const aiAPI = {
  // Status
  getStatus: () => api.get('/api/v1/ai/status'),

  // Vector Search
  search: (query: string, top_k = 5) =>
    api.post('/api/v1/ai/search', { query, top_k }),
  searchSimilarMaterials: (materialId: string, top_k = 5) =>
    api.post('/api/v1/ai/search/similar-materials', { material_id: materialId, top_k }),

  // Formula Analysis
  analyzeFormula: (formula: FormulaInput) =>
    api.post('/api/v1/ai/formula/analyze', formula),

  // Success Prediction
  predictSuccess: (query: { name: string; materials: MaterialInput[] }) =>
    api.post('/api/v1/ai/predict', query),

  // Compliance
  getComplianceLimits: () => api.get('/api/v1/ai/compliance/limits'),
  checkCompliance: (substance: string, concentration: number, regulation = 'IFRA') =>
    api.post('/api/v1/ai/compliance/check', { substance, concentration, regulation }),
  checkFormulaCompliance: (formula: FormulaInput) =>
    api.post('/api/v1/ai/compliance/check-formula', formula),

  // Knowledge Graph
  getPatterns: () => api.get('/api/v1/ai/knowledge/patterns'),
  getPerfumerSignature: (perfumer: string) =>
    api.get(`/api/v1/ai/knowledge/perfumer/${perfumer}`),
  suggestPairings: (materialId: string, top_k = 5) =>
    api.post('/api/v1/ai/knowledge/suggest-pairings', { material_id: materialId, top_k }),

  // Material Pairs (20K+)
  getPairs: () => api.get('/api/v1/ai/pairs'),
  getPairsForMaterial: (material: string) =>
    api.get(`/api/v1/ai/pairs/${material}`),

  // Constraints (5K+)
  getConstraints: (material?: string, regulation?: string) => {
    let url = '/api/v1/ai/constraints'
    const params = new URLSearchParams()
    if (material) params.set('material', material)
    if (regulation) params.set('regulation', regulation)
    const qs = params.toString()
    if (qs) url += `?${qs}`
    return api.get(url)
  },

  // Formulas (1000+)
  getFormulas: (page = 1, perPage = 50, archetype?: string) => {
    let url = `/api/v1/ai/formulas?page=${page}&per_page=${perPage}`
    if (archetype) url += `&archetype=${archetype}`
    return api.get(url)
  },

  // Materials (500+)
  getMaterials: (family?: string, note?: string) => {
    let url = '/api/v1/ai/materials'
    const params = new URLSearchParams()
    if (family) params.set('family', family)
    if (note) params.set('note', note)
    const qs = params.toString()
    if (qs) url += `?${qs}`
    return api.get(url)
  },

  // Archetypes
  getArchetypes: () => api.get('/api/v1/ai/archetypes'),

  // Relationships (10K+)
  getRelationships: (perfumer?: string, limit = 100) => {
    let url = `/api/v1/ai/relationships?limit=${limit}`
    if (perfumer) url += `&perfumer=${perfumer}`
    return api.get(url)
  },

  // Statistics
  getStatistics: () => api.get('/api/v1/ai/statistics'),

  // Embeddings
  getMaterialEmbeddings: () => api.get('/api/v1/ai/embeddings/materials'),

  // Seed
  seedEngine: (count = 1000) => api.post(`/api/v1/ai/seed?count=${count}`),
};

export default aiAPI;
