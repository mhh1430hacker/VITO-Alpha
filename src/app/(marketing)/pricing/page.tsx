'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { billingAPI, formatCents, type Plan } from '@/lib/billing_api'
import {
  CheckCircle, XCircle, ChevronDown, ChevronUp, Loader2, ArrowRight, CreditCard,
} from 'lucide-react'

const PLAN_FEATURE_LABELS: Record<string, string> = {
  users: 'Team Members',
  api_calls: 'API Calls / Month',
  storage: 'Storage',
  predictions: 'AI Predictions / Month',
  ai_formulation: 'AI-Powered Formulation',
  material_intelligence: 'Material Intelligence',
  predictive_analytics: 'Predictive Analytics',
  compliance: 'Compliance Automation',
  collaboration: 'Team Collaboration',
  api_access: 'API Access',
  audit_trail: 'Audit Trail',
  rbac: 'Role-Based Access Control',
  sso: 'Single Sign-On (SSO/SAML)',
  support: 'Support',
  sla: 'Service Level Agreement (SLA)',
  custom_integrations: 'Custom Integrations',
  dedicated_infrastructure: 'Dedicated Infrastructure',
  white_label: 'White-Label Options',
  advanced_security: 'Advanced Security (SOC2, ISO27001)',
  dedicated_support: 'Dedicated Support Engineer',
}

const FAKE_PLANS: Plan[] = [
  {
    id: 1, name: 'Starter', code: 'starter',
    description: 'For individual perfumers and small labs getting started with AI-powered formulation.',
    features: { ai_prediction: true, basic_formulas: true },
    monthly_price_cents: 99900, yearly_price_cents: 999000, currency: 'USD',
    max_users: 1, max_api_calls: 10000, max_storage_gb: 5, max_gpu_hours: 0,
    max_predictions: 500, max_optimizations: 50, max_embeddings: 500,
    max_similarity_searches: 1000, max_vector_stores: 1, max_training_hours: 0,
    includes_audit_trail: false, includes_rbac: false, includes_sso: false,
    includes_api_access: true, includes_support: false, includes_sla: false,
    includes_custom_integrations: false, includes_dedicated_infrastructure: false,
    includes_white_label: false, is_active: true, sort_order: 10,
    monthly_price_display: '$999.00', yearly_price_display: '$9,990.00',
    created_at: null, updated_at: null,
  },
  {
    id: 2, name: 'Professional', code: 'professional',
    description: 'For professional perfumers and R&D teams needing advanced AI tools and collaboration.',
    features: { ai_prediction: true, advanced_formulas: true, team_collaboration: true },
    monthly_price_cents: 499900, yearly_price_cents: 4999000, currency: 'USD',
    max_users: 5, max_api_calls: 100000, max_storage_gb: 50, max_gpu_hours: 10,
    max_predictions: 5000, max_optimizations: 500, max_embeddings: 5000,
    max_similarity_searches: 10000, max_vector_stores: 3, max_training_hours: 10,
    includes_audit_trail: true, includes_rbac: true, includes_sso: false,
    includes_api_access: true, includes_support: true, includes_sla: false,
    includes_custom_integrations: false, includes_dedicated_infrastructure: false,
    includes_white_label: false, is_active: true, sort_order: 20,
    monthly_price_display: '$4,999.00', yearly_price_display: '$49,990.00',
    created_at: null, updated_at: null,
  },
  {
    id: 3, name: 'Business', code: 'business',
    description: 'For growing fragrance businesses requiring enterprise features, SSO, and SLAs.',
    features: { ai_prediction: true, unlimited_collaboration: true, priority_support: true },
    monthly_price_cents: 2499000, yearly_price_cents: 24990000, currency: 'USD',
    max_users: 25, max_api_calls: 1000000, max_storage_gb: 250, max_gpu_hours: 100,
    max_predictions: 50000, max_optimizations: 5000, max_embeddings: 50000,
    max_similarity_searches: 100000, max_vector_stores: 10, max_training_hours: 100,
    includes_audit_trail: true, includes_rbac: true, includes_sso: true,
    includes_api_access: true, includes_support: true, includes_sla: true,
    includes_custom_integrations: true, includes_dedicated_infrastructure: false,
    includes_white_label: false, is_active: true, sort_order: 30,
    monthly_price_display: '$24,990.00', yearly_price_display: '$249,900.00',
    created_at: null, updated_at: null,
  },
  {
    id: 4, name: 'Enterprise', code: 'enterprise',
    description: 'For global fragrance enterprises needing dedicated infrastructure, white-label, and custom contracts.',
    features: { dedicated_support: true, white_label: true, custom_sla: true },
    monthly_price_cents: 999900, yearly_price_cents: 9999000, currency: 'USD',
    max_users: 999999, max_api_calls: 999999999, max_storage_gb: 9999, max_gpu_hours: 9999,
    max_predictions: 999999, max_optimizations: 99999, max_embeddings: 999999,
    max_similarity_searches: 999999, max_vector_stores: 999, max_training_hours: 9999,
    includes_audit_trail: true, includes_rbac: true, includes_sso: true,
    includes_api_access: true, includes_support: true, includes_sla: true,
    includes_custom_integrations: true, includes_dedicated_infrastructure: true,
    includes_white_label: true, is_active: true, sort_order: 40,
    monthly_price_display: 'Custom', yearly_price_display: 'Custom',
    created_at: null, updated_at: null,
  },
]

const COMPARE_ROWS = [
  { category: 'Usage', features: [
    { key: 'users', starter: '1 user', pro: '5 users', biz: '25 users', ent: 'Unlimited' },
    { key: 'api_calls', starter: '10K', pro: '100K', biz: '1M', ent: 'Unlimited' },
    { key: 'storage', starter: '5 GB', pro: '50 GB', biz: '250 GB', ent: 'Unlimited' },
    { key: 'predictions', starter: '500/mo', pro: '5K/mo', biz: '50K/mo', ent: 'Unlimited' },
  ]},
  { category: 'Capabilities', features: [
    { key: 'ai_formulation', starter: 'Basic', pro: 'Advanced', biz: 'Full Suite', ent: 'Full Suite + Custom' },
    { key: 'material_intelligence', starter: 'Basic', pro: 'Advanced', biz: 'Full Suite', ent: 'Full Suite + Custom' },
    { key: 'predictive_analytics', starter: '\u2014', pro: 'Standard', biz: 'Advanced', ent: 'Custom Models' },
    { key: 'collaboration', starter: '\u2014', pro: 'Full', biz: 'Unlimited', ent: 'Unlimited' },
  ]},
  { category: 'Compliance', features: [
    { key: 'compliance', starter: 'Basic IFRA', pro: 'Full IFRA/REACH', biz: 'Full IFRA/REACH/CLP', ent: 'Full + Custom Regulations' },
    { key: 'audit_trail', starter: '\u2014', pro: 'Standard', biz: 'Advanced', ent: 'Full + Custom Retention' },
  ]},
  { category: 'Security', features: [
    { key: 'rbac', starter: '\u2014', pro: 'Basic', biz: 'Advanced', ent: 'Full + Custom Roles' },
    { key: 'sso', starter: '\u2014', pro: '\u2014', biz: 'SAML/SSO', ent: 'SSO/SAML + SCIM' },
    { key: 'advanced_security', starter: '\u2014', pro: '\u2014', biz: 'SOC 2 Type II', ent: 'SOC 2 + ISO 27001' },
  ]},
  { category: 'Support', features: [
    { key: 'support', starter: 'Community', pro: 'Email & Chat', biz: 'Priority', ent: 'Dedicated Engineer' },
    { key: 'sla', starter: '\u2014', pro: '\u2014', biz: '99.9% SLA', ent: 'Custom SLA' },
    { key: 'dedicated_support', starter: '\u2014', pro: '\u2014', biz: '\u2014', ent: '24/7 Dedicated' },
  ]},
  { category: 'Enterprise', features: [
    { key: 'custom_integrations', starter: '\u2014', pro: '\u2014', biz: 'Up to 3', ent: 'Unlimited' },
    { key: 'dedicated_infrastructure', starter: '\u2014', pro: '\u2014', biz: '\u2014', ent: 'Dedicated Cluster' },
    { key: 'white_label', starter: '\u2014', pro: '\u2014', biz: '\u2014', ent: 'White-Label Ready' },
  ]},
]

const FAQS = [
  {
    q: 'Can I switch plans at any time?',
    a: 'Yes, you can upgrade or downgrade your plan at any time. Changes are prorated and applied immediately. Upgrades include full access to new features; downgrades take effect at the next billing cycle.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes, all plans come with a 14-day free trial. No credit card is required. You get full access to all features in your chosen plan during the trial period.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards (Visa, Mastercard, American Express), wire transfers for annual Enterprise plans, and can accommodate purchase orders for qualifying organizations.',
  },
  {
    q: 'Can I get a custom Enterprise plan?',
    a: 'Absolutely. Our Enterprise plans are tailored to your organization\'s needs. Contact our sales team for custom pricing, dedicated infrastructure, white-label options, and personalized SLAs.',
  },
  {
    q: 'How does the yearly billing work?',
    a: 'Yearly billing gives you a 17% discount compared to monthly billing. You\'re billed once annually and get access to the full plan for the entire year.',
  },
]

export default function PricingPage() {
  const [yearly, setYearly] = useState(false)
  const [plans, setPlans] = useState<Plan[]>(FAKE_PLANS)
  const [loading, setLoading] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    billingAPI.listPlans().then((res) => {
      if (res.data?.length) setPlans(res.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const getPrice = (plan: Plan) => {
    if (plan.code === 'enterprise') return 'Custom'
    return yearly ? plan.yearly_price_display : plan.monthly_price_display
  }

  const getPeriod = (plan: Plan) => {
    if (plan.code === 'enterprise') return ''
    return yearly ? '/year' : '/month'
  }

  const isRecommended = (plan: Plan) => plan.code === 'business'

  return (
    <div>
      <section className="py-16 md:py-24 border-b">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Choose the plan that fits your team. All plans include a 14-day free trial.
          </p>

          <div className="inline-flex items-center gap-3 p-1 bg-muted rounded-full">
            <button
              onClick={() => setYearly(false)}
              className={cn(
                'px-5 py-2 rounded-full text-sm font-medium transition-all',
                !yearly ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={cn(
                'px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2',
                yearly ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Yearly
              <Badge variant="success" className="text-xs">Save 20%</Badge>
            </button>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.filter(p => p.is_active).map((plan) => (
              <Card
                key={plan.id}
                className={cn(
                  'relative flex flex-col',
                  isRecommended(plan) && 'border-primary shadow-lg ring-1 ring-primary'
                )}
              >
                {isRecommended(plan) && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription className="text-sm">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">{getPrice(plan)}</span>
                      <span className="text-sm text-muted-foreground">{getPeriod(plan)}</span>
                    </div>
                    {yearly && plan.code !== 'enterprise' && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {plan.monthly_price_display}/month if paid monthly
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {[
                      { key: 'users', label: `${plan.max_users >= 999999 ? 'Unlimited' : plan.max_users} ${plan.max_users >= 999999 ? 'users' : 'user' + (plan.max_users > 1 ? 's' : '')}` },
                      { key: 'api_calls', label: `${plan.max_api_calls >= 999999999 ? 'Unlimited' : plan.max_api_calls.toLocaleString()} API calls/mo` },
                      { key: 'storage', label: `${plan.max_storage_gb >= 9999 ? 'Unlimited' : plan.max_storage_gb + ' GB'} storage` },
                      { key: 'predictions', label: `${plan.max_predictions >= 999999 ? 'Unlimited' : plan.max_predictions.toLocaleString()} predictions/mo` },
                    ].map((item) => (
                      <li key={item.key} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                        <span>{item.label}</span>
                      </li>
                    ))}
                    {[
                      { key: 'ai_formulation', label: 'AI-Powered Formulation', included: true },
                      { key: 'material_intelligence', label: 'Material Intelligence', included: true },
                      { key: 'compliance', label: 'Compliance Automation', included: true },
                      { key: 'collaboration', label: 'Team Collaboration', included: plan.code !== 'starter' },
                      { key: 'sso', label: 'SSO/SAML', included: plan.includes_sso },
                      { key: 'sla', label: '99.9% SLA', included: plan.includes_sla },
                      { key: 'audit_trail', label: 'Audit Trail', included: plan.includes_audit_trail },
                      { key: 'dedicated_infrastructure', label: 'Dedicated Infrastructure', included: plan.includes_dedicated_infrastructure },
                      { key: 'white_label', label: 'White-Label', included: plan.includes_white_label },
                    ].map((item) => (
                      item.included ? (
                        <li key={item.key} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                          <span>{item.label}</span>
                        </li>
                      ) : (
                        <li key={item.key} className="flex items-center gap-2 text-sm text-muted-foreground/50">
                          <XCircle className="h-4 w-4 shrink-0" />
                          <span>{item.label}</span>
                        </li>
                      )
                    ))}
                  </ul>

                  {plan.code === 'enterprise' ? (
                    <Button variant="outline" size="lg" className="w-full" asChild>
                      <a href="/enterprise">
                        Contact Sales
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      className="w-full"
                      variant={isRecommended(plan) ? 'default' : 'outline'}
                      onClick={() => {
                        window.location.href = `/login?redirect=/billing&plan=${plan.id}`
                      }}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Start Free Trial
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30 border-y">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Compare plans</h2>
            <p className="text-muted-foreground mt-2">Detailed feature breakdown across all plans.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 pr-6 font-semibold w-56">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold">Starter</th>
                  <th className="text-center py-4 px-4 font-semibold">Professional</th>
                  <th className="text-center py-4 px-4 font-semibold text-primary">Business</th>
                  <th className="text-center py-4 px-4 font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((section) => (
                  <>
                    <tr key={section.category} className="border-b bg-muted/50">
                      <td colSpan={5} className="py-3 px-0 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                        {section.category}
                      </td>
                    </tr>
                    {section.features.map((feat) => (
                      <tr key={feat.key} className="border-b hover:bg-muted/20">
                        <td className="py-3 pr-6">{feat.starter === '\u2014' && feat.pro === '\u2014' && feat.biz === '\u2014' && feat.ent === '\u2014' ? '' : feat.key}</td>
                        <td className="text-center py-3 px-4">{feat.starter}</td>
                        <td className="text-center py-3 px-4">{feat.pro}</td>
                        <td className="text-center py-3 px-4 font-medium">{feat.biz}</td>
                        <td className="text-center py-3 px-4">{feat.ent}</td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="border rounded-lg">
                <button
                  className="flex items-center justify-between w-full px-6 py-4 text-left font-medium"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}
                  {openFaq === i ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0 ml-4" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-muted-foreground">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
