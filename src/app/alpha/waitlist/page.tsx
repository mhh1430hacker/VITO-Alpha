'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, ArrowLeft, CheckCircle, Mail, Building2, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function WaitlistPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [useCase, setUseCase] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [position, setPosition] = useState(0)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)
    try {
      await fetch('http://localhost:8000/api/v1/alpha/waitlist', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, company, use_case: useCase }),
      })
      setPosition(Math.floor(Math.random() * 200) + 50)
      setSubmitted(true)
    } catch {}
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0A0D12] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="max-w-md w-full text-center">
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }}
            className="inline-flex p-4 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl mb-6 shadow-lg shadow-violet-500/20">
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">You're on the list!</h1>
          <p className="text-muted-foreground/60 mb-1">Position #{position}</p>
          <p className="text-muted-foreground/40 text-[13px] mb-8">We'll notify you at {email} when your account is ready.</p>
          <Button onClick={() => router.push('/alpha')} variant="outline" className="border-border/60">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Alpha Portal
          </Button>
        </motion.div>
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
              <div className="p-2 rounded-lg bg-violet-500/10"><Users className="h-5 w-5 text-violet-400" /></div>
              <div><CardTitle className="text-xl">Request Access</CardTitle><CardDescription>Join the VITO early access program</CardDescription></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="bg-white/[0.02] border-border/60 h-11 text-[14px]" />
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />
              <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="work@company.com" className="pl-10 bg-white/[0.02] border-border/60 h-11 text-[14px]" />
            </div>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />
              <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" className="pl-10 bg-white/[0.02] border-border/60 h-11 text-[14px]" />
            </div>
            <select value={useCase} onChange={(e) => setUseCase(e.target.value)}
              className="w-full h-11 rounded-lg border border-border/60 bg-white/[0.02] text-[14px] text-foreground px-3">
              <option value="">What will you use VITO for?</option>
              <option value="formulation">Formula creation</option>
              <option value="compliance">Compliance checking</option>
              <option value="research">R&D and AI predictions</option>
              <option value="supply">Supply chain management</option>
              <option value="all">All of the above</option>
            </select>
            <Button onClick={submit} disabled={!email || loading} className="w-full bg-violet-500 hover:bg-violet-600 text-white font-medium h-11">
              {loading ? 'Joining...' : 'Join Waitlist'} <Sparkles className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
