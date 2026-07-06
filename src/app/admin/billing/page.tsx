'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import {
  AlertCircle, Loader2, RefreshCw, CreditCard, FileText, Download,
  CheckCircle, Zap, HardDrive, Users, Plus, XCircle, BarChart3,
  Receipt, Settings2, DollarSign, TrendingUp,
} from 'lucide-react'
import {
  billingAPI, formatCents,
  type Plan, type Subscription, type Invoice, type PaymentHistory,
} from '@/lib/billing_api'

type PageState = 'loading' | 'ready' | 'error'

export default function AdminBillingPage() {
  const [pageState, setPageState] = useState<PageState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [invoiceTotal, setInvoiceTotal] = useState(0)
  const [payments, setPayments] = useState<PaymentHistory[]>([])
  const [reloading, setReloading] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const [subsRes, plansRes, invRes, payRes] = await Promise.all([
        billingAPI.listSubscriptions(),
        billingAPI.listPlans(true),
        billingAPI.listInvoices(1, 100),
        billingAPI.listPayments(),
      ])
      setSubscriptions(subsRes.data || [])
      setPlans(plansRes.data || [])
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

  const handleSeedPlans = async () => {
    try {
      await billingAPI.seedPlans()
      await loadData()
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message)
    }
  }

  const formatDate = (d: string | null) => {
    if (!d) return '-'
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const activeSubs = subscriptions.filter(s => s.status === 'active' || s.status === 'trialing')
  const mrr = activeSubs.reduce((sum, s) => {
    const plan = plans.find(p => p.id === s.plan_id)
    if (!plan) return sum
    const monthlyCents = s.billing_interval === 'yearly'
      ? Math.round(plan.yearly_price_cents / 12)
      : plan.monthly_price_cents
    return sum + (monthlyCents * Math.max(1, s.seats))
  }, 0)

  if (pageState === 'loading') {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Billing Administration</h1>
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
        <h1 className="text-2xl font-bold tracking-tight">Billing Administration</h1>
        <Card className="border-destructive/50">
          <CardContent className="flex flex-col items-center gap-4 pt-12 pb-12">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <p className="text-destructive font-semibold">Failed to Load</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={loadData}><RefreshCw className="h-4 w-4 mr-2" />Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Billing Administration</h1>
          <p className="text-sm text-muted-foreground">Manage plans, subscriptions, and invoices across all tenants</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSeedPlans}>
            <Plus className="h-4 w-4 mr-2" /> Seed Plans
          </Button>
          <Button variant="outline" size="sm" onClick={() => { setReloading(true); loadData().finally(() => setReloading(false)) }} disabled={reloading}>
            <RefreshCw className={cn('h-4 w-4 mr-2', reloading && 'animate-spin')} /> Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex items-center gap-3 pt-3 pb-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setError(null)}>Dismiss</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{activeSubs.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{formatCents(mrr)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Invoices</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{invoiceTotal}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Plans</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{plans.length}</p></CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="overview"><BarChart3 className="h-4 w-4 mr-2" />Subscriptions</TabsTrigger>
          <TabsTrigger value="plans"><DollarSign className="h-4 w-4 mr-2" />Plans</TabsTrigger>
          <TabsTrigger value="invoices"><Receipt className="h-4 w-4 mr-2" />Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader><CardTitle>All Subscriptions</CardTitle><CardDescription>{subscriptions.length} total</CardDescription></CardHeader>
            <CardContent className="p-0">
              {subscriptions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">No subscriptions</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Interval</TableHead>
                      <TableHead>Seats</TableHead>
                      <TableHead>Period End</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions.map(sub => {
                      const plan = plans.find(p => p.id === sub.plan_id)
                      return (
                        <TableRow key={sub.id}>
                          <TableCell className="font-mono text-xs">#{sub.id}</TableCell>
                          <TableCell className="text-xs">Company #{sub.company_id}</TableCell>
                          <TableCell className="text-xs font-medium">{plan?.name || 'Unknown'}</TableCell>
                          <TableCell>
                            <Badge variant={
                              sub.status === 'active' ? 'success' :
                              sub.status === 'trialing' ? 'default' :
                              sub.status === 'past_due' ? 'destructive' : 'secondary'
                            }>
                              {sub.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs">{sub.billing_interval}</TableCell>
                          <TableCell className="text-xs">{sub.seats}</TableCell>
                          <TableCell className="text-xs">{formatDate(sub.current_period_end)}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing Plans</CardTitle>
              <CardDescription>Configure plan tiers, pricing, and feature limits</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Monthly</TableHead>
                    <TableHead>Yearly</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>API Calls</TableHead>
                    <TableHead>SSO</TableHead>
                    <TableHead>SLA</TableHead>
                    <TableHead>Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="font-mono text-xs">{p.code}</TableCell>
                      <TableCell>{formatCents(p.monthly_price_cents)}</TableCell>
                      <TableCell>{formatCents(p.yearly_price_cents)}</TableCell>
                      <TableCell className="text-xs">{p.max_users === 999999 ? '∞' : p.max_users}</TableCell>
                      <TableCell className="text-xs">{p.max_api_calls >= 999999999 ? '∞' : p.max_api_calls.toLocaleString()}</TableCell>
                      <TableCell>{p.includes_sso ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-muted-foreground" />}</TableCell>
                      <TableCell>{p.includes_sla ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-muted-foreground" />}</TableCell>
                      <TableCell>
                        <Badge variant={p.is_active ? 'success' : 'secondary'}>{p.is_active ? 'Yes' : 'No'}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="mt-4">
          <Card>
            <CardHeader><CardTitle>All Invoices</CardTitle><CardDescription>{invoiceTotal} total</CardDescription></CardHeader>
            <CardContent className="p-0">
              {invoices.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">No invoices</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map(inv => (
                      <TableRow key={inv.id}>
                        <TableCell className="font-mono text-xs">{inv.invoice_number}</TableCell>
                        <TableCell className="text-xs">Company #{inv.company_id}</TableCell>
                        <TableCell className="text-xs">{formatDate(inv.created_at)}</TableCell>
                        <TableCell>{inv.amount_display}</TableCell>
                        <TableCell>
                          <Badge variant={
                            inv.status === 'paid' ? 'success' : inv.status === 'open' ? 'default' : 'secondary'
                          }>{inv.status}</Badge>
                        </TableCell>
                        <TableCell className="text-xs">{inv.billing_reason || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
