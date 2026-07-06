'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { demoAPI } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import {
  Sparkles, ArrowRight, ArrowLeft, Check, Mail, Lock, User, Building2,
  Users, Globe, Briefcase, Zap, Server, Shield, Brain, BarChart3, FlaskConical,
  CheckCircle, Loader2,
} from 'lucide-react'

type Step = 1 | 2 | 3 | 4 | 5

interface FormData {
  fullName: string
  email: string
  password: string
  companyName: string
  industry: string
  companySize: string
  teamMembers: { email: string; role: string }[]
  modules: string[]
}

const industries = ['Fragrance & Cosmetics', 'Flavors & Food', 'Pharmaceuticals', 'Chemical Manufacturing', 'Research & Academia', 'Consumer Goods', 'Other']
const companySizes = ['1-10', '11-50', '51-200', '201-500', '500+']
const roles = ['Perfumer', 'R&D Manager', 'Compliance Officer', 'Operations Manager', 'Executive', 'AI Engineer', 'Researcher', 'Laboratory Scientist']

const availableModules = [
  { id: 'formulation', label: 'Formulation Studio', icon: FlaskConical, desc: 'Design and analyze fragrance formulas' },
  { id: 'materials', label: 'Materials Management', icon: Globe, desc: 'Catalog, inventory, and pricing' },
  { id: 'ai', label: 'AI Predictions', icon: Brain, desc: 'ML-powered optimization and insights' },
  { id: 'compliance', label: 'Compliance Center', icon: Shield, desc: 'IFRA, REACH, CLP tracking' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, desc: 'Performance and trend reports' },
  { id: 'supply', label: 'Supply Chain', icon: Server, desc: 'Supplier and contract management' },
]

const formVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 400 : -400, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 400 : -400, opacity: 0 }),
}

export default function SignupPage() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [step, setStep] = useState<Step>(1)
  const [direction, setDirection] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState<FormData>({
    fullName: '', email: '', password: '', companyName: '',
    industry: '', companySize: '', teamMembers: [{ email: '', role: '' }],
    modules: [],
  })

  const updateField = (field: keyof FormData, value: any) => {
    setForm((p) => ({ ...p, [field]: value }))
    setError('')
  }

  const nextStep = () => { setDirection(1); setStep((s) => Math.min(5, s + 1) as Step) }
  const prevStep = () => { setDirection(-1); setStep((s) => Math.max(1, s - 1) as Step) }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await demoAPI.provision({
        company_name: form.companyName,
        email: form.email,
        full_name: form.fullName,
        password: form.password,
      })
      const { access_token, refresh_token, user } = res.data as any
      if (access_token) {
        localStorage.setItem('access_token', access_token)
        if (refresh_token) localStorage.setItem('refresh_token', refresh_token)
        setAuth(user, access_token, refresh_token)
      }
      setSuccess(true)
      setTimeout(() => router.push('/onboarding'), 2500)
    } catch (err: any) {
      const detail = err.response?.data?.detail || 'Registration failed. Please try again.'
      setError(detail)
    } finally {
      setLoading(false)
    }
  }

  const canProceed = (): boolean => {
    if (step === 1) return !!form.fullName && !!form.email && form.email.includes('@') && form.password.length >= 8
    if (step === 2) return !!form.companyName && !!form.industry
    if (step === 3) return true
    if (step === 4) return form.modules.length > 0
    return true
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0D12] overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMDgiPjxwYXRoIGQ9Ik0zNiAzNHYySDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyek0yNCA0NGgxMnYySDI0di0yek0yNCAxNGgxMnYySDI0di0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.15, 0.08] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-violet-500/20 via-purple-500/10 to-transparent rounded-full blur-[140px]" />
        <motion.div animate={{ scale: [1.15, 1, 1.15], opacity: [0.08, 0.12, 0.08] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-amber-500/15 via-gold-500/10 to-transparent rounded-full blur-[140px]" />
      </div>

      <div className="relative w-full max-w-2xl mx-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-center mb-8">
          <motion.div whileHover={{ scale: 1.05 }} className="inline-flex p-3 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl mb-4 shadow-lg shadow-violet-500/20">
            <Sparkles className="w-7 h-7 text-white" />
          </motion.div>
          <h1 className="text-[28px] font-semibold text-foreground tracking-tight">VITO</h1>
          <p className="text-muted-foreground/50 mt-1 text-[13px]">Luxury Fragrance R&D Platform</p>
        </motion.div>

        {!success && (
          <>
            <div className="flex items-center justify-center gap-1 mb-8">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="flex items-center">
                  <motion.div
                    animate={{ scale: step === s ? 1.1 : 1 }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold border transition-colors ${
                      s < step ? 'bg-violet-500 border-violet-500 text-white' :
                      s === step ? 'border-violet-500 text-violet-400 bg-violet-500/10' :
                      'border-border/60 text-muted-foreground/40'
                    }`}
                  >
                    {s < step ? <Check className="h-3.5 w-3.5" /> : s}
                  </motion.div>
                  {s < 5 && <div className={`w-8 h-px mx-1 ${s < step ? 'bg-violet-500/50' : 'bg-border/40'}`} />}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={formVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              >
                <div className="rounded-2xl border border-border/60 bg-[#171C24] shadow-elevation-3 p-8">
                  {step === 1 && (
                    <Step1 form={form} updateField={updateField} />
                  )}
                  {step === 2 && (
                    <Step2 form={form} updateField={updateField} />
                  )}
                  {step === 3 && (
                    <Step3 form={form} updateField={updateField} />
                  )}
                  {step === 4 && (
                    <Step4 form={form} updateField={updateField} />
                  )}
                  {step === 5 && (
                    <Step5 form={form} />
                  )}

                  {error && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                      className="mt-4 text-[13px] px-3 py-2 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400">
                      {error}
                    </motion.div>
                  )}

                  <div className="flex items-center justify-between mt-8">
                    <div>
                      {step > 1 && (
                        <Button variant="ghost" onClick={prevStep} className="text-muted-foreground hover:text-foreground">
                          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground/40">Step {step} of 5</span>
                      {step < 5 ? (
                        <Button onClick={nextStep} disabled={!canProceed()} className="bg-violet-500 hover:bg-violet-600 text-white font-medium px-5">
                          Continue <ArrowRight className="h-4 w-4 ml-1.5" />
                        </Button>
                      ) : (
                        <Button onClick={handleSubmit} disabled={loading} className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-medium px-5">
                          {loading ? (
                            <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Creating...</>
                          ) : (
                            <>Create Workspace <Zap className="h-4 w-4 ml-1.5" /></>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </>
        )}

        {success && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="rounded-2xl border border-violet-500/20 bg-[#171C24] shadow-elevation-3 p-12 text-center">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex p-4 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl mb-6 shadow-lg shadow-violet-500/20">
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">Workspace Created</h2>
            <p className="text-muted-foreground/60 text-[14px] mb-6">Your VITO workspace is ready. Redirecting to onboarding...</p>
            <div className="w-48 h-1 mx-auto bg-border/40 rounded-full overflow-hidden">
              <motion.div className="h-full bg-violet-500 rounded-full" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 2.5, ease: 'easeOut' }} />
            </div>
          </motion.div>
        )}

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-center text-muted-foreground/20 text-[11px] mt-6">
          Already have an account? <a href="/login" className="text-violet-400/50 hover:text-violet-400 transition-colors">Sign in</a>
        </motion.p>
      </div>
    </div>
  )
}

function Step1({ form, updateField }: { form: FormData; updateField: (f: keyof FormData, v: any) => void }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-1">Create your account</h2>
      <p className="text-muted-foreground/50 text-[13px] mb-6">Start your 14-day free trial. No credit card required.</p>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-muted-foreground/70 text-[12px]">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
            <Input value={form.fullName} onChange={(e) => updateField('fullName', e.target.value)}
              placeholder="Dr. Sarah Chen" className="pl-10 bg-white/[0.02] border-border/60 h-11 text-[14px]" />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground/70 text-[12px]">Work Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
            <Input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)}
              placeholder="sarah@fragrancehouse.com" className="pl-10 bg-white/[0.02] border-border/60 h-11 text-[14px]" />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground/70 text-[12px]">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
            <Input type="password" value={form.password} onChange={(e) => updateField('password', e.target.value)}
              placeholder="Minimum 8 characters" className="pl-10 bg-white/[0.02] border-border/60 h-11 text-[14px]" />
          </div>
          {form.password.length > 0 && form.password.length < 8 && (
            <p className="text-[11px] text-amber-400/60">Password must be at least 8 characters</p>
          )}
        </div>
      </div>
    </div>
  )
}

function Step2({ form, updateField }: { form: FormData; updateField: (f: keyof FormData, v: any) => void }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-1">Create your company</h2>
      <p className="text-muted-foreground/50 text-[13px] mb-6">Set up your organization profile.</p>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-muted-foreground/70 text-[12px]">Company Name</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
            <Input value={form.companyName} onChange={(e) => updateField('companyName', e.target.value)}
              placeholder="Maison de Parfum" className="pl-10 bg-white/[0.02] border-border/60 h-11 text-[14px]" />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground/70 text-[12px]">Industry</Label>
          <div className="grid grid-cols-2 gap-2">
            {industries.map((ind) => (
              <button key={ind} type="button" onClick={() => updateField('industry', ind)}
                className={`text-left px-3 py-2.5 rounded-lg border text-[13px] transition-colors ${
                  form.industry === ind ? 'border-violet-500/50 bg-violet-500/10 text-violet-400' : 'border-border/60 bg-white/[0.01] text-muted-foreground hover:border-border'
                }`}>
                {ind}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground/70 text-[12px]">Company Size</Label>
          <div className="flex gap-2">
            {companySizes.map((size) => (
              <button key={size} type="button" onClick={() => updateField('companySize', size)}
                className={`px-4 py-2 rounded-lg border text-[13px] transition-colors ${
                  form.companySize === size ? 'border-violet-500/50 bg-violet-500/10 text-violet-400' : 'border-border/60 bg-white/[0.01] text-muted-foreground hover:border-border'
                }`}>
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Step3({ form, updateField }: { form: FormData; updateField: (f: keyof FormData, v: any) => void }) {
  const addMember = () => updateField('teamMembers', [...form.teamMembers, { email: '', role: '' }])
  const removeMember = (i: number) => updateField('teamMembers', form.teamMembers.filter((_, idx) => idx !== i))
  const updateMember = (i: number, field: 'email' | 'role', value: string) => {
    const updated = [...form.teamMembers]
    updated[i] = { ...updated[i], [field]: value }
    updateField('teamMembers', updated)
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-1">Invite your team</h2>
      <p className="text-muted-foreground/50 text-[13px] mb-6">Add colleagues who will collaborate on formulations.</p>
      <div className="space-y-3">
        {form.teamMembers.map((member, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
              <Input placeholder="colleague@company.com" value={member.email} onChange={(e) => updateMember(i, 'email', e.target.value)}
                className="pl-10 bg-white/[0.02] border-border/60 h-10 text-[13px]" />
            </div>
            <select value={member.role} onChange={(e) => updateMember(i, 'role', e.target.value)}
              className="w-40 h-10 rounded-lg border border-border/60 bg-white/[0.02] text-[13px] text-foreground px-3 focus:outline-none focus:border-violet-500/50">
              <option value="">Select role</option>
              {roles.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            {form.teamMembers.length > 1 && (
              <button onClick={() => removeMember(i)} className="text-muted-foreground/30 hover:text-red-400 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            )}
          </motion.div>
        ))}
        <Button variant="ghost" onClick={addMember} className="text-muted-foreground/50 hover:text-muted-foreground text-[13px]">
          + Add team member
        </Button>
      </div>
      <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-border/40">
        <p className="text-[12px] text-muted-foreground/50">Invitations will be sent after workspace creation. You can also skip this step and invite later.</p>
      </div>
    </div>
  )
}

function Step4({ form, updateField }: { form: FormData; updateField: (f: keyof FormData, v: any) => void }) {
  const toggleModule = (id: string) => {
    const next = form.modules.includes(id) ? form.modules.filter((m) => m !== id) : [...form.modules, id]
    updateField('modules', next)
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-1">Configure modules</h2>
      <p className="text-muted-foreground/50 text-[13px] mb-6">Select the platform capabilities for your workspace.</p>
      <div className="grid grid-cols-2 gap-3">
        {availableModules.map((mod) => {
          const selected = form.modules.includes(mod.id)
          return (
            <motion.button key={mod.id} type="button" whileHover={{ y: -2 }} onClick={() => toggleModule(mod.id)}
              className={`text-left p-4 rounded-xl border transition-all duration-150 ${
                selected ? 'border-violet-500/50 bg-violet-500/5 shadow-[0_0_16px_rgba(139,92,246,0.06)]' : 'border-border/60 bg-white/[0.01] hover:border-border'
              }`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${selected ? 'bg-violet-500/20' : 'bg-white/[0.03]'}`}>
                  <mod.icon className={`h-4 w-4 ${selected ? 'text-violet-400' : 'text-muted-foreground/40'}`} />
                </div>
                <div>
                  <p className={`text-[13px] font-medium ${selected ? 'text-foreground' : 'text-muted-foreground/70'}`}>{mod.label}</p>
                  <p className="text-[11px] text-muted-foreground/40 mt-0.5">{mod.desc}</p>
                </div>
              </div>
              {selected && <div className="mt-2 flex items-center gap-1 text-[11px] text-violet-400/60"><CheckCircle className="h-3 w-3" /> Enabled</div>}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

function Step5({ form }: { form: FormData }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-1">Review your workspace</h2>
      <p className="text-muted-foreground/50 text-[13px] mb-6">Confirm your configuration before creation.</p>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-border/40">
            <p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground/40 mb-1">Account</p>
            <p className="text-[13px] text-foreground font-medium">{form.fullName}</p>
            <p className="text-[11px] text-muted-foreground/50">{form.email}</p>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-border/40">
            <p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground/40 mb-1">Company</p>
            <p className="text-[13px] text-foreground font-medium">{form.companyName}</p>
            <p className="text-[11px] text-muted-foreground/50">{form.industry}{form.companySize ? ` · ${form.companySize} employees` : ''}</p>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.02] border border-border/40">
          <p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground/40 mb-2">Team ({form.teamMembers.filter(t => t.email).length} members)</p>
          {form.teamMembers.filter(t => t.email).length === 0 ? (
            <p className="text-[12px] text-muted-foreground/40">No team members added — you can invite later</p>
          ) : (
            form.teamMembers.filter(t => t.email).map((m, i) => (
              <div key={i} className="flex items-center justify-between py-1 text-[12px]">
                <span className="text-muted-foreground">{m.email}</span>
                <span className="text-muted-foreground/40">{m.role}</span>
              </div>
            ))
          )}
        </div>
        <div className="p-3 rounded-xl bg-white/[0.02] border border-border/40">
          <p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground/40 mb-2">Modules ({form.modules.length} selected)</p>
          <div className="flex flex-wrap gap-1.5">
            {form.modules.map((id) => {
              const mod = availableModules.find((m) => m.id === id)
              return mod ? <Badge key={id} variant="outline" className="text-[11px] border-violet-500/20 text-violet-400/80">{mod.label}</Badge> : null
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
