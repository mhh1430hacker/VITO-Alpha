import { AlphaDataProvider } from '@/lib/alpha/data-provider'

interface StubConfig {
  url: string
  method: string
  data?: any
  params?: any
}

function matchURL(pattern: string, url: string): boolean {
  return url.includes(pattern)
}

export function getAlphaStubResponse(config: StubConfig): { data: any; status: number } | null {
  const { url, method, data, params } = config
  const provider = AlphaDataProvider.getInstance()

  // ── AI endpoints (existing) ──

  if (matchURL('/api/v1/ai/status', url)) {
    const ds = provider.getDatasets()
    return { data: { status: 'active (alpha)', generated: { materials: { total: ds.materials.length }, formulas: { total: ds.formulas.length } }, model_version: 'alpha-1.0', last_trained: new Date().toISOString() }, status: 200 }
  }

  if (matchURL('/api/v1/ai/formula/analyze', url)) {
    const ds = provider.getDatasets()
    const f = ds.formulas[0]
    return { data: { formula_name: data?.name || f?.name || 'Demo Formula', stability_score: f?.stability_score || 87, performance_score: f?.performance_score || 82, balance_score: 78, complexity_score: 65, novelty_score: 72, detected_accords: ['amber', 'woody'], note_pyramid: { top: 25, middle: 40, base: 35 }, similar_formulas: [] }, status: 200 }
  }

  if (matchURL('/api/v1/ai/predict', url)) {
    return { data: { formula_name: data?.name || 'Demo', predicted_success: 88, confidence: 82, market_fit: 85, longevity_score: 78, appeal_score: 91, comparable_hits: ['Baccarat Rouge 540', 'Grand Soir', 'Santal 33'], risk_factors: ['Woody-heavy competitive market'], recommendation: 'Strong market potential — target premium niche' }, status: 200 }
  }

  if (matchURL('/api/v1/ai/compliance/limits', url)) {
    return { data: { limits: {}, pending_changes: [], total_substances: 50 }, status: 200 }
  }

  if (matchURL('/api/v1/ai/compliance/check', url)) {
    return { data: { status: 'compliant', limit: 15, current: parseFloat(data?.concentration || '5') || 5, margin: 67, pending_change: null }, status: 200 }
  }

  if (matchURL('/api/v1/ai/knowledge/patterns', url)) {
    const ds = provider.getDatasets()
    return { data: { patterns: ds.materials.slice(0, 5).map((m, i) => ({ material_a: m.name, material_b: ds.materials[(i + 1) % ds.materials.length].name, co_occurrence_count: i + 1, support: 0.3 + i * 0.1, significance: 0.5 + i * 0.1, family_a: m.family, family_b: ds.materials[(i + 1) % ds.materials.length].family, compatibility: 0.8 })), total_patterns: 5, graph_stats: { total_materials: ds.materials.length, total_formulas: ds.formulas.length } }, status: 200 }
  }

  if (matchURL('/api/v1/ai/knowledge/perfumer', url)) {
    const name = url.split('/').pop() || 'Elena Voss'
    return { data: { perfumer: name, formula_count: 12, signature_materials: ['ambroxan', 'hedione', 'bergamot'], avg_stability: 85, avg_performance: 78 }, status: 200 }
  }

  if (matchURL('/api/v1/ai/knowledge/suggest-pairings', url)) {
    return { data: { material: data?.material_id || 'ambroxan', suggestions: [{ material: 'bergamot', score: 0.92 }, { material: 'hedione', score: 0.88 }, { material: 'vanillin', score: 0.85 }] }, status: 200 }
  }

  if (matchURL('/api/v1/ai/search', url)) {
    return { data: { query: data?.query || '', results: [], total_results: 0 }, status: 200 }
  }

  if (matchURL('/api/v1/ai/search/similar-materials', url)) {
    return { data: { query_material: data?.material_id || '', results: [{ material_id: 'bergamot', similarity: 0.95 }, { material_id: 'hedione', similarity: 0.85 }] }, status: 200 }
  }

  if (matchURL('/api/v1/ai/embeddings/materials', url)) {
    const ds = provider.getDatasets()
    return { data: { materials: ds.materials.map(m => ({ id: m.id, name: m.name, family: m.family })), dimensions: 12, count: ds.materials.length }, status: 200 }
  }

  if (matchURL('/api/v1/ai/seed', url)) {
    const ds = provider.getDatasets()
    return { data: { message: 'Alpha mode — synthetic data already loaded', stats: { generated: { materials: { total: ds.materials.length }, formulas: { total: ds.formulas.length } } } }, status: 200 }
  }

  // ── Auth / User endpoints ──

  if (matchURL('/api/v1/auth/admin/dashboard', url)) {
    return { data: { total_users: 128, total_companies: 15, active_sessions: 42, revenue_mrr: 12500, formulas_created: 1234, api_calls_today: 4520, user_growth: [{ month: 'Jan', count: 100 }, { month: 'Feb', count: 108 }, { month: 'Mar', count: 115 }, { month: 'Apr', count: 120 }, { month: 'May', count: 124 }, { month: 'Jun', count: 128 }], top_users: [{ id: 1, name: 'Elena Voss', formulas: 42 }, { id: 2, name: 'Marco Ricci', formulas: 38 }, { id: 3, name: 'Amir Al-Farsi', formulas: 35 }] }, status: 200 }
  }

  if (matchURL('/api/v1/auth/users', url)) {
    return { data: [{ id: 1, email: 'elena@vito.demo', full_name: 'Elena Voss', role: 'perfumer', is_active: true, created_at: '2026-01-15T10:00:00Z' }, { id: 2, email: 'marco@vito.demo', full_name: 'Marco Ricci', role: 'perfumer', is_active: true, created_at: '2026-02-10T09:30:00Z' }, { id: 3, email: 'amir@vito.demo', full_name: 'Amir Al-Farsi', role: 'perfumer', is_active: true, created_at: '2026-03-05T14:00:00Z' }, { id: 4, email: 'sophie@vito.demo', full_name: 'Sophie Laurent', role: 'researcher', is_active: true, created_at: '2026-03-20T11:00:00Z' }, { id: 5, email: 'yuki@vito.demo', full_name: 'Yuki Tanaka', role: 'compliance', is_active: true, created_at: '2026-04-01T08:00:00Z' }], status: 200 }
  }

  if (matchURL('/api/v1/auth/companies', url)) {
    return { data: [{ id: 1, name: 'Maison Voss Parfums', country: 'France', user_count: 12, is_active: true }, { id: 2, name: 'Ricci Fragranze', country: 'Italy', user_count: 8, is_active: true }, { id: 3, name: 'Al-Farsi Oud Atelier', country: 'UAE', user_count: 15, is_active: true }], status: 200 }
  }

  if (matchURL('/api/v1/auth/me', url)) {
    return { data: { id: 'alpha-guest', email: 'explorer@vito-alpha.demo', full_name: 'VITO Explorer', role: 'perfumer', avatar_url: null }, status: 200 }
  }

  if (matchURL('/api/v1/auth/login', url)) {
    return { data: { access_token: 'alpha-token', refresh_token: 'alpha-refresh', token_type: 'bearer' }, status: 200 }
  }

  // ── Dashboard ──

  if (matchURL('/api/v1/dashboard', url)) {
    const ds = provider.getDatasets()
    return { data: { ...ds.dashboardStats, recent_formulas: ds.formulas.slice(0, 10), recent_analyses: ds.experiments.slice(0, 10) }, status: 200 }
  }

  // ── Formulas ──

  if (matchURL('/api/v1/formulas', url)) {
    const ds = provider.getDatasets()
    return { data: ds.formulas, status: 200 }
  }

  // ── Materials ──

  if (matchURL('/api/v1/materials', url)) {
    const ds = provider.getDatasets()
    return { data: ds.materials, status: 200 }
  }

  // ── Optimization ──

  if (matchURL('/api/v1/optimize', url)) {
    return { data: { optimized_formula: data, improvement_score: 15, suggestions: ['Increase ambroxan to 14%', 'Add 2% hedione for lift'] }, status: 200 }
  }

  if (matchURL('/api/v1/suggest-new-formulation', url)) {
    return { data: { suggestion: { name: 'Suggested Alpha Blend', materials: [{ name: 'Ambroxan', percentage: 12 }, { name: 'Hedione', percentage: 25 }, { name: 'Iso E Super', percentage: 18 }, { name: 'Bergamot', percentage: 20 }, { name: 'Vanillin', percentage: 10 }, { name: 'Cashmeran', percentage: 5 }], predicted_score: 87, confidence: 82 } }, status: 200 }
  }

  // ── Super Intelligence ──

  if (matchURL('/api/v1/super-intelligence', url)) {
    return { data: { status: 'alpha-limited', message: 'Super Intelligence is available in full mode', capabilities: ['formula_analysis', 'market_prediction', 'trend_forecasting'], enabled: false }, status: 200 }
  }

  // ── Knowledge (VKD) ──

  if (matchURL('/api/v1/knowledge', url)) {
    const ds = provider.getDatasets()
    if (matchURL('/api/v1/knowledge/status', url)) {
      return { data: { status: 'alpha', bootstrapped: true, records: { materials: ds.materials.length, formulas: ds.formulas.length, suppliers: ds.suppliers.length }, started_at: new Date().toISOString() }, status: 200 }
    }
    if (matchURL('/api/v1/knowledge/metrics', url)) {
      return { data: { knowledge_growth: 100, embedding_freshness: 95, graph_density: 0.45, dataset_coverage: 80 }, status: 200 }
    }
    if (matchURL('/api/v1/knowledge/compliance', url)) {
      return { data: { total_substances: 50 }, status: 200 }
    }
    return { data: { message: 'VKD running in alpha mode', status: 'alpha-mode' }, status: 200 }
  }

  // ── Billing ──

  if (matchURL('/api/v1/billing', url)) {
    return { data: [], status: 200 }
  }

  // ── Embeddings ──

  if (matchURL('/api/v1/embeddings', url)) {
    return { data: { results: [], dimensions: 0, count: 0 }, status: 200 }
  }

  // ── Training ──

  if (matchURL('/api/v1/training', url)) {
    return { data: { message: 'Training disabled in alpha mode', status: 'disabled' }, status: 200 }
  }

  // ── Inference ──

  if (matchURL('/api/v1/inference', url)) {
    return { data: { predictions: [], model_version: 'alpha-none' }, status: 200 }
  }

  // ── Models ──

  if (matchURL('/api/v1/models', url)) {
    return { data: { models: [], count: 0 }, status: 200 }
  }

  // ── Similarity ──

  if (matchURL('/api/v1/similarity', url)) {
    return { data: { results: [], threshold: 0.7, count: 0 }, status: 200 }
  }

  // ── Search ──

  if (matchURL('/api/v1/search', url)) {
    return { data: { query: '', results: [], total: 0 }, status: 200 }
  }

  // ── Features ──

  if (matchURL('/api/v1/features', url)) {
    return { data: { features: [], count: 0 }, status: 200 }
  }

  // ── Recommendations ──

  if (matchURL('/api/v1/recommendations', url)) {
    return { data: { recommendations: [], count: 0 }, status: 200 }
  }

  // ── Demo ──

  if (matchURL('/api/v1/demo', url)) {
    return { data: { id: 'alpha-demo', company_name: 'VITO Alpha Demo', status: 'active', created_at: new Date().toISOString() }, status: 200 }
  }

  // ── Alpha ──

  if (matchURL('/api/v1/alpha', url)) {
    return { data: { status: 'running', version: '1.0.0-alpha', features: [] }, status: 200 }
  }

  // ── Onboarding ──

  if (matchURL('/api/v1/onboarding', url)) {
    return { data: { onboarding_id: 'alpha-onboarding', current_step: 1, completed_steps: [], total_steps: 5, started_at: new Date().toISOString() }, status: 200 }
  }

  return null
}
