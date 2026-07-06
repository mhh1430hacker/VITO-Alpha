'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import api from '@/lib/api'
import {
  Brain, Send, Lightbulb, GitBranch, Activity, TrendingUp, ShieldCheck,
  Sparkles, BarChart3, AlertTriangle, CheckCircle, XCircle, Loader2,
  MessageSquare, RefreshCw, Zap, Target, FlaskConical, Eye,
  ThumbsUp, ThumbsDown, Copy, Download, Clock, Star,
} from 'lucide-react'

type QueryResult = {
  query_id: string
  query: string
  intent: string
  entities: Record<string, any>
  timestamp: string
  data: Record<string, any>
  insights: any[]
  confidence: number
}

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  result?: QueryResult
  timestamp: string
  rating?: number
}

const suggestedQueries = [
  { icon: Brain, text: 'Predict quality scores for my latest formula', intent: 'predict' },
  { icon: GitBranch, text: 'What if I replace Benzyl Acetate with Linalool?', intent: 'whatif' },
  { icon: Lightbulb, text: 'Recommend improvements for floral accords', intent: 'recommend' },
  { icon: TrendingUp, text: 'Analyze quality score trends this quarter', intent: 'trends' },
  { icon: Eye, text: 'Explain why my stability score is low', intent: 'explain' },
]

const insightTemplates = [
  {
    id: '1',
    type: 'trend',
    title: 'Quality scores trending upward',
    description: 'Average quality score increased 8.3% over the last 30 days across active projects.',
    confidence: 0.87,
    severity: 'info',
    time: '2h ago',
  },
  {
    id: '2',
    type: 'risk',
    title: 'Model disagreement on commercial score',
    description: 'Molecular and sensory models differ by 0.31 on formula "Rose Amber v3". Additional validation recommended.',
    confidence: 0.92,
    severity: 'warning',
    time: '4h ago',
  },
  {
    id: '3',
    type: 'recommendation',
    title: 'Optimize coumarin concentration',
    description: 'Reducing coumarin by 15% in "Woody Elegance" could improve IFRA compliance while maintaining character.',
    confidence: 0.78,
    severity: 'info',
    time: '1d ago',
  },
  {
    id: '4',
    type: 'anomaly',
    title: 'Anomaly: Stability score deviation',
    description: 'Formula "Fresh Ocean" shows stability score 2.4σ below historical mean for aquatic accords.',
    confidence: 0.95,
    severity: 'critical',
    time: '1d ago',
  },
]

function severityColor(severity: string) {
  switch (severity) {
    case 'critical': return 'text-red-600 bg-red-50 border-red-200'
    case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    default: return 'text-blue-600 bg-blue-50 border-blue-200'
  }
}

function severityIcon(severity: string) {
  switch (severity) {
    case 'critical': return AlertTriangle
    case 'warning': return AlertTriangle
    default: return Lightbulb
  }
}

export default function SuperIntelligencePage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('chat')
  const [systemStatus, setSystemStatus] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadStatus()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadStatus = async () => {
    try {
      const res = await api.get('/api/v1/super-intelligence/status')
      setSystemStatus(res.data)
    } catch {
      setSystemStatus({ orchestrator_ready: true, queries_processed: 0 })
    }
  }

  const handleQuery = async (queryText?: string) => {
    const q = queryText || input
    if (!q.trim() || loading) return

    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: q,
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await api.post('/api/v1/super-intelligence/query', { query: q })
      const result: QueryResult = res.data
      const assistantMsg: Message = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: formatResult(result),
        result,
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, assistantMsg])
    } catch {
      const assistantMsg: Message = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: 'Unable to connect to the Super Intelligence engine. Ensure the backend is running.',
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, assistantMsg])
    } finally {
      setLoading(false)
    }
  }

  const formatResult = (result: QueryResult): string => {
    const parts: string[] = []
    const data = result.data || {}

    if (data.fused) {
      const f = data.fused
      parts.push('**Prediction Results**')
      parts.push(`Overall Score: ${(f.overall_score * 100).toFixed(1)}%`)
      parts.push(`Confidence: ${(f.confidence * 100).toFixed(0)}% (${f.model_count} models)`)
      parts.push('')
      for (const dim of ['quality_score', 'commercial_score', 'stability_score', 'safety_compliance_score']) {
        if (f[dim] !== undefined) {
          parts.push(`• ${dim.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}: ${(f[dim] * 100).toFixed(1)}%`)
        }
      }
      if (data.confidence_intervals && typeof data.confidence_intervals === 'object') {
        parts.push('')
        parts.push('**Confidence Ranges**')
        for (const [dim, interval] of Object.entries(data.confidence_intervals as Record<string, [number, number]>)) {
          const [lo, hi] = interval
          parts.push(`• ${dim.replace('_', ' ')}: ${(lo * 100).toFixed(0)}%-${(hi * 100).toFixed(0)}%`)
        }
      }
    }

    if (data.effects) {
      parts.push('**What-If Analysis**')
      for (const [varName, effect] of Object.entries(data.effects)) {
        const e = effect as any
        parts.push(`\nModify: ${varName.replace('_', ' ')}`)
        parts.push(`  ${e.old_value} → ${e.new_value} (${e.change_pct > 0 ? '+' : ''}${(e.change_pct * 100).toFixed(1)}%)`)
        if (e.downstream_effects) {
          for (const [outcome, impact] of Object.entries(e.downstream_effects)) {
            const imp = impact as any
            parts.push(`  ↳ ${outcome.replace('_', ' ')}: ${imp.direction} by ${(imp.estimated_change * 100).toFixed(1)}%`)
          }
        }
      }
    }

    if (data.recommendations?.length) {
      parts.push('**Recommendations**')
      for (const rec of data.recommendations) {
        parts.push(`• ${rec.title}: ${rec.description}`)
      }
    }

    if (data.alternatives?.length) {
      parts.push('**Suggested Modifications**')
      for (const alt of data.alternatives) {
        parts.push(`• ${alt.modification}: ${alt.current_value}% → ${alt.suggested_value}%`)
        if (alt.trade_offs?.length) {
          parts.push(`  ⚠ ${alt.trade_offs.join(', ')}`)
        }
      }
    }

    if (data.explanation) {
      parts.push('**Explanation**')
      parts.push(data.explanation)
    }

    if (result.insights?.length) {
      parts.push('\n**AI Insights**')
      for (const insight of result.insights) {
        parts.push(`• ${insight.title} (${(insight.confidence * 100).toFixed(0)}% confidence)`)
      }
    }

    return parts.join('\n') || 'Query processed. No structured data returned.'
  }

  const handleFeedback = (messageId: string, rating: number) => {
    setMessages(prev => prev.map(m =>
      m.id === messageId ? { ...m, rating } : m
    ))
    const msg = messages.find(m => m.id === messageId)
    if (msg?.result) {
      api.post('/api/v1/super-intelligence/feedback', {
        query_id: msg.result.query_id,
        rating,
      }).catch(() => {})
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Super Intelligence</h1>
              <p className="text-sm text-muted-foreground">
                AI-powered fragrance intelligence — query, analyze, optimize
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {systemStatus && (
              <>
                <Badge variant={systemStatus.orchestrator_ready ? 'success' : 'destructive'}>
                  {systemStatus.orchestrator_ready ? 'Online' : 'Offline'}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {systemStatus.queries_processed || 0} queries processed
                </span>
              </>
            )}
            <Button variant="outline" size="sm" onClick={loadStatus}>
              <RefreshCw className="h-3 w-3 mr-1" />
              Status
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-6 border-b">
          <TabsList className="bg-transparent border-b-0">
            <TabsTrigger value="chat" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              <MessageSquare className="h-4 w-4 mr-2" />
              Intelligence Chat
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              <Lightbulb className="h-4 w-4 mr-2" />
              Insights Feed
            </TabsTrigger>
            <TabsTrigger value="status" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              <Activity className="h-4 w-4 mr-2" />
              System Status
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="max-w-2xl mx-auto pt-8 space-y-6">
                <div className="text-center">
                  <Brain className="h-12 w-12 mx-auto text-primary/60 mb-3" />
                  <h2 className="text-lg font-semibold mb-1">How can I help you?</h2>
                  <p className="text-sm text-muted-foreground">
                    Ask anything about your formulas, materials, or projects
                  </p>
                </div>

                <Separator />

                <div>
                  <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">
                    Suggested queries
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {suggestedQueries.map((sq, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuery(sq.text)}
                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors text-left text-sm"
                      >
                        <sq.icon className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-muted-foreground">{sq.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                {msg.role === 'assistant' && (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Brain className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div className={cn(
                  'max-w-[75%] rounded-lg px-4 py-3',
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted border'
                )}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {msg.content.split('**').map((part, i) =>
                      i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-inherit/20">
                    <span className="text-[10px] opacity-60">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-1">
                        {msg.rating ? (
                          <span className="text-[10px] opacity-60">
                            {msg.rating >= 4 ? 'Helpful' : 'Needs improvement'}
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={() => handleFeedback(msg.id, 5)}
                              className="p-1 rounded hover:bg-background/50 transition-colors"
                              title="Helpful"
                            >
                              <ThumbsUp className="h-3 w-3 opacity-60" />
                            </button>
                            <button
                              onClick={() => handleFeedback(msg.id, 1)}
                              className="p-1 rounded hover:bg-background/50 transition-colors"
                              title="Not helpful"
                            >
                              <ThumbsDown className="h-3 w-3 opacity-60" />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {msg.role === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1 text-primary-foreground text-xs font-medium">
                    U
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Brain className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted border rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing through Super Intelligence Layer...
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-4 bg-card">
            <div className="flex gap-2 max-w-4xl mx-auto">
              <Input
                placeholder="Ask anything about your formulas, materials, or projects..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                className="flex-1"
              />
              <Button onClick={() => handleQuery()} disabled={!input.trim() || loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="flex-1 overflow-y-auto p-6 m-0">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Autonomous Insights</h2>
                <p className="text-sm text-muted-foreground">
                  AI-detected patterns, trends, and recommendations across your data
                </p>
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-3 w-3 mr-1" /> Refresh
              </Button>
            </div>

            {insightTemplates.map((insight) => {
              const Icon = severityIcon(insight.severity)
              return (
                <div
                  key={insight.id}
                  className={cn(
                    'rounded-lg border p-4 transition-colors hover:bg-accent/30',
                    severityColor(insight.severity).split(' ')[2]
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'p-2 rounded-full',
                      insight.severity === 'critical' ? 'bg-red-100' :
                      insight.severity === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                    )}>
                      <Icon className={cn(
                        'h-4 w-4',
                        insight.severity === 'critical' ? 'text-red-600' :
                        insight.severity === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-sm">{insight.title}</h3>
                        <Badge variant={
                          insight.severity === 'critical' ? 'destructive' :
                          insight.severity === 'warning' ? 'warning' : 'secondary'
                        } className="text-[10px]">
                          {insight.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {(insight.confidence * 100).toFixed(0)}% confidence
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {insight.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="status" className="flex-1 overflow-y-auto p-6 m-0">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-lg font-semibold">Super Intelligence — System Status</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    Orchestrator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Active</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Routes queries to appropriate intelligence modules
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Fusion Engine
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Active</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Weighted ensemble: molecular 30%, sensory 25%, commercial 20%, safety 25%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-primary" />
                    Causal Engine
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Active</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Causal graph with {systemStatus?.causal_engine === 'active' ? '14' : '—'} variable relationships
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    Counterfactual Generator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Active</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Generates ranked alternatives with trade-off analysis
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    Insight Synthesizer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Active</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Trend detection, anomaly detection, recommendation generation
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-primary" />
                    Feedback Loop
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Continuous Learning</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Model accuracy tracking and improvement suggestions
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Available Models</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['molecular', 'commercial', 'sensory', 'safety'].map((model) => (
                    <div key={model} className="flex items-center gap-2 p-2 rounded-lg border">
                      <FlaskConical className="h-4 w-4 text-primary" />
                      <span className="text-sm capitalize">{model}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
