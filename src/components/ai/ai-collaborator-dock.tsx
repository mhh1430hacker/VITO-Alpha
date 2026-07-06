'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Brain, Sparkles, X, Send, Maximize2, Minimize2,
  Loader2, DollarSign, TrendingUp, ShieldCheck, Scale,
  Clock, ChevronDown, ExternalLink, ThumbsUp, ThumbsDown,
} from 'lucide-react'
import { CapabilityPanel } from './capability-panel'
import { ConfidenceIndicator } from './confidence-indicator'
import {
  AICollaboratorMessage,
  Citation,
  ImpactEstimate,
  SuggestedAction,
  CollaboratorCapability,
  CapabilityConfig,
  COLLABORATOR_CAPABILITIES,
} from './collaborator-types'
import { useExperienceConfig } from '@/lib/role-experience/hooks'

interface AICollaboratorDockProps {
  formulaId?: string | null
  materialId?: string | null
  projectId?: string | null
}

export function AICollaboratorDock({ formulaId, materialId, projectId }: AICollaboratorDockProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeMode, setActiveMode] = useState<'chat' | 'capabilities'>('capabilities')
  const [messages, setMessages] = useState<AICollaboratorMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "I'm your fragrance R&D collaborator. I can optimize formulas, find alternatives, check compliance, generate accords, and more.",
      timestamp: Date.now(),
    },
  ])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [currentCapability, setCurrentCapability] = useState<CapabilityConfig | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const config = useExperienceConfig()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const hasFormulaContext = !!formulaId
  const hasMaterialContext = !!materialId

  const handleSelectCapability = useCallback((capabilityId: CollaboratorCapability, capConfig: CapabilityConfig) => {
    setCurrentCapability(capConfig)
    setActiveMode('chat')

    const contextMsg: AICollaboratorMessage = {
      id: `ctx-${Date.now()}`,
      role: 'system',
      content: capConfig.label,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, contextMsg])

    setIsStreaming(true)
    setTimeout(() => {
      const response = generateSimulatedResponse(capabilityId, capConfig)
      setMessages((prev) => [...prev, response])
      setIsStreaming(false)
    }, capConfig.estimatedLatencyMs * (0.3 + Math.random() * 0.4))
  }, [])

  const handleSend = useCallback(async () => {
    if (!input.trim() || isStreaming) return
    const userMsg: AICollaboratorMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsStreaming(true)

    const ragConfig = COLLABORATOR_CAPABILITIES.find((c) => c.id === 'rag_query')!
    setCurrentCapability(ragConfig)

    setTimeout(() => {
      const response = generateRAGResponse(userMsg.content)
      setMessages((prev) => [...prev, response])
      setIsStreaming(false)
    }, ragConfig.estimatedLatencyMs * (0.5 + Math.random() * 0.6))
  }, [input, isStreaming])

  return (
    <>
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => setIsOpen(true)}
          className={cn(
            'fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg flex items-center justify-center z-50 transition-colors',
            'bg-gradient-to-br from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500'
          )}
        >
          <Brain className="h-5 w-5" />
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={cn(
              'fixed bottom-6 right-6 z-50 flex flex-col rounded-xl border bg-background shadow-2xl overflow-hidden',
              isExpanded ? 'w-[520px] h-[640px]' : 'w-[400px] h-[540px]'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b bg-gradient-to-r from-violet-500/5 to-indigo-500/5">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">VITO Collaborator</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                    </span>
                    <p className="text-[10px] text-muted-foreground">
                      {hasFormulaContext ? 'Formula context active' : hasMaterialContext ? 'Material context active' : 'Ready'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setActiveMode(activeMode === 'chat' ? 'capabilities' : 'chat')}>
                  {activeMode === 'chat' ? <Sparkles className="h-3.5 w-3.5" /> : <MessageIcon className="h-3.5 w-3.5" />}
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsExpanded(!isExpanded)}>
                  {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsOpen(false)}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            {activeMode === 'capabilities' ? (
              <div className="flex-1 overflow-y-auto">
                <CapabilityPanel
                  onSelectCapability={handleSelectCapability}
                  isStreaming={isStreaming}
                  hasFormulaContext={hasFormulaContext}
                  hasMaterialContext={hasMaterialContext}
                />
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-3">
                  {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                  ))}
                  {isStreaming && <StreamingIndicator />}
                  <div ref={messagesEndRef} />
                </div>

                {/* Current capability context */}
                {currentCapability && (
                  <div className="px-3 py-1.5 border-t bg-muted/30 flex items-center gap-2">
                    <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
                      <Brain className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      Mode: <span className="font-medium text-foreground">{currentCapability.label}</span>
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 px-1.5 text-[10px] ml-auto"
                      onClick={() => { setCurrentCapability(null); setActiveMode('capabilities') }}
                    >
                      Change
                    </Button>
                  </div>
                )}

                {/* Input */}
                <div className="flex items-center gap-2 p-3 border-t">
                  <Input
                    className="h-9 text-sm"
                    placeholder={currentCapability ? `Ask about ${currentCapability.label.toLowerCase()}...` : 'Ask anything about your formula...'}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <Button size="sm" className="h-9 w-9 p-0" onClick={handleSend} disabled={!input.trim() || isStreaming}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function MessageBubble({ message }: { message: AICollaboratorMessage }) {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)
  const ConfidenceIcon = getConfidenceIcon(message.confidence ?? 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex gap-2',
        message.role === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      {message.role === 'assistant' && (
        <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shrink-0 mt-1">
          <Brain className="h-3.5 w-3.5 text-white" />
        </div>
      )}

      <div className="max-w-[85%] space-y-2">
        <div
          className={cn(
            'rounded-lg px-3 py-2 text-sm',
            message.role === 'user'
              ? 'bg-primary text-primary-foreground'
              : message.role === 'system'
                ? 'bg-violet-500/10 border border-violet-500/20 text-xs text-center py-1'
                : 'bg-muted'
          )}
        >
          {message.role === 'system' ? (
            <span className="text-muted-foreground">Switched to: <span className="font-medium text-foreground">{message.content}</span></span>
          ) : (
            <div className="whitespace-pre-wrap">{message.content}</div>
          )}
        </div>

        {message.role === 'assistant' && (
          <div className="space-y-1.5">
            {message.confidence !== undefined && (
              <div className={cn(
                'flex items-center gap-1.5 px-1',
                getConfidenceColorClass(message.confidence)
              )}>
                <ConfidenceIcon className="h-3 w-3" />
                <span className="text-[10px] font-medium">
                  {getConfidenceLabel(message.confidence)} confidence ({Math.round(message.confidence * 100)}%)
                </span>
              </div>
            )}

            {message.expectedImpact && (
              <ImpactSummary impact={message.expectedImpact} />
            )}

            {message.suggestedActions && message.suggestedActions.length > 0 && (
              <div className="flex flex-wrap gap-1 px-1">
                {message.suggestedActions.map((action, i) => (
                  <Button key={i} variant="outline" size="sm" className="h-6 text-[10px] px-2 py-0">
                    {action.label}
                  </Button>
                ))}
              </div>
            )}

            {message.citations && message.citations.length > 0 && (
              <div className="px-1">
                <button
                  className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => {/* toggle citations */}}
                >
                  <ExternalLink className="h-2.5 w-2.5" />
                  {message.citations.length} source{message.citations.length > 1 ? 's' : ''}
                  <ChevronDown className="h-2.5 w-2.5" />
                </button>
              </div>
            )}

            {message.timestamp && (
              <div className="flex items-center gap-2 px-1">
                <p className="text-[10px] text-muted-foreground">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
                    className={cn('p-0.5 rounded transition-colors', feedback === 'up' ? 'text-emerald-500' : 'text-muted-foreground hover:text-foreground')}
                  >
                    <ThumbsUp className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
                    className={cn('p-0.5 rounded transition-colors', feedback === 'down' ? 'text-red-500' : 'text-muted-foreground hover:text-foreground')}
                  >
                    <ThumbsDown className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {message.role === 'user' && (
        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
          <span className="text-[10px] font-bold text-primary-foreground">U</span>
        </div>
      )}
    </motion.div>
  )
}

function ImpactSummary({ impact }: { impact: ImpactEstimate }) {
  return (
    <div className="grid grid-cols-2 gap-1 px-1">
      {impact.costSavings && (
        <div className="flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5">
          <DollarSign className="h-3 w-3 text-emerald-400" />
          <span className="text-[10px] font-medium text-emerald-300">
            Save ${impact.costSavings.min}-{impact.costSavings.max}/{impact.costSavings.unit}
          </span>
        </div>
      )}
      {impact.qualityImpact && (
        <div className={cn(
          'flex items-center gap-1 rounded px-1.5 py-0.5 border',
          impact.qualityImpact.direction === 'positive' ? 'bg-emerald-500/10 border-emerald-500/20' :
          impact.qualityImpact.direction === 'negative' ? 'bg-red-500/10 border-red-500/20' :
          'bg-muted border-border'
        )}>
          <TrendingUp className={cn(
            'h-3 w-3',
            impact.qualityImpact.direction === 'positive' ? 'text-emerald-400' : 'text-muted-foreground'
          )} />
          <span className="text-[10px]">Quality: {impact.qualityImpact.direction}</span>
        </div>
      )}
    </div>
  )
}

function StreamingIndicator() {
  return (
    <div className="flex gap-2">
      <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shrink-0">
        <Brain className="h-3.5 w-3.5 text-white" />
      </div>
      <div className="bg-muted rounded-lg px-3 py-2">
        <motion.div className="flex gap-1">
          {[0, 0.3, 0.6].map((delay, i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.2, delay }}
              className="h-1.5 w-1.5 rounded-full bg-violet-500"
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

function MessageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function getConfidenceIcon(confidence: number) {
  if (confidence >= 0.90) return ShieldCheck
  if (confidence >= 0.80) return TrendingUp
  if (confidence >= 0.65) return Clock
  return Sparkles
}

function getConfidenceColorClass(confidence: number): string {
  if (confidence >= 0.90) return 'text-emerald-400'
  if (confidence >= 0.80) return 'text-green-400'
  if (confidence >= 0.65) return 'text-amber-400'
  if (confidence >= 0.50) return 'text-orange-400'
  return 'text-red-400'
}

function getConfidenceLabel(confidence: number): string {
  if (confidence >= 0.90) return 'Very High'
  if (confidence >= 0.80) return 'High'
  if (confidence >= 0.65) return 'Moderate'
  if (confidence >= 0.50) return 'Low'
  return 'Speculative'
}

function generateSimulatedResponse(
  capabilityId: CollaboratorCapability,
  config: CapabilityConfig
): AICollaboratorMessage {
  const responses: Record<string, Partial<AICollaboratorMessage>> = {
    reduce_cost: {
      content: `I've analyzed the current formula composition and identified 3 cost-saving opportunities:

1. **Rose Absolute (8.0%) → Rose Givco 222 (7.2%)**
   Savings: $26.50/kg (58.9% reduction for this ingredient)
   Sensory impact: Minimal (d'=0.23 in panel testing, n=47)

2. **Orris Butter (0.5%) → reduce to 0.3%**
   Savings: $76.00/kg (40% reduction per gram)
   Compensate with Ionone Alpha at 0.15% (+$2.10)

3. **Jasmine Absolute (4.0%) → Jasmophore (3.8%)**
   Savings: $18.20/kg (65% reduction)
   Sensory impact: Low (indolic character preserved)

**Total estimated savings: 26.0% ($112.70 → $83.40/kg)**`,
      confidence: 0.87,
      suggestedActions: [
        { label: 'Apply All', description: 'Apply all three changes', action: 'apply_all_cost', icon: 'DollarSign', confidence: 0.87 },
        { label: 'Preview Changes', description: 'See formula before applying', action: 'preview_cost', icon: 'Eye', confidence: 0.87 },
        { label: 'Optimize Further', description: 'Run aggressive optimization', action: 'aggressive_cost', icon: 'TrendingUp', confidence: 0.72 },
      ],
      expectedImpact: {
        costSavings: { min: 25, max: 30, unit: '%', confidence: 0.87 },
        qualityImpact: { direction: 'neutral', magnitude: 0.05, confidence: 0.82 },
      },
      citations: [
        { ref: 1, source: 'GIVAUDAN-TECHNICAL-DATA-2026', excerpt: 'Rose Givco 222 — PEA/citronellol ratio matched to Rosa damascena absolute.', documentId: 'SUP-GIVAUDAN-2026', page: 234 },
        { ref: 2, source: 'SENSORY-PANEL-2026-Q2', excerpt: 'Rose Absolute vs. Rose Givco 222 discrimination test: d\' = 0.23 (n=47).', documentId: 'SENSORY-PANEL-2026-Q2', page: 18 },
      ],
      riskAssessment: {
        overallRisk: 'low',
        factors: [
          { name: 'Sensory drift', severity: 'low', probability: 0.08, impact: 'May require micro-adjustment of supporting notes' },
          { name: 'Supplier dependency', severity: 'low', probability: 0.12, impact: 'Givaudan single-source for Rose Givco 222' },
        ],
        mitigationSuggestions: ['Order small batch (100g) for physical panel evaluation', 'Maintain backup supplier for critical base'],
      },
    },
    suggest_alternatives: {
      content: `Top alternatives for Sandalwood Oil (MAT-4521, $20.10/kg):

1. **Iso E Super (CAS 54464-57-2)** — 0.893 similarity
   $12.40/kg | 38.2% savings | IFRA: unrestricted
   Woody-amber with subtle cedar. Excellent fixative properties.

2. **Ambroxan (CAS 6790-58-5)** — 0.847 similarity
   $18.90/kg | 5.6% savings | IFRA: unrestricted
   Ambery-marine character. Stronger projection than natural sandalwood.

3. **Javanol (CAS 95962-20-0)** — 0.912 similarity
   $31.20/kg | +55.2% cost | IFRA: unrestricted
   Superior sandalwood fidelity but premium pricing. Best for luxury positioning.`,
      confidence: 0.91,
      suggestedActions: [
        { label: 'Replace with Iso E Super', description: 'Best cost-performance ratio', action: 'replace_iso_e', icon: 'GitBranch', confidence: 0.91 },
        { label: 'Compare All', description: 'Side-by-side comparison', action: 'compare_alts', icon: 'GitBranch', confidence: 0.91 },
      ],
      expectedImpact: {
        costSavings: { min: 5, max: 38, unit: '%', confidence: 0.91 },
        qualityImpact: { direction: 'neutral', magnitude: 0.1, confidence: 0.88 },
      },
      citations: [
        { ref: 1, source: 'Mol Similarity DB', excerpt: 'ECFP4 Tanimoto similarity MAT-4521 vs Iso E Super = 0.893', documentId: 'SIM-DB-v3' },
        { ref: 2, source: 'IFRA 51st Amendment', excerpt: 'Iso E Super (CAS 54464-57-2): unrestricted in Category 4', documentId: 'IFRA-51', page: 112 },
      ],
      riskAssessment: {
        overallRisk: 'low',
        factors: [
          { name: 'Sensory preference variation', severity: 'low', probability: 0.15, impact: 'Asian markets may prefer Javanol\'s creamier profile' },
        ],
        mitigationSuggestions: ['Run regional sensory panel (n=30 per region) before finalizing'],
      },
    },
    explain_compliance: {
      content: `IFRA 51st Amendment Compliance Analysis:

**Current Status: FULLY COMPLIANT**

All 23 ingredients checked against IFRA Category 4 (Fine Fragrance) limits:

✅ Eugenol (CAS 97-53-0): 0.8% — Limit: 2.5% (34.2% of limit)
✅ Isoeugenol (CAS 97-54-1): 0.02% — Limit: 0.02% (AT LIMIT — monitor)
✅ Coumarin (CAS 91-64-5): 1.2% — Limit: 1.6% (75% of limit)
✅ Geraniol (CAS 106-24-1): 3.1% — Limit: 5.8% (53.4% of limit)

**Attention: Isoeugenol at exact IFRA limit.** Any formula modification that increases isoeugenol concentration will trigger a violation. Consider using Dihydroeugenol (limit: 0.5%) as buffer if further spice character is needed.`,
      confidence: 0.94,
      citations: [
        { ref: 1, source: 'IFRA 51st Amendment, Annex II', excerpt: 'Category 4 limits for restricted substances.', documentId: 'IFRA-ANNEX-2', page: 78 },
      ],
    },
    optimize_formula: {
      content: `Multi-objective optimization complete (genetic algorithm, 500 generations, population=200):

**Objectives**: Maximize quality + Maximize stability + Minimize cost + Maintain compliance

**Pareto-optimal solution found (Generation 387)**:

| Metric | Original | Optimized | Change |
|--------|----------|-----------|--------|
| Quality Score | 78.4 | 81.2 | +3.6% |
| Cost/kg | $112.70 | $89.40 | -20.7% |
| Stability (mo) | 18 | 22 | +22.2% |
| IFRA Compliance | ✓ | ✓ | — |

Key changes:
- Rose Absolute 8.0% → Rose Givco 222 7.2% + Rose Absolute 0.8% (for label claim)
- Orris Butter 0.5% → 0.3% + Ionone Alpha 0.2%
- Added BHT 0.05% as antioxidant (stability improvement)
- Added 0.1% Ultraviolet absorber (color stability)`,
      confidence: 0.84,
      suggestedActions: [
        { label: 'Apply Optimized', description: 'Update formula with optimized composition', action: 'apply_optimized', icon: 'Settings', confidence: 0.84 },
        { label: 'Save as Variant', description: 'Keep original, create variant', action: 'save_variant', icon: 'GitBranch', confidence: 0.84 },
      ],
      expectedImpact: {
        costSavings: { min: 18, max: 23, unit: '%', confidence: 0.84 },
        qualityImpact: { direction: 'positive', magnitude: 0.04, confidence: 0.79 },
        stabilityImpact: { direction: 'positive', monthsShelfLife: 22, confidence: 0.76 },
      },
      citations: [
        { ref: 1, source: 'Optimization Engine', excerpt: 'NSGA-II genetic algorithm with 5 objectives over 500 generations.', documentId: 'OPT-ENGINE-v2' },
      ],
      riskAssessment: {
        overallRisk: 'moderate',
        factors: [
          { name: 'Multi-objective trade-offs', severity: 'moderate', probability: 0.22, impact: 'Quality improvement may not materialize in physical testing' },
        ],
        mitigationSuggestions: ['Compound optimized version and run 3-month accelerated aging test', 'Validating sensory panel before production approval'],
      },
    },
    predict_success: {
      content: `Commercial viability prediction for this formula:

**Predicted Hedonic Score: 78.4/100** (95% CI: 76–81)
**Predicted Market Performance: Top 30% of floral-woody launches**

Key drivers:
1. Hedione at 18.2% — near optimal range (15-20%) for consumer liking
2. Rose accord construction — technically sound (damascenone-to-ionone ratio 0.67)
3. Musk complexity (3 musks) — slightly above optimal; simplifying could add 3-5 points

**Target Demographics**:
- Women 25-45: 82/100 predicted liking
- Men 30-50: 64/100 (lower due to floral-dominant profile)
- EU market: 81/100 | NA: 76/100 | APAC: 72/100

**Recommended Price Point**: $145-165/100ml (premium masstige segment)`,
      confidence: 0.83,
      citations: [
        { ref: 1, source: 'sensory-transformer-v2', excerpt: 'Hedonic prediction model trained on 4,900 materials with human panel validation.', documentId: 'SENSORY-TRANSFORMER-V2' },
        { ref: 2, source: 'NPD Prestige Fragrance Q2 2026', excerpt: 'Floral-woody segment growing 12% YoY; average price $152/100ml.', documentId: 'MKT-NPD-2026-Q2', page: 28 },
      ],
    },
    generate_accord: {
      content: `Generated Accord: "Vetiver Solaire"

**Olfactory Description**: Sun-warmed vetiver with bright citrus opening, aromatic lavender heart, and a smooth tonka-amber dry-down.

| Ingredient | % | Role |
|------------|---|------|
| Bergamot Oil BF | 12.0% | Top — Citrus sparkle |
| Grapefruit (Pink) | 6.0% | Top — Juicy brightness |
| Lavender Oil (France) | 8.0% | Heart — Aromatic clarity |
| Vetiver Oil (Haiti) | 5.0% | Heart — Earthy warmth |
| Geranium (Egypt) | 3.0% | Heart — Green-rosy lift |
| Hedione | 18.0% | Bridge — Transparent diffusion |
| Iso E Super | 14.0% | Base — Woody-amber radiance |
| Ambroxan | 3.0% | Base — Solar warmth |
| Coumarin | 2.5% | Base — Tonka sweetness |
| Ethylene Brassylate | 4.0% | Base — Clean musk |

**Predicted Performance**: Hedonic 76, Longevity 8h, Sillage: Moderate-Strong
**Estimated Cost**: $38.40/kg | **IFRA**: Fully compliant

Novelty vs. training set: 0.72 (72nd percentile — distinctive but not unprecedented)`,
      confidence: 0.72,
      suggestedActions: [
        { label: 'Create Formula', description: 'Open this accord in the Formulation Wizard', action: 'create_from_accord', icon: 'FlaskConical', confidence: 0.72 },
        { label: 'Regenerate', description: 'Generate another variation', action: 'regenerate_accord', icon: 'Sparkles', confidence: 0.72 },
        { label: 'Refine', description: 'Adjust the accord description', action: 'refine_accord', icon: 'Settings', confidence: 0.72 },
      ],
      citations: [
        { ref: 1, source: 'accord-gan-v1', excerpt: 'Generated accord with policy gradient reward on sensory, cost, compliance scores.', documentId: 'ACCORD-GAN-V1' },
      ],
      riskAssessment: {
        overallRisk: 'moderate',
        factors: [
          { name: 'GAN mode collapse', severity: 'moderate', probability: 0.18, impact: 'Generated accord may be too similar to training examples' },
        ],
        mitigationSuggestions: ['Physical compound and evaluate with 3 perfumers', 'Run 2-week maceration test before scaling'],
      },
    },
    improve_stability: {
      content: `Stability Analysis & Recommendations:

**Current predicted shelf life: 18 months** (standard conditions)
**Risk Factors Identified**:

1. **Bergamot Oil (6.5%)** — High oxidation risk
   - Limonene content degrades to limonene oxide within 12 months
   - Recommendation: Add 0.05% BHT + 0.02% Tocopherol (Vitamin E)

2. **Vanillin (2.8%)** — Discoloration risk
   - Vanillin reacts with amine-containing materials forming Schiff bases (brown)
   - Recommendation: Replace with Vanillyl Butyl Ether (VBE) at 2.4% or add 0.01% UV absorber

3. **Sandalwood Oil (3.2%)** — Photo-instability
   - Natural oil degrades under UV exposure within 9 months
   - Recommendation: Store in amber glass; add 0.005% UV absorber Tinoguard TT

**With all mitigations**: Predicted shelf life **28 months** (+56%)`,
      confidence: 0.81,
      suggestedActions: [
        { label: 'Apply Stabilizers', description: 'Add BHT, Tocopherol, and UV absorber', action: 'apply_stabilizers', icon: 'Shield', confidence: 0.81 },
      ],
      expectedImpact: {
        stabilityImpact: { direction: 'positive', monthsShelfLife: 28, confidence: 0.81 },
        costSavings: { min: 0.8, max: 1.2, unit: '%', confidence: 0.81 },
      },
      citations: [
        { ref: 1, source: 'stability-xgb-v1', excerpt: 'Degradation prediction based on 15,200 accelerated aging test results.', documentId: 'STABILITY-XGB-V1' },
      ],
    },
  }

  const template = responses[capabilityId] || {
    content: `I've analyzed your request regarding ${config.label.toLowerCase()}. Based on available data and model predictions, I recommend proceeding with the analysis in the context of your current formula. Please provide more specific parameters for a detailed recommendation.`,
    confidence: 0.70,
  }

  return {
    id: `ai-${Date.now()}`,
    role: 'assistant',
    content: template.content || '',
    timestamp: Date.now(),
    confidence: template.confidence,
    citations: template.citations,
    expectedImpact: template.expectedImpact,
    suggestedActions: template.suggestedActions,
    riskAssessment: template.riskAssessment,
  }
}

function generateRAGResponse(query: string): AICollaboratorMessage {
  const lowerQuery = query.toLowerCase()

  if (lowerQuery.includes('eugenol') || lowerQuery.includes('alternative')) {
    return {
      id: `rag-${Date.now()}`,
      role: 'assistant',
      content: `Based on the IFRA Knowledge Base and Supplier Catalogs:

**Top alternatives to Eugenol (CAS 97-53-0)**:

1. **Isoeugenol (CAS 97-54-1)** — 0.94 molecular similarity
   - Slightly sweeter, more carnation-like
   - $18/kg | IFRA: 0.02% in Category 4 (⚠️ restricted)
   - [1] IFRA 51st Amendment, Annex II, p.78

2. **Dihydroeugenol (CAS 2785-87-7)** — 0.89 similarity
   - Milder, less pungent
   - $22/kg | IFRA: 0.5% in Category 4 (better safety profile)
   - [1] IFRA 51st Amendment, Annex II, p.82

3. **Methyl Diantilis (CAS 5595-61-3)** — 0.81 olfactory similarity
   - Carnation-spice with vanilla undertone
   - $45/kg | IFRA: unrestricted
   - [2] Givaudan Catalog 2026, p.234`,
      confidence: 0.91,
      citations: [
        { ref: 1, source: 'IFRA 51st Amendment, Annex II', excerpt: 'Isoeugenol: QRA Category 4 limit 0.02%. Dihydroeugenol: 0.5%.', documentId: 'IFRA-ANNEX-2', page: 78 },
        { ref: 2, source: 'Givaudan Catalog 2026', excerpt: 'Methyl Diantilis — spicy carnation specialty, unrestricted.', documentId: 'SUP-GIVAUDAN-2026', page: 234 },
      ],
      timestamp: Date.now(),
    }
  }

  if (lowerQuery.includes('ifra') || lowerQuery.includes('restrict')) {
    return {
      id: `rag-${Date.now()}`,
      role: 'assistant',
      content: `IFRA 51st Amendment Key Information:

The IFRA Standards are based on safety assessments by the Research Institute for Fragrance Materials (RIFM). The 51st Amendment (effective March 2024) introduced:

- **11 new restricted substances** including 3 synthetic musks
- **Revised QRA2 framework** replacing the original QRA for dermal sensitization
- **Updated aggregate exposure model** accounting for multiple product use

Key Categories for Fine Fragrance (Category 4):
- Leave-on application to skin
- Most restrictive QRA limits apply
- Example limits: Isoeugenol 0.02%, Coumarin 1.6%, Eugenol 2.5%

[1] IFRA 51st Amendment — Full Standard, pp.1-187
[2] IFRA Guidance for the Use of IFRA Standards, pp.1-94`,
      confidence: 0.96,
      citations: [
        { ref: 1, source: 'IFRA 51st Amendment', excerpt: 'Full standard document with all QRA categories and substance limits.', documentId: 'IFRA-51' },
        { ref: 2, source: 'IFRA Guidance Document', excerpt: 'Guidance for application of IFRA Standards in fragrance formulation.', documentId: 'IFRA-GL-001' },
      ],
      timestamp: Date.now(),
    }
  }

  return {
    id: `rag-${Date.now()}`,
    role: 'assistant',
    content: `I searched the VITO Knowledge Base for "${query}" and found relevant information. To provide a more specific answer, could you clarify what aspect you're most interested in? For example, you can ask about:

- IFRA restrictions for a specific material
- Alternative ingredients with better cost or compliance profiles
- Commercial viability of a fragrance concept
- Comparison between two formulas
- Stability concerns for specific ingredient combinations`,
    confidence: 0.75,
    timestamp: Date.now(),
  }
}
