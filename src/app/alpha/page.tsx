'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Sparkles, ArrowRight, Users, MessageSquare, Bug, Map, Mail, CheckCircle } from 'lucide-react'

export default function AlphaPortalPage() {
  return (
    <div className="min-h-screen bg-[#0A0D12]">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <motion.div whileHover={{ scale: 1.05 }} className="inline-flex p-3 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl mb-6 shadow-lg shadow-violet-500/20">
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight mb-4">VITO Public Alpha</h1>
          <p className="text-muted-foreground/60 text-lg max-w-xl mx-auto">
            We&apos;re opening VITO to early adopters. Join the waitlist, shape the product, and get priority access.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {[
            { href: '/alpha/waitlist', icon: Users, title: 'Request Access', desc: 'Join the waitlist for early access. Priority for fragrance professionals.', color: 'from-violet-500 to-purple-500', stat: '1,200+ waiting' },
            { href: '/alpha/feedback', icon: MessageSquare, title: 'Feedback Portal', desc: 'Share your thoughts on features, UX, and what you need from VITO.', color: 'from-amber-500 to-orange-500', stat: '340 suggestions' },
            { href: '/alpha/bugs', icon: Bug, title: 'Bug Submission', desc: 'Found an issue? Help us make VITO production-ready.', color: 'from-rose-500 to-red-500', stat: '47 reports' },
            { href: '/alpha/roadmap', icon: Map, title: 'Public Roadmap', desc: 'See what we are building and vote on features you need most.', color: 'from-teal-500 to-cyan-500', stat: '12 features' },
          ].map((item) => (
            <motion.a key={item.href} href={item.href} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="block p-6 rounded-2xl border border-border/60 bg-[#171C24] hover:border-violet-500/20 transition-colors group">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} shadow-lg`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[16px] font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-[13px] text-muted-foreground/60 mb-3">{item.desc}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px] border-violet-500/20 text-violet-400">{item.stat}</Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/20 group-hover:text-violet-400/50 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="text-center p-8 rounded-2xl border border-violet-500/10 bg-violet-500/[0.02]">
          <p className="text-muted-foreground/40 text-[13px]">
            Already have access? <a href="/login" className="text-violet-400/60 hover:text-violet-400">Sign in</a>.
            New to VITO? <a href="/signup" className="text-violet-400/60 hover:text-violet-400">Create an account</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
