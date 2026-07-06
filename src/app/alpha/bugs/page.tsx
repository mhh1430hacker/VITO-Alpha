'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Bug, ArrowLeft, AlertTriangle, Globe, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'

const severities = ['minor', 'moderate', 'major', 'critical']

export default function BugPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState('minor')
  const [pageUrl, setPageUrl] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const submit = async () => {
    try {
      await fetch('http://localhost:8000/api/v1/alpha/bugs', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, title, description, severity, page_url: pageUrl }),
      })
      setSubmitted(true)
    } catch {}
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0A0D12] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Bug Reported</h1>
          <p className="text-muted-foreground/50 mb-8">Thank you! Our team will investigate.</p>
          <Button onClick={() => router.push('/alpha')} variant="outline" className="border-border/60">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0D12] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg w-full">
        <button onClick={() => router.push('/alpha')} className="text-muted-foreground/40 hover:text-muted-foreground text-[13px] mb-8 flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" /> Alpha Portal
        </button>
        <Card className="shadow-elevation-3">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-rose-500/10"><Bug className="h-5 w-5 text-rose-400" /></div>
              <div><CardTitle className="text-xl">Report Bug</CardTitle><CardDescription>Help us squash issues before launch</CardDescription></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Brief title of the issue" className="bg-white/[0.02] border-border/60 h-11 text-[14px]" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what happened..." rows={5}
              className="w-full rounded-lg border border-border/60 bg-white/[0.02] text-[14px] text-foreground px-3 py-3 resize-none placeholder:text-muted-foreground/30" />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[12px] text-muted-foreground/50 mb-1">Severity</p>
                <select value={severity} onChange={(e) => setSeverity(e.target.value)}
                  className="w-full h-10 rounded-lg border border-border/60 bg-white/[0.02] text-[13px] text-foreground px-3">
                  {severities.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <p className="text-[12px] text-muted-foreground/50 mb-1">Your Email</p>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Optional" className="bg-white/[0.02] border-border/60 h-10 text-[13px]" />
              </div>
            </div>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />
              <Input value={pageUrl} onChange={(e) => setPageUrl(e.target.value)} placeholder="Page URL (optional)" className="pl-10 bg-white/[0.02] border-border/60 h-11 text-[14px]" />
            </div>
            <Button onClick={submit} disabled={!title || !description} className="w-full bg-rose-500 hover:bg-rose-600 text-white font-medium h-11">
              <Send className="h-4 w-4 mr-2" /> Submit Report
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
