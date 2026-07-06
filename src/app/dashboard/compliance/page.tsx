'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { dashboardAPI } from '@/lib/api'
import { KPICards } from '@/types'
import { ComplianceAlert, Formula } from '@/types/enterprise'
import { cn } from '@/lib/utils'
import {
  ShieldCheck, AlertTriangle, AlertCircle, Info, FileText,
  Calendar, Clock, CheckCircle2, RefreshCw, Scale, Ban
} from 'lucide-react'

interface RegulationChange {
  id: number
  regulation: string
  title: string
  effective_date: string
  description: string
}

interface CertificateExpiry {
  id: number
  name: string
  expiry_date: string
  category: string
}

const mockRegulationChanges: RegulationChange[] = [
  { id: 1, regulation: 'IFRA', title: 'IFRA 51st Amendment - New restrictions on Ambroxan', effective_date: '2026-09-15', description: 'Maximum concentration reduced to 0.5% in consumer products' },
  { id: 2, regulation: 'REACH', title: 'REACH SVHC Update - 4 new substances', effective_date: '2026-08-01', description: 'New substances added to candidate list for authorization' },
]

const mockCertificates: CertificateExpiry[] = [
  { id: 1, name: 'ISO 9001:2025', expiry_date: '2026-12-31', category: 'Quality' },
  { id: 2, name: 'IFRA Certificate', expiry_date: '2026-10-15', category: 'Compliance' },
  { id: 3, name: 'REACH Registration', expiry_date: '2026-07-20', category: 'Regulatory' },
  { id: 4, name: 'RSPO Certification', expiry_date: '2027-03-01', category: 'Sustainability' },
]

export default function ComplianceDashboard() {
  const [kpi, setKpi] = useState<KPICards | null>(null)
  const [pendingFormulas, setPendingFormulas] = useState<Formula[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [kpiRes, formulasRes] = await Promise.all([
        dashboardAPI.getKPI(),
        dashboardAPI.getFormulasByStatus(),
      ])
      const kpiData: KPICards = kpiRes.data
      const formulasByStatus: Record<string, Formula[]> = formulasRes.data

      setKpi(kpiData)
      setPendingFormulas(
        Object.values(formulasByStatus).flat().filter((f: Formula) => f.status === 'under_review')
      )
    } catch (err: any) {
      setError(err?.message || 'Failed to load compliance dashboard')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-lg font-medium text-red-600">Failed to load dashboard</div>
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button onClick={loadDashboard} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" /> Retry
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-8 p-6">
        <div className="h-24 bg-amber-50 border border-amber-200 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-5 w-32 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const complianceScore = kpi?.avg_compliance_score ?? 100
  const scoreColor =
    complianceScore >= 90
      ? { stroke: '#22c55e', text: 'text-green-600', bg: 'bg-green-50' }
      : complianceScore >= 70
        ? { stroke: '#eab308', text: 'text-yellow-600', bg: 'bg-yellow-50' }
        : { stroke: '#ef4444', text: 'text-red-600', bg: 'bg-red-50' }

  const hasViolations = complianceScore < 100
  const violationCount = Math.round(((100 - complianceScore) / 100) * (kpi?.total_formulas ?? 0))

  const upcomingExpiry = [...mockCertificates]
    .sort((a, b) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime())
    .slice(0, 5)

  const gaugeCircumference = 2 * Math.PI * 60
  const gaugeOffset = gaugeCircumference - (complianceScore / 100) * gaugeCircumference

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compliance Dashboard</h1>
          <p className="text-muted-foreground">Regulatory oversight and IFRA compliance monitoring</p>
        </div>
        <Badge variant={complianceScore >= 90 ? 'success' : complianceScore >= 70 ? 'warning' : 'destructive'} className="text-sm px-3 py-1">
          {complianceScore >= 90 ? 'All Clear' : complianceScore >= 70 ? 'Needs Attention' : 'Critical'}
        </Badge>
      </div>

      {hasViolations && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800">{violationCount} IFRA violation{violationCount > 1 ? 's' : ''} detected</p>
            <p className="text-xs text-red-600 mt-1">Immediate review required. Affected formulas need reformulation.</p>
          </div>
          <Button size="sm" variant="destructive" className="ml-auto shrink-0">Review Violations</Button>
        </div>
      )}

      {!hasViolations && (
        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-800">All formulas are IFRA compliant</p>
            <p className="text-xs text-green-600 mt-1">No violations found. Compliance status is up to date.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Score</CardTitle>
            <CardDescription>Overall IFRA & regulatory compliance</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative w-40 h-40 mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="60" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
                <circle
                  cx="70" cy="70" r="60"
                  fill="none"
                  stroke={scoreColor.stroke}
                  strokeWidth="10"
                  strokeDasharray={gaugeCircumference}
                  strokeDashoffset={gaugeOffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn('text-3xl font-bold', scoreColor.text)}>{complianceScore.toFixed(1)}%</span>
                <span className="text-xs text-muted-foreground mt-1">compliant</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-muted-foreground">Pass: {Math.round((complianceScore / 100) * (kpi?.total_formulas ?? 0))}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-muted-foreground">Fail: {violationCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>IFRA Violation Status</CardTitle>
            <CardDescription>By severity level</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span>Compliant</span>
                </div>
                <span className="font-medium">{Math.round((complianceScore / 100) * (kpi?.total_formulas ?? 0))}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${complianceScore}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <span>Warning</span>
                </div>
                <span className="font-medium">0</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '0%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span>Critical</span>
                </div>
                <span className="font-medium">{violationCount}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${100 - complianceScore}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Certificate Expiry</CardTitle>
            <CardDescription>Upcoming renewals</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingExpiry.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-muted-foreground">No upcoming expirations</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingExpiry.map((cert) => {
                  const daysLeft = Math.ceil(
                    (new Date(cert.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                  )
                  return (
                    <div key={cert.id} className="flex items-center justify-between p-2.5 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{cert.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {new Date(cert.expiry_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Badge variant={daysLeft <= 90 ? 'destructive' : daysLeft <= 180 ? 'warning' : 'success'}>
                        {daysLeft <= 0 ? 'Expired' : `${daysLeft}d`}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pending Reviews</CardTitle>
            <CardDescription>Formulas requiring compliance sign-off</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingFormulas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Scale className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-muted-foreground">No pending reviews</p>
                <p className="text-xs text-muted-foreground">All formulas have been reviewed for compliance</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingFormulas.map((f) => (
                  <div key={f.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{f.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        v{f.version} &middot; {new Date(f.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" /> Review
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Regulation Changes</CardTitle>
            <CardDescription>Updates affecting your formulations</CardDescription>
          </CardHeader>
          <CardContent>
            {mockRegulationChanges.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ShieldCheck className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-muted-foreground">No recent changes</p>
              </div>
            ) : (
              <div className="space-y-3">
                {mockRegulationChanges.map((reg) => (
                  <div key={reg.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className="text-xs">{reg.regulation}</Badge>
                      <span className="text-xs text-muted-foreground">
                        Effective {new Date(reg.effective_date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium mt-1">{reg.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{reg.description}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
