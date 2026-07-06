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
  Rocket, Play, Square, Pause, BarChart3, Clock, History,
  Layers, FileDigit, Box, GitBranch, Activity, Server,
  Settings, Calendar, Database, Eye, ChevronLeft, Search,
  ArrowUpDown, Terminal, CheckCircle, XCircle, SkipForward,
  Gauge, Cpu, HardDrive,
} from 'lucide-react'
import {
  trainingAPI,
  TrainingJob,
  TrainingJobSummary,
  TrainingQueueEntry,
  TrainingRun,
  TrainingMetric,
  TrainingLog,
  TrainingArtifact,
  TrainingCheckpoint,
  TrainingResource,
  TrainingSchedule,
  ExperimentInfo,
  ExperimentComparison,
  PromoteToRegistryResult,
} from '@/lib/training_api'

const STATUS_CONFIG: Record<string, { variant: 'success' | 'secondary' | 'destructive' | 'warning' | 'outline' | 'default'; label: string }> = {
  completed: { variant: 'success', label: 'Completed' },
  running: { variant: 'warning', label: 'Running' },
  failed: { variant: 'destructive', label: 'Failed' },
  cancelled: { variant: 'secondary', label: 'Cancelled' },
  pending: { variant: 'outline', label: 'Pending' },
  queued: { variant: 'outline', label: 'Queued' },
  scheduled: { variant: 'outline', label: 'Scheduled' },
  paused: { variant: 'secondary', label: 'Paused' },
  retrying: { variant: 'warning', label: 'Retrying' },
  archived: { variant: 'secondary', label: 'Archived' },
}

const PRIORITY_CONFIG: Record<string, string> = {
  critical: 'bg-red-100 text-red-800',
  high: 'bg-orange-100 text-orange-800',
  normal: 'bg-blue-100 text-blue-800',
  low: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
}

function formatDuration(seconds?: number): string {
  if (!seconds) return '—'
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
}

function formatBytes(bytes?: number): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function TrainingOrchestrationPage() {
  const [jobs, setJobs] = useState<TrainingJob[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedJob, setSelectedJob] = useState<TrainingJob | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [summary, setSummary] = useState<TrainingJobSummary | null>(null)
  const [startOpen, setStartOpen] = useState(false)

  const [metrics, setMetrics] = useState<TrainingMetric[]>([])
  const [logs, setLogs] = useState<TrainingLog[]>([])
  const [artifacts, setArtifacts] = useState<TrainingArtifact[]>([])
  const [checkpoints, setCheckpoints] = useState<TrainingCheckpoint[]>([])
  const [runs, setRuns] = useState<TrainingRun[]>([])
  const [queue, setQueue] = useState<TrainingQueueEntry[]>([])
  const [resources, setResources] = useState<TrainingResource[]>([])
  const [experiments, setExperiments] = useState<ExperimentInfo[]>([])
  const [experimentCompare, setExperimentCompare] = useState<ExperimentComparison | null>(null)
  const [schedules, setSchedules] = useState<TrainingSchedule[]>([])

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await trainingAPI.list({ page, page_size: 20, search: search || undefined })
      setJobs(res.data.jobs)
      setTotal(res.data.total)
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to load training jobs')
    } finally {
      setLoading(false)
    }
  }, [page, search])

  const fetchSummary = useCallback(async () => {
    try {
      const res = await trainingAPI.getSummary()
      setSummary(res.data)
    } catch { /* ignore */ }
  }, [])

  useEffect(() => { fetchJobs(); fetchSummary() }, [fetchJobs, fetchSummary])

  const fetchJobDetail = useCallback(async (job: TrainingJob) => {
    setSelectedJob(job)
    setActiveTab('overview')
    try {
      const [metricsRes, logsRes, artifactsRes, checkpointsRes, runsRes] = await Promise.all([
        trainingAPI.getMetrics(job.job_id).catch(() => ({ data: [] })),
        trainingAPI.getLogs(job.job_id).catch(() => ({ data: [] })),
        trainingAPI.getArtifacts(job.job_id).catch(() => ({ data: [] })),
        trainingAPI.getCheckpoints(job.job_id).catch(() => ({ data: [] })),
        trainingAPI.getRuns(job.job_id).catch(() => ({ data: [] })),
      ])
      setMetrics(metricsRes.data as TrainingMetric[])
      setLogs(logsRes.data as TrainingLog[])
      setArtifacts(artifactsRes.data as TrainingArtifact[])
      setCheckpoints(checkpointsRes.data as TrainingCheckpoint[])
      setRuns(runsRes.data as TrainingRun[])
    } catch { /* ignore */ }
  }, [])

  const fetchQueue = useCallback(async () => {
    try {
      const res = await trainingAPI.getQueue()
      setQueue(res.data as TrainingQueueEntry[])
    } catch { /* ignore */ }
  }, [])

  const fetchResources = useCallback(async () => {
    try {
      const res = await trainingAPI.getResources()
      setResources(res.data as TrainingResource[])
    } catch { /* ignore */ }
  }, [])

  const fetchExperiments = useCallback(async () => {
    try {
      const res = await trainingAPI.getExperiments()
      setExperiments(res.data as ExperimentInfo[])
    } catch { /* ignore */ }
  }, [])

  const fetchSchedules = useCallback(async () => {
    try {
      const res = await trainingAPI.getSchedules()
      setSchedules(res.data as TrainingSchedule[])
    } catch { /* ignore */ }
  }, [])

  const handleAction = async (
    action: string,
    fn: () => Promise<any>,
    jobId: string,
  ) => {
    setActionLoading(`${action}-${jobId}`)
    try {
      await fn()
      await fetchJobs()
      await fetchSummary()
      if (selectedJob?.job_id === jobId) {
        const updated = await trainingAPI.get(jobId)
        setSelectedJob(updated.data)
      }
    } catch (err: any) {
      alert(err?.response?.data?.detail || `${action} failed`)
    } finally {
      setActionLoading(null)
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <p className="text-lg font-medium">Failed to load training jobs</p>
            <p className="text-sm text-muted-foreground text-center">{error}</p>
            <Button variant="outline" onClick={fetchJobs}>
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
            <Brain className="h-7 w-7" /> Training Orchestration
          </h1>
          <p className="text-muted-foreground mt-1">
            Launch, monitor, and manage ML training jobs across VITO
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => { fetchQueue(); fetchResources(); fetchExperiments(); fetchSchedules() }}>
            <RotateCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
          <Button onClick={() => setStartOpen(true)}>
            <Play className="mr-2 h-4 w-4" /> Start Training
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          <Card><CardContent className="p-3 text-center"><p className="text-xs text-muted-foreground">Total</p><p className="text-xl font-bold">{summary.total_jobs}</p></CardContent></Card>
          <Card className="border-yellow-200"><CardContent className="p-3 text-center"><p className="text-xs text-muted-foreground">Running</p><p className="text-xl font-bold text-yellow-600">{summary.running}</p></CardContent></Card>
          <Card className="border-green-200"><CardContent className="p-3 text-center"><p className="text-xs text-muted-foreground">Completed</p><p className="text-xl font-bold text-green-600">{summary.completed}</p></CardContent></Card>
          <Card className="border-red-200"><CardContent className="p-3 text-center"><p className="text-xs text-muted-foreground">Failed</p><p className="text-xl font-bold text-red-600">{summary.failed}</p></CardContent></Card>
          <Card><CardContent className="p-3 text-center"><p className="text-xs text-muted-foreground">Queued</p><p className="text-xl font-bold">{summary.queued}</p></CardContent></Card>
          <Card><CardContent className="p-3 text-center"><p className="text-xs text-muted-foreground">Paused</p><p className="text-xl font-bold">{summary.paused}</p></CardContent></Card>
          <Card><CardContent className="p-3 text-center"><p className="text-xs text-muted-foreground">Avg Duration</p><p className="text-xl font-bold">{formatDuration(summary.avg_duration_seconds)}</p></CardContent></Card>
          <Card><CardContent className="p-3 text-center"><p className="text-xs text-muted-foreground">Avg Memory</p><p className="text-xl font-bold">{summary.avg_memory_mb > 1024 ? `${(summary.avg_memory_mb / 1024).toFixed(1)} GB` : `${summary.avg_memory_mb.toFixed(0)} MB`}</p></CardContent></Card>
        </div>
      )}

      {selectedJob ? (
        <JobDetailView
          job={selectedJob}
          onBack={() => setSelectedJob(null)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          actionLoading={actionLoading}
          handleAction={handleAction}
          metrics={metrics}
          logs={logs}
          artifacts={artifacts}
          checkpoints={checkpoints}
          runs={runs}
        />
      ) : (
        <>
          {/* Secondary Tabs */}
          <Tabs defaultValue="jobs" onValueChange={(v) => { if (v === 'queue') fetchQueue(); if (v === 'resources') fetchResources(); if (v === 'experiments') fetchExperiments(); if (v === 'schedules') fetchSchedules() }}>
            <TabsList className="flex-wrap">
              <TabsTrigger value="jobs"><Activity className="h-4 w-4 mr-2" />Jobs</TabsTrigger>
              <TabsTrigger value="queue"><Clock className="h-4 w-4 mr-2" />Queue</TabsTrigger>
              <TabsTrigger value="resources"><Server className="h-4 w-4 mr-2" />Resources</TabsTrigger>
              <TabsTrigger value="experiments"><FlaskConical className="h-4 w-4 mr-2" />Experiments</TabsTrigger>
              <TabsTrigger value="schedules"><Calendar className="h-4 w-4 mr-2" />Schedules</TabsTrigger>
            </TabsList>

            <TabsContent value="jobs" className="space-y-4">
              {/* Search */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  className="w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Search jobs by name, ID, or description..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                />
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-[40vh]">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Loading training jobs...</p>
                  </div>
                </div>
              ) : jobs.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center gap-4 pt-10 pb-10">
                    <Brain className="h-16 w-16 text-muted-foreground/40" />
                    <p className="text-lg font-medium">No training jobs</p>
                    <p className="text-sm text-muted-foreground">
                      Launch your first training job to start tracking ML experiments.
                    </p>
                    <Button onClick={() => setStartOpen(true)}>
                      <Play className="mr-2 h-4 w-4" /> Start Training
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Framework</TableHead>
                          <TableHead>Runs</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Started</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {jobs.map((job) => (
                          <TableRow
                            key={job.id}
                            className="cursor-pointer"
                            onClick={() => fetchJobDetail(job)}
                          >
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{job.name}</span>
                                <span className="text-xs text-muted-foreground font-mono">{job.job_id}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={STATUS_CONFIG[job.status]?.variant || 'secondary'}>
                                <span className={cn(job.status === 'running' && 'animate-pulse')}>
                                  {STATUS_CONFIG[job.status]?.label || job.status}
                                </span>
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className={cn(
                                'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                                PRIORITY_CONFIG[job.priority] || ''
                              )}>
                                {job.priority}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm">{job.framework || '—'}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{job.run_count}</Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDuration(job.runtime_seconds)}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {job.started_at ? new Date(job.started_at).toLocaleDateString() : '—'}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                {job.status === 'running' && (
                                  <Button variant="ghost" size="sm" title="Pause"
                                    disabled={actionLoading === `pause-${job.job_id}`}
                                    onClick={(e) => { e.stopPropagation(); handleAction('pause', () => trainingAPI.pause(job.job_id), job.job_id) }}>
                                    <Pause className="h-4 w-4 text-yellow-600" />
                                  </Button>
                                )}
                                {(job.status === 'running' || job.status === 'paused' || job.status === 'queued') && (
                                  <Button variant="ghost" size="sm" title="Cancel"
                                    disabled={actionLoading === `cancel-${job.job_id}`}
                                    onClick={(e) => { e.stopPropagation(); handleAction('cancel', () => trainingAPI.cancel(job.job_id), job.job_id) }}>
                                    <Square className="h-4 w-4 text-destructive" />
                                  </Button>
                                )}
                                {job.status === 'failed' && job.retry_count < job.max_retries && (
                                  <Button variant="ghost" size="sm" title="Retry"
                                    disabled={actionLoading === `retry-${job.job_id}`}
                                    onClick={(e) => { e.stopPropagation(); handleAction('retry', () => trainingAPI.retry(job.job_id), job.job_id) }}>
                                    <RotateCw className="h-4 w-4 text-orange-600" />
                                  </Button>
                                )}
                                <Button variant="ghost" size="sm" title="View"
                                  onClick={(e) => { e.stopPropagation(); fetchJobDetail(job) }}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  {total > 20 && (
                    <CardFooter className="justify-between border-t px-6 py-3">
                      <span className="text-sm text-muted-foreground">{total} job{total !== 1 ? 's' : ''}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                        <Button variant="outline" size="sm" disabled={page * 20 >= total} onClick={() => setPage(p => p + 1)}>Next</Button>
                      </div>
                    </CardFooter>
                  )}
                </Card>
              )}
            </TabsContent>

            <TabsContent value="queue">
              <QueueView queue={queue} fetchQueue={fetchQueue} />
            </TabsContent>

            <TabsContent value="resources">
              <ResourceView resources={resources} fetchResources={fetchResources} />
            </TabsContent>

            <TabsContent value="experiments">
              <ExperimentView experiments={experiments} onCompare={setExperimentCompare} compareResult={experimentCompare} />
            </TabsContent>

            <TabsContent value="schedules">
              <ScheduleView schedules={schedules} fetchSchedules={fetchSchedules} />
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Start Training Modal */}
      {startOpen && (
        <StartTrainingModal
          onClose={() => setStartOpen(false)}
          onStarted={() => { setStartOpen(false); fetchJobs(); fetchSummary() }}
        />
      )}
    </div>
  )
}

/* ─── Job Detail View ─── */
function JobDetailView({
  job, onBack, activeTab, setActiveTab, actionLoading, handleAction,
  metrics, logs, artifacts, checkpoints, runs,
}: {
  job: TrainingJob; onBack: () => void; activeTab: string; setActiveTab: (t: string) => void;
  actionLoading: string | null; handleAction: (a: string, fn: () => Promise<any>, id: string) => Promise<void>;
  metrics: TrainingMetric[]; logs: TrainingLog[]; artifacts: TrainingArtifact[];
  checkpoints: TrainingCheckpoint[]; runs: TrainingRun[];
}) {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-0 h-auto">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Jobs
        </Button>
        <span>/</span>
        <span className="font-medium text-foreground">{job.name}</span>
      </div>

      {/* Job Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" /> {job.name}
                <Badge variant={STATUS_CONFIG[job.status]?.variant || 'secondary'}>
                  {STATUS_CONFIG[job.status]?.label || job.status}
                </Badge>
                <Badge variant="outline">{job.priority}</Badge>
              </CardTitle>
              <CardDescription className="mt-1">
                <span className="font-mono text-xs">{job.job_id}</span>
                {' '}&middot;{' '}
                <span>{job.framework || 'N/A'}</span>
                {job.task_type && <> &middot; {job.task_type}</>}
              </CardDescription>
              {job.description && (
                <p className="text-sm text-muted-foreground mt-2">{job.description}</p>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {job.status === 'running' && (
                <Button size="sm" variant="outline" disabled={actionLoading === `pause-${job.job_id}`}
                  onClick={() => handleAction('pause', () => trainingAPI.pause(job.job_id), job.job_id)}>
                  <Pause className="mr-2 h-4 w-4" /> Pause
                </Button>
              )}
              {job.status === 'paused' && (
                <Button size="sm" variant="outline" disabled={actionLoading === `resume-${job.job_id}`}
                  onClick={() => handleAction('resume', () => trainingAPI.resume(job.job_id), job.job_id)}>
                  <Play className="mr-2 h-4 w-4" /> Resume
                </Button>
              )}
              {(job.status === 'running' || job.status === 'paused' || job.status === 'queued') && (
                <Button size="sm" variant="destructive" disabled={actionLoading === `cancel-${job.job_id}`}
                  onClick={() => handleAction('cancel', () => trainingAPI.cancel(job.job_id), job.job_id)}>
                  <Square className="mr-2 h-4 w-4" /> Cancel
                </Button>
              )}
              {job.status === 'failed' && job.retry_count < job.max_retries && (
                <Button size="sm" disabled={actionLoading === `retry-${job.job_id}`}
                  onClick={() => handleAction('retry', () => trainingAPI.retry(job.job_id), job.job_id)}>
                  <RotateCw className="mr-2 h-4 w-4" /> Retry
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><p className="text-muted-foreground">Duration</p><p className="font-semibold">{formatDuration(job.runtime_seconds)}</p></div>
            <div><p className="text-muted-foreground">Memory</p><p className="font-semibold">{job.memory_used_mb ? `${(job.memory_used_mb / 1024).toFixed(1)} GB` : '—'}</p></div>
            <div><p className="text-muted-foreground">CPU</p><p className="font-semibold">{job.cpu_usage_percent != null ? `${job.cpu_usage_percent.toFixed(1)}%` : '—'}</p></div>
            <div><p className="text-muted-foreground">GPU</p><p className="font-semibold">{job.gpu_type || '—'}</p></div>
            <div><p className="text-muted-foreground">Runs</p><p className="font-semibold">{runs.length}</p></div>
            <div><p className="text-muted-foreground">Max Retries</p><p className="font-semibold">{job.retry_count}/{job.max_retries}</p></div>
            <div><p className="text-muted-foreground">Worker Count</p><p className="font-semibold">{job.worker_count || 1}</p></div>
            <div><p className="text-muted-foreground">Created</p><p className="font-semibold">{new Date(job.created_at).toLocaleDateString()}</p></div>
          </div>
          {job.hyperparameters && Object.keys(job.hyperparameters).length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Hyperparameters</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(job.hyperparameters).map(([k, v]) => (
                  <Badge key={k} variant="outline" className="text-xs font-mono">{k}={String(v)}</Badge>
                ))}
              </div>
            </div>
          )}
          {job.experiment_name && (
            <div className="mt-2 text-sm text-muted-foreground">
              <span><strong>Experiment:</strong> {job.experiment_name}</span>
              {job.run_id && <> &middot; <span><strong>Run:</strong> <span className="font-mono">{job.run_id}</span></span></>}
            </div>
          )}
          {job.error_message && (
            <div className="mt-4 p-3 rounded-md bg-destructive/10 text-sm text-destructive">
              <strong>Error:</strong> {job.error_message}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview"><Eye className="h-4 w-4 mr-2" />Overview</TabsTrigger>
          <TabsTrigger value="metrics"><BarChart3 className="h-4 w-4 mr-2" />Metrics ({metrics.length})</TabsTrigger>
          <TabsTrigger value="logs"><Terminal className="h-4 w-4 mr-2" />Logs ({logs.length})</TabsTrigger>
          <TabsTrigger value="artifacts"><FileDigit className="h-4 w-4 mr-2" />Artifacts ({artifacts.length})</TabsTrigger>
          <TabsTrigger value="runs"><Layers className="h-4 w-4 mr-2" />Runs ({runs.length})</TabsTrigger>
          <TabsTrigger value="checkpoints"><Activity className="h-4 w-4 mr-2" />Checkpoints ({checkpoints.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Gauge className="h-4 w-4" /> Training Progress</CardTitle></CardHeader>
              <CardContent>
                {runs.length > 0 ? (
                  <div className="space-y-2">
                    {runs.slice(-5).reverse().map(r => (
                      <div key={r.id} className="flex items-center justify-between text-sm border-b pb-1 last:border-0">
                        <span className="text-muted-foreground">Run #{r.run_number}</span>
                        <span className="font-mono">epoch {r.epoch}/{r.total_epochs}</span>
                        <Badge variant={STATUS_CONFIG[r.status]?.variant || 'secondary'} className="text-[10px]">
                          {STATUS_CONFIG[r.status]?.label || r.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No runs recorded yet</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm flex items-center gap-2"><HardDrive className="h-4 w-4" /> Resources</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Docker Image</span><span className="font-mono text-xs">{job.docker_image || 'default'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Python</span><span>{job.python_version || '—'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">CUDA</span><span>{job.cuda_version || '—'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Git SHA</span><span className="font-mono text-xs">{job.git_sha ? job.git_sha.slice(0, 12) : '—'}</span></div>
              </CardContent>
            </Card>
          </div>
          {job.model_registry_id && (
            <Card>
              <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Rocket className="h-4 w-4" /> Registry Integration</CardTitle></CardHeader>
              <CardContent className="text-sm">
                <p>Model has been promoted to the Model Registry.</p>
                <p className="text-muted-foreground">
                  Model ID: {job.model_registry_id}, Version ID: {job.model_registry_version_id}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="metrics">
          <MetricsView metrics={metrics} />
        </TabsContent>

        <TabsContent value="logs">
          <LogsView logs={logs} />
        </TabsContent>

        <TabsContent value="artifacts">
          <ArtifactsView artifacts={artifacts} />
        </TabsContent>

        <TabsContent value="runs">
          <RunsView runs={runs} />
        </TabsContent>

        <TabsContent value="checkpoints">
          <CheckpointsView checkpoints={checkpoints} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

/* ─── Queue View ─── */
function QueueView({ queue, fetchQueue }: { queue: TrainingQueueEntry[]; fetchQueue: () => void }) {
  useEffect(() => { fetchQueue() }, [fetchQueue])
  return (
    <Card>
      <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Clock className="h-5 w-5" /> Training Queue</CardTitle></CardHeader>
      <CardContent className="p-0">
        {queue.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground">
            <Clock className="h-8 w-8" />
            <p className="text-sm">Queue is empty</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Worker</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>Retries</TableHead>
                <TableHead>Last Error</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queue.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell><Badge variant="secondary">{entry.position}</Badge></TableCell>
                  <TableCell className="font-medium font-mono text-sm">{entry.job_id}</TableCell>
                  <TableCell>
                    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', PRIORITY_CONFIG[entry.priority] || '')}>
                      {entry.priority}
                    </span>
                  </TableCell>
                  <TableCell><Badge variant={STATUS_CONFIG[entry.status]?.variant || 'secondary'}>{STATUS_CONFIG[entry.status]?.label || entry.status}</Badge></TableCell>
                  <TableCell className="text-sm">{entry.worker_id || '—'}</TableCell>
                  <TableCell className="text-sm">{entry.scheduled_at ? new Date(entry.scheduled_at).toLocaleString() : '—'}</TableCell>
                  <TableCell>{entry.retry_count}</TableCell>
                  <TableCell className="text-xs text-destructive max-w-[200px] truncate">{entry.last_error || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

/* ─── Metrics View ─── */
function MetricsView({ metrics }: { metrics: TrainingMetric[] }) {
  const metricNames = [...new Set(metrics.map(m => m.metric_name))]
  const splits = [...new Set(metrics.map(m => m.split))]
  return (
    <Card>
      <CardHeader><CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Metrics ({metrics.length})</CardTitle></CardHeader>
      <CardContent className="p-0">
        {metrics.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground">
            <BarChart3 className="h-8 w-8" />
            <p className="text-sm">No metrics recorded</p>
          </div>
        ) : (
          <div className="space-y-4 p-4">
            {metricNames.map(name => (
              <div key={name}>
                <p className="text-sm font-medium mb-2">{name}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {splits.map(split => {
                    const vals = metrics.filter(m => m.metric_name === name && m.split === split)
                    if (vals.length === 0) return null
                    const last = vals[vals.length - 1]
                    return (
                      <div key={split} className="border rounded p-2">
                        <p className="text-xs text-muted-foreground uppercase">{split}</p>
                        <p className="text-lg font-semibold">{last.metric_value.toFixed(4)}</p>
                        <p className="text-[10px] text-muted-foreground">epoch {last.epoch}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/* ─── Logs View ─── */
function LogsView({ logs }: { logs: TrainingLog[] }) {
  const [filterLevel, setFilterLevel] = useState('')
  const filtered = filterLevel ? logs.filter(l => l.level === filterLevel) : logs
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2"><Terminal className="h-5 w-5" /> Logs ({logs.length})</CardTitle>
          <select className="rounded-md border border-input bg-background px-3 py-1 text-sm"
            value={filterLevel} onChange={e => setFilterLevel(e.target.value)}>
            <option value="">All Levels</option>
            <option value="DEBUG">DEBUG</option>
            <option value="INFO">INFO</option>
            <option value="WARNING">WARNING</option>
            <option value="ERROR">ERROR</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
        </div>
      </CardHeader>
      <CardContent className="p-0 max-h-[500px] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground">
            <Terminal className="h-8 w-8" />
            <p className="text-sm">No logs</p>
          </div>
        ) : (
          <div className="font-mono text-xs">
            {filtered.map((log) => (
              <div key={log.id} className={cn(
                'border-b px-4 py-1.5 hover:bg-muted/30',
                log.level === 'ERROR' && 'bg-destructive/5',
                log.level === 'WARNING' && 'bg-yellow-50',
              )}>
                <span className="text-muted-foreground">{new Date(log.timestamp).toISOString()} </span>
                <Badge variant={
                  log.level === 'ERROR' ? 'destructive' : log.level === 'WARNING' ? 'warning' : 'secondary'
                } className="text-[10px] mx-1">{log.level}</Badge>
                {log.logger_name && <span className="text-muted-foreground">[{log.logger_name}] </span>}
                <span className={log.level === 'ERROR' ? 'text-destructive' : ''}>{log.message}</span>
                {log.traceback && (
                  <details className="mt-1">
                    <summary className="text-destructive cursor-pointer">Traceback</summary>
                    <pre className="mt-1 p-2 rounded bg-muted text-[10px] whitespace-pre-wrap">{log.traceback}</pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/* ─── Artifacts View ─── */
function ArtifactsView({ artifacts }: { artifacts: TrainingArtifact[] }) {
  const [filterType, setFilterType] = useState('')
  const filtered = filterType ? artifacts.filter(a => a.artifact_type === filterType) : artifacts
  const types = [...new Set(artifacts.map(a => a.artifact_type))]
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2"><FileDigit className="h-5 w-5" /> Artifacts ({artifacts.length})</CardTitle>
          {types.length > 0 && (
            <select className="rounded-md border border-input bg-background px-3 py-1 text-sm"
              value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="">All Types</option>
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground">
            <FileDigit className="h-8 w-8" />
            <p className="text-sm">No artifacts</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Storage</TableHead>
                <TableHead>Hash</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium text-sm">{a.name}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{a.artifact_type}</Badge></TableCell>
                  <TableCell className="text-sm">{formatBytes(a.file_size_bytes)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{a.storage_uri || a.storage_backend || '—'}</TableCell>
                  <TableCell className="font-mono text-[10px] max-w-[80px] truncate">{a.file_hash ? a.file_hash.slice(0, 12) : '—'}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

/* ─── Runs View ─── */
function RunsView({ runs }: { runs: TrainingRun[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Layers className="h-5 w-5" /> Training Runs ({runs.length})</CardTitle></CardHeader>
      <CardContent className="p-0">
        {runs.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground"><Layers className="h-8 w-8" /><p className="text-sm">No runs</p></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Run</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Epoch</TableHead>
                <TableHead>Loss</TableHead>
                <TableHead>Val Loss</TableHead>
                <TableHead>LR</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Started</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runs.map((r) => (
                <TableRow key={r.id}>
                  <TableCell><span className="font-mono font-medium">#{r.run_number}</span></TableCell>
                  <TableCell><Badge variant={STATUS_CONFIG[r.status]?.variant || 'secondary'} className="text-[10px]">{STATUS_CONFIG[r.status]?.label || r.status}</Badge></TableCell>
                  <TableCell>{r.epoch}/{r.total_epochs}</TableCell>
                  <TableCell className="font-mono text-sm">{r.loss?.toFixed(4) ?? '—'}</TableCell>
                  <TableCell className="font-mono text-sm">{r.validation_loss?.toFixed(4) ?? '—'}</TableCell>
                  <TableCell className="font-mono text-sm">{r.learning_rate?.toExponential(2) ?? '—'}</TableCell>
                  <TableCell className="text-sm">{formatDuration(r.runtime_seconds)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.started_at ? new Date(r.started_at).toLocaleString() : '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

/* ─── Checkpoints View ─── */
function CheckpointsView({ checkpoints }: { checkpoints: TrainingCheckpoint[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Activity className="h-5 w-5" /> Checkpoints ({checkpoints.length})</CardTitle></CardHeader>
      <CardContent className="p-0">
        {checkpoints.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground"><Activity className="h-8 w-8" /><p className="text-sm">No checkpoints</p></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Epoch</TableHead>
                <TableHead>Step</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Best</TableHead>
                <TableHead>Latest</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {checkpoints.map((cp) => (
                <TableRow key={cp.id} className={cn(cp.is_best && 'bg-green-50/50')}>
                  <TableCell className="font-mono">{cp.epoch}</TableCell>
                  <TableCell>{cp.step}</TableCell>
                  <TableCell className="font-mono">{cp.score?.toFixed(4) ?? '—'}</TableCell>
                  <TableCell>{formatBytes(cp.file_size_bytes)}</TableCell>
                  <TableCell>{cp.is_best ? <Badge variant="success" className="text-[10px]">Best</Badge> : '—'}</TableCell>
                  <TableCell>{cp.is_latest ? <Badge variant="secondary" className="text-[10px]">Latest</Badge> : '—'}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(cp.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

/* ─── Resources View ─── */
function ResourceView({ resources, fetchResources }: { resources: TrainingResource[]; fetchResources: () => void }) {
  useEffect(() => { fetchResources() }, [fetchResources])
  const available = resources.filter(r => r.is_available && !r.is_allocated).length
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{available} of {resources.length} resources available</p>
        <Button variant="outline" size="sm" onClick={() => {}}><Plus className="mr-2 h-4 w-4" /> Add Resource</Button>
      </div>
      {resources.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center gap-3 py-8 text-muted-foreground"><Server className="h-8 w-8" /><p className="text-sm">No resources configured</p></CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((r) => (
            <Card key={r.id} className={cn(!r.is_available && 'opacity-60')}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Cpu className="h-4 w-4" /> {r.name}
                  </CardTitle>
                  <Badge variant={r.is_available ? (r.is_allocated ? 'warning' : 'success') : 'destructive'} className="text-[10px]">
                    {r.is_allocated ? 'In Use' : r.is_available ? 'Ready' : 'Offline'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-xs space-y-1 text-muted-foreground">
                <p>Type: {r.resource_type}</p>
                <p>CPU: {r.cpu_count} cores &middot; RAM: {r.memory_gb} GB</p>
                {r.gpu_count > 0 && <p>GPU: {r.gpu_count}x {r.gpu_type || 'N/A'}</p>}
                {r.cuda_version && <p>CUDA: {r.cuda_version}</p>}
                {r.cost_per_hour > 0 && <p>Cost: ${r.cost_per_hour.toFixed(2)}/hr</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Experiments View ─── */
function ExperimentView({
  experiments, onCompare, compareResult,
}: {
  experiments: ExperimentInfo[]; onCompare: (r: any) => void; compareResult: ExperimentComparison | null;
}) {
  const [selectedExp, setSelectedExp] = useState<string>('')
  const [comparing, setComparing] = useState(false)

  const handleCompare = async () => {
    if (!selectedExp) return
    setComparing(true)
    try {
      const res = await trainingAPI.compareExperiments(selectedExp)
      onCompare(res.data)
    } catch { alert('Compare failed') }
    finally { setComparing(false) }
  }

  return (
    <div className="space-y-4">
      {experiments.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center gap-3 py-8 text-muted-foreground"><FlaskConical className="h-8 w-8" /><p className="text-sm">No experiments yet</p></CardContent></Card>
      ) : (
        <>
          <Card>
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><FlaskConical className="h-5 w-5" /> Experiments ({experiments.length})</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Experiment</TableHead>
                    <TableHead>Jobs</TableHead>
                    <TableHead>Runs</TableHead>
                    <TableHead>Best Metric</TableHead>
                    <TableHead>Frameworks</TableHead>
                    <TableHead>Last Run</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {experiments.map((exp) => (
                    <TableRow key={exp.experiment_name}>
                      <TableCell className="font-medium">{exp.experiment_name}</TableCell>
                      <TableCell><Badge variant="secondary">{exp.job_count}</Badge></TableCell>
                      <TableCell><Badge variant="secondary">{exp.run_count}</Badge></TableCell>
                      <TableCell className="font-mono text-sm">{exp.best_metric?.toFixed(4) ?? '—'}</TableCell>
                      <TableCell className="text-xs">{(exp.frameworks || []).join(', ') || '—'}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{exp.last_run ? new Date(exp.last_run).toLocaleString() : '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Compare */}
          <Card>
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><ArrowUpDown className="h-5 w-5" /> Compare Experiments</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-end gap-4">
                <div>
                  <label className="text-sm font-medium">Experiment</label>
                  <select className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                    value={selectedExp} onChange={e => setSelectedExp(e.target.value)}>
                    <option value="">Select...</option>
                    {experiments.map(e => <option key={e.experiment_name} value={e.experiment_name}>{e.experiment_name}</option>)}
                  </select>
                </div>
                <Button onClick={handleCompare} disabled={!selectedExp || comparing}>
                  {comparing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BarChart3 className="mr-2 h-4 w-4" />}
                  Compare
                </Button>
              </div>
            </CardContent>
          </Card>

          {compareResult && (
            <Card>
              <CardHeader><CardTitle className="text-lg">{compareResult.experiment_name} — Metric Summary</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(compareResult.metric_summary).map(([name, stats]) => (
                    <div key={name} className="border rounded p-3">
                      <p className="text-xs text-muted-foreground uppercase font-medium">{name}</p>
                      <div className="mt-1 space-y-0.5 text-sm">
                        <p><span className="text-muted-foreground">Mean:</span> {stats.mean.toFixed(4)}</p>
                        <p><span className="text-muted-foreground">Max:</span> {stats.max.toFixed(4)}</p>
                        <p><span className="text-muted-foreground">Min:</span> {stats.min.toFixed(4)}</p>
                        <p><span className="text-muted-foreground">Std:</span> {stats.std.toFixed(4)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {compareResult.best_job && (
                  <p className="mt-4 text-sm"><strong>Best Job:</strong> {compareResult.best_job}</p>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

/* ─── Schedules View ─── */
function ScheduleView({ schedules, fetchSchedules }: { schedules: TrainingSchedule[]; fetchSchedules: () => void }) {
  useEffect(() => { fetchSchedules() }, [fetchSchedules])
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => {}}><Plus className="mr-2 h-4 w-4" /> Add Schedule</Button>
      </div>
      {schedules.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center gap-3 py-8 text-muted-foreground"><Calendar className="h-8 w-8" /><p className="text-sm">No schedules configured</p></CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schedules.map((s) => (
            <Card key={s.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> {s.name}
                  </CardTitle>
                  <Badge variant={s.is_active ? 'success' : 'secondary'} className="text-[10px]">
                    {s.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-xs space-y-1 text-muted-foreground">
                <p>Frequency: {s.frequency}</p>
                {s.cron_expression && <p>Cron: <span className="font-mono">{s.cron_expression}</span></p>}
                <p>Runs: {s.run_count}/{s.max_runs || '∞'}</p>
                {s.next_run_at && <p>Next: {new Date(s.next_run_at).toLocaleString()}</p>}
                {s.last_run_at && <p>Last: {new Date(s.last_run_at).toLocaleString()}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Start Training Modal ─── */
function StartTrainingModal({ onClose, onStarted }: { onClose: () => void; onStarted: () => void }) {
  const [form, setForm] = useState({
    name: '', description: '', job_id: '', dataset_id: 0,
    framework: 'pytorch', task_type: 'regression',
    priority: 'normal', experiment_name: '', seed: 42,
    worker_count: 1, gpu_type: '', max_retries: 3,
    hyperparameters: '', training_config: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!form.name) { setError('Job name is required'); return }
    setSubmitting(true); setError('')
    try {
      let hp: Record<string, any> | undefined
      let tc: Record<string, any> | undefined
      try { if (form.hyperparameters) hp = JSON.parse(form.hyperparameters) } catch { setError('Invalid hyperparameters JSON'); setSubmitting(false); return }
      try { if (form.training_config) tc = JSON.parse(form.training_config) } catch { setError('Invalid training_config JSON'); setSubmitting(false); return }
      await trainingAPI.start({
        name: form.name, description: form.description || undefined,
        job_id: form.job_id || undefined, dataset_id: form.dataset_id || undefined,
        framework: form.framework, task_type: form.task_type,
        priority: form.priority, experiment_name: form.experiment_name || undefined,
        seed: form.seed || undefined, worker_count: form.worker_count || undefined,
        gpu_type: form.gpu_type || undefined, max_retries: form.max_retries,
        hyperparameters: hp, training_config: tc,
      })
      onStarted()
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to start training')
    } finally { setSubmitting(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2"><Play className="h-5 w-5" /> Start Training Job</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}><XCircle className="h-4 w-4" /></Button>
          </div>
          <CardDescription>Configure and launch a new ML training job</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Job Name *</label>
              <input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="quality-net-v3-training" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Job ID (optional)</label>
              <input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                placeholder="auto-generated if empty" value={form.job_id}
                onChange={e => setForm(f => ({ ...f, job_id: e.target.value }))} />
            </div>
            <div className="col-span-2 space-y-1">
              <label className="text-sm font-medium">Description</label>
              <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                rows={2} placeholder="Training job description..." value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
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
              <label className="text-sm font-medium">Priority</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Experiment Name</label>
              <input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="experiment-name" value={form.experiment_name}
                onChange={e => setForm(f => ({ ...f, experiment_name: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Seed</label>
              <input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                type="number" value={form.seed}
                onChange={e => setForm(f => ({ ...f, seed: parseInt(e.target.value) || 0 }))} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Workers</label>
              <input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                type="number" min={1} value={form.worker_count}
                onChange={e => setForm(f => ({ ...f, worker_count: parseInt(e.target.value) || 1 }))} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">GPU Type</label>
              <input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="A100, V100, etc." value={form.gpu_type}
                onChange={e => setForm(f => ({ ...f, gpu_type: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Max Retries</label>
              <input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                type="number" min={0} value={form.max_retries}
                onChange={e => setForm(f => ({ ...f, max_retries: parseInt(e.target.value) || 0 }))} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Dataset ID</label>
              <input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                type="number" placeholder="optional" value={form.dataset_id || ''}
                onChange={e => setForm(f => ({ ...f, dataset_id: parseInt(e.target.value) || 0 }))} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Hyperparameters (JSON)</label>
              <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                rows={4} placeholder='{"lr": 0.001, "batch_size": 64, "epochs": 100}' value={form.hyperparameters}
                onChange={e => setForm(f => ({ ...f, hyperparameters: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Training Config (JSON)</label>
              <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                rows={4} placeholder='{"early_stopping": true, "patience": 10}' value={form.training_config}
                onChange={e => setForm(f => ({ ...f, training_config: e.target.value }))} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Rocket className="mr-2 h-4 w-4" />}
            Launch Training
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
