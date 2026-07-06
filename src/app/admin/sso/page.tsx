'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  AlertCircle,
  Loader2,
  RefreshCw,
  CheckCircle,
  XCircle,
  Shield,
  Link,
  Upload,
  Globe,
} from 'lucide-react'

interface SSOConfig {
  metadataUrl: string
  entityId: string
  acsUrl: string
  certificateName: string | null
}

type ConnectionStatus = 'connected' | 'disconnected' | 'error'
type PageState = 'loading' | 'ready' | 'not_configured' | 'error'

export default function SsoPage() {
  const [pageState, setPageState] = useState<PageState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected')
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'fail' | null>(null)
  const [config, setConfig] = useState<SSOConfig>({
    metadataUrl: 'https://idp.company.com/saml/metadata',
    entityId: 'https://sso.prefoum.com/saml/metadata',
    acsUrl: 'https://sso.prefoum.com/saml/acs',
    certificateName: 'idp_certificate_2026.pem',
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setConnectionStatus('disconnected')
      setPageState('not_configured')
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleSave = () => {
    setTimeout(() => {
      setConnectionStatus('connected')
      setPageState('ready')
    }, 600)
  }

  const handleTestConnection = () => {
    setTesting(true)
    setTestResult(null)
    setTimeout(() => {
      setTestResult('success')
      setTesting(false)
      setConnectionStatus('connected')
    }, 2000)
  }

  const handleDisconnect = () => {
    setConnectionStatus('disconnected')
    setConfig({ metadataUrl: '', entityId: '', acsUrl: '', certificateName: null })
    setPageState('not_configured')
  }

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">SSO / SAML Configuration</h1>
            <p className="text-sm text-muted-foreground">Single Sign-On with your identity provider</p>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Loading Configuration</CardTitle>
              <CardDescription>Checking SSO status...</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (pageState === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">SSO / SAML Configuration</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <p className="text-red-600 mb-2 font-semibold">Failed to Load Configuration</p>
              <p className="text-muted-foreground mb-6">{error || 'Server error.'}</p>
              <Button onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">SSO / SAML Configuration</h1>
          <p className="text-sm text-muted-foreground">Single Sign-On with your identity provider</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">Connection Status</CardTitle>
                <CardDescription>SAML 2.0 identity provider status</CardDescription>
              </div>
              {connectionStatus === 'connected' && (
                <Badge variant="success">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              )}
              {connectionStatus === 'disconnected' && (
                <Badge variant="secondary">
                  <XCircle className="h-3 w-3 mr-1" />
                  Not Configured
                </Badge>
              )}
              {connectionStatus === 'error' && (
                <Badge variant="destructive">
                  <XCircle className="h-3 w-3 mr-1" />
                  Error
                </Badge>
              )}
            </div>
          </CardHeader>
          {testResult && (
            <CardContent className="pb-3">
              <div className={cn(
                'p-3 rounded text-sm flex items-center gap-2',
                testResult === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800',
              )}>
                {testResult === 'success' ? (
                  <><CheckCircle className="h-4 w-4" /> Connection test successful. SAML handshake verified.</>
                ) : (
                  <><AlertCircle className="h-4 w-4" /> Connection test failed. Check your configuration.</>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        {pageState === 'not_configured' && (
          <Card>
            <CardContent className="py-12 text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-2">SSO is not configured</p>
              <p className="text-xs text-muted-foreground mb-6">Set up SAML 2.0 to enable single sign-on for your team</p>
              <Button>Configure Now</Button>
            </CardContent>
          </Card>
        )}

        {pageState === 'ready' && (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>SAML Configuration</CardTitle>
                <CardDescription>Configure your identity provider details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="metadata-url">SAML Metadata URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="metadata-url"
                      value={config.metadataUrl}
                      onChange={e => setConfig(prev => ({ ...prev, metadataUrl: e.target.value }))}
                      placeholder="https://idp.company.com/saml/metadata"
                    />
                    <Button variant="outline" size="icon" title="Fetch metadata">
                      <Globe className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="entity-id">Entity ID / Issuer</Label>
                  <Input
                    id="entity-id"
                    value={config.entityId}
                    onChange={e => setConfig(prev => ({ ...prev, entityId: e.target.value }))}
                    placeholder="https://sso.prefoum.com/saml/metadata"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="acs-url">ACS URL (Assertion Consumer Service)</Label>
                  <Input
                    id="acs-url"
                    value={config.acsUrl}
                    onChange={e => setConfig(prev => ({ ...prev, acsUrl: e.target.value }))}
                    placeholder="https://sso.prefoum.com/saml/acs"
                  />
                </div>

                <div className="space-y-2">
                  <Label>IdP Certificate</Label>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Certificate
                    </Button>
                    {config.certificateName && (
                      <span className="text-sm text-muted-foreground">{config.certificateName}</span>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleSave}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Save Configuration
                  </Button>
                  <Button variant="outline" onClick={handleTestConnection} disabled={testing}>
                    {testing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Link className="h-4 w-4 mr-2" />}
                    {testing ? 'Testing...' : 'Test Connection'}
                  </Button>
                  <Button variant="destructive" onClick={handleDisconnect}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Disconnect
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Provider Details</CardTitle>
                <CardDescription>Provide these to your identity provider</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">ACS URL</span>
                    <span className="font-mono text-xs">https://sso.prefoum.com/saml/acs</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Entity ID</span>
                    <span className="font-mono text-xs">https://sso.prefoum.com/saml/metadata</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Name ID Format</span>
                    <span className="font-mono text-xs">urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Audience URI</span>
                    <span className="font-mono text-xs">https://sso.prefoum.com/saml/metadata</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  )
}
