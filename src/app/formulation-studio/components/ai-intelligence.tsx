'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  Brain, Sparkles, Lightbulb, AlertTriangle, CheckCircle2, XCircle,
  BarChart3, ShieldCheck, TrendingUp, Target, RefreshCw,
  ChevronRight, Star, Plus, Gauge, Activity, Zap,
  Droplets, Wind, Thermometer, Clock, Leaf,
} from 'lucide-react'
import { demoFormula } from '@/lib/demo-formula'
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer, Tooltip,
} from 'recharts'

const suggestions = demoFormula.aiSuggestions

const predictionDimensions = [
  { key: 'longevity', label: 'Longevity', value: demoFormula.predictions.longevity, color: '#f59e0b' },
  { key: 'sillage', label: 'Sillage', value: demoFormula.predictions.sillage, color: '#8b5cf6' },
  { key: 'diffusion', label: 'Diffusion', value: demoFormula.predictions.diffusion, color: '#06b6d4' },
  { key: 'stability', label: 'Stability', value: demoFormula.predictions.stability, color: '#10b981' },
  { key: 'projection', label: 'Projection', value: demoFormula.predictions.projection, color: '#f97316' },
  { key: 'freshness', label: 'Freshness', value: demoFormula.predictions.freshness, color: '#22c55e' },
  { key: 'sweetness', label: 'Sweetness', value: demoFormula.predictions.sweetness, color: '#ec4899' },
  { key: 'woodiness', label: 'Woodiness', value: demoFormula.predictions.woodiness, color: '#92400e' },
  { key: 'floral_intensity', label: 'Floral', value: demoFormula.predictions.floral_intensity, color: '#d946ef' },
  { key: 'spiciness', label: 'Spice', value: demoFormula.predictions.spiciness, color: '#ef4444' },
]

const radarData = predictionDimensions.slice(0, 8).map(d => ({
  dimension: d.label,
  score: d.value,
  fullMark: 100,
}))

const complianceChecks = [
  { id: 'c1', check: 'IFRA 51 - Cinnamon Bark', status: 'fail', detail: 'Exceeds max 1.2% (currently 1.5%)' },
  { id: 'c2', check: 'IFRA 49 - Oakmoss', status: 'fail', detail: 'Restricted - max 0.1% (currently 0.5%)' },
  { id: 'c3', check: 'IFRA 48 - Rose Absolute', status: 'warn', detail: 'Near limit at 85% of max allowed' },
  { id: 'c4', check: 'IFRA 43 - Clove Bud', status: 'warn', detail: 'Near limit at 78% of max allowed' },
  { id: 'c5', check: 'EU Cosmetics Regulation', status: 'pass', detail: 'All allergens correctly labeled' },
  { id: 'c6', check: 'CLP Classification', status: 'pass', detail: 'No hazardous thresholds triggered' },
  { id: 'c7', check: 'REACH Registration', status: 'pass', detail: 'All substances registered' },
  { id: 'c8', check: 'California Prop 65', status: 'pass', detail: 'No listed substances detected' },
]

const similarFormulas = [
  { id: 'sf1', name: 'Nuit d\'Été', similarity: 94, costPerKg: 48.20, score: 85 },
  { id: 'sf2', name: 'Amber Velvet', similarity: 87, costPerKg: 56.80, score: 79 },
  { id: 'sf3', name: 'Citrus Moon', similarity: 72, costPerKg: 38.40, score: 82 },
  { id: 'sf4', name: 'Floral Dusk', similarity: 68, costPerKg: 62.10, score: 76 },
]

export function AIIntelligence({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState('suggestions')

  return (
    <div className={cn('flex flex-col bg-background', className)}>
      <div className="p-3 border-b">
        <h2 className="text-sm font-semibold flex items-center gap-1.5">
          <Brain className="h-4 w-4 text-primary" />
          AI Intelligence
        </h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-3 pt-2">
          <TabsList className="w-full h-8">
            <TabsTrigger value="suggestions" className="text-xs h-7 flex-1 gap-1">
              <Lightbulb className="h-3 w-3" /> Suggestions
            </TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs h-7 flex-1 gap-1">
              <BarChart3 className="h-3 w-3" /> Analysis
            </TabsTrigger>
            <TabsTrigger value="compliance" className="text-xs h-7 flex-1 gap-1">
              <ShieldCheck className="h-3 w-3" /> Compliance
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-3">
          <TabsContent value="suggestions" className="mt-0 space-y-3">
            {/* AI Quick Actions */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-medium text-muted-foreground uppercase">Quick Actions</p>
              {[
                { icon: Sparkles, label: 'Generate from brief', desc: 'Create formula from description' },
                { icon: RefreshCw, label: 'Find alternatives', desc: 'Suggestion for restricted ingredient' },
                { icon: TrendingUp, label: 'Reduce cost 15%', desc: 'Optimize cost structure' },
                { icon: Target, label: 'Improve longevity', desc: 'Boost performance score' },
                { icon: Leaf, label: 'Natural optimization', desc: 'Increase natural content' },
              ].map((action, i) => (
                <motion.button
                  key={i}
                  whileHover={{ x: 2 }}
                  className="flex items-center gap-2 w-full rounded-md border p-2 text-left hover:bg-muted/50 transition-colors group"
                >
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <action.icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">{action.label}</p>
                    <p className="text-[10px] text-muted-foreground">{action.desc}</p>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100" />
                </motion.button>
              ))}
            </div>

            <Separator />

            {/* AI Suggestions */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-medium text-muted-foreground uppercase">Recent Suggestions</p>
              <AnimatePresence>
                {suggestions.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-lg border p-2.5 space-y-2 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        {s.confidence >= 90
                          ? <Star className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                          : <Lightbulb className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                        }
                        <div>
                          <p className="text-xs font-medium">{s.title}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{s.description}</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          s.status === 'applied' ? 'success' :
                          s.status === 'dismissed' ? 'secondary' : 'warning'
                        }
                        className="text-[9px] h-4 shrink-0"
                      >
                        {s.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[9px] h-4">{s.impact}</Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {s.confidence}% confident
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <XCircle className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="mt-0 space-y-3">
            {/* Performance cards */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Longevity', value: demoFormula.predictions.longevity, icon: Clock, color: 'text-amber-500' },
                { label: 'Sillage', value: demoFormula.predictions.sillage, icon: Wind, color: 'text-purple-500' },
                { label: 'Diffusion', value: demoFormula.predictions.diffusion, icon: Activity, color: 'text-cyan-500' },
                { label: 'Stability', value: demoFormula.predictions.stability, icon: Thermometer, color: 'text-emerald-500' },
              ].map(metric => (
                <Card key={metric.label} className="overflow-hidden">
                  <CardContent className="p-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <metric.icon className={cn('h-3.5 w-3.5', metric.color)} />
                      <span className="text-xs font-bold">{metric.value}/100</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{metric.label}</p>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        className={cn('h-full rounded-full', {
                          'bg-amber-500': metric.label === 'Longevity',
                          'bg-purple-500': metric.label === 'Sillage',
                          'bg-cyan-500': metric.label === 'Diffusion',
                          'bg-emerald-500': metric.label === 'Stability',
                        })}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Radar chart */}
            <Card>
              <CardContent className="p-2">
                <p className="text-[10px] font-medium text-muted-foreground uppercase mb-1">10-Dimension Profile</p>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 9 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
                    <Radar name="Score" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Separator />

            {/* Similar formulas */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-medium text-muted-foreground uppercase">Similar Formulas</p>
              {similarFormulas.map(f => (
                <div key={f.id} className="flex items-center justify-between rounded-md border p-2 hover:bg-muted/30">
                  <div>
                    <p className="text-xs font-medium">{f.name}</p>
                    <p className="text-[10px] text-muted-foreground">${f.costPerKg}/kg · {f.score}/100 score</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">{f.similarity}% match</Badge>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="mt-0 space-y-3">
            {/* Overall score */}
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-xs font-medium">IFRA Compliance Score</p>
                <p className="text-[10px] text-muted-foreground">Based on current formulation</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-green-600">{demoFormula.ifraScore}%</span>
                <Badge variant={demoFormula.ifraScore >= 90 ? 'success' : 'warning'} className="ml-2 text-[9px] h-4">
                  {demoFormula.ifraScore >= 90 ? 'Good' : 'Needs Work'}
                </Badge>
              </div>
            </div>

            <div className="space-y-1">
              {complianceChecks.map(check => (
                <div
                  key={check.id}
                  className={cn(
                    'flex items-center justify-between rounded-md border p-2',
                    check.status === 'fail' && 'border-red-200 bg-red-50',
                    check.status === 'warn' && 'border-amber-200 bg-amber-50',
                    check.status === 'pass' && 'border-green-200 bg-green-50',
                  )}
                >
                  <div className="flex items-start gap-2 min-w-0">
                    {check.status === 'pass' ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" />
                    ) : check.status === 'warn' ? (
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-red-600 mt-0.5 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{check.check}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{check.detail}</p>
                    </div>
                  </div>
                  <Badge
                    variant={check.status === 'pass' ? 'success' : check.status === 'warn' ? 'warning' : 'destructive'}
                    className="text-[9px] h-4 shrink-0 ml-2"
                  >
                    {check.status === 'pass' ? 'Pass' : check.status === 'warn' ? 'Warn' : 'Fail'}
                  </Badge>
                </div>
              ))}
            </div>

            {/* Market alerts */}
            <Card>
              <CardContent className="p-2.5">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                  <span className="text-xs font-medium">Regulatory Alerts</span>
                </div>
                <div className="space-y-1.5">
                  <div className="rounded border border-amber-200 bg-amber-50 p-1.5 text-[10px]">
                    <p className="font-medium text-amber-800">EU: Cinnamon Bark restriction update pending (2026 Q3)</p>
                    <p className="text-amber-600">Current formulation may require adjustment</p>
                  </div>
                  <div className="rounded border border-blue-200 bg-blue-50 p-1.5 text-[10px]">
                    <p className="font-medium text-blue-800">US: FDA guidance on synthetic musks unchanged</p>
                    <p className="text-blue-600">No action required</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
