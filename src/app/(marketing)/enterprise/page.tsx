'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  ShieldCheck, Server, Lock, Users, Headphones, FileCheck,
  ChevronLeft, ChevronRight, Star, ArrowRight, CheckCircle, Send,
  Building2, Globe, Network, Fingerprint, Award, MessageSquare,
} from 'lucide-react'

const ENTERPRISE_FEATURES = [
  {
    title: 'Dedicated Infrastructure',
    description: 'Single-tenant deployment on dedicated clusters with isolated compute, storage, and networking. Guaranteed performance with no noisy neighbors.',
    icon: Server,
    gradient: 'from-blue-500/10 to-transparent',
  },
  {
    title: 'White-Label Options',
    description: 'Full white-label capabilities including custom domains, branding, and tailored UI. Deploy VITO as your own fragrance intelligence platform.',
    icon: Building2,
    gradient: 'from-purple-500/10 to-transparent',
  },
  {
    title: 'Custom Integrations',
    description: 'Deep integration with your existing LIMS, ERP, PLM, and formulation management systems. Custom API endpoints and data pipeline construction.',
    icon: Network,
    gradient: 'from-emerald-500/10 to-transparent',
  },
  {
    title: 'Advanced Security & SSO',
    description: 'SOC 2 Type II certified, ISO 27001 compliant. SSO/SAML with SCIM provisioning, MFA enforcement, and granular RBAC with custom roles.',
    icon: Fingerprint,
    gradient: 'from-amber-500/10 to-transparent',
  },
  {
    title: 'Dedicated Support',
    description: 'Named support engineer with 24/7 priority response. Custom SLAs with 15-minute critical incident response. Monthly business reviews included.',
    icon: Headphones,
    gradient: 'from-rose-500/10 to-transparent',
  },
  {
    title: 'Custom SLAs & Contracts',
    description: 'Tailored service level agreements covering uptime (up to 99.99%), performance, data retention, and regulatory compliance. Multi-year contracts available.',
    icon: FileCheck,
    gradient: 'from-sky-500/10 to-transparent',
  },
]

const BADGES = [
  { name: 'SOC 2 Type II', icon: ShieldCheck, description: 'Annual audit for security, availability, and confidentiality' },
  { name: 'ISO 27001', icon: Award, description: 'Information security management system certified' },
  { name: 'GDPR Compliant', icon: Lock, description: 'Full GDPR compliance with DPA included' },
  { name: 'HIPAA Eligible', icon: FileCheck, description: 'Business associate agreement available' },
  { name: '99.99% Uptime', icon: Globe, description: 'Guaranteed SLA with multi-region failover' },
  { name: 'Encrypted at Rest', icon: Lock, description: 'AES-256 encryption for all data at rest' },
]

const CASE_STUDIES = [
  {
    quote: 'VITO\'s dedicated infrastructure allowed us to deploy a white-labeled fragrance AI platform to our 2,000+ perfumers globally. The custom integration with our legacy LIMS system was seamless.',
    author: 'Dr. Helena Vogt',
    role: 'CTO',
    company: 'Global Fragrance Corp',
    result: '60% faster formulation cycles, 40% reduction in raw material costs',
  },
  {
    quote: 'As a regulatory-first organization, we needed a platform that could handle our compliance requirements out of the box. VITO\'s enterprise security and compliance automation exceeded our expectations.',
    author: 'Robert Kim',
    role: 'VP of Regulatory Affairs',
    company: 'Aroma Enterprises',
    result: '100% IFRA compliance rate, 80% faster regulatory reviews',
  },
  {
    quote: 'The white-label capabilities meant we could launch our own fragrance intelligence platform to our clients within weeks, not months. The dedicated support team made all the difference.',
    author: 'Sarah Mitchell',
    role: 'Director of Innovation',
    company: 'Luxury Scent Group',
    result: 'Launched client portal in 6 weeks, 95% client satisfaction',
  },
]

interface ContactForm {
  name: string
  email: string
  company: string
  phone: string
  employees: string
  message: string
}

export default function EnterprisePage() {
  const [form, setForm] = useState<ContactForm>({
    name: '', email: '', company: '', phone: '', employees: '', message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [caseIndex, setCaseIndex] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.name && form.email && form.company) {
      setSubmitted(true)
    }
  }

  return (
    <div>
      <section className="py-20 md:py-32 border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm">
            <Building2 className="h-4 w-4 mr-2" />
            Enterprise
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-3xl mx-auto">
            Built for the world&apos;s leading fragrance enterprises
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Deploy VITO at scale with dedicated infrastructure, white-label options,
            custom integrations, and enterprise-grade security.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base h-12 px-8">
              <MessageSquare className="mr-2 h-5 w-5" />
              Contact Sales
            </Button>
            <Button size="lg" variant="outline" className="text-base h-12 px-8">
              <PlayCircleIcon className="mr-2 h-5 w-5" />
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Enterprise features
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything your enterprise needs to scale fragrance R&amp;D securely and efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ENTERPRISE_FEATURES.map((feat) => {
              const Icon = feat.icon
              return (
                <Card key={feat.title} className="group border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className={cn('absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity', feat.gradient)} />
                  <CardContent className="relative p-6">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feat.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feat.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30 border-y">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Security &amp; Compliance</h2>
            <p className="mt-2 text-muted-foreground">Enterprise-grade security built into every layer.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {BADGES.map((badge) => {
              const Icon = badge.icon
              return (
                <Card key={badge.name} className="text-center hover:shadow-sm transition-shadow">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 mb-3">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h4 className="text-sm font-semibold mb-1">{badge.name}</h4>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Trusted by enterprise teams
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              See how leading fragrance enterprises are transforming their R&amp;D.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 md:p-12">
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
                  &ldquo;{CASE_STUDIES[caseIndex].quote}&rdquo;
                </blockquote>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{CASE_STUDIES[caseIndex].author}</div>
                    <div className="text-sm text-muted-foreground">
                      {CASE_STUDIES[caseIndex].role}, {CASE_STUDIES[caseIndex].company}
                    </div>
                  </div>
                  <Badge variant="success" className="text-xs">{CASE_STUDIES[caseIndex].result}</Badge>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-center gap-4 mt-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCaseIndex((c) => (c - 1 + CASE_STUDIES.length) % CASE_STUDIES.length)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              {CASE_STUDIES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCaseIndex(i)}
                  className={cn(
                    'h-2 w-2 rounded-full transition-all',
                    i === caseIndex ? 'bg-primary w-6' : 'bg-muted-foreground/30'
                  )}
                />
              ))}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCaseIndex((c) => (c + 1) % CASE_STUDIES.length)}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30 border-y">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                Ready to scale your fragrance R&amp;D?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Tell us about your needs and our enterprise team will get back to you within 24 hours with a custom proposal.
              </p>
              <div className="space-y-4">
                {[
                  { icon: MessageSquare, text: 'Personalized demo with your team' },
                  { icon: Building2, text: 'Custom pricing and contract terms' },
                  { icon: ShieldCheck, text: 'Security review and compliance documentation' },
                  { icon: Headphones, text: 'Dedicated onboarding and migration support' },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.text} className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-sm">{item.text}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              {submitted ? (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-green-800 mb-2">Thank you!</h3>
                    <p className="text-green-600">
                      Your message has been received. Our enterprise team will contact you within 24 hours.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>Contact Sales</CardTitle>
                    <CardDescription>Fill out the form and we&apos;ll be in touch.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ent-name">Full Name *</Label>
                          <Input
                            id="ent-name"
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            required
                            placeholder="Jane Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ent-email">Work Email *</Label>
                          <Input
                            id="ent-email"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            required
                            placeholder="jane@company.com"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ent-company">Company *</Label>
                          <Input
                            id="ent-company"
                            value={form.company}
                            onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                            required
                            placeholder="Fragrance Inc."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ent-phone">Phone</Label>
                          <Input
                            id="ent-phone"
                            type="tel"
                            value={form.phone}
                            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                            placeholder="+1 555-0123"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ent-employees">Number of Employees</Label>
                        <Input
                          id="ent-employees"
                          value={form.employees}
                          onChange={(e) => setForm((f) => ({ ...f, employees: e.target.value }))}
                          placeholder="e.g. 500-1000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ent-message">Message</Label>
                        <textarea
                          id="ent-message"
                          className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          value={form.message}
                          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                          placeholder="Tell us about your needs..."
                        />
                      </div>
                      <Button type="submit" size="lg" className="w-full">
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function PlayCircleIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
    </svg>
  )
}
