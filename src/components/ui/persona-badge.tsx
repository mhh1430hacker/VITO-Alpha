'use client'

import { cn } from '@/lib/utils'
import { getPersona, type Persona } from '@/types/enterprise'
import { useAuthStore } from '@/lib/store'
import {
  Building2, TrendingUp, FlaskConical, ShieldCheck, Brain,
  ShoppingCart, CreditCard, TestTube, BarChart3, User,
} from 'lucide-react'

const personaIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2, TrendingUp, FlaskConical, ShieldCheck, Brain,
  ShoppingCart, CreditCard, TestTube, BarChart3, User,
}

export function PersonaBadge({ className }: { className?: string }) {
  const { user } = useAuthStore()
  if (!user?.role) return null

  const persona = getPersona(user.role)
  const Icon = personaIcons[persona.icon] || User

  return (
    <div className={cn('inline-flex items-center gap-1.5 rounded-full border border-violet-500/10 bg-violet-500/5 px-2.5 py-1', className)}>
      <Icon className="h-3 w-3 text-violet-400/70" />
      <span className="text-[11px] font-medium text-violet-400/80">{persona.label}</span>
    </div>
  )
}

export function PersonaCard({ className }: { className?: string }) {
  const { user } = useAuthStore()
  if (!user?.role) return null

  const persona = getPersona(user.role)
  const Icon = personaIcons[persona.icon] || User

  return (
    <div className={cn('rounded-xl bg-white/[0.02] border border-border/60 p-4', className)}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg bg-${persona.color}-500/10`}>
          <Icon className={`h-5 w-5 text-${persona.color}-400`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[14px] font-semibold text-foreground">{persona.label}</p>
            <span className="text-[11px] text-muted-foreground/40">{persona.subtitle}</span>
          </div>
          <p className="text-[12px] text-muted-foreground/50 mt-1 leading-relaxed">{persona.description}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {persona.capabilities.map((c) => (
              <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.03] border border-border/40 text-muted-foreground/50">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}