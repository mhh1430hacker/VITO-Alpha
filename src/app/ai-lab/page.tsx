'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  Brain, Activity, BarChart3, Clock, Database, FlaskConical,
  CheckCircle2, AlertCircle, Loader2, TrendingUp, Gauge,
  Server, Zap, RefreshCw, Play, StopCircle, Settings,
  ArrowUp, ArrowDown, Minus, Layers, Cpu, HardDrive,
  Network, Download, Upload,
} from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip, AreaChart, Area, Cell,
  PieChart, Pie, Legend,
} from 'recharts'

const modelStatuses = [
  { id: 'm1', name: 'Longevity Predictor', type: 'Regression', status: 'production' as const, accuracy: 94.2, latency: 23, version: 'v2.1.0', lastTraining: '2026-06-20', predictions: 12450 },
  { id: 'm2', name: 'IFRA Compliance Checker', type: 'Classification', status: 'production' as const, accuracy: 97.8, latency: 18, version: 'v1.8.3', lastTraining: '2026-06-18', predictions: 28300 },
  { id: 'm3', name: 'Ingredient Recommender', type: 'Ranking', status: 'staging' as const, accuracy: 89.5, latency: 45, version: 'v3.0.0', lastTraining: '2026-06-25', predictions: 5670 },
  { id: 'm4', name: 'Similarity Search', type: 'Embedding', status: 'production' as const, accuracy: 92.1, latency: 12, version: 'v1.5.2', lastTraining: '2026-06-15', predictions: 45200 },
  { id: 'm5', name: 'Cost Optimizer', type: 'Regression', status: 'development' as const, accuracy: 86.3, latency: 34, version: 'v0.9.0', lastTraining: '2026-06-28', predictions: 890 },
  { id: 'm6', name: 'Scent Profile Generator', type: 'Generation', status: 'development' as const, accuracy: 78.9, latency: 120, version: 'v0.4.0', lastTraining: '2026-06-27', predictions: 340 },
]

const accuracyTrend = [
  { date: 'Jun 1', overall: 88, longevity: 85, ifra: 93, recommendation: 82 },
  { date: 'Jun 5', overall: 89, longevity: 86, ifra: 94, recommendation: 83 },
  { date: 'Jun 10', overall: 90, longevity: 88, ifra: 95, recommendation: 84 },
  { date: 'Jun 15', overall: 91, longevity: 90, ifra: 96, recommendation: 85 },
  { date: 'Jun 20', overall: 92, longevity: 92, ifra: 97, recommendation: 87 },
  { date: 'Jun 25', overall: 91.5, longevity: 93, ifra: 97, recommendation: 86 },
  { date: 'Jun 28', overall: 91.8, longevity: 94, ifra: 98, recommendation: 87 },
]

const recentRuns = [
  { id: 'r1', model: 'IFRA Compliance Checker', status: 'completed' as const, duration: '2m 34s', records: 1240, accuracy: 97.8, date: '2 hours ago' },
  { id: 'r2', model: 'Longevity Predictor', status: 'completed' as const, duration: '1m 12s', records: 890, accuracy: 94.2, date: '3 hours ago' },
  { id: 'r3', model: 'Cost Optimizer', status: 'running' as const, duration: '--', records: 340, accuracy: null, date: 'Running' },
  { id: 'r4', model: 'Scent Profile Generator', status: 'failed' as const, duration: '45s', records: 50, accuracy: null, date: '1 day ago' },
  { id: 'r5', model: 'Ingredient Recommender', status: 'completed' as const, duration: '4m 20s', records: 2100, accuracy: 89.5, date: '1 day ago' },
]

const resourceUsage = [
  { name: 'CPU', usage: 62, color: '#8b5cf6' },
  { name: 'GPU', usage: 78, color: '#06b6d4' },
  { name: 'Memory', usage: 45, color: '#10b981' },
  { name: 'Storage', usage: 34, color: '#f59e0b' },
]

const trainingJobs = [
  { id: 't1', model: 'Longevity Predictor', status: 'completed' as const, epochs: 50, accuracy: 94.2, loss: 0.032, duration: '12m', date: 'Jun 20' },
  { id: 't2', model: 'Ingredient Recommender', status: 'training' as const, epochs: 23, accuracy: 87.1, loss: 0.089, duration: '8m 30s', date: 'In progress' },
  { id: 't3', model: 'Cost Optimizer', status: 'queued' as const, epochs: 0, accuracy: null, loss: null, duration: '--', date: 'Queued' },
  { id: 't4', model: 'Scent Profile Generator', status: 'failed' as const, epochs: 12, accuracy: 45.2, loss: 0.42, duration: '3m', date: 'Jun 27' },
]

export default function AILabPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="h-7 w-7" /> AI Lab
          </h1>
          <p className="text-muted-foreground mt-1">
            Central hub for model management, predictions, and training
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1.5" /> Refresh
          </Button>
          <Button size="sm">
            <Play className="h-4 w-4 mr-1.5" /> New Run
          </Button>
        </div>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Models', value: '6', icon: Cpu, color: 'text-purple-600', bg: 'bg-purple-100' },
          { label: 'Predictions (24h)', value: '24,580', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Avg Accuracy', value: '91.8%', icon: Gauge, color: 'text-green-600', bg: 'bg-green-100', trend: 'up' },
          { label: 'Training Jobs', value: '3', icon: Layers, color: 'text-orange-600', bg: 'bg-orange-100' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="p-4 flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', stat.bg)}>
                  <stat.icon className={cn('h-5 w-5', stat.color)} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview" className="gap-1.5">
            <BarChart3 className="h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="models" className="gap-1.5">
            <Database className="h-4 w-4" /> Models
          </TabsTrigger>
          <TabsTrigger value="training" className="gap-1.5">
            <FlaskConical className="h-4 w-4" /> Training
          </TabsTrigger>
          <TabsTrigger value="resources" className="gap-1.5">
            <Server className="h-4 w-4" /> Resources
          </TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          {/* Accuracy trend */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" /> Prediction Accuracy Trend
              </CardTitle>
              <CardDescription>7-day rolling average across all models</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={accuracyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[75, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="overall" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 3 }} name="Overall" />
                  <Line type="monotone" dataKey="longevity" stroke="#f59e0b" strokeWidth={1.5} dot={{ r: 2 }} strokeDasharray="4 4" name="Longevity" />
                  <Line type="monotone" dataKey="ifra" stroke="#10b981" strokeWidth={1.5} dot={{ r: 2 }} strokeDasharray="4 4" name="IFRA" />
                  <Line type="monotone" dataKey="recommendation" stroke="#06b6d4" strokeWidth={1.5} dot={{ r: 2 }} strokeDasharray="4 4" name="Recommendation" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            {/* Recent runs */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" /> Recent Runs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {recentRuns.map(run => (
                    <div key={run.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                      <div className="flex items-center gap-2">
                        {run.status === 'completed' ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : run.status === 'running' ? (
                          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        )}
                        <div>
                          <p className="font-medium text-xs">{run.model}</p>
                          <p className="text-[10px] text-muted-foreground">{run.records} records · {run.duration}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {run.accuracy !== null && (
                          <p className="text-xs font-mono font-medium">{run.accuracy}%</p>
                        )}
                        <p className="text-[10px] text-muted-foreground">{run.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Model breakdown pie */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Layers className="h-5 w-5" /> Model Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Production', value: 3, color: '#10b981' },
                        { name: 'Staging', value: 1, color: '#f59e0b' },
                        { name: 'Development', value: 2, color: '#8b5cf6' },
                      ]}
                      cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                      dataKey="value"
                    >
                      {[
                        { name: 'Production', value: 3, color: '#10b981' },
                        { name: 'Staging', value: 1, color: '#f59e0b' },
                        { name: 'Development', value: 2, color: '#8b5cf6' },
                      ].map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Models tab */}
        <TabsContent value="models" className="space-y-4 mt-4">
          <div className="grid gap-3">
            {modelStatuses.map((model, i) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'h-10 w-10 rounded-lg flex items-center justify-center',
                          model.status === 'production' ? 'bg-green-100' :
                          model.status === 'staging' ? 'bg-amber-100' : 'bg-purple-100',
                        )}>
                          <Brain className={cn(
                            'h-5 w-5',
                            model.status === 'production' ? 'text-green-700' :
                            model.status === 'staging' ? 'text-amber-700' : 'text-purple-700',
                          )} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{model.name}</p>
                            <Badge variant={
                              model.status === 'production' ? 'success' :
                              model.status === 'staging' ? 'warning' : 'secondary'
                            } className="text-[10px] h-4">
                              {model.status}
                            </Badge>
                            <Badge variant="outline" className="text-[10px] h-4 font-mono">{model.version}</Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                            <span>{model.type}</span>
                            <span>·</span>
                            <span>{model.predictions.toLocaleString()} predictions</span>
                            <span>·</span>
                            <span>Trained {model.lastTraining}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold">{model.accuracy}%</p>
                          <p className="text-[10px] text-muted-foreground">Accuracy</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{model.latency}ms</p>
                          <p className="text-[10px] text-muted-foreground">Latency</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Training tab */}
        <TabsContent value="training" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <FlaskConical className="h-5 w-5" /> Training Jobs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {trainingJobs.map(job => (
                  <div key={job.id} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      {job.status === 'completed' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : job.status === 'training' ? (
                        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                      ) : job.status === 'queued' ? (
                        <Clock className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{job.model}</p>
                        <p className="text-xs text-muted-foreground">
                          Epoch {job.epochs}/50 · {job.duration} · {job.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {job.accuracy !== null && (
                        <div className="text-right">
                          <p className="text-sm font-semibold font-mono">{job.accuracy}%</p>
                          <p className="text-[10px] text-muted-foreground">Accuracy</p>
                        </div>
                      )}
                      {job.loss !== null && (
                        <div className="text-right">
                          <p className="text-sm font-semibold font-mono">{job.loss}</p>
                          <p className="text-[10px] text-muted-foreground">Loss</p>
                        </div>
                      )}
                      {job.status === 'training' && (
                        <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                          <StopCircle className="h-3.5 w-3.5" /> Stop
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources tab */}
        <TabsContent value="resources" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            {resourceUsage.map((resource, i) => (
              <motion.div
                key={resource.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">{resource.name}</p>
                      <span className="text-lg font-bold">{resource.usage}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${resource.usage}%` }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: resource.color }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Server className="h-5 w-5" /> Infrastructure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'GPU Nodes', value: '4', sub: 'NVIDIA A100', icon: Cpu },
                  { label: 'CPU Cores', value: '48', sub: '3.2 GHz', icon: HardDrive },
                  { label: 'Storage', value: '2.4 TB', sub: 'NVMe SSD', icon: Database },
                ].map((item, i) => (
                  <div key={i} className="rounded-lg border p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                    </div>
                    <p className="text-lg font-bold">{item.value}</p>
                    <p className="text-[10px] text-muted-foreground">{item.sub}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
