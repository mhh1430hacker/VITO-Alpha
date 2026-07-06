'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/lib/store'
import {
  Sparkles, ArrowRight, CheckCircle, Play, Zap, Users, Building2,
  Globe, Brain, ShieldCheck, BarChart3, FlaskConical, Package, Lightbulb,
  Clock, Target, MessageSquare, TrendingUp, ChevronLeft,
} from 'lucide-react'

type Step = 'welcome' | 'tour' | 'profile' | 'workspace' | 'ai-setup' | 'integrations' | 'complete'

const tourSteps = [
  { id: 'dashboard', title: 'Command Center', desc: 'Executive dashboard with KPIs, project status, and AI insights.', icon: BarChart3, duration: '3 min' },
  { id: 'formulation', title: 'Formulation Studio', desc: 'Design fragrance formulas with AI-assisted accord building.', icon: FlaskConical, duration: '5 min' },
  { id: 'materials', title: 'Materials Catalog', desc: 'Browse 10,000+ materials with safety data and pricing.', icon: Package, duration: '4 min' },
  { id: 'ai', title: 'AI Lab', desc: 'ML predictions for stability, longevity, and commercial success.', icon: Brain, duration: '4 min' },
  { id: 'compliance', title: 'Compliance Center', desc: 'Automated IFRA, REACH, CLP compliance checking.', icon: ShieldCheck, duration: '3 min' },
]

const quickGuides = [
  { title: 'Create your first formula', icon: FlaskConical, href: '/formulation-studio' },
  { title: 'Browse materials catalog', icon: Globe, href: '/materials/catalog' },
  { title: 'Run an AI prediction', icon: Brain, href: '/ai-lab/predictions' },
  { title: 'Check IFRA compliance', icon: ShieldCheck, href: '/compliance/ifra' },
]

const aiOptions = [
  { id: 'stability', label: 'Stability Prediction', desc: 'Predict fragrance stability over time', icon: Clock },
  { id: 'longevity', label: 'Longevity Analysis', desc: 'Estimate skin longevity', icon: TrendingUp },
  { id: 'accord', label: 'Accord Generation', desc: 'AI-suggested accords', icon: Sparkles },
  { id: 'commercial', label: 'Commercial Viability', desc: 'Market success probability', icon: Target },
  { id: 'alternatives', label: 'Alternative Suggestions', desc: 'Sustainable replacements', icon: Globe },
  { id: 'optimization', label: 'Cost Optimization', desc: 'Reduce cost, maintain quality', icon: BarChart3 },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [step, setStep] = useState<Step>('welcome')
  const [direction, setDirection] = useState(1)
  const [activeTour, setActiveTour] = useState('dashboard')
  const [completedSteps, setCompletedSteps] = useState<Set<Step>>(new Set(['welcome']))
  const [form, setForm] = useState({
    role: '', department: '', timezone: 'UTC', trainingFocus: [] as string[],
    workspaceName: user?.full_name ? `${user.full_name}'s Workspace` : 'My Workspace',
  })
  const [integrationsSelected, setIntegrationsSelected] = useState<string[]>([])

  const stepOrder: Step[] = ['welcome', 'tour', 'profile', 'workspace', 'ai-setup', 'integrations', 'complete']

  const goTo = (next: Step) => {
    const idx = stepOrder.indexOf(step)
    const target = stepOrder.indexOf(next)
    setDirection(target > idx ? 1 : -1)
    setStep(next)
    setCompletedSteps((p) => new Set([...p, next]))
  }

  const getProgress = () => {
    const done = stepOrder.filter((s) => completedSteps.has(s)).length
    return Math.round((done / stepOrder.length) * 100)
  }

  const stepVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 300 : -300, opacity: 0 }),
  }

  const finishOnboarding = () => router.push('/dashboard')

  return (
    <div className="min-h-screen bg-[#0A0D12] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ opacity: [0.03, 0.06, 0.03] }} transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-violet-500/10 via-transparent to-amber-500/5" />
      </div>

      <div className="relative w-full max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/50">Onboarding</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')} className="text-muted-foreground/40 hover:text-muted-foreground text-[12px]">
              Skip all <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          <div className="w-full h-1 bg-border/40 rounded-full overflow-hidden">
            <motion.div className="h-full bg-violet-500 rounded-full" animate={{ width: `${getProgress()}%` }} transition={{ duration: 0.5 }} />
          </div>
          <p className="text-[11px] text-muted-foreground/30 text-right mt-1">{getProgress()}% complete</p>
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div key={step} custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit"
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}>
            {step === 'welcome' && (
              <Card className="shadow-elevation-3">
                <CardHeader>
                  <CardTitle className="text-2xl">Welcome to VITO, {user?.full_name?.split(' ')[0] || 'there'}</CardTitle>
                  <CardDescription className="text-[14px]">Your luxury fragrance R&amp;D platform is ready. Let's get you set up in under 3 minutes.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-8">
                    {[
                      { icon: Target, title: 'Discover your workspace', desc: 'Tour the command center, formulation tools, and AI capabilities.' },
                      { icon: Users, title: 'Set up your profile', desc: 'Tell us your role and specialization for a tailored experience.' },
                      { icon: Building2, title: 'Configure your workspace', desc: 'Name your workspace and set regional preferences.' },
                      { icon: Brain, title: 'Enable AI features', desc: 'Choose which AI models to activate for your workflow.' },
                      { icon: Zap, title: 'Connect your tools', desc: 'Integrate with Slack, Teams, GitHub, and more.' },
                    ].map((item, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
                        className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
                        <div className="p-2 rounded-lg bg-violet-500/10"><item.icon className="h-4 w-4 text-violet-400" /></div>
                        <div><p className="text-[14px] font-medium text-foreground">{item.title}</p><p className="text-[12px] text-muted-foreground/50">{item.desc}</p></div>
                      </motion.div>
                    ))}
                  </div>
                  <Button onClick={() => goTo('tour')} className="w-full bg-violet-500 hover:bg-violet-600 text-white font-medium h-11">
                    Start Setup <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === 'tour' && (
              <Card className="shadow-elevation-3">
                <CardHeader>
                  <CardTitle className="text-xl">Platform Tour</CardTitle>
                  <CardDescription className="text-[13px]">Explore key areas of VITO. ~3 minutes.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {tourSteps.map((t) => (
                      <button key={t.id} onClick={() => setActiveTour(t.id)}
                        className={`shrink-0 px-3 py-2 rounded-lg text-[12px] font-medium transition-colors ${
                          activeTour === t.id ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' : 'bg-white/[0.02] text-muted-foreground/50 border border-border/40 hover:border-border'
                        }`}>{t.title}</button>
                    ))}
                  </div>
                  <motion.div key={activeTour} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                    {(() => { const t = tourSteps.find((x) => x.id === activeTour)!
                      return (
                        <div className="flex items-start gap-4 p-5 rounded-xl bg-white/[0.02] border border-border/40">
                          <div className="p-3 rounded-xl bg-violet-500/10"><t.icon className="h-6 w-6 text-violet-400" /></div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1"><h3 className="text-[16px] font-semibold">{t.title}</h3><Badge variant="outline" className="text-[10px] border-border/40">{t.duration}</Badge></div>
                            <p className="text-[13px] text-muted-foreground/60 leading-relaxed">{t.desc}</p>
                          </div>
                        </div>
                      )})()}
                  </motion.div>
                  <div className="flex justify-between items-center mt-6">
                    <Button variant="ghost" onClick={() => goTo('welcome')} className="text-muted-foreground"><ChevronLeft className="h-4 w-4 mr-1" /> Back</Button>
                    <div className="flex items-center gap-1.5">
                      {tourSteps.map((t, i) => (
                        <div key={t.id} className={`h-1.5 rounded-full ${i <= tourSteps.findIndex((x) => x.id === activeTour) ? 'w-4 bg-violet-500/60' : 'w-1.5 bg-border/40'}`} />
                      ))}
                    </div>
                    <Button onClick={() => goTo('profile')} className="bg-violet-500 hover:bg-violet-600 text-white font-medium">Continue <ArrowRight className="h-4 w-4 ml-1.5" /></Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 'profile' && (
              <Card className="shadow-elevation-3">
                <CardHeader>
                  <CardTitle className="text-xl">Your Profile</CardTitle>
                  <CardDescription className="text-[13px]">Help us personalize VITO for your role.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground/70 text-[12px]">Your Role</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Founder', 'Executive', 'Master Perfumer', 'R&D Director', 'Compliance Officer', 'AI Researcher', 'Procurement Manager', 'Laboratory Scientist', 'Operations Analyst'].map((r) => (
                        <button key={r} onClick={() => setForm({ ...form, role: r })}
                          className={`text-left px-3 py-2.5 rounded-lg border text-[13px] transition-colors ${form.role === r ? 'border-violet-500/50 bg-violet-500/10 text-violet-400' : 'border-border/60 bg-white/[0.01] text-muted-foreground hover:border-border'}`}>{r}</button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground/70 text-[12px]">Department</Label>
                    <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="R&D, Quality, Production..." className="bg-white/[0.02] border-border/60 h-11 text-[14px]" />
                  </div>
                  <div className="flex justify-between pt-2">
                    <Button variant="ghost" onClick={() => goTo('tour')} className="text-muted-foreground"><ChevronLeft className="h-4 w-4 mr-1" /> Back</Button>
                    <Button onClick={() => goTo('workspace')} className="bg-violet-500 hover:bg-violet-600 text-white font-medium">Continue <ArrowRight className="h-4 w-4 ml-1.5" /></Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 'workspace' && (
              <Card className="shadow-elevation-3">
                <CardHeader>
                  <CardTitle className="text-xl">Workspace Configuration</CardTitle>
                  <CardDescription className="text-[13px]">Name your workspace and set preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground/70 text-[12px]">Workspace Name</Label>
                    <Input value={form.workspaceName} onChange={(e) => setForm({ ...form, workspaceName: e.target.value })} className="bg-white/[0.02] border-border/60 h-11 text-[14px]" />
                  </div>
                  <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/10">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                      <div><p className="text-[13px] font-medium text-violet-300/80">Pro Tip</p><p className="text-[12px] text-violet-400/40">Name your workspace after your team or lab for easy identification.</p></div>
                    </div>
                  </div>
                  <div className="flex justify-between pt-2">
                    <Button variant="ghost" onClick={() => goTo('profile')} className="text-muted-foreground"><ChevronLeft className="h-4 w-4 mr-1" /> Back</Button>
                    <Button onClick={() => goTo('ai-setup')} className="bg-violet-500 hover:bg-violet-600 text-white font-medium">Continue <ArrowRight className="h-4 w-4 ml-1.5" /></Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 'ai-setup' && (
              <Card className="shadow-elevation-3">
                <CardHeader>
                  <CardTitle className="text-xl">AI Preferences</CardTitle>
                  <CardDescription className="text-[13px]">Select AI capabilities to activate for your workspace.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {aiOptions.map((opt) => {
                    const active = form.trainingFocus.includes(opt.id)
                    return (
                      <button key={opt.id} onClick={() => setForm({ ...form, trainingFocus: active ? form.trainingFocus.filter((x: string) => x !== opt.id) : [...form.trainingFocus, opt.id] })}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-start gap-4 ${active ? 'border-violet-500/50 bg-violet-500/5' : 'border-border/40 bg-white/[0.01] hover:border-border'}`}>
                        <div className={`p-2.5 rounded-lg ${active ? 'bg-violet-500/20' : 'bg-white/[0.02]'}`}><opt.icon className={`h-4 w-4 ${active ? 'text-violet-400' : 'text-muted-foreground/30'}`} /></div>
                        <div className="flex-1"><p className={`text-[14px] font-medium ${active ? 'text-foreground' : 'text-muted-foreground/60'}`}>{opt.label}</p><p className="text-[12px] text-muted-foreground/40 mt-0.5">{opt.desc}</p></div>
                        {active && <CheckCircle className="h-4 w-4 text-violet-400 shrink-0 mt-1" />}
                      </button>
                    )
                  })}
                  <div className="flex justify-between pt-4">
                    <Button variant="ghost" onClick={() => goTo('workspace')} className="text-muted-foreground"><ChevronLeft className="h-4 w-4 mr-1" /> Back</Button>
                    <Button onClick={() => goTo('integrations')} className="bg-violet-500 hover:bg-violet-600 text-white font-medium">Continue <ArrowRight className="h-4 w-4 ml-1.5" /></Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 'integrations' && (
              <Card className="shadow-elevation-3">
                <CardHeader>
                  <CardTitle className="text-xl">Connect Your Tools</CardTitle>
                  <CardDescription className="text-[13px]">Integrate with your existing workflow tools.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[{ id: 'slack', name: 'Slack', desc: 'Notifications and alerts' }, { id: 'teams', name: 'Microsoft Teams', desc: 'Collaboration integration' }, { id: 'github', name: 'GitHub', desc: 'Formula version control' }, { id: 'jira', name: 'Jira', desc: 'Project tracking sync' }].map((int) => {
                    const active = integrationsSelected.includes(int.id)
                    return (
                      <button key={int.id} onClick={() => setIntegrationsSelected((p) => active ? p.filter((x) => x !== int.id) : [...p, int.id])}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-center justify-between ${active ? 'border-violet-500/50 bg-violet-500/5' : 'border-border/40 bg-white/[0.01] hover:border-border'}`}>
                        <div><p className={`text-[14px] font-medium ${active ? 'text-foreground' : 'text-muted-foreground/60'}`}>{int.name}</p><p className="text-[12px] text-muted-foreground/40">{int.desc}</p></div>
                        {active ? <Badge variant="outline" className="text-[10px] border-violet-500/20 text-violet-400/70">Connected</Badge> : <span className="text-[11px] text-muted-foreground/30">Connect</span>}
                      </button>
                    )
                  })}
                  <div className="flex justify-between pt-4">
                    <Button variant="ghost" onClick={() => goTo('ai-setup')} className="text-muted-foreground"><ChevronLeft className="h-4 w-4 mr-1" /> Back</Button>
                    <Button onClick={() => goTo('complete')} className="bg-violet-500 hover:bg-violet-600 text-white font-medium">Continue <ArrowRight className="h-4 w-4 ml-1.5" /></Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 'complete' && (
              <Card className="shadow-elevation-3">
                <CardContent className="p-12 text-center">
                  <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.6, delay: 0.2 }}
                    className="inline-flex p-4 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl mb-6 shadow-lg shadow-violet-500/20">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-semibold text-foreground mb-2">You're all set!</h2>
                  <p className="text-muted-foreground/60 text-[14px] mb-8 max-w-md mx-auto">
                    Your VITO workspace is configured and ready. Start creating fragrance formulas with AI-powered insights.
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-8 max-w-sm mx-auto">
                    {quickGuides.map((g, i) => (
                      <motion.a key={i} href={g.href} whileHover={{ y: -2 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                        className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-border/40 text-[12px] text-muted-foreground hover:text-foreground hover:border-border transition-colors">
                        <g.icon className="h-3.5 w-3.5 text-violet-400/60" />{g.title}
                      </motion.a>
                    ))}
                  </div>
                  <Button onClick={finishOnboarding} className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-medium px-8 h-11">
                    Go to Dashboard <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}