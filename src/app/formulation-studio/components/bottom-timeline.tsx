'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  Clock, History, GitBranch, BarChart3, MessageSquare,
  ChevronDown, RotateCcw, ChevronRight, User, Calendar,
  Activity, Target, TrendingUp, Gauge, Loader2, CheckCircle2,
  XCircle, AlertCircle, Download, Share2, Star, Zap,
} from 'lucide-react'
import { demoFormula, AISuggestion } from '@/lib/demo-formula'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts'

const historyData = [
  { date: 'Jun 15', score: 72, cost: 58.20 },
  { date: 'Jun 16', score: 74, cost: 57.80 },
  { date: 'Jun 18', score: 76, cost: 56.40 },
  { date: 'Jun 20', score: 80, cost: 55.90 },
  { date: 'Jun 22', score: 83, cost: 49.20 },
  { date: 'Jun 24', score: 85, cost: 50.10 },
  { date: 'Jun 26', score: 86, cost: 51.80 },
  { date: 'Jun 28', score: 87, cost: 52.40 },
]

const experiments = [
  { id: 'e1', name: 'Cost opt v1', date: 'Jun 22', status: 'completed' as const, result: '-12% cost, +3 score', duration: '2m 14s' },
  { id: 'e2', name: 'Longevity boost', date: 'Jun 23', status: 'completed' as const, result: '+8 longevity, +$0.80/kg', duration: '3m 01s' },
  { id: 'e3', name: 'Natural swap', date: 'Jun 24', status: 'failed' as const, result: 'Score dropped 7 points', duration: '1m 45s' },
  { id: 'e4', name: 'IFRA fix v1', date: 'Jun 25', status: 'running' as const, result: 'Optimizing...', duration: '--' },
  { id: 'e5', name: 'Balanced opt', date: 'Jun 26', status: 'pending' as const, result: 'Queued', duration: '--' },
]

const predictionRadar = Object.entries(demoFormula.predictions).slice(0, 12).map(([key, value]) => ({
  dimension: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
  score: value,
}))

const comments = [
  { id: 'cm1', author: 'Sarah Chen', role: 'Senior Perfumer', timestamp: '2 hours ago', content: 'The top notes feel a bit flat. Consider increasing bergamot by 2% and reducing grapefruit.', mentions: ['Marcus Webb'] },
  { id: 'cm2', author: 'Marcus Webb', role: 'Compliance Specialist', timestamp: '1 hour ago', content: 'IFRA check on clove bud - we need to address this before submission. @Sarah Chen please review the AI suggestion.', mentions: ['Sarah Chen'] },
  { id: 'cm3', author: 'AI Assistant', role: 'System', timestamp: '30 min ago', content: 'Suggestion applied: Cinnamon Bark replaced with Cinnamon Leaf. IFRA score improved from 89 to 94.', mentions: [] },
]

interface BottomTimelineProps {
  onClose: () => void
}

export function BottomTimeline({ onClose }: BottomTimelineProps) {
  const [activeTab, setActiveTab] = useState('history')

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 240, opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="border-t bg-background shrink-0 overflow-hidden"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between px-4 py-1.5 border-b">
          <TabsList className="h-7">
            <TabsTrigger value="history" className="text-xs h-6 gap-1 px-2">
              <History className="h-3 w-3" /> History
            </TabsTrigger>
            <TabsTrigger value="experiments" className="text-xs h-6 gap-1 px-2">
              <GitBranch className="h-3 w-3" /> Experiments
            </TabsTrigger>
            <TabsTrigger value="predictions" className="text-xs h-6 gap-1 px-2">
              <BarChart3 className="h-3 w-3" /> Predictions
            </TabsTrigger>
            <TabsTrigger value="comments" className="text-xs h-6 gap-1 px-2">
              <MessageSquare className="h-3 w-3" /> Comments
            </TabsTrigger>
          </TabsList>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onClose}>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-[calc(240px-37px)] overflow-y-auto scrollbar-thin">
        <TabsContent value="history" className="p-3 mt-0">
          {/* Timeline chart */}
          <div className="h-[80px] mb-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 9 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 8 }} domain={[60, 100]} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 8 }} domain={[40, 65]} />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} name="Score" />
                <Line yAxisId="right" type="monotone" dataKey="cost" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Cost $/kg" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1">
            {demoFormula.versions.slice().reverse().map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between rounded-md border p-2 hover:bg-muted/30 group"
              >
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                    v{v.version}
                  </div>
                  <div>
                    <p className="text-xs font-medium">{v.change}</p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1"><User className="h-3 w-3" />{v.author}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(v.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1 opacity-0 group-hover:opacity-100">
                  <RotateCcw className="h-3 w-3" /> Restore
                </Button>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="experiments" className="p-3 mt-0">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="rounded-lg border p-2">
              <p className="text-[10px] text-muted-foreground">Total Experiments</p>
              <p className="text-lg font-bold">12</p>
            </div>
            <div className="rounded-lg border p-2">
              <p className="text-[10px] text-muted-foreground">Success Rate</p>
              <p className="text-lg font-bold text-green-600">67%</p>
            </div>
          </div>
          <div className="space-y-1">
            {experiments.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between rounded-md border p-2 hover:bg-muted/30"
              >
                <div className="flex items-center gap-2">
                  {exp.status === 'completed' ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                  ) : exp.status === 'failed' ? (
                    <XCircle className="h-3.5 w-3.5 text-red-600" />
                  ) : exp.status === 'running' ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
                  ) : (
                    <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="text-xs font-medium">{exp.name}</p>
                    <p className="text-[10px] text-muted-foreground">{exp.date} · {exp.duration}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-medium">{exp.result}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="p-3 mt-0">
          <div className="flex gap-3">
            <div className="flex-1">
              <p className="text-[10px] font-medium text-muted-foreground uppercase mb-2">Performance Radar</p>
              <ResponsiveContainer width="100%" height={150}>
                <RadarChart data={predictionRadar}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 8 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 7 }} />
                  <Radar name="Prediction" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="w-[200px] space-y-1">
              {predictionRadar.slice(0, 8).map(p => (
                <div key={p.dimension} className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground truncate mr-2">{p.dimension}</span>
                  <span className="font-mono font-medium">{p.score}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="comments" className="p-3 mt-0">
          <div className="space-y-2">
            {comments.map(c => (
              <div key={c.id} className="rounded-lg border p-2.5">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[8px] font-bold text-primary">
                    {c.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-medium">{c.author}</p>
                    <p className="text-[9px] text-muted-foreground">{c.role} · {c.timestamp}</p>
                  </div>
                </div>
                <p className="text-xs">{c.content}</p>
                {c.mentions.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {c.mentions.map(m => (
                      <Badge key={m} variant="secondary" className="text-[9px] h-4">@{m}</Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex items-center gap-2 pt-1">
              <input
                className="flex-1 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Add a comment... (use @ to mention)"
              />
              <Button size="sm" className="h-7 text-xs">Send</Button>
            </div>
          </div>
        </TabsContent>
      </div>
      </Tabs>
    </motion.div>
  )
}
