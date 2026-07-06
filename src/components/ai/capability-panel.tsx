'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign, Clock, Shield, Sparkles, GitBranch, TrendingUp,
  Scale, Settings, Star, Search, ChevronRight, Loader2, Brain,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  COLLABORATOR_CAPABILITIES,
  CapabilityConfig,
  CollaboratorCapability,
} from './collaborator-types'
import { useExperienceConfig } from '@/lib/role-experience/hooks'

interface CapabilityPanelProps {
  onSelectCapability: (capability: CollaboratorCapability, config: CapabilityConfig) => void
  isStreaming: boolean
  hasFormulaContext: boolean
  hasMaterialContext: boolean
}

function getCapabilityIcon(icon: string) {
  const icons: Record<string, React.ElementType> = {
    DollarSign, Clock, Shield, Sparkles, GitBranch,
    TrendingUp, Scale, Settings, Star, Search,
  }
  return icons[icon] || Sparkles
}

function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.90) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
  if (confidence >= 0.80) return 'text-green-400 bg-green-500/10 border-green-500/30'
  if (confidence >= 0.65) return 'text-amber-400 bg-amber-500/10 border-amber-500/30'
  if (confidence >= 0.50) return 'text-orange-400 bg-orange-500/10 border-orange-500/30'
  return 'text-red-400 bg-red-500/10 border-red-500/30'
}

function getConfidenceLabel(confidence: number): string {
  if (confidence >= 0.90) return 'Very High'
  if (confidence >= 0.80) return 'High'
  if (confidence >= 0.65) return 'Moderate'
  if (confidence >= 0.50) return 'Low'
  return 'Speculative'
}

export function CapabilityPanel({
  onSelectCapability,
  isStreaming,
  hasFormulaContext,
  hasMaterialContext,
}: CapabilityPanelProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('core')
  const config = useExperienceConfig()

  const availableCapabilities = COLLABORATOR_CAPABILITIES.filter((cap) => {
    if (!cap.requiresContext) return true
    if (cap.contextTypes.includes('formula') && hasFormulaContext) return true
    if (cap.contextTypes.includes('material') && hasMaterialContext) return true
    return false
  })

  const categories: Record<string, CapabilityConfig[]> = {
    core: availableCapabilities.filter((c) =>
      ['reduce_cost', 'suggest_alternatives', 'optimize_formula', 'explain_compliance'].includes(c.id)
    ),
    creation: availableCapabilities.filter((c) =>
      ['generate_accord', 'improve_longevity', 'improve_stability'].includes(c.id)
    ),
    analysis: availableCapabilities.filter((c) =>
      ['predict_success', 'compare_formulas', 'estimate_commercial', 'suggest_positioning'].includes(c.id)
    ),
    knowledge: availableCapabilities.filter((c) =>
      ['rag_query'].includes(c.id)
    ),
  }

  const categoryLabels: Record<string, string> = {
    core: 'Core Actions',
    creation: 'Creation & Refinement',
    analysis: 'Analysis & Strategy',
    knowledge: 'Knowledge',
  }

  return (
    <div className="p-2 space-y-3">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider px-1 font-medium">
        Intelligent Collaborator
      </p>

      {Object.entries(categories).map(([catId, capabilities]) => {
        if (capabilities.length === 0) return null
        const isExpanded = expandedCategory === catId

        return (
          <div key={catId} className="space-y-0.5">
            <button
              onClick={() => setExpandedCategory(isExpanded ? null : catId)}
              className="flex items-center gap-1.5 w-full rounded-md px-2 py-1 text-[11px] font-medium text-muted-foreground hover:bg-accent transition-colors"
            >
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.15 }}
              >
                <ChevronRight className="h-3 w-3" />
              </motion.div>
              {categoryLabels[catId]}
              <span className="ml-auto text-[10px] opacity-50">{capabilities.length}</span>
            </button>

            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-0.5 ml-3"
              >
                {capabilities.map((cap) => {
                  const Icon = getCapabilityIcon(cap.icon)
                  const contextAvailable = !cap.requiresContext ||
                    (cap.contextTypes.includes('formula') && hasFormulaContext) ||
                    (cap.contextTypes.includes('material') && hasMaterialContext)

                  return (
                    <button
                      key={cap.id}
                      onClick={() => contextAvailable && onSelectCapability(cap.id, cap)}
                      disabled={!contextAvailable || isStreaming}
                      className={cn(
                        'flex items-start gap-2 w-full rounded-md px-2 py-1.5 text-left transition-colors',
                        contextAvailable && !isStreaming
                          ? 'hover:bg-accent cursor-pointer'
                          : 'opacity-40 cursor-not-allowed'
                      )}
                    >
                      <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-medium">{cap.label}</span>
                          <Badge
                            className={cn(
                              'text-[9px] px-1 py-0 h-4 border',
                              getConfidenceColor(cap.minConfidenceThreshold)
                            )}
                          >
                            {getConfidenceLabel(cap.minConfidenceThreshold)}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                          {cap.description}
                        </p>
                        {!contextAvailable && (
                          <p className="text-[9px] text-amber-500 mt-0.5">
                            Open a formula to enable
                          </p>
                        )}
                      </div>
                    </button>
                  )
                })}
              </motion.div>
            )}
          </div>
        )
      })}

      {!hasFormulaContext && !hasMaterialContext && (
        <div className="mx-2 mt-3 p-3 rounded-lg border border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2 mb-1.5">
            <Brain className="h-3.5 w-3.5 text-primary" />
            <span className="text-[11px] font-medium text-primary">Pro Tip</span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Open a formula or select a material to unlock powerful AI capabilities like cost reduction, compliance checking, and sensory prediction.
          </p>
        </div>
      )}
    </div>
  )
}
