'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import {
  Brain, Loader2, AlertCircle, FlaskConical, Plus, RotateCw,
  Rocket, Undo2, Archive, Tag, CheckCircle, XCircle, Eye, Ban,
  GitBranch, BarChart3, Clock, History, ArrowUpDown, Layers,
  Upload, Download, Search, Server, ThumbsUp, ChevronLeft,
  FileDigit, Activity, Box, GitFork,
} from 'lucide-react'
import {
  modelRegistryAPI,
  RegisteredModel,
  ModelVersion,
  ModelTag,
  CompareResponse,
  LineageGraph,
  LineageNode,
  AuditEntry,
} from '@/lib/model_registry_api'

const STAGE_CONFIG: Record<string, { variant: 'success' | 'secondary' | 'destructive' | 'warning' | 'outline'; label: string }> = {
  production: { variant: 'success', label: 'Production' },
  staging: { variant: 'warning', label: 'Staging' },
  development: { variant: 'secondary', label: 'Development' },
  archived: { variant: 'destructive', label: 'Archived' },
}

const TASK_TYPE_COLORS: Record<string, string> = {
  regression: 'bg-blue-100 text-blue-800',
  classification: 'bg-purple-100 text-purple-800',
  clustering: 'bg-green-100 text-green-800',
  embedding: 'bg-orange-100 text-orange-800',
  generation: 'bg-pink-100 text-pink-800',
  ranking: 'bg-teal-100 text-teal-800',
}

function formatBytes(bytes?: number): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDuration(seconds?: number): string {
  if (!seconds) return '—'
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
}

export default function ModelRegistryPage() {
  const [models, setModels] = useState<RegisteredModel[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedModel, setSelectedModel] = useState<RegisteredModel | null>(null)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [compareResult, setCompareResult] = useState<CompareResponse | null>(null)
  const [lineage, setLineage] = useState<LineageGraph | null>(null)
  const [lineageLoading, setLineageLoading] = useState(false)
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([])
  const [auditTotal, setAuditTotal] = useState(0)
  const [auditPage, setAuditPage] = useState<number>(1)

  const fetchModels = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await modelRegistryAPI.list({ page, page_size: 20, search: search || undefined })
      setModels(res.data.models)
      setTotal(res.data.total)
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to load models')
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => { fetchModels() }, [fetchModels])

  const fetchLineage = useCallback(async (modelId: string) => {
    setLineageLoading(true)
    try {
      const res = await modelRegistryAPI.getLineage(modelId)
      setLineage(res.data)
    } catch {
      setLineage(null)
    } finally {
      setLineageLoading(false)
    }
  }, [])

  const fetchAuditTrail = useCallback(async (modelId: string) => {
    try {
      const res = await modelRegistryAPI.getAuditTrail(modelId, auditPage)
      setAuditTrail(res.data.entries)
      setAuditTotal(res.data.total)
    } catch {
      setAuditTrail([])
    }
  }, [auditPage])

  const handleAction = async (
    action: string,
    fn: () => Promise<any>,
    modelId: string,
  ) => {
    setActionLoading(`${action}-${modelId}`)
    try {
      await fn()
      await fetchModels()
      if (selectedModel?.model_id === modelId) {
        const updated = await modelRegistryAPI.get(modelId)
        setSelectedModel(updated.data)
      }
    } catch (err: any) {
      alert(err?.response?.data?.detail || `${action} failed`)
    } finally {
      setActionLoading(null)
    }
  }

  const selectModel = async (model: RegisteredModel) => {
    setSelectedModel(model)
    setActiveTab('overview')
    setCompareResult(null)
    fetchLineage(model.model_id)
    fetchAuditTrail(model.model_id)
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <p className="text-lg font-medium">Failed to load model registry</p>
            <p className="text-sm text-muted-foreground text-center">{error}</p>
            <Button variant="outline" onClick={fetchModels}>
              <RotateCw className="mr-2 h-4 w-4" /> Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="h-7 w-7" /> Model Registry
          </h1>
          <p className="text-muted-foreground mt-1">
            Central source of truth for every AI capability inside VITO
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => modelRegistryAPI.list().then(() => window.open('/docs', '_blank'))}>
            <Server className="mr-2 h-4 w-4" /> API
          </Button>
          <Button onClick={() => setRegisterOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Register Model
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          className="w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Search models by name, ID, or description..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        />
      </div>

      {selectedModel ? (
        /* Detail View */
        <DetailView
          model={selectedModel}
          onBack={() => { setSelectedModel(null); setCompareResult(null); setLineage(null) }}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          actionLoading={actionLoading}
          handleAction={handleAction}
          compareResult={compareResult}
          setCompareResult={setCompareResult}
          lineage={lineage}
          lineageLoading={lineageLoading}
          auditTrail={auditTrail}
          auditTotal={auditTotal}
          auditPage={auditPage}
          setAuditPage={setAuditPage}
          fetchAuditTrail={fetchAuditTrail}
        />
      ) : (
        /* List View */
        <>
          {loading ? (
            <div className="flex items-center justify-center h-[40vh]">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Loading model registry...</p>
              </div>
            </div>
          ) : models.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-4 pt-10 pb-10">
                <FlaskConical className="h-16 w-16 text-muted-foreground/40" />
                <p className="text-lg font-medium">No models registered</p>
                <p className="text-sm text-muted-foreground">
                  Register your first ML model to make it the central source of truth.
                </p>
                <Button onClick={() => setRegisterOpen(true)}>
                  <Brain className="mr-2 h-4 w-4" /> Register Model
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model</TableHead>
                      <TableHead>Task</TableHead>
                      <TableHead>Versions</TableHead>
                      <TableHead>Production</TableHead>
                      <TableHead>Staging</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {models.map((model) => {
                      const prod = model.versions.find(v => v.stage === 'production')
                      const staging = model.versions.find(v => v.stage === 'staging')
                      return (
                        <TableRow
                          key={model.id}
                          className="cursor-pointer"
                          onClick={() => selectModel(model)}
                        >
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{model.name}</span>
                              <span className="text-xs text-muted-foreground font-mono">{model.model_id}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={cn(
                              'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                              TASK_TYPE_COLORS[model.task_type] || 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                            )}>
                              {model.task_type}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{model.versions.length}</Badge>
                          </TableCell>
                          <TableCell>
                            {prod ? (
                              <Badge variant="success" className="font-mono text-xs">
                                v{prod.semantic_version}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {staging ? (
                              <Badge variant="warning" className="font-mono text-xs">
                                v{staging.semantic_version}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">{model.owner || '—'}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {model.updated_at
                              ? new Date(model.updated_at).toLocaleDateString()
                              : new Date(model.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost" size="sm"
                              onClick={(e) => { e.stopPropagation(); selectModel(model) }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
              {total > 20 && (
                <CardFooter className="justify-between border-t px-6 py-3">
                  <span className="text-sm text-muted-foreground">{total} model{total !== 1 ? 's' : ''}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled={page * 20 >= total} onClick={() => setPage(p => p + 1)}>
                      Next
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          )}
        </>
      )}

      {/* Register Modal */}
      {registerOpen && (
        <RegisterModelModal
          onClose={() => setRegisterOpen(false)}
          onRegistered={() => { setRegisterOpen(false); fetchModels() }}
        />
      )}
    </div>
  )
}

/* ─── Detail View ─── */
function DetailView({
  model, onBack, activeTab, setActiveTab, actionLoading, handleAction,
  compareResult, setCompareResult, lineage, lineageLoading,
  auditTrail, auditTotal, auditPage, setAuditPage, fetchAuditTrail,
}: {
  model: RegisteredModel; onBack: () => void; activeTab: string; setActiveTab: (t: string) => void;
  actionLoading: string | null; handleAction: (a: string, fn: () => Promise<any>, id: string) => Promise<void>;
  compareResult: CompareResponse | null; setCompareResult: (r: CompareResponse | null) => void;
  lineage: LineageGraph | null; lineageLoading: boolean;
  auditTrail: AuditEntry[]; auditTotal: number; auditPage: number;
  setAuditPage: React.Dispatch<React.SetStateAction<number>>; fetchAuditTrail: (id: string) => Promise<void>;
}) {
  const prodVersion = model.versions.find(v => v.stage === 'production')
  const latestVersion = model.versions[0]
  const [compareA, setCompareA] = useState('')
  const [compareB, setCompareB] = useState('')

  const handlePromote = async (version: string, target: string) => {
    await handleAction('promote', () =>
      modelRegistryAPI.promote({ model_id: model.model_id, version, target_stage: target as any }),
      model.model_id
    )
  }

  const handleRollback = async (targetVersion: string) => {
    await handleAction('rollback', () =>
      modelRegistryAPI.rollback({ model_id: model.model_id, target_version: targetVersion }),
      model.model_id
    )
  }

  const handleCompare = async () => {
    if (!compareA || !compareB) return
    try {
      const res = await modelRegistryAPI.compare({ model_id: model.model_id, version_a: compareA, version_b: compareB })
      setCompareResult(res.data)
    } catch (err: any) {
      alert(err?.response?.data?.detail || 'Compare failed')
    }
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-0 h-auto">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Registry
        </Button>
        <span>/</span>
        <span className="font-medium text-foreground">{model.name}</span>
      </div>

      {/* Model Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" /> {model.name}
                <Badge variant={model.is_active ? 'success' : 'secondary'}>
                  {model.is_active ? 'Active' : 'Archived'}
                </Badge>
              </CardTitle>
              <CardDescription className="mt-1">
                <span className="font-mono text-xs">{model.model_id}</span>
                {' '}&middot;{' '}
                <span className={cn(
                  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                  TASK_TYPE_COLORS[model.task_type] || ''
                )}>
                  {model.task_type}
                </span>
                {' '}&middot;{' '}
                <span className="text-xs">{model.framework}</span>
              </CardDescription>
              {model.description && (
                <p className="text-sm text-muted-foreground mt-2">{model.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {model.tags?.map(tag => (
                <Badge key={tag.id} variant="outline" className="text-xs">
                  {tag.key}: {tag.value}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Versions</p>
              <p className="font-semibold text-lg">{model.versions.length}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Production</p>
              <p className="font-semibold text-lg">
                {prodVersion ? (
                  <Badge variant="success" className="text-sm font-mono">v{prodVersion.semantic_version}</Badge>
                ) : '—'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Owner</p>
              <p className="font-semibold">{model.owner || '—'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Created</p>
              <p className="font-semibold">{new Date(model.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview"><Eye className="h-4 w-4 mr-2" />Overview</TabsTrigger>
          <TabsTrigger value="versions"><Layers className="h-4 w-4 mr-2" />Versions</TabsTrigger>
          <TabsTrigger value="compare"><ArrowUpDown className="h-4 w-4 mr-2" />Compare</TabsTrigger>
          <TabsTrigger value="lineage"><GitBranch className="h-4 w-4 mr-2" />Lineage</TabsTrigger>
          <TabsTrigger value="audit"><Clock className="h-4 w-4 mr-2" />Audit Trail</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {latestVersion && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5" /> Latest Version v{latestVersion.semantic_version}
                </CardTitle>
                <CardDescription>
                  Stage: <Badge variant={STAGE_CONFIG[latestVersion.stage]?.variant || 'secondary'}>
                    {STAGE_CONFIG[latestVersion.stage]?.label || latestVersion.stage}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {latestVersion.metrics && Object.entries(latestVersion.metrics).slice(0, 8).map(([key, val]) => (
                    <div key={key}>
                      <p className="text-xs text-muted-foreground uppercase">{key}</p>
                      <p className="text-lg font-semibold">
                        {typeof val === 'number' ? val.toFixed(4) : String(val)}
                      </p>
                    </div>
                  ))}
                </div>
                {latestVersion.hyperparameters && Object.keys(latestVersion.hyperparameters).length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Hyperparameters</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(latestVersion.hyperparameters).map(([k, v]) => (
                        <Badge key={k} variant="outline" className="text-xs font-mono">
                          {k}={String(v)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {(latestVersion.dataset_name || latestVersion.experiment_name) && (
                  <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
                    {latestVersion.dataset_name && (
                      <span><strong>Dataset:</strong> {latestVersion.dataset_name}{latestVersion.dataset_version ? ` v${latestVersion.dataset_version}` : ''}</span>
                    )}
                    {latestVersion.experiment_name && (
                      <span><strong>Experiment:</strong> {latestVersion.experiment_name}</span>
                    )}
                    {latestVersion.training_duration_seconds && (
                      <span><strong>Duration:</strong> {formatDuration(latestVersion.training_duration_seconds)}</span>
                    )}
                    {latestVersion.model_file_size_bytes && (
                      <span><strong>Size:</strong> {formatBytes(latestVersion.model_file_size_bytes)}</span>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="gap-2">
                {latestVersion.stage === 'development' && (
                  <Button size="sm" onClick={() => handlePromote(latestVersion.semantic_version, 'staging')}
                    disabled={actionLoading === `promote-${model.model_id}`}>
                    {actionLoading === `promote-${model.model_id}` ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Rocket className="mr-2 h-4 w-4" />}
                    Promote to Staging
                  </Button>
                )}
                {latestVersion.stage === 'staging' && (
                  <Button size="sm" onClick={() => handlePromote(latestVersion.semantic_version, 'production')}
                    disabled={actionLoading === `promote-${model.model_id}`}>
                    <Rocket className="mr-2 h-4 w-4" /> Promote to Production
                  </Button>
                )}
              </CardFooter>
            </Card>
          )}

          {/* Approval summary */}
          {latestVersion?.approvals && latestVersion.approvals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5" /> Approvals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {latestVersion.approvals.map(approval => (
                    <div key={approval.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                      <div className="flex items-center gap-2">
                        {approval.status === 'approved' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : approval.status === 'rejected' ? (
                          <XCircle className="h-4 w-4 text-red-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        )}
                        <span className="text-sm">
                          {approval.reviewer_name || `Reviewer #${approval.reviewer_id}`}
                        </span>
                        {approval.comments && (
                          <span className="text-xs text-muted-foreground">— {approval.comments}</span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {approval.reviewed_at ? new Date(approval.reviewed_at).toLocaleString() : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Versions Tab */}
        <TabsContent value="versions" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Metrics</TableHead>
                    <TableHead>Dataset</TableHead>
                    <TableHead>Experiment</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {model.versions.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell>
                        <span className="font-mono font-medium">v{v.semantic_version}</span>
                        {v.version_number === 1 && (
                          <Badge variant="outline" className="ml-2 text-[10px]">initial</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={STAGE_CONFIG[v.stage]?.variant || 'secondary'}
                          className={v.stage === 'production' ? 'animate-pulse' : ''}>
                          {STAGE_CONFIG[v.stage]?.label || v.stage}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {v.metrics && Object.keys(v.metrics).length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {Object.entries(v.metrics).slice(0, 3).map(([k, val]) => (
                              <span key={k} className="text-xs bg-muted rounded px-1 py-0.5 font-mono">
                                {k}: {typeof val === 'number' ? val.toFixed(3) : String(val)}
                              </span>
                            ))}
                          </div>
                        ) : '—'}
                      </TableCell>
                      <TableCell className="text-sm">{v.dataset_name || '—'}</TableCell>
                      <TableCell className="text-sm">{v.experiment_name || '—'}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(v.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {v.stage === 'development' && (
                            <Button variant="ghost" size="sm" title="Promote to Staging"
                              disabled={actionLoading === `promote-${model.model_id}`}
                              onClick={() => handlePromote(v.semantic_version, 'staging')}>
                              <Rocket className="h-4 w-4 text-yellow-600" />
                            </Button>
                          )}
                          {v.stage === 'staging' && (
                            <Button variant="ghost" size="sm" title="Promote to Production"
                              disabled={actionLoading === `promote-${model.model_id}`}
                              onClick={() => handlePromote(v.semantic_version, 'production')}>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          {v.stage === 'production' && model.versions.filter(x => x.stage !== 'archived').length > 1 && (
                            <Button variant="ghost" size="sm" title="Rollback"
                              disabled={actionLoading === `rollback-${model.model_id}`}
                              onClick={() => handleRollback(v.semantic_version)}>
                              <Undo2 className="h-4 w-4 text-orange-600" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" title="Archive"
                            disabled={actionLoading === `archive-${model.model_id}`}
                            onClick={() => handleAction('archive', () =>
                              modelRegistryAPI.archive({ model_id: model.model_id, version: v.semantic_version }),
                              model.model_id
                            )}>
                            <Archive className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compare Tab */}
        <TabsContent value="compare" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5" /> Compare Versions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-4">
                <div>
                  <label className="text-sm font-medium">Version A</label>
                  <select className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                    value={compareA} onChange={e => setCompareA(e.target.value)}>
                    <option value="">Select...</option>
                    {model.versions.map(v => (
                      <option key={v.id} value={v.semantic_version}>v{v.semantic_version}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Version B</label>
                  <select className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                    value={compareB} onChange={e => setCompareB(e.target.value)}>
                    <option value="">Select...</option>
                    {model.versions.map(v => (
                      <option key={v.id} value={v.semantic_version}>v{v.semantic_version}</option>
                    ))}
                  </select>
                </div>
                <Button onClick={handleCompare} disabled={!compareA || !compareB}>
                  <BarChart3 className="mr-2 h-4 w-4" /> Compare
                </Button>
              </div>
            </CardContent>
          </Card>

          {compareResult && (
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(compareResult.metric_diffs).filter(([_, v]) => v !== null).map(([metric, diff]) => (
                <Card key={metric}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium uppercase text-muted-foreground">{metric}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">A</p>
                        <p className="text-lg font-semibold">
                          {compareResult.version_a.metrics?.[metric]?.toFixed(4) ?? '—'}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">B</p>
                        <p className="text-lg font-semibold">
                          {compareResult.version_b.metrics?.[metric]?.toFixed(4) ?? '—'}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Diff</p>
                        <p className={cn(
                          'text-lg font-semibold',
                          (diff as number) > 0 ? 'text-green-600' : (diff as number) < 0 ? 'text-red-600' : ''
                        )}>
                          {(diff as number) > 0 ? '+' : ''}{(diff as number)?.toFixed(4) ?? '—'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Lineage Tab */}
        <TabsContent value="lineage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <GitBranch className="h-5 w-5" /> Model Lineage
              </CardTitle>
              <CardDescription>
                Trace data sources, experiments, and version ancestry
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lineageLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : lineage && lineage.nodes.length > 0 ? (
                <div className="space-y-3">
                  {lineage.nodes.map(node => (
                    <div key={node.id} className="flex items-center gap-3 border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                      <div className={cn(
                        'h-8 w-8 rounded-full flex items-center justify-center shrink-0',
                        node.type === 'model' ? 'bg-purple-100 text-purple-700' :
                        node.type === 'version' ? 'bg-blue-100 text-blue-700' :
                        node.type === 'dataset' ? 'bg-green-100 text-green-700' :
                        node.type === 'experiment' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 dark:bg-gray-800 text-gray-700'
                      )}>
                        {node.type === 'model' ? <Brain className="h-4 w-4" /> :
                         node.type === 'version' ? <FileDigit className="h-4 w-4" /> :
                         node.type === 'dataset' ? <Box className="h-4 w-4" /> :
                         node.type === 'experiment' ? <FlaskConical className="h-4 w-4" /> :
                         <GitFork className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{node.label}</p>
                        <p className="text-xs text-muted-foreground font-mono">{node.id}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] uppercase">{node.type}</Badge>
                    </div>
                  ))}

                  {/* Edges */}
                  {lineage.edges.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Relationships</p>
                      <div className="space-y-1">
                        {lineage.edges.map((edge, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-mono">{edge.source.split(':')[1]}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-muted">{edge.type}</span>
                            <span className="font-mono">{edge.target.split(':')[1]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground">
                  <GitBranch className="h-8 w-8" />
                  <p className="text-sm">No lineage data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Trail Tab */}
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditTrail.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No audit entries
                      </TableCell>
                    </TableRow>
                  ) : (
                    auditTrail.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <Badge variant={
                            entry.action.includes('approve') || entry.action.includes('deploy_completed') ? 'success' :
                            entry.action.includes('reject') || entry.action.includes('deploy_failed') ? 'destructive' :
                            entry.action.includes('deploy') ? 'warning' : 'secondary'
                          } className="text-[10px] uppercase">
                            {entry.action.replace(/_/g, ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">v{entry.version}</TableCell>
                        <TableCell className="text-sm">{entry.actor || 'system'}</TableCell>
                        <TableCell className="text-sm max-w-[200px] truncate">
                          {entry.details ? JSON.stringify(entry.details).slice(0, 60) : '—'}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : '—'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            {auditTotal > 50 && (
              <CardFooter className="justify-between border-t px-6 py-3">
                <span className="text-sm text-muted-foreground">{auditTotal} entries</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={auditPage <= 1}
                    onClick={() => setAuditPage(p => p - 1)}>Previous</Button>
                  <Button variant="outline" size="sm" disabled={auditPage * 50 >= auditTotal}
                    onClick={() => setAuditPage(p => p + 1)}>Next</Button>
                </div>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

/* ─── Register Modal ─── */
function RegisterModelModal({ onClose, onRegistered }: { onClose: () => void; onRegistered: () => void }) {
  const [form, setForm] = useState({
    model_id: '', name: '', description: '', task_type: 'regression',
    framework: 'pytorch', owner: '', version: '1.0.0',
    dataset_name: '', experiment_name: '', run_id: '',
  })
  const [tags, setTags] = useState<{ key: string; value: string }[]>([])
  const [metrics, setMetrics] = useState('')
  const [hyperparameters, setHyperparameters] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!form.model_id || !form.name) {
      setError('Model ID and Name are required')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      let parsedMetrics: Record<string, any> | undefined
      let parsedHyperparams: Record<string, any> | undefined
      try { if (metrics) parsedMetrics = JSON.parse(metrics) } catch { setError('Invalid metrics JSON'); setSubmitting(false); return }
      try { if (hyperparameters) parsedHyperparams = JSON.parse(hyperparameters) } catch { setError('Invalid hyperparameters JSON'); setSubmitting(false); return }

      await modelRegistryAPI.register({
        ...form,
        metrics: parsedMetrics,
        hyperparameters: parsedHyperparams,
        tags: tags.filter(t => t.key),
      })
      onRegistered()
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" /> Register Model
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}><XCircle className="h-4 w-4" /></Button>
          </div>
          <CardDescription>Register a new ML model or a new version of an existing model</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Model ID *</label>
              <input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="quality-net-v2" value={form.model_id}
                onChange={e => setForm(f => ({ ...f, model_id: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Name *</label>
              <input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="QualityNet v2" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="col-span-2 space-y-1">
              <label className="text-sm font-medium">Description</label>
              <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                rows={2} placeholder="Model description..." value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Task Type</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.task_type} onChange={e => setForm(f => ({ ...f, task_type: e.target.value }))}>
                <option value="regression">Regression</option>
                <option value="classification">Classification</option>
                <option value="clustering">Clustering</option>
                <option value="embedding">Embedding</option>
                <option value="generation">Generation</option>
                <option value="ranking">Ranking</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Framework</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.framework} onChange={e => setForm(f => ({ ...f, framework: e.target.value }))}>
                <option value="pytorch">PyTorch</option>
                <option value="tensorflow">TensorFlow</option>
                <option value="sklearn">Scikit-Learn</option>
                <option value="xgboost">XGBoost</option>
                <option value="lightgbm">LightGBM</option>
                <option value="catboost">CatBoost</option>
                <option value="transformers">Transformers</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Owner</label>
              <input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Team or user name" value={form.owner}
                onChange={e => setForm(f => ({ ...f, owner: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Version</label>
              <input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                placeholder="1.0.0" value={form.version}
                onChange={e => setForm(f => ({ ...f, version: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Dataset</label>
              <input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="FragranceDB-v3" value={form.dataset_name}
                onChange={e => setForm(f => ({ ...f, dataset_name: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Experiment</label>
              <input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="experiment-name" value={form.experiment_name}
                onChange={e => setForm(f => ({ ...f, experiment_name: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Run ID</label>
              <input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                placeholder="mlflow-run-id" value={form.run_id}
                onChange={e => setForm(f => ({ ...f, run_id: e.target.value }))} />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium mb-2 block">Tags</label>
            <div className="space-y-2">
              {tags.map((tag, i) => (
                <div key={i} className="flex gap-2">
                  <input className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                    placeholder="key" value={tag.key}
                    onChange={e => {
                      const newTags = [...tags]; newTags[i] = { ...newTags[i], key: e.target.value }; setTags(newTags)
                    }} />
                  <input className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="value" value={tag.value}
                    onChange={e => {
                      const newTags = [...tags]; newTags[i] = { ...newTags[i], value: e.target.value }; setTags(newTags)
                    }} />
                  <Button variant="ghost" size="sm" onClick={() => setTags(tags.filter((_, j) => j !== i))}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setTags([...tags, { key: '', value: '' }])}>
                <Tag className="mr-2 h-4 w-4" /> Add Tag
              </Button>
            </div>
          </div>

          {/* Metrics & Hyperparameters */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Metrics (JSON)</label>
              <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                rows={4} placeholder='{"accuracy": 0.94, "f1_score": 0.92}' value={metrics}
                onChange={e => setMetrics(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Hyperparameters (JSON)</label>
              <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                rows={4} placeholder='{"lr": 0.001, "batch_size": 64}' value={hyperparameters}
                onChange={e => setHyperparameters(e.target.value)} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
            Register Model
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
