'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Activity, Brain, AlertTriangle, BarChart3, Clock, Cpu, Database,
  Eye, FileText, FlaskConical, GitBranch, Loader2, Mic,
  RefreshCw, Rocket, Target, TrendingUp, Zap, Play, StopCircle,
  CheckCircle, XCircle, ChevronLeft, ChevronRight, Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { inferenceAPI, InferencePredictResponse, PredictionResponse, DriftResponse, DeploymentResponse, FeedbackResponse, ExplainabilityResponse, InferenceSummaryResponse } from '@/lib/inference_api';

const STATUS_CONFIG: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
  completed: { variant: 'default', label: 'Completed' },
  processing: { variant: 'secondary', label: 'Processing' },
  failed: { variant: 'destructive', label: 'Failed' },
  pending: { variant: 'outline', label: 'Pending' },
  cancelled: { variant: 'outline', label: 'Cancelled' },
};

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms.toFixed(0)}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

function SummaryCards({ summary }: { summary: InferenceSummaryResponse }) {
  const cards = [
    { title: 'Total Predictions', value: summary.total_predictions.toLocaleString(), icon: Brain, color: 'text-blue-600' },
    { title: 'Success Rate', value: `${summary.success_rate}%`, icon: CheckCircle, color: 'text-green-600' },
    { title: 'Avg Latency', value: formatDuration(summary.avg_latency_ms), icon: Clock, color: 'text-purple-600' },
    { title: 'P95 Latency', value: formatDuration(summary.p95_latency_ms), icon: Clock, color: 'text-orange-600' },
    { title: 'Active Models', value: summary.active_models.toString(), icon: Cpu, color: 'text-cyan-600' },
    { title: 'Deployments', value: summary.active_deployments.toString(), icon: Rocket, color: 'text-indigo-600' },
    { title: 'Drift Alerts', value: summary.drift_alerts.toString(), icon: AlertTriangle, color: summary.drift_alerts > 0 ? 'text-red-600' : 'text-green-600' },
    { title: 'Cache Hit Rate', value: `${summary.cache_hit_rate}%`, icon: Zap, color: 'text-yellow-600' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent className="p-4 flex items-center gap-3">
            <card.icon className={`h-8 w-8 ${card.color}`} />
            <div>
              <p className="text-sm text-muted-foreground">{card.title}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PredictionsTable({ predictions, onSelect }: { predictions: PredictionResponse[]; onSelect: (p: PredictionResponse) => void }) {
  if (predictions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Brain className="h-12 w-12 mb-4 opacity-30" />
        <p className="text-lg font-medium">No predictions yet</p>
        <p className="text-sm">Run a prediction to see results here</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Prediction ID</TableHead>
          <TableHead>Model</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Confidence</TableHead>
          <TableHead>Latency</TableHead>
          <TableHead>Cache</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {predictions.map((p) => {
          const cfg = STATUS_CONFIG[p.status] || STATUS_CONFIG.pending;
          return (
            <TableRow key={p.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onSelect(p)}>
              <TableCell className="font-mono text-xs">{p.prediction_id.slice(0, 16)}...</TableCell>
              <TableCell>{p.model_version_label || `v${p.model_version_id}`}</TableCell>
              <TableCell><Badge variant={cfg.variant}>{cfg.label}</Badge></TableCell>
              <TableCell>{p.confidence_score ? `${(p.confidence_score * 100).toFixed(0)}%` : '-'}</TableCell>
              <TableCell>{p.latency_ms ? formatDuration(p.latency_ms) : '-'}</TableCell>
              <TableCell>{p.latency_ms && p.latency_ms < 5 ? <Zap className="h-4 w-4 text-yellow-500" /> : '-'}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{p.created_at ? new Date(p.created_at).toLocaleString() : '-'}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onSelect(p); }}>
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function PredictionDetailView({ prediction, onBack }: { prediction: PredictionResponse; onBack: () => void }) {
  const [explanation, setExplanation] = useState<ExplainabilityResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    inferenceAPI.explainPrediction(prediction.prediction_id, 'feature_importance')
      .then((res) => setExplanation(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [prediction.prediction_id]);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" onClick={onBack}><ChevronLeft className="h-4 w-4 mr-1" />Back</Button>
        <h3 className="text-lg font-semibold">Prediction Detail</h3>
        <Badge variant={STATUS_CONFIG[prediction.status]?.variant || 'outline'}>
          {STATUS_CONFIG[prediction.status]?.label || prediction.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="p-4"><CardTitle className="text-sm">Prediction ID</CardTitle></CardHeader>
          <CardContent className="p-4 pt-0"><p className="font-mono text-xs">{prediction.prediction_id}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4"><CardTitle className="text-sm">Model Version</CardTitle></CardHeader>
          <CardContent className="p-4 pt-0"><p>{prediction.model_version_label || `ID ${prediction.model_version_id}`}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4"><CardTitle className="text-sm">Latency</CardTitle></CardHeader>
          <CardContent className="p-4 pt-0"><p>{prediction.latency_ms ? formatDuration(prediction.latency_ms) : 'N/A'}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4"><CardTitle className="text-sm">Confidence</CardTitle></CardHeader>
          <CardContent className="p-4 pt-0">
            <p className={cn('text-lg font-bold', (prediction.confidence_score || 0) >= 0.7 ? 'text-green-600' : 'text-orange-600')}>
              {prediction.confidence_score ? `${(prediction.confidence_score * 100).toFixed(0)}%` : 'N/A'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4"><CardTitle className="text-sm">Uncertainty</CardTitle></CardHeader>
          <CardContent className="p-4 pt-0"><p>{prediction.uncertainty_score ? `${(prediction.uncertainty_score * 100).toFixed(1)}%` : 'N/A'}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4"><CardTitle className="text-sm">Entropy</CardTitle></CardHeader>
          <CardContent className="p-4 pt-0"><p>{prediction.entropy ? prediction.entropy.toFixed(3) : 'N/A'}</p></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-sm">Output Data</CardTitle></CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto max-h-64">
              {JSON.stringify(prediction.output_data, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Explainability</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading explanation...</div>
            ) : explanation ? (
              <div>
                <p className="text-sm mb-2 italic text-muted-foreground">{explanation.natural_language}</p>
                <div className="space-y-1">
                  {explanation.top_features.slice(0, 5).map((f, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span>{f.name.replace(/_/g, ' ')}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div className={cn('h-full rounded-full', f.direction === 'positive' ? 'bg-green-500' : 'bg-red-500')}
                            style={{ width: `${Math.abs(f.contribution_pct)}%` }} />
                        </div>
                        <span className={cn('font-medium', f.direction === 'positive' ? 'text-green-600' : 'text-red-600')}>
                          {f.direction === 'positive' ? '+' : ''}{f.contribution_pct.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No explanation available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PredictView({ onPredictionCreated }: { onPredictionCreated: () => void }) {
  const [modelId, setModelId] = useState('');
  const [inputJson, setInputJson] = useState('{\n  "formula": {\n    "name": "Test Formula",\n    "ingredients": []\n  }\n}');
  const [result, setResult] = useState<InferencePredictResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePredict = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const inputData = JSON.parse(inputJson);
      const res = await inferenceAPI.predict({
        model_id: modelId || 'default',
        input_data: inputData,
        use_cache: true,
      });
      setResult(res.data);
      onPredictionCreated();
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Model ID</Label>
          <Input value={modelId} onChange={(e) => setModelId(e.target.value)} placeholder="default" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Input Data (JSON)</Label>
        <textarea
          className="w-full h-40 p-3 text-xs font-mono border rounded-lg bg-muted"
          value={inputJson}
          onChange={(e) => setInputJson(e.target.value)}
        />
      </div>
      <Button onClick={handlePredict} disabled={loading}>
        {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Predicting...</> : <><Play className="h-4 w-4 mr-2" />Run Prediction</>}
      </Button>

      {error && (
        <Card className="border-destructive">
          <CardContent className="p-4 flex items-center gap-2 text-destructive">
            <XCircle className="h-5 w-5" />{error}
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader><CardTitle className="text-sm">Prediction Result</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div><span className="text-xs text-muted-foreground">Prediction ID</span><p className="font-mono text-xs">{result.prediction_id.slice(0, 20)}...</p></div>
              <div><span className="text-xs text-muted-foreground">Confidence</span><p className="font-medium">{(result.confidence_score || 0) >= 0 ? `${(result.confidence_score! * 100).toFixed(0)}%` : 'N/A'}</p></div>
              <div><span className="text-xs text-muted-foreground">Latency</span><p className="font-medium">{formatDuration(result.latency_ms)}</p></div>
              <div><span className="text-xs text-muted-foreground">Cache Hit</span><p className="font-medium">{result.cache_hit ? 'Yes' : 'No'}</p></div>
            </div>
            <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto max-h-48">
              {JSON.stringify(result.output_data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function DriftView() {
  const [drifts, setDrifts] = useState<DriftResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    inferenceAPI.getDrift({ page: 1, page_size: 50 })
      .then((res) => setDrifts(res.data.drifts))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Metric</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Direction</TableHead>
          <TableHead>Severity</TableHead>
          <TableHead>Alert</TableHead>
          <TableHead>Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {drifts.length === 0 ? (
          <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No drift detected</TableCell></TableRow>
        ) : drifts.map((d) => (
          <TableRow key={d.id}>
            <TableCell><Badge variant="outline">{d.drift_type}</Badge></TableCell>
            <TableCell>{d.metric_name}</TableCell>
            <TableCell>{d.drift_score.toFixed(4)}</TableCell>
            <TableCell>{d.direction}</TableCell>
            <TableCell>
              <Badge variant={d.severity === 'critical' ? 'destructive' : d.severity === 'medium' ? 'default' : 'secondary'}>
                {d.severity}
              </Badge>
            </TableCell>
            <TableCell>{d.alert_generated ? <AlertTriangle className="h-4 w-4 text-red-500" /> : <CheckCircle className="h-4 w-4 text-green-500" />}</TableCell>
            <TableCell className="text-xs text-muted-foreground">{new Date(d.created_at).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function DeploymentsView() {
  const [deployments, setDeployments] = useState<DeploymentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    inferenceAPI.listDeployments({ active_only: true })
      .then((res) => setDeployments(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Strategy</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Traffic</TableHead>
          <TableHead>Active</TableHead>
          <TableHead>Deployed</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {deployments.length === 0 ? (
          <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No active deployments</TableCell></TableRow>
        ) : deployments.map((d) => (
          <TableRow key={d.id}>
            <TableCell className="font-medium">{d.name}</TableCell>
            <TableCell><Badge variant="outline">{d.strategy}</Badge></TableCell>
            <TableCell><Badge variant={d.status === 'active' ? 'default' : 'secondary'}>{d.status}</Badge></TableCell>
            <TableCell>{d.traffic_percent}%</TableCell>
            <TableCell>{d.is_active ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}</TableCell>
            <TableCell className="text-xs text-muted-foreground">{new Date(d.deployed_at).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function FeedbackView() {
  const [feedback, setFeedback] = useState<FeedbackResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    inferenceAPI.listFeedback({ page: 1, page_size: 50 })
      .then((res) => setFeedback(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>Comment</TableHead>
          <TableHead>Used for Retraining</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {feedback.length === 0 ? (
          <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No feedback yet</TableCell></TableRow>
        ) : feedback.map((f) => (
          <TableRow key={f.id}>
            <TableCell><Badge variant="outline">{f.feedback_type}</Badge></TableCell>
            <TableCell>{f.rating ?? '-'}</TableCell>
            <TableCell className="max-w-xs truncate">{f.comment || '-'}</TableCell>
            <TableCell>{f.is_used_for_retraining ? <CheckCircle className="h-4 w-4 text-green-500" /> : 'No'}</TableCell>
            <TableCell className="text-xs text-muted-foreground">{new Date(f.created_at).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function InferencePage() {
  const [summary, setSummary] = useState<InferenceSummaryResponse | null>(null);
  const [predictions, setPredictions] = useState<PredictionResponse[]>([]);
  const [totalPredictions, setTotalPredictions] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionResponse | null>(null);
  const [activeTab, setActiveTab] = useState('predictions');
  const [searchStatus, setSearchStatus] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [summaryRes, predictionsRes] = await Promise.all([
        inferenceAPI.getSummary(),
        inferenceAPI.listPredictions({ status: searchStatus || undefined, page, page_size: pageSize }),
      ]);
      setSummary(summaryRes.data);
      setPredictions(predictionsRes.data.predictions);
      setTotalPredictions(predictionsRes.data.total);
    } catch (e: any) {
      setError(e.message || 'Failed to load inference data');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchStatus]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (error && !summary) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">Failed to load</p>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchData}><RefreshCw className="h-4 w-4 mr-2" />Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalPages = Math.ceil(totalPredictions / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inference Center</h1>
          <p className="text-sm text-muted-foreground">Enterprise AI prediction serving, monitoring, and management</p>
        </div>
        <Button variant="outline" onClick={fetchData} disabled={loading}>
          <RefreshCw className={cn('h-4 w-4 mr-2', loading && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      {summary && <SummaryCards summary={summary} />}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="predictions"><Brain className="h-4 w-4 mr-2" />Predictions</TabsTrigger>
          <TabsTrigger value="predict"><Play className="h-4 w-4 mr-2" />Predict</TabsTrigger>
          <TabsTrigger value="drift"><TrendingUp className="h-4 w-4 mr-2" />Drift</TabsTrigger>
          <TabsTrigger value="deployments"><Rocket className="h-4 w-4 mr-2" />Deployments</TabsTrigger>
          <TabsTrigger value="feedback"><FileText className="h-4 w-4 mr-2" />Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <select
                className="text-sm border rounded-md px-2 py-1 bg-background"
                value={searchStatus}
                onChange={(e) => { setSearchStatus(e.target.value); setPage(1); }}
              >
                <option value="">All Status</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="processing">Processing</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <span className="text-sm text-muted-foreground">{totalPredictions} total</span>
          </div>

          {selectedPrediction ? (
            <PredictionDetailView prediction={selectedPrediction} onBack={() => setSelectedPrediction(null)} />
          ) : (
            <>
              <Card>
                <CardContent className="p-0">
                  <PredictionsTable predictions={predictions} onSelect={setSelectedPrediction} />
                </CardContent>
              </Card>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                      <ChevronLeft className="h-4 w-4 mr-1" />Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                      Next<ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="predict" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Run Prediction</CardTitle><CardDescription>Execute a single prediction against a model</CardDescription></CardHeader>
            <CardContent>
              <PredictView onPredictionCreated={fetchData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drift" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Drift Detection</CardTitle><CardDescription>Monitor data and concept drift across models</CardDescription></CardHeader>
            <CardContent className="p-0">
              <DriftView />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployments" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Active Deployments</CardTitle><CardDescription>Manage model deployments and traffic routing</CardDescription></CardHeader>
            <CardContent className="p-0">
              <DeploymentsView />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Feedback Review</CardTitle><CardDescription>Review and manage prediction feedback for active learning</CardDescription></CardHeader>
            <CardContent className="p-0">
              <FeedbackView />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
