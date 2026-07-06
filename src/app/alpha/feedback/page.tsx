'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, ArrowLeft, Star, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'

const categories = ['general', 'feature_request', 'ux', 'performance', 'security', 'other']

export default function FeedbackPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [category, setCategory] = useState('general')
  const [rating, setRating] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const submit = async () => {
    try {
      await fetch('http://localhost:8000/api/v1/alpha/feedback', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message, category, rating: rating || undefined }),
      })
      setSubmitted(true)
    } catch {}
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0A0D12] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Feedback Submitted</h1>
          <p className="text-muted-foreground/50 mb-8">Thank you for helping us improve VITO.</p>
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
              <div className="p-2 rounded-lg bg-amber-500/10"><MessageSquare className="h-5 w-5 text-amber-400" /></div>
              <div><CardTitle className="text-xl">Feedback</CardTitle><CardDescription>Help shape VITO's future</CardDescription></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email (optional)" className="bg-white/[0.02] border-border/60 h-11 text-[14px]" />
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setRating(n)}>
                  <Star className={`h-6 w-6 ${n <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/20'}`} />
                </button>
              ))}
            </div>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full h-11 rounded-lg border border-border/60 bg-white/[0.02] text-[14px] text-foreground px-3">
              {categories.map((c) => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
            </select>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Share your thoughts..." rows={5}
              className="w-full rounded-lg border border-border/60 bg-white/[0.02] text-[14px] text-foreground px-3 py-3 resize-none placeholder:text-muted-foreground/30" />
            <Button onClick={submit} disabled={!message} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium h-11">
              <Send className="h-4 w-4 mr-2" /> Submit Feedback
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
