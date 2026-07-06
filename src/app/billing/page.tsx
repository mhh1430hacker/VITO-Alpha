'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import {
  AlertCircle, Loader2, RefreshCw, CreditCard, FileText, Download,
  CheckCircle, Zap, HardDrive, Users, ChevronRight, ArrowLeft,
  BarChart3, Receipt, Settings2, Plus, XCircle, Clock, Search,
  ArrowUpDown, Trash2, Star, TrendingUp, DollarSign, Calendar,
  Building2, ExternalLink,
} from 'lucide-react'
import {
  billingAPI, formatCents, formatInterval,
  type Plan, type Subscription, type Invoice,
  type UsageSummaryItem, type PaymentHistory, type Quota,
} from '@/lib/billing_api'

type PageState = 'loading' | 'ready' | 'error'

interface SubscriptionState {
  sub: Subscription | null
  plan: Plan | null
}

const PAYMENT_METHODS_MOCK = [
  { id: 'pm_1', brand: 'Visa', last4: '4242', expMonth: 12, expYear: 2026, isDefault: true },
  { id: 'pm_2', brand: 'Mastercard', last4: '8888', expMonth: 8, expYear: 2025, isDefault: false },
]

export default function BillingPage() {
  const [pageState, setPageState] = useState<PageState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  const [subscription, setSubscription] = useState<SubscriptionState>({ sub: null, plan: null })
  const [plans, setPlans] = useState<Plan[]>([])
  const [usage, setUsage] = useState<UsageSummaryItem[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [invoiceTotal, setInvoiceTotal] = useState(0)
  const [payments, setPayments] = useState<PaymentHistory[]>([])
  const [reloading, setReloading] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null)
  const [showPlanSelector, setShowPlanSelector] = useState(false)
  const [invoiceSearch, setInvoiceSearch] = useState('')
  const [invoiceSort, setInvoiceSort] = useState<'desc' | 'asc'>('desc')

  const loadData = useCallback(async () => {
    try {
      const [subRes, plansRes, usageRes, invRes, payRes] = await Promise.all([
        billingAPI.getActiveSubscription(),
        billingAPI.listPlans(),
        billingAPI.getUsageSummary(),
        billingAPI.listInvoices(1, 50),
        billingAPI.listPayments(),
      ])
      const sub = subRes.data
      let plan: Plan | null = null
      if (sub) {
        const planRes = await billingAPI.getPlan(sub.plan_id)
        plan = planRes.data
      }
      setSubscription({ sub, plan })
      setPlans(plansRes.data)
      setUsage(usageRes.data?.items || [])
      setInvoices(invRes.data?.items || [])
      setInvoiceTotal(invRes.data?.total || 0)
      setPayments(payRes.data || [])
      setPageState('ready')
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message || 'Failed to load billing data')
      setPageState('error')
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const handleCancel = async () => {
    if (!subscription.sub) return
    try {
      const res = await billingAPI.cancelSubscription(subscription.sub.id, false)
      setSubscription(prev => ({ ...prev, sub: res.data }))
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message)
    }
  }

  const handleChangePlan = async (planId: number) => {
    if (!subscription.sub) return
    try {
      const res = await billingAPI.updateSubscription(subscription.sub.id, { plan_id: planId })
      const planRes = await billingAPI.getPlan(planId)
      setSubscription({ sub: res.data, plan: planRes.data })
      setSelectedPlanId(null)
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message)
    }
  }

  const handlePortal = async () => {
    try {
      const res = await billingAPI.createBillingPortal(window.location.href)
      if (res.data.portal_url) {
        window.location.href = res.data.portal_url
      }
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message)
    }
  }

  const formatDate = (d: string | null) => {
    if (!d) return '-'
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const filteredInvoices = invoices
    .filter(inv =>
      !invoiceSearch ||
      inv.invoice_number.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
      inv.status.toLowerCase().includes(invoiceSearch.toLowerCase())
    )
    .sort((a, b) => {
      const da = a.created_at ? new Date(a.created_at).getTime() : 0
      const db = b.created_at ? new Date(b.created_at).getTime() : 0
      return invoiceSort === 'desc' ? db - da : da - db
    })

  if (pageState === 'loading') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Billing & Subscription</h1>
            <p className="text-sm text-muted-foreground">Manage your plan, usage, and invoices</p>
          </div>
        </div>
        <Card>
          <CardHeader><CardTitle>Loading</CardTitle><CardDescription>Fetching billing data...</CardDescription></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (pageState === 'error') {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Billing & Subscription</h1>
        <Card className="border-destructive/50">
          <CardContent className="flex flex-col items-center gap-4 pt-12 pb-12">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <p className="text-destructive font-semibold">Failed to Load Billing Data</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={loadData}><RefreshCw className="h-4 w-4 mr-2" />Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const sub = subscription.sub
  const plan = subscription.plan
  const hasSubscription = !!sub

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Billing & Subscription</h1>
          <p className="text-sm text-muted-foreground">Manage your plan, usage, and invoices</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { setReloading(true); loadData().finally(() => setReloading(false)) }} disabled={reloading}>
          <RefreshCw className={cn('h-4 w-4 mr-2', reloading && 'animate-spin')} /> Refresh
        </Button>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex items-center gap-3 pt-3 pb-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setError(null)}>Dismiss</Button>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-2xl grid-cols-5">
          <TabsTrigger value="overview"><BarChart3 className="h-4 w-4 mr-2" />Overview</TabsTrigger>
          <TabsTrigger value="plans"><CreditCard className="h-4 w-4 mr-2" />Plans</TabsTrigger>
          <TabsTrigger value="invoices"><Receipt className="h-4 w-4 mr-2" />Invoices</TabsTrigger>
          <TabsTrigger value="payments"><CreditCard className="h-4 w-4 mr-2" />Payment Methods</TabsTrigger>
          <TabsTrigger value="settings"><Settings2 className="h-4 w-4 mr-2" />Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-4">
          {hasSubscription && plan ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{plan.name} Plan</CardTitle>
                        <CardDescription>Current subscription</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {plan.code === 'business' && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                        <Badge variant={sub.status === 'active' ? 'success' : sub.status === 'trialing' ? 'default' : 'secondary'}>
                          {sub.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2 mb-1">
                      {plan.monthly_price_cents > 0 ? (
                        <>
                          <span className="text-3xl font-bold">
                            {sub.billing_interval === 'yearly' ? formatCents(plan.yearly_price_cents) : formatCents(plan.monthly_price_cents)}
                          </span>
                          <span className="text-muted-foreground">{formatInterval(sub.billing_interval)}</span>
                          {sub.billing_interval === 'yearly' && (
                            <Badge variant="success" className="text-xs">Save 20%</Badge>
                          )}
                        </>
                      ) : (
                        <span className="text-xl font-bold">Custom pricing</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{sub.seats} seat{sub.seats !== 1 ? 's' : ''}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Next billing: {formatDate(sub.current_period_end)}</span>
                      {sub.trial_end && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />Trial until: {formatDate(sub.trial_end)}</span>}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                      <div className="bg-muted/30 rounded-lg p-3 text-center">
                        <HardDrive className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                        <div className="text-xs text-muted-foreground">Storage</div>
                        <div className="text-sm font-semibold">{plan.max_storage_gb >= 9999 ? 'Unlimited' : `${plan.max_storage_gb}GB`}</div>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-3 text-center">
                        <Zap className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                        <div className="text-xs text-muted-foreground">API Calls</div>
                        <div className="text-sm font-semibold">{plan.max_api_calls >= 999999999 ? 'Unlimited' : `${(plan.max_api_calls / 1000).toFixed(0)}K`}</div>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-3 text-center">
                        <Users className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                        <div className="text-xs text-muted-foreground">Team</div>
                        <div className="text-sm font-semibold">{plan.max_users >= 999999 ? 'Unlimited' : `${plan.max_users} users`}</div>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-3 text-center">
                        <BarChart3 className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                        <div className="text-xs text-muted-foreground">Predictions</div>
                        <div className="text-sm font-semibold">{plan.max_predictions >= 999999 ? 'Unlimited' : `${(plan.max_predictions / 1000).toFixed(0)}K`}</div>
                      </div>
                    </div>

                    <Separator className="my-4" />
                    <div className="flex gap-2 flex-wrap">
                      <Button variant="outline" size="sm" onClick={() => setActiveTab('plans')}>
                        <ArrowUpDown className="h-4 w-4 mr-2" />Change Plan
                      </Button>
                      <Button variant="outline" size="sm" onClick={handlePortal}>
                        <ExternalLink className="h-4 w-4 mr-2" />Manage in Stripe
                      </Button>
                      {!sub.cancel_at_period_end && sub.status === 'active' && (
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={handleCancel}>
                          Cancel at period end
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Usage This Period</CardTitle>
                    <CardDescription>
                      {usage.length} metric{usage.length !== 1 ? 's' : ''} tracked
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {usage.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No usage data available yet. Start using VITO to see your usage metrics.</p>
                    )}
                    {usage.map(item => (
                      <div key={item.metric}>
                        <div className="flex items-center justify-between mb-1 text-sm">
                          <span className="font-medium">{item.metric_display}</span>
                          <span className="text-muted-foreground">
                            {item.used.toLocaleString()} / {item.limit >= 999999999 ? 'Unlimited' : item.limit.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all duration-500',
                              item.percentage > 90 ? 'bg-destructive' : item.percentage > 70 ? 'bg-warning' : 'bg-primary'
                            )}
                            style={{ width: `${Math.min(item.percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Payment Method</CardTitle>
                    <CardDescription>Cards on file</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {PAYMENT_METHODS_MOCK.map((pm) => (
                      <div key={pm.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium text-sm">{pm.brand}</span>
                              {pm.isDefault && <Badge variant="outline" className="text-[10px] h-4 px-1">Default</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              &bull;&bull;&bull;&bull; {pm.last4} &middot; Expires {pm.expMonth}/{pm.expYear}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full" onClick={handlePortal}>
                      <Plus className="h-4 w-4 mr-2" /> Add Payment Method
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => setActiveTab('invoices')}>
                      <Download className="h-4 w-4 mr-2" /> View Invoices
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handlePortal}>
                      <CreditCard className="h-4 w-4 mr-2" /> Update Payment Method
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => setActiveTab('plans')}>
                      <TrendingUp className="h-4 w-4 mr-2" /> Upgrade Plan
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => window.open('/pricing', '_blank')}>
                      <DollarSign className="h-4 w-4 mr-2" /> View Pricing
                    </Button>
                  </CardContent>
                </Card>

                {payments.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Recent Payments</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {payments.slice(0, 5).map(p => (
                        <div key={p.id} className="flex items-center justify-between text-xs py-1.5">
                          <div className="flex items-center gap-2">
                            {p.status === 'succeeded' ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : p.status === 'failed' ? (
                              <XCircle className="h-3 w-3 text-destructive" />
                            ) : (
                              <Clock className="h-3 w-3 text-muted-foreground" />
                            )}
                            <span>{formatDate(p.created_at)}</span>
                          </div>
                          <span className="font-medium">{p.amount_display}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center gap-4 pt-16 pb-16">
                <CreditCard className="h-16 w-16 text-muted-foreground/30" />
                <p className="text-lg font-medium">No active subscription</p>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  Choose a plan to start using VITO&apos;s enterprise features.
                </p>
                <Button onClick={() => setActiveTab('plans')}>
                  View Plans <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="plans" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Choose a Plan</CardTitle>
              <CardDescription>
                {hasSubscription ? 'Switch plans at any time. Changes will be prorated.' : 'Select the plan that fits your needs.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {plans.filter(p => p.is_active).map(p => {
                  const isCurrentPlan = plan?.id === p.id
                  const isUpgrade = hasSubscription && (p.sort_order > (plan?.sort_order || 0))
                  const isDowngrade = hasSubscription && (p.sort_order < (plan?.sort_order || 0))
                  return (
                    <Card key={p.id} className={cn(isCurrentPlan && 'border-primary ring-1 ring-primary')}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{p.name}</CardTitle>
                          {p.code === 'business' && <Badge variant="success" className="text-xs">Popular</Badge>}
                        </div>
                        <CardDescription className="text-xs">{p.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <div className="text-2xl font-bold">
                            {p.monthly_price_cents > 0 ? formatCents(p.monthly_price_cents) : 'Custom'}
                            <span className="text-sm font-normal text-muted-foreground">/mo</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {p.yearly_price_cents > 0 ? `${formatCents(p.yearly_price_cents)}/year` : 'Contact for pricing'}
                          </div>
                        </div>
                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between"><span>Users</span><span>{p.max_users >= 999999 ? 'Unlimited' : p.max_users}</span></div>
                          <div className="flex justify-between"><span>API calls</span><span>{p.max_api_calls >= 999999999 ? 'Unlimited' : p.max_api_calls.toLocaleString()}</span></div>
                          <div className="flex justify-between"><span>Storage</span><span>{p.max_storage_gb >= 9999 ? 'Unlimited' : `${p.max_storage_gb}GB`}</span></div>
                          <div className="flex justify-between"><span>Predictions</span><span>{p.max_predictions >= 999999 ? 'Unlimited' : p.max_predictions.toLocaleString()}</span></div>
                          {p.includes_sso && <div className="flex justify-between"><span>SSO</span><CheckCircle className="h-3 w-3 text-green-500" /></div>}
                          {p.includes_sla && <div className="flex justify-between"><span>SLA</span><CheckCircle className="h-3 w-3 text-green-500" /></div>}
                          {p.includes_audit_trail && <div className="flex justify-between"><span>Audit Trail</span><CheckCircle className="h-3 w-3 text-green-500" /></div>}
                        </div>
                        <Button
                          className="w-full mt-4"
                          variant={isCurrentPlan ? 'outline' : 'default'}
                          onClick={() => {
                            if (hasSubscription && !isCurrentPlan) {
                              handleChangePlan(p.id)
                            } else if (!hasSubscription) {
                              billingAPI.createCheckoutSession({
                                plan_id: p.id,
                                billing_interval: 'monthly',
                                seats: 1,
                                success_url: window.location.href,
                                cancel_url: window.location.href,
                              }).then(res => {
                                if (res.data.session_url) window.location.href = res.data.session_url
                              })
                            }
                          }}
                        >
                          {isCurrentPlan ? 'Current Plan' : hasSubscription ? (
                            isUpgrade ? 'Upgrade' : isDowngrade ? 'Downgrade' : 'Switch to this Plan'
                          ) : 'Choose Plan'}
                        </Button>
                        {hasSubscription && !isCurrentPlan && (
                          <p className="text-[10px] text-muted-foreground text-center mt-1">
                            {isUpgrade ? 'Immediate upgrade, prorated' : isDowngrade ? 'Takes effect next cycle' : ''}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Invoice History</CardTitle>
                  <CardDescription>{invoiceTotal} invoice{invoiceTotal !== 1 ? 's' : ''}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search invoices..."
                      value={invoiceSearch}
                      onChange={(e) => setInvoiceSearch(e.target.value)}
                      className="pl-8 h-9 w-48 text-sm"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9"
                    onClick={() => setInvoiceSort(s => s === 'desc' ? 'asc' : 'desc')}
                  >
                    <ArrowUpDown className="h-4 w-4 mr-1" />
                    {invoiceSort === 'desc' ? 'Newest' : 'Oldest'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredInvoices.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  {invoiceSearch ? 'No invoices match your search.' : 'No invoices yet'}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map(inv => (
                      <TableRow key={inv.id}>
                        <TableCell className="font-mono text-xs">{inv.invoice_number}</TableCell>
                        <TableCell className="text-xs">{formatDate(inv.created_at)}</TableCell>
                        <TableCell className="text-xs">
                          {formatDate(inv.period_start)} - {formatDate(inv.period_end)}
                        </TableCell>
                        <TableCell className="font-medium">{inv.amount_display}</TableCell>
                        <TableCell>
                          <Badge variant={
                            inv.status === 'paid' ? 'success' :
                            inv.status === 'open' ? 'default' :
                            inv.status === 'draft' ? 'secondary' : 'destructive'
                          }>
                            {inv.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {inv.invoice_pdf_url && (
                            <Button size="sm" variant="ghost" asChild>
                              <a href={inv.invoice_pdf_url} target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your saved payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {PAYMENT_METHODS_MOCK.map((pm) => (
                <div key={pm.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{pm.brand} &bull;&bull;&bull;&bull; {pm.last4}</span>
                        {pm.isDefault && <Badge variant="outline" className="text-xs">Default</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">Expires {pm.expMonth}/{pm.expYear}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!pm.isDefault && (
                      <Button variant="outline" size="sm">Set Default</Button>
                    )}
                    <Button variant="ghost" size="sm" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" onClick={handlePortal}>
                <Plus className="h-4 w-4 mr-2" /> Add Payment Method
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>Payment transaction history</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {payments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">No payment history</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Method</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map(p => (
                      <TableRow key={p.id}>
                        <TableCell className="text-xs">{formatDate(p.created_at)}</TableCell>
                        <TableCell className="font-medium">{p.amount_display}</TableCell>
                        <TableCell>
                          <Badge variant={
                            p.status === 'succeeded' ? 'success' :
                            p.status === 'failed' ? 'destructive' : 'secondary'
                          }>
                            {p.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {p.payment_method_brand ? `${p.payment_method_brand} ****${p.payment_method_last4}` : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6 mt-4">
          <BillingSettingsPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function BillingSettingsPanel() {
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    billing_email: '',
    tax_id: '',
    billing_address_line1: '',
    billing_address_line2: '',
    billing_city: '',
    billing_state: '',
    billing_postal_code: '',
    billing_country: '',
    currency: 'USD',
    payment_terms_days: 30,
  })

  useEffect(() => {
    billingAPI.getBillingSettings().then(res => {
      const s = res.data
      setSettings(s)
      setForm({
        billing_email: s.billing_email || '',
        tax_id: s.tax_id || '',
        billing_address_line1: s.billing_address_line1 || '',
        billing_address_line2: s.billing_address_line2 || '',
        billing_city: s.billing_city || '',
        billing_state: s.billing_state || '',
        billing_postal_code: s.billing_postal_code || '',
        billing_country: s.billing_country || '',
        currency: s.currency || 'USD',
        payment_terms_days: s.payment_terms_days || 30,
      })
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await billingAPI.updateBillingSettings(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e: any) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <Card><CardContent className="pt-6 pb-6 text-center text-sm text-muted-foreground">Loading settings...</CardContent></Card>
  }

  return (
    <div className="max-w-2xl space-y-6">
      {saved && (
        <div className="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800 flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />Settings saved successfully
        </div>
      )}
      <Card>
        <CardHeader><CardTitle>Billing Information</CardTitle><CardDescription>Tax ID, address, and invoice preferences</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Billing Email</label>
              <input
                type="email"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.billing_email}
                onChange={e => setForm(f => ({ ...f, billing_email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tax ID</label>
              <input
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.tax_id}
                onChange={e => setForm(f => ({ ...f, tax_id: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Address Line 1</label>
            <input
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={form.billing_address_line1}
              onChange={e => setForm(f => ({ ...f, billing_address_line1: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Address Line 2</label>
            <input
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={form.billing_address_line2}
              onChange={e => setForm(f => ({ ...f, billing_address_line2: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <input
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.billing_city}
                onChange={e => setForm(f => ({ ...f, billing_city: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">State/Province</label>
              <input
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.billing_state}
                onChange={e => setForm(f => ({ ...f, billing_state: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Postal Code</label>
              <input
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.billing_postal_code}
                onChange={e => setForm(f => ({ ...f, billing_postal_code: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Country (ISO 2-letter)</label>
              <input
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.billing_country}
                maxLength={2}
                onChange={e => setForm(f => ({ ...f, billing_country: e.target.value }))}
              />
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Currency</label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.currency}
                onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (&euro;)</option>
                <option value="GBP">GBP (&pound;)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Terms (days)</label>
              <input
                type="number"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.payment_terms_days}
                onChange={e => setForm(f => ({ ...f, payment_terms_days: parseInt(e.target.value) || 30 }))}
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Save(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> }
