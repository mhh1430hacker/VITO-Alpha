'use client'

import { useDemoStore } from '@/lib/store'
import { demosScenarios } from '@/lib/demo-scenarios'
import { useRouter } from 'next/navigation'

export function DemoScriptBar() {
  const router = useRouter()
  const { isScriptMode, currentScenario, currentScriptStep, nextScriptStep, prevScriptStep, setDemoMode, setScriptMode, setCurrentScenario } = useDemoStore()

  if (!isScriptMode || currentScenario === null) return null

  const scenario = demosScenarios[currentScenario]
  if (!scenario) return null

  const step = scenario.steps[currentScriptStep]
  const isFirst = currentScriptStep === 0
  const isLast = currentScriptStep === scenario.steps.length - 1

  const handleExit = () => {
    setDemoMode(false)
    setScriptMode(false)
    setCurrentScenario(null)
  }

  const handleNavigate = () => {
    router.push(scenario.targetRoute)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-amber-500/20 bg-black/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center gap-4 px-6 py-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">{scenario.title}</span>
            <span className="text-xs text-gray-500">
              Step {currentScriptStep + 1} of {scenario.steps.length}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-white">{step?.instruction || ''}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {scenario.steps.map((_, i) => (
              <span
                key={i}
                className={`h-1 w-6 rounded-full transition-colors ${i === currentScriptStep ? 'bg-amber-500' : i < currentScriptStep ? 'bg-amber-500/40' : 'bg-gray-700'}`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleNavigate}
            className="inline-flex h-8 items-center justify-center rounded-md bg-amber-500/20 px-3 text-xs font-medium text-amber-400 hover:bg-amber-500/30"
          >
            Navigate
          </button>
          {!isFirst && (
            <button
              onClick={prevScriptStep}
              className="inline-flex h-8 items-center justify-center rounded-md border border-gray-700 px-3 text-xs font-medium text-gray-300 hover:bg-gray-800"
            >
              Previous
            </button>
          )}
          {!isLast ? (
            <button
              onClick={nextScriptStep}
              className="inline-flex h-8 items-center justify-center rounded-md bg-amber-500 px-3 text-xs font-medium text-black hover:bg-amber-400"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleExit}
              className="inline-flex h-8 items-center justify-center rounded-md bg-gray-800 px-3 text-xs font-medium text-gray-300 hover:bg-gray-700"
            >
              Complete
            </button>
          )}
          <button
            onClick={handleExit}
            className="inline-flex h-8 items-center justify-center rounded-md px-2 text-xs text-gray-500 hover:text-gray-300"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  )
}
