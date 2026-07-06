'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  Database, Loader2, AlertCircle, Plus, Search, RefreshCw,
  Layers, CheckCircle, XCircle, ListTree, BarChart3,
} from 'lucide-react'
import { featureStoreAPI, type FeatureResponse, type FeatureSummary, type FeatureGroupResponse } from '@/lib/feature_store_api'

type PageState = 'loading' | 'ready' | 'error'

export default function FeaturesPage() {
  const [pageState, setPageState] = useState<PageState>('loading')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('browse')
  const [features, setFeatures] = useState<FeatureResponse[]>([])
  const [summary, setSummary] = useState<FeatureSummary | null>(null)
  const [groups, setGroups] = useState<FeatureGroupResponse[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  const [showRegister, setShowRegister] = useState(false)
  const [registerForm, setRegisterForm] = useState({
    feature_id: '', name: '', description: '', feature_type: 'numeric',
    entity_id: '', owner: '', tags: '',
  })

  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [groupForm, setGroupForm] = useState({
    group_id: '', name: '', description: '', category: '',
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [featuresRes, summaryRes, groupsRes] = await Promise.all([
        featureStoreAPI.listFeatures({ page, page_size: 20 }),
        featureStoreAPI.getSummary(),
        featureStoreAPI.listGroups({ page: 1, page_size: 50 }),
      ])
      setFeatures(featuresRes.data.features)
      setTotal(featuresRes.data.total)
      setSummary(summaryRes.data)
      setGroups(groupsRes.data.groups || [])
      setPageState('ready')
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message || 'Failed to load features')
      setPageState('error')
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { fetchData() }, [fetchData])

  const handleRegister = useCallback(async () => {
    try {
      await featureStoreAPI.registerFeature({
        feature_id: registerForm.feature_id,
        name: registerForm.name,
        description: registerForm.description,
        feature_type: registerForm.feature_type,
        entity_id: registerForm.entity_id || undefined,
        owner: registerForm.owner || undefined,
        tags: registerForm.tags ? registerForm.tags.split(',').map(t => t.trim()) : [],
      })
      setShowRegister(false)
      setRegisterForm({ feature_id: '', name: '', description: '', feature_type: 'numeric', entity_id: '', owner: '', tags: '' })
      fetchData()
    } catch (e: any) {
      alert(e.response?.data?.detail || e.message || 'Registration failed')
    }
  }, [registerForm, fetchData])

  const handleCreateGroup = useCallback(async () => {
    try {
      await featureStoreAPI.createGroup({
        group_id: groupForm.group_id,
        name: groupForm.name,
        description: groupForm.description,
        category: groupForm.category || undefined,
      })
      setShowCreateGroup(false)
      setGroupForm({ group_id: '', name: '', description: '', category: '' })
      fetchData()
    } catch (e: any) {
      alert(e.response?.data?.detail || e.message || 'Failed to create group')
    }
  }, [groupForm, fetchData])

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) { fetchData(); return }
    setLoading(true)
    try {
      const res = await featureStoreAPI.searchFeatures({ query: searchQuery, page: 1, page_size: 20 })
      setFeatures(res.data.features)
      setTotal(res.data.total)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, fetchData])

  if (pageState === 'loading') {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading feature store...</p>
        </div>
      </div>
    )
  }

  if (pageState === 'error') {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <p className="text-lg font-medium">Feature Store Error</p>
            <p className="text-sm text-muted-foreground text-center">{error}</p>
            <Button variant="outline" onClick={fetchData}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Database className="h-6 w-6" /> Feature Store
          </h1>
          <p className="text-sm text-muted-foreground">Manage feature definitions, groups, and metadata</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCw className={cn('h-4 w-4 mr-2', loading && 'animate-spin')} />
            Refresh
          </Button>
          <Button onClick={() => setShowRegister(true)}>
            <Plus className="h-4 w-4 mr-2" /> Register Feature
          </Button>
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4 pb-3">
              <p className="text-2xl font-bold">{summary.total_features}</p>
              <p className="text-xs text-muted-foreground">Total Features</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <p className="text-2xl font-bold">{summary.active_features}</p>
              <p className="text-xs text-muted-foreground">Active Features</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <p className="text-2xl font-bold">{summary.groups_count}</p>
              <p className="text-xs text-muted-foreground">Feature Groups</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <p className="text-2xl font-bold">{Object.keys(summary.feature_types).length}</p>
              <p className="text-xs text-muted-foreground">Types</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="browse"><Database className="h-4 w-4 mr-2" />Browse</TabsTrigger>
          <TabsTrigger value="groups"><Layers className="h-4 w-4 mr-2" />Groups</TabsTrigger>
          <TabsTrigger value="insights"><BarChart3 className="h-4 w-4 mr-2" />Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="mt-4 space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search features by name, id, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="max-w-md"
            />
            <Button variant="secondary" onClick={handleSearch} disabled={loading}>
              <Search className="h-4 w-4 mr-2" /> Search
            </Button>
          </div>

          {showRegister && (
            <Card>
              <CardHeader><CardTitle className="text-base">Register New Feature</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Feature ID *</Label>
                  <Input value={registerForm.feature_id} onChange={(e) => setRegisterForm(p => ({ ...p, feature_id: e.target.value }))} placeholder="molecular_weight" />
                </div>
                <div className="space-y-1">
                  <Label>Name *</Label>
                  <Input value={registerForm.name} onChange={(e) => setRegisterForm(p => ({ ...p, name: e.target.value }))} placeholder="Molecular Weight" />
                </div>
                <div className="space-y-1 col-span-2">
                  <Label>Description</Label>
                  <Input value={registerForm.description} onChange={(e) => setRegisterForm(p => ({ ...p, description: e.target.value }))} placeholder="Description of the feature" />
                </div>
                <div className="space-y-1">
                  <Label>Type</Label>
                  <Select value={registerForm.feature_type} onValueChange={(v) => setRegisterForm(p => ({ ...p, feature_type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="numeric">Numeric</SelectItem>
                      <SelectItem value="categorical">Categorical</SelectItem>
                      <SelectItem value="binary">Binary</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="vector">Vector</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Entity ID</Label>
                  <Input value={registerForm.entity_id} onChange={(e) => setRegisterForm(p => ({ ...p, entity_id: e.target.value }))} placeholder="molecule" />
                </div>
                <div className="space-y-1">
                  <Label>Owner</Label>
                  <Input value={registerForm.owner} onChange={(e) => setRegisterForm(p => ({ ...p, owner: e.target.value }))} placeholder="scientist" />
                </div>
                <div className="space-y-1">
                  <Label>Tags (comma separated)</Label>
                  <Input value={registerForm.tags} onChange={(e) => setRegisterForm(p => ({ ...p, tags: e.target.value }))} placeholder="molecular, basic" />
                </div>
                <div className="col-span-2 flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowRegister(false)}>Cancel</Button>
                  <Button onClick={handleRegister} disabled={!registerForm.feature_id || !registerForm.name}>Register</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {features.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        {searchQuery ? 'No features match your search.' : 'No features registered yet.'}
                      </TableCell>
                    </TableRow>
                  ) : features.map((f) => (
                    <TableRow key={f.feature_id}>
                      <TableCell className="font-mono text-xs">{f.feature_id}</TableCell>
                      <TableCell className="font-medium">{f.name}</TableCell>
                      <TableCell><Badge variant="secondary">{f.feature_type}</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{f.entity_id || '-'}</TableCell>
                      <TableCell className="text-xs">{f.owner || '-'}</TableCell>
                      <TableCell>v{f.version}</TableCell>
                      <TableCell>
                        {f.is_active
                          ? <Badge variant="success" className="gap-1"><CheckCircle className="h-3 w-3" />Active</Badge>
                          : <Badge variant="secondary" className="gap-1"><XCircle className="h-3 w-3" />Inactive</Badge>
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{total} total feature{total !== 1 ? 's' : ''}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
              <Button variant="outline" size="sm" disabled={page * 20 >= total} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="groups" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowCreateGroup(true)}>
              <Plus className="h-4 w-4 mr-2" /> Create Group
            </Button>
          </div>

          {showCreateGroup && (
            <Card>
              <CardHeader><CardTitle className="text-base">Create Feature Group</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Group ID *</Label>
                  <Input value={groupForm.group_id} onChange={(e) => setGroupForm(p => ({ ...p, group_id: e.target.value }))} placeholder="molecular-descriptors" />
                </div>
                <div className="space-y-1">
                  <Label>Name *</Label>
                  <Input value={groupForm.name} onChange={(e) => setGroupForm(p => ({ ...p, name: e.target.value }))} placeholder="Molecular Descriptors" />
                </div>
                <div className="space-y-1 col-span-2">
                  <Label>Description</Label>
                  <Input value={groupForm.description} onChange={(e) => setGroupForm(p => ({ ...p, description: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <Label>Category</Label>
                  <Input value={groupForm.category} onChange={(e) => setGroupForm(p => ({ ...p, category: e.target.value }))} placeholder="molecular" />
                </div>
                <div className="flex gap-2 justify-end col-span-2">
                  <Button variant="outline" onClick={() => setShowCreateGroup(false)}>Cancel</Button>
                  <Button onClick={handleCreateGroup} disabled={!groupForm.group_id || !groupForm.name}>Create</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Group ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groups.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">No groups created yet.</TableCell>
                    </TableRow>
                  ) : groups.map((g) => (
                    <TableRow key={g.group_id}>
                      <TableCell className="font-mono text-xs">{g.group_id}</TableCell>
                      <TableCell className="font-medium">{g.name}</TableCell>
                      <TableCell><Badge variant="outline">{g.category || 'Uncategorized'}</Badge></TableCell>
                      <TableCell>
                        {g.is_active
                          ? <Badge variant="success"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>
                          : <Badge variant="secondary">Inactive</Badge>
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="mt-4">
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="text-base">Feature Type Distribution</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(summary.feature_types).map(([type, count]) => (
                      <div key={type} className="flex items-center gap-3">
                        <span className="text-sm w-24 capitalize">{type}</span>
                        <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${(count / summary.total_features) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-8 text-right">{count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">Groups Overview</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {groups.slice(0, 10).map((g) => (
                      <div key={g.group_id} className="flex items-center justify-between text-sm">
                        <span>{g.name}</span>
                        <Badge variant="outline">{g.category || 'General'}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
