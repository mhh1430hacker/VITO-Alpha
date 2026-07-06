import api from './api'

export interface Plan {
  id: number
  name: string
  code: string
  price_monthly?: number
  price_yearly?: number
  features?: string[] | Record<string, boolean>
  is_active?: boolean
  [key: string]: any
}

export interface Subscription {
  id: number
  plan_id?: number
  status?: string
  current_period_end?: string
  cancel_at_period_end?: boolean
  [key: string]: any
}

export interface Invoice {
  id: number
  amount?: number
  currency?: string
  status?: string
  due_date?: string
  [key: string]: any
}

export const billingAPI = {
  listPlans: (_includeInactive?: boolean) =>
    api.get('/api/v1/billing/plans', { params: { include_inactive: _includeInactive ?? false } }),

  getPlan: (planId: number) =>
    api.get(`/api/v1/billing/plans/${planId}`),

  getPlanByCode: (code: string) =>
    api.get(`/api/v1/billing/plans/code/${code}`),

  createPlan: (data: any) =>
    api.post('/api/v1/billing/plans', data),

  updatePlan: (planId: number, data: any) =>
    api.put(`/api/v1/billing/plans/${planId}`, data),

  getActiveSubscription: () =>
    api.get('/api/v1/billing/subscriptions/active'),

  listSubscriptions: (params?: any) =>
    api.get('/api/v1/billing/subscriptions', { params }),

  createSubscription: (data: any) =>
    api.post('/api/v1/billing/subscriptions', data),

  updateSubscription: (subId: number, data: any) =>
    api.put(`/api/v1/billing/subscriptions/${subId}`, data),

  cancelSubscription: (subId: number, immediately: boolean = false) =>
    api.post(`/api/v1/billing/subscriptions/${subId}/cancel`, { immediately }),

  listInvoices: (page: number = 1, pageSize: number = 50) =>
    api.get('/api/v1/billing/invoices', { params: { page, page_size: pageSize } }),

  listPayments: () =>
    api.get('/api/v1/billing/payments'),

  getUsageSummary: () =>
    api.get('/api/v1/billing/usage/summary'),

  recordUsage: (data: any) =>
    api.post('/api/v1/billing/usage', data),

  getBillingSettings: () =>
    api.get('/api/v1/billing/settings'),

  updateBillingSettings: (data: any) =>
    api.put('/api/v1/billing/settings', data),

  listCoupons: () =>
    api.get('/api/v1/billing/coupons'),

  createCoupon: (data: any) =>
    api.post('/api/v1/billing/coupons', data),

  validateCoupon: (code: string, planId: number, interval: string) =>
    api.post('/api/v1/billing/coupons/validate', { code, plan_id: planId, interval }),

  createCheckoutSession: (data: any) =>
    api.post('/api/v1/billing/checkout', data),

  createBillingPortal: (returnUrl: string) =>
    api.post('/api/v1/billing/portal', { return_url: returnUrl }),

  checkFeatureAccess: (featureKey: string) =>
    api.post('/api/v1/billing/entitlements/check', { feature_key: featureKey }),

  getEntitlements: () =>
    api.get('/api/v1/billing/entitlements'),

  getQuotas: () =>
    api.get('/api/v1/billing/quotas'),

  seedPlans: () =>
    api.post('/api/v1/billing/seed'),

  getPaymentMethods: () =>
    api.get('/api/v1/billing/payment-methods'),

  createSetupIntent: () =>
    api.post('/api/v1/billing/payment-methods/setup-intent'),
}

export interface PaymentHistory {
  id: number
  amount: number
  currency: string
  status: string
  created_at: string
  [key: string]: any
}

export interface UsageSummaryItem {
  feature: string
  used: number
  limit: number
  unit: string
  [key: string]: any
}

export interface Quota {
  feature: string
  limit: number
  used: number
  remaining: number
  [key: string]: any
}

export { type Plan as BillingPlan, type Subscription as BillingSubscription }

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export function formatInterval(interval: string): string {
  return interval === 'monthly' ? '/mo' : interval === 'yearly' ? '/yr' : ''
}
