'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TopBar } from './components/top-bar'
import { MaterialLibrary } from './components/material-library'
import { FormulaComposer } from './components/formula-composer'
import { AIIntelligence } from './components/ai-intelligence'
import { BottomTimeline } from './components/bottom-timeline'
import { demoFormula } from '@/lib/demo-formula'

export default function FormulaStudioPage() {
  const [bottomPanelOpen, setBottomPanelOpen] = useState(true)
  const [formulaName, setFormulaName] = useState(demoFormula.name)
  const [lastSaved, setLastSaved] = useState<string | null>(new Date().toISOString())
  const [isDirty, setIsDirty] = useState(false)
  const [canUndo, setCanUndo] = useState(true)
  const [canRedo, setCanRedo] = useState(false)

  const handleSave = useCallback(() => {
    setLastSaved(new Date().toISOString())
    setIsDirty(false)
  }, [])

  const handleShare = useCallback(() => {
    navigator.clipboard?.writeText(window.location.href)
  }, [])

  const handleExport = useCallback(() => {
    const data = JSON.stringify(demoFormula, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${demoFormula.name.replace(/\s+/g, '_')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  return (
    <div className="flex h-full flex-col">
      <TopBar
        formulaName={formulaName}
        onNameChange={setFormulaName}
        status={demoFormula.status}
        onSave={handleSave}
        onShare={handleShare}
        onExport={handleExport}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={() => {}}
        onRedo={() => {}}
        lastSaved={lastSaved}
        isDirty={isDirty}
      />

      <div className="flex flex-1 overflow-hidden">
        <MaterialLibrary className="w-80 shrink-0 border-r hidden lg:flex" />

        <FormulaComposer className="flex-1" />

        <AIIntelligence className="w-[400px] shrink-0 border-l hidden xl:flex" />
      </div>

      <AnimatePresence>
        {bottomPanelOpen && (
          <BottomTimeline onClose={() => setBottomPanelOpen(false)} />
        )}
      </AnimatePresence>

      {!bottomPanelOpen && (
        <button
          onClick={() => setBottomPanelOpen(true)}
          className="flex items-center justify-center gap-1.5 h-8 border-t bg-background text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.div>
          Show Timeline
        </button>
      )}
    </div>
  )
}
