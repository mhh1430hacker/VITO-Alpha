'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Play, ArrowLeft, CheckCircle, Clock } from 'lucide-react'
import { useState } from 'react'

const tutorialSteps: Record<string, { title: string; steps: { title: string; content: string }[] }> = {
  'intro-vito': {
    title: 'Introduction to VITO',
    steps: [
      { title: 'Welcome to VITO', content: 'VITO is an enterprise AI platform purpose-built for fragrance formulation. It combines machine learning, molecular science, and enterprise-grade infrastructure.' },
      { title: 'Platform Overview', content: 'The platform consists of: Dashboard for KPIs, Formulation Wizard for creating formulas, Material Library for managing ingredients, AI Lab for predictions and optimization, and Compliance Center for regulatory checks.' },
      { title: 'Key Concepts', content: 'Formulations are fragrance compositions with precise material ratios. AI Predictions use machine learning to forecast performance. Compliance checks ensure IFRA/REACH/CLP standards.' },
      { title: 'Your First Action', content: 'Start by exploring the Material Library to see available ingredients. Then try creating your first formulation using the Formulation Wizard.' },
    ],
  },
}

export default function TutorialDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const tutorial = tutorialSteps[slug]
  const [currentStep, setCurrentStep] = useState(0)

  if (!tutorial) {
    return (
      <div className="p-6">
        <Link href="/tutorials" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back</Link>
        <p className="mt-4">Tutorial not found.</p>
      </div>
    )
  }

  const step = tutorial.steps[currentStep]

  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto">
      <Link href="/tutorials" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Tutorials
      </Link>

      <div>
        <h1 className="text-2xl font-bold">{tutorial.title}</h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
          <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> 10 min</span>
          <span>Step {currentStep + 1} of {tutorial.steps.length}</span>
        </div>
      </div>

      <div className="flex gap-2">
        {tutorial.steps.map((s, i) => (
          <button key={i} onClick={() => setCurrentStep(i)} className={`h-2 flex-1 rounded-full transition-colors ${i === currentStep ? 'bg-primary' : i < currentStep ? 'bg-green-400' : 'bg-muted'}`} />
        ))}
      </div>

      <div className="rounded-xl border p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">{currentStep + 1}</span>
          </div>
          <h2 className="text-lg font-semibold">{step.title}</h2>
        </div>
        <p className="text-sm leading-relaxed">{step.content}</p>

        {currentStep === tutorial.steps.length - 1 && (
          <div className="mt-8 rounded-lg bg-green-50 border border-green-200 p-4">
            <div className="flex items-center gap-2 text-green-800 font-medium">
              <CheckCircle className="h-5 w-5" /> Tutorial Complete!
            </div>
            <p className="text-sm text-green-700 mt-1">You have completed the introduction tutorial.</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentStep(Math.min(tutorial.steps.length - 1, currentStep + 1))}
          disabled={currentStep === tutorial.steps.length - 1}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}
