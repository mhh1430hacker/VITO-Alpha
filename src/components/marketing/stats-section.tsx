import { TrendingUp, DollarSign, Clock, BarChart3 } from 'lucide-react'

const STATS = [
  {
    value: '70%',
    label: 'Faster Formulation',
    description: 'Reduce formulation time from weeks to days',
    icon: Clock,
  },
  {
    value: '45%',
    label: 'Cost Reduction',
    description: 'Lower raw material and iteration costs',
    icon: DollarSign,
  },
  {
    value: '3x',
    label: 'Faster Time-to-Market',
    description: 'Accelerate from concept to launch',
    icon: TrendingUp,
  },
  {
    value: '95%',
    label: 'Compliance Accuracy',
    description: 'Automated IFRA and REACH verification',
    icon: BarChart3,
  },
]

export function StatsSection() {
  return (
    <section className="py-20 md:py-28 bg-muted/30 border-y">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="text-center group">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-base font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
