const isAlpha = true

function fakeResponse<T = any>(data: T): Promise<{ data: any; status: number }> {
  return Promise.resolve({ data, status: 200 })
}

import { getAlphaStubResponse } from './alpha/interceptor'

const api = {
  get: <T = any>(url: string, config?: any): Promise<{ data: any; status: number }> => {
    const stub = getAlphaStubResponse({ url, method: 'get', params: config?.params })
    if (stub) return fakeResponse(stub.data)
    return fakeResponse({})
  },
  post: <T = any>(url: string, data?: any, config?: any): Promise<{ data: any; status: number }> => {
    const stub = getAlphaStubResponse({ url, method: 'post', data, params: config?.params })
    if (stub) return fakeResponse(stub.data)
    return fakeResponse({})
  },
  put: <T = any>(url: string, data?: any, config?: any): Promise<{ data: any; status: number }> => {
    const stub = getAlphaStubResponse({ url, method: 'put', data, params: config?.params })
    if (stub) return fakeResponse(stub.data)
    return fakeResponse({})
  },
  delete: <T = any>(url: string, config?: any): Promise<{ data: any; status: number }> => {
    const stub = getAlphaStubResponse({ url, method: 'delete', params: config?.params })
    if (stub) return fakeResponse(stub.data)
    return fakeResponse({})
  },
  patch: <T = any>(url: string, data?: any, config?: any): Promise<{ data: any; status: number }> => {
    const stub = getAlphaStubResponse({ url, method: 'patch', data, params: config?.params })
    if (stub) return fakeResponse(stub.data)
    return fakeResponse({})
  },
  create: () => api,
}

export default api

export const authAPI = {
  login: (email: string, password: string) => fakeResponse({ access_token: 'alpha-token', refresh_token: 'alpha-refresh', token_type: 'bearer' }),
  register: (data: any) => fakeResponse({ id: 'alpha-user', email: data?.email, message: 'Alpha mode: registration simulated' }),
  getMe: () => fakeResponse({ id: 'alpha-guest', email: 'explorer@vito-alpha.demo', full_name: 'VITO Explorer', role: 'perfumer', avatar_url: null }),
  refresh: () => fakeResponse({ access_token: 'alpha-token', refresh_token: 'alpha-refresh' }),
  changePassword: () => fakeResponse({ message: 'Alpha mode: password change simulated' }),
}

export const dashboardAPI = {
  getKPI: () => fakeResponse({ total_projects: 8, total_formulas: 42, total_analyses: 234, avg_quality_score: 87, avg_commercial_score: 76, avg_stability_score: 84, avg_compliance_score: 96, total_inventory_items: 640 }),
  getRecentFormulas: (..._args: any[]) => fakeResponse([{ id: 1, name: 'Amber Rush', stability_score: 87, performance_score: 82, status: 'active', updated_at: new Date().toISOString() }, { id: 2, name: 'Citrus Wave', stability_score: 74, performance_score: 68, status: 'draft', updated_at: new Date().toISOString() }, { id: 3, name: 'Oud Mystique', stability_score: 93, performance_score: 91, status: 'completed', updated_at: new Date().toISOString() }]),
  getRecentAnalyses: (..._args: any[]) => fakeResponse([{ id: 1, formula_name: 'Amber Rush', stability_score: 87, analyzed_at: new Date().toISOString() }, { id: 2, formula_name: 'Citrus Wave', stability_score: 74, analyzed_at: new Date().toISOString() }]),
  getLowStockAlerts: (..._args: any[]) => fakeResponse([]),
  getFormulasByStatus: (..._args: any[]) => fakeResponse({
    active: [{ id: 1, name: 'Amber Rush', status: 'active', stability_score: 87 }],
    draft: [{ id: 2, name: 'Citrus Wave', status: 'draft', stability_score: 74 }, { id: 3, name: 'Fleur de Lune', status: 'draft', stability_score: 65 }],
    completed: [{ id: 4, name: 'Oud Mystique', status: 'completed', stability_score: 93 }],
    archived: [{ id: 5, name: 'Summer Breeze', status: 'archived', stability_score: 71 }],
  }),
  getScoreTrends: (..._args: any[]) => fakeResponse([{ date: '2026-07-01', avg_stability: 82 }, { date: '2026-07-02', avg_stability: 84 }, { date: '2026-07-03', avg_stability: 83 }]),
}

export const adminAPI = {
  getDashboard: () => fakeResponse({ total_users: 128, total_companies: 15, active_sessions: 42, revenue_mrr: 12500, formulas_created: 1234, api_calls_today: 4520 }),
  listUsers: () => fakeResponse([{ id: 1, email: 'elena@vito.demo', full_name: 'Elena Voss', role: 'perfumer', is_active: true }, { id: 2, email: 'marco@vito.demo', full_name: 'Marco Ricci', role: 'perfumer', is_active: true }, { id: 3, email: 'amir@vito.demo', full_name: 'Amir Al-Farsi', role: 'perfumer', is_active: true }]),
  getUser: () => fakeResponse({ id: 1, email: 'elena@vito.demo', full_name: 'Elena Voss', role: 'perfumer', is_active: true }),
  updateUserRole: () => fakeResponse({ success: true }),
  deleteUser: () => fakeResponse({ success: true }),
  suspendUser: () => fakeResponse({ success: true }),
  reactivateUser: () => fakeResponse({ success: true }),
  bulkUserAction: () => fakeResponse({ success: true, affected: 0 }),
  impersonate: () => fakeResponse({ access_token: 'impersonate-token' }),
  listAuditLogs: () => fakeResponse([{ id: 1, action: 'login', user: 'Elena Voss', timestamp: new Date().toISOString() }]),
}

export const formulasAPI = {
  list: () => fakeResponse([]),
  get: () => fakeResponse({}),
  create: () => fakeResponse({}),
  update: () => fakeResponse({}),
  delete: () => fakeResponse({}),
  analyze: () => fakeResponse({}),
  updateStatus: () => fakeResponse({}),
}

export const materialsAPI = {
  list: () => fakeResponse([]),
  get: () => fakeResponse({}),
  create: () => fakeResponse({}),
  update: () => fakeResponse({}),
  delete: () => fakeResponse({}),
  bulkImport: () => fakeResponse({}),
  searchBySMILES: () => fakeResponse([]),
}

export const optimizationAPI = {
  optimize: () => fakeResponse({}),
  suggestNewFormulation: () => fakeResponse({}),
}

export const companyAPI = {
  list: () => fakeResponse([]),
  get: () => fakeResponse({}),
  create: () => fakeResponse({}),
  update: () => fakeResponse({}),
  delete: () => fakeResponse({}),
}

export const teamAPI = {
  invite: () => fakeResponse({}),
  bulkInvite: () => fakeResponse({}),
}

export const demoAPI = {
  provision: (data: any) => fakeResponse({ demo_id: 'alpha-demo', user: { id: 'alpha-user', email: data?.email, full_name: data?.full_name, role: 'perfumer' }, access_token: 'alpha-demo-token' }),
  get: () => fakeResponse({ id: 'alpha-demo', company_name: 'VITO Alpha Demo', status: 'active' }),
  convert: () => fakeResponse({ success: true }),
}

export const onboardingAPI = {
  start: () => fakeResponse({ onboarding_id: 'alpha-onboarding', current_step: 1 }),
  progress: () => fakeResponse({ current_step: 1, completed_steps: [] }),
  saveStep: () => fakeResponse({ success: true }),
  complete: () => fakeResponse({ success: true }),
  skip: () => fakeResponse({ success: true }),
}

export const profileAPI = {
  updateNotifications: () => fakeResponse({ success: true }),
}

export const billingAPI = {
  listPlans: () => fakeResponse([]),
  getPlan: () => fakeResponse({}),
  createPlan: () => fakeResponse({}),
  updatePlan: () => fakeResponse({}),
}
