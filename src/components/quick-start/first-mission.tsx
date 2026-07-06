'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useIntelligenceContext } from '@/lib/intelligence'
import { loadMission, saveMission, completeStep, dismissMission, type MissionState, type MissionStep } from '@/lib/intelligence/first-mission'
import { Confetti } from '@/components/intelligence/confetti'

const STEP_ICONS: Record<MissionStep, string> = {
  create_formula: '🧪',
  run_prediction: '🤖',
  explore: '🚀',
}

const STEP_LABELS: Record<MissionStep, string> = {
  create_formula: 'Create Your First Formula',
  run_prediction: 'Run Your First AI Prediction',
  explore: 'Explore the Platform',
}

const STEP_DESCRIPTIONS: Record<MissionStep, string> = {
  create_formula: 'Every great fragrance starts with a single note. Let\'s create yours.',
  run_prediction: 'See how AI analyzes your formula — unexpected accords await.',
  explore: 'Your platform is ready. Discover what you can do.',
}

export function FirstMission({ onComplete }: { onComplete: () => void }) {
  const router = useRouter()
  const { track, streak } = useIntelligenceContext()
  const [mission, setMission] = useState<MissionState>(loadMission)
  const [formulaName, setFormulaName] = useState('')
  const [formulaNotes, setFormulaNotes] = useState('')
  const [createdFormula, setCreatedFormula] = useState<{ name: string; notes: string } | null>(null)
  const [predictionResult, setPredictionResult] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const m = loadMission()
    setMission(m)
    if (m.completed) onComplete()
  }, [])

  const handleCreateFormula = () => {
    const name = formulaName.trim() || 'My First Signature'
    const formula = { name, notes: formulaNotes.trim() || 'A bold opening with warm undertones' }
    setCreatedFormula(formula)
    const updated = completeStep(mission, 'create_formula')
    setMission(updated)
    track('create_formula')

    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('vito_formulas') || '[]')
      existing.push({ ...formula, id: Date.now(), createdAt: new Date().toISOString(), materials: [] })
      localStorage.setItem('vito_formulas', JSON.stringify(existing))
    }
  }

  const handleRunPrediction = () => {
    setPredictionResult('High compatibility predicted with Ambroxan, Iso E Super, and Hedione. Unexpected synergy with Bergamot detected.')
    const updated = completeStep(mission, 'run_prediction')
    setMission(updated)
    track('run_prediction')

    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('vito_predictions') || '[]')
      existing.push({ id: Date.now(), formula: createdFormula?.name, result: predictionResult || 'Analyzing...', createdAt: new Date().toISOString() })
      localStorage.setItem('vito_predictions', JSON.stringify(existing))
    }
  }

  const handleExplore = () => {
    const updated = completeStep(mission, 'explore')
    setMission(updated)
    setShowConfetti(true)
    track('complete_mission')
    setTimeout(() => {
      setShowConfetti(false)
      dismissMission(mission)
      onComplete()
    }, 1500)
  }

  const handleDismiss = () => {
    dismissMission(mission)
    onComplete()
  }

  const progressPercent = mission.formulaCreated ? (mission.predictionRun ? 100 : 66) : 33

  return (
    <>
      <Confetti trigger={showConfetti} duration={2000} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{STEP_ICONS[mission.currentStep]}</span>
            <div>
              <h1 className="text-xl font-semibold text-white">Your First Mission</h1>
              <p className="text-sm text-white/50">3 steps to master VITO</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            {(['create_formula', 'run_prediction', 'explore'] as const).map((step, i) => (
              <div key={step} className="flex items-center gap-2 flex-1">
                <div className={`flex items-center gap-1.5 ${i <= ['create_formula', 'run_prediction', 'explore'].indexOf(mission.currentStep) ? 'text-violet-400' : 'text-white/20'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    mission.formulaCreated && step === 'create_formula' || mission.predictionRun && step === 'run_prediction' || mission.explorationDone && step === 'explore'
                      ? 'bg-violet-500 text-white'
                      : mission.currentStep === step
                      ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                      : 'bg-white/5 text-white/30'
                  }`}>
                    {mission.formulaCreated && step === 'create_formula' || mission.predictionRun && step === 'run_prediction' || mission.explorationDone && step === 'explore' ? '✓' : i + 1}
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider hidden sm:inline">{step.replace('_', ' ')}</span>
                </div>
                {i < 2 && <div className={`h-px flex-1 ${progressPercent > (i + 1) * 33 ? 'bg-violet-500/50' : 'bg-white/5'}`} />}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Create Formula */}
          {mission.currentStep === 'create_formula' && !mission.formulaCreated && (
            <motion.div
              key="create"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card variant="glass" className="border-violet-500/20">
                <CardContent className="p-6 space-y-5">
                  <div>
                    <p className="text-sm text-white/70 mb-1">Step 1 of 3</p>
                    <h2 className="text-lg font-semibold text-white">{STEP_LABELS.create_formula}</h2>
                    <p className="text-sm text-white/50 mt-1">{STEP_DESCRIPTIONS.create_formula}</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Formula Name</label>
                      <input
                        type="text"
                        value={formulaName}
                        onChange={e => setFormulaName(e.target.value)}
                        placeholder="e.g., My First Signature"
                        className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-violet-500/40 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Describe Your Vision</label>
                      <textarea
                        value={formulaNotes}
                        onChange={e => setFormulaNotes(e.target.value)}
                        placeholder="e.g., A fresh citrus opening with warm amber base..."
                        rows={3}
                        className="w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-violet-500/40 transition-colors resize-none"
                      />
                    </div>
                    <div className="rounded-xl bg-violet-500/5 border border-violet-500/10 p-3">
                      <p className="text-xs text-violet-300/70">
                        <span className="font-semibold text-violet-300">💡 Tip:</span> Think of one dominant note you want to build around. AI will help you find complementary accords.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button onClick={handleCreateFormula} className="flex-1 bg-violet-500 hover:bg-violet-600 text-white">
                      Create My First Formula ✨
                    </Button>
                    <button onClick={handleDismiss} className="text-xs text-white/30 hover:text-white/60 transition-colors">Skip</button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 1b: Formula Created — Transition */}
          {mission.currentStep === 'run_prediction' && createdFormula && !predictionResult && (
            <motion.div
              key="prediction"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card variant="glass" className="border-violet-500/20">
                <CardContent className="p-6 space-y-5">
                  <div>
                    <p className="text-sm text-white/70 mb-1">Step 2 of 3</p>
                    <h2 className="text-lg font-semibold text-white">{STEP_LABELS.run_prediction}</h2>
                    <p className="text-sm text-white/50 mt-1">{STEP_DESCRIPTIONS.run_prediction}</p>
                  </div>

                  <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">🧪</span>
                      <span className="text-sm font-semibold text-white">{createdFormula.name}</span>
                    </div>
                    <p className="text-xs text-white/40 italic">"{createdFormula.notes}"</p>
                  </div>

                  <div className="rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/5 border border-violet-500/20 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">🧠</span>
                      <span className="text-xs font-semibold text-violet-300 uppercase tracking-wider">AI Readiness Check</span>
                    </div>
                    <p className="text-xs text-white/50">
                      VITO AI will analyze your formula against 12,487 known accords and 640 materials to predict harmony, longevity, and unexpected synergies.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button onClick={handleRunPrediction} className="flex-1 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white">
                      Run AI Prediction 🔮
                    </Button>
                    <button onClick={handleDismiss} className="text-xs text-white/30 hover:text-white/60 transition-colors">Skip</button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2b: Prediction Complete */}
          {mission.currentStep === 'explore' && predictionResult && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card variant="glass" className="border-emerald-500/20">
                <CardContent className="p-6 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-2xl">🎉</span>
                    <div>
                      <p className="text-sm text-emerald-400/80 font-semibold">Step 3 of 3</p>
                      <h2 className="text-lg font-semibold text-white">Mission Complete</h2>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
                    <p className="text-xs text-white/40 mb-1">AI Prediction Result</p>
                    <p className="text-sm text-white/80">{predictionResult}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/[0.02] border border-white/5 p-3 text-center">
                      <p className="text-2xl font-bold text-violet-400">1</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Formula</p>
                    </div>
                    <div className="rounded-xl bg-white/[0.02] border border-white/5 p-3 text-center">
                      <p className="text-2xl font-bold text-emerald-400">1</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Prediction</p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 p-4">
                    <p className="text-xs text-amber-300/80 font-semibold mb-1">🏆 You've earned: First Steps + First Creation</p>
                    <p className="text-xs text-white/50">Achievements are permanent. Keep exploring to unlock more.</p>
                  </div>

                  <Button onClick={handleExplore} className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white">
                    Explore Your Dashboard 🚀
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
