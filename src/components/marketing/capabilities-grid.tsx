import { Card, CardContent } from '@/components/ui/card'
import {
  Brain, Database, BarChart3, ShieldCheck, Users, Lock,
} from 'lucide-react'

const CAPABILITIES = [
  {
    title: 'AI Formulation',
    description: 'Generate novel fragrance formulations with generative AI trained on millions of historical formulas and material interactions.',
    icon: Brain,
    gradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
  },
  {
    title: 'Material Intelligence',
    description: 'Comprehensive material database with olfactory profiles, regulatory status, sustainability metrics, and substitution recommendations.',
    icon: Database,
    gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
  },
  {
    title: 'Predictive Analytics',
    description: 'Predict performance, stability, and consumer preference before creating a single batch. Reduce iterations by up to 70%.',
    icon: BarChart3,
    gradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
  },
  {
    title: 'Compliance Automation',
    description: 'Automated IFRA, REACH, CLP, and global regulatory checks. Ensure every formulation is compliant across 50+ jurisdictions.',
    icon: ShieldCheck,
    gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
  },
  {
    title: 'Collaboration',
    description: 'Real-time collaboration for perfumers, evaluators, regulatory teams, and suppliers. Version control and approval workflows built in.',
    icon: Users,
    gradient: 'from-rose-500/10 via-rose-500/5 to-transparent',
  },
  {
    title: 'Enterprise Security',
    description: 'SOC 2 Type II certified, ISO 27001 compliant, with SSO/SAML, RBAC, audit trails, and dedicated infrastructure options.',
    icon: Lock,
    gradient: 'from-sky-500/10 via-sky-500/5 to-transparent',
  },
]

export function CapabilitiesGrid() {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Everything you need to innovate faster
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A complete platform for fragrance creation, from concept to compliant formulation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAPABILITIES.map((cap) => {
            const Icon = cap.icon
            return (
              <Card key={cap.title} className="group relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                <div className={`absolute inset-0 bg-gradient-to-br ${cap.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <CardContent className="relative p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{cap.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{cap.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
