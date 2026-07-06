'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles, ArrowRight, Building2, Users, FolderKanban, Package,
  Brain, FileText, Play, Download, RefreshCw, Zap, CheckCircle,
  ArrowLeft,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface PreviewData {
  company: any
  departments: { name: string; employees: number }[]
  employees: { sample: any[]; total: number }
  projects: { sample: any[]; total: number }
  materials: { sample: any[]; total: number }
  predictions_estimate: string
  reports_estimate: string
}

export default function DemoGeneratorPage() {
  const router = useRouter()
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [preview, setPreview] = useState<PreviewData | null>(null)
  const [loading, setLoading] = useState(false)
  const stats = {
    employees: 42, departments: 7, projects: 18,
    materials: 640, predictions: 1200, reports: 380,
  }

  const fetchPreview = async () => {
    setLoading(true)
    try {
      const r = await fetch('http://localhost:8000/api/v1/demo/generate-company/preview?employee_count=42&department_count=7&project_count=18&material_count=640')
      const d = await r.json()
      setPreview(d)
    } catch {}
    setLoading(false)
  }

  const generate = async () => {
    setGenerating(true)
    try {
      await fetch('http://localhost:8000/api/v1/demo/generate-company', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_name: 'Maison Aurum', employee_count: 42, department_count: 7, project_count: 18, material_count: 640, prediction_count: 1200, report_count: 380 }),
      })
      setGenerated(true)
    } catch {}
    setGenerating(false)
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-semibold text-foreground flex items-center gap-3">
            <Building2 className="h-6 w-6 text-amber-400" />
            Demo Company Generator
          </h1>
          <p className="text-muted-foreground/50 text-[13px] mt-1">Generate synthetic enterprise data for demonstration</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push('/explorer')} className="text-[12px] text-muted-foreground">
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Explorer
          </Button>
        </div>
      </div>

      {!generated && !preview && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="shadow-elevation-3">
            <CardHeader>
              <CardTitle className="text-xl">Maison Aurum</CardTitle>
              <CardDescription className="text-[13px]">Luxury Fragrance House — Grasse, France</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                {[
                  { label: 'Employees', value: stats.employees, icon: Users, color: 'text-violet-400' },
                  { label: 'Departments', value: stats.departments, icon: Building2, color: 'text-amber-400' },
                  { label: 'Projects', value: stats.projects, icon: FolderKanban, color: 'text-teal-400' },
                  { label: 'Materials', value: stats.materials, icon: Package, color: 'text-emerald-400' },
                  { label: 'Predictions', value: stats.predictions, icon: Brain, color: 'text-blue-400' },
                  { label: 'Reports', value: stats.reports, icon: FileText, color: 'text-rose-400' },
                ].map((m) => (
                  <div key={m.label} className="p-4 rounded-xl bg-white/[0.02] border border-border/40 text-center">
                    <m.icon className={`h-5 w-5 ${m.color} mx-auto mb-2`} />
                    <p className="text-2xl font-bold text-foreground">{m.value.toLocaleString()}</p>
                    <p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground/40">{m.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Button onClick={fetchPreview} disabled={loading} className="bg-violet-500 hover:bg-violet-600 text-white font-medium">
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  Preview Data
                </Button>
                <Button onClick={generate} disabled={generating} className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-medium">
                  {generating ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
                  Generate Full Company
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {preview && !generated && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-[15px]">Departments ({preview.departments.length})</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {preview.departments.map((d: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.01] border border-border/40">
                      <span className="text-[13px] text-foreground">{d.name}</span>
                      <span className="text-[11px] text-muted-foreground/50">{d.employees} members</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-[15px]">Employees ({preview.employees.total})</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {preview.employees.sample.map((e: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.01] border border-border/40">
                      <div>
                        <p className="text-[13px] text-foreground font-medium">{e.name}</p>
                        <p className="text-[11px] text-muted-foreground/40">{e.role}</p>
                      </div>
                      <span className="text-[11px] text-muted-foreground/40">{e.department}</span>
                    </div>
                  ))}
                  {preview.employees.total > preview.employees.sample.length && (
                    <p className="text-center text-[12px] text-muted-foreground/30 py-2">
                      +{preview.employees.total - preview.employees.sample.length} more employees
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-[15px]">Projects ({preview.projects.total})</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-1.5">
                  {preview.projects.sample.slice(0, 8).map((p: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-[12px] py-1">
                      <span className="text-muted-foreground">{p.name}</span>
                      <Badge variant="outline" className="text-[10px]">{p.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-[15px]">Materials ({preview.materials.total})</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-1.5">
                  {preview.materials.sample.slice(0, 8).map((m: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-[12px] py-1">
                      <span className="text-muted-foreground">{m.name}</span>
                      <span className="text-muted-foreground/40">€{m.cost}/kg</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-[15px]">Data Scale</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-[11px] text-muted-foreground/40 mb-1">Predictions</p>
                    <p className="text-lg font-bold text-violet-400">{preview.predictions_estimate}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground/40 mb-1">Reports</p>
                    <p className="text-lg font-bold text-rose-400">{preview.reports_estimate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex gap-3">
            <Button onClick={generate} disabled={generating} className="bg-gradient-to-r from-violet-500 to-violet-600 text-white font-medium">
              {generating ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
              Generate Full Company
            </Button>
          </div>
        </motion.div>
      )}

      {generated && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
          <Card className="shadow-elevation-3 text-center">
            <CardContent className="p-12">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6 }}
                className="inline-flex p-4 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl mb-6 shadow-lg shadow-violet-500/20">
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">Maison Aurum Generated</h2>
              <p className="text-muted-foreground/50 mb-8">
                {stats.employees} employees · {stats.departments} departments · {stats.projects} projects · {stats.materials} materials · {stats.predictions} predictions · {stats.reports} reports
              </p>
              <div className="flex justify-center gap-3">
                <Button onClick={() => router.push('/dashboard')} className="bg-violet-500 hover:bg-violet-600 text-white">
                  View Dashboard <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button onClick={() => { setGenerated(false); setPreview(null) }} variant="outline" className="border-border/60">
                  Generate Another
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
