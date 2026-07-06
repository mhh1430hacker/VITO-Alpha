'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { AccordPyramid } from './accord-pyramid'
import {
  GripVertical, Plus, Trash2, ChevronDown, ChevronRight,
  AlertTriangle, CheckCircle2, XCircle, DollarSign,
  Beaker, BarChart3, Info, Leaf, MoreHorizontal,
  Copy, ArrowUpDown,
} from 'lucide-react'
import { demoFormula, categoryColors, categoryLabels } from '@/lib/demo-formula'

type Ingredient = typeof demoFormula.ingredients[0]

interface FormulaComposerProps {
  className?: string
}

export function FormulaComposer({ className }: FormulaComposerProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>(demoFormula.ingredients)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [history, setHistory] = useState<Ingredient[][]>([demoFormula.ingredients])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [lastSaved, setLastSaved] = useState<string>(new Date().toISOString())
  const [isDirty, setIsDirty] = useState(false)

  const totalPercent = ingredients.reduce((sum, i) => sum + i.percentage, 0)
  const totalCost = ingredients.reduce((sum, i) => sum + (i.percentage * 10 / 1000) * i.costPerGram * 1000, 0)
  const totalBalance = 100 - totalPercent

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isDirty) {
        setLastSaved(new Date().toISOString())
        setIsDirty(false)
      }
    }, 3000)
    return () => clearTimeout(timer)
  }, [isDirty, ingredients])

  const pushHistory = useCallback((newIngredients: Ingredient[]) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push([...newIngredients])
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    setIsDirty(true)
  }, [history, historyIndex])

  const updatePercentage = useCallback((id: string, newPercent: number) => {
    newPercent = Math.max(0, Math.min(100, newPercent))
    const newIngredients = ingredients.map(i =>
      i.id === id ? { ...i, percentage: newPercent, grams: newPercent * 10 } : i
    )
    setIngredients(newIngredients)
    pushHistory(newIngredients)
  }, [ingredients, pushHistory])

  const removeIngredient = useCallback((id: string) => {
    const newIngredients = ingredients.filter(i => i.id !== id)
    setIngredients(newIngredients)
    pushHistory(newIngredients)
  }, [ingredients, pushHistory])

  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  const handleUndo = () => {
    if (!canUndo) return
    const newIndex = historyIndex - 1
    setHistoryIndex(newIndex)
    setIngredients([...history[newIndex]])
    setIsDirty(true)
  }

  const handleRedo = () => {
    if (!canRedo) return
    const newIndex = historyIndex + 1
    setHistoryIndex(newIndex)
    setIngredients([...history[newIndex]])
    setIsDirty(true)
  }

  const topPercent = ingredients.filter(i => i.category === 'top').reduce((s, i) => s + i.percentage, 0)
  const heartPercent = ingredients.filter(i => i.category === 'heart').reduce((s, i) => s + i.percentage, 0)
  const basePercent = ingredients.filter(i => ['base', 'modifier', 'fixative', 'solvent'].includes(i.category)).reduce((s, i) => s + i.percentage, 0)

  return (
    <div className={cn('flex flex-col bg-background', className)}>
      {/* Composer header */}
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold flex items-center gap-1.5">
            <Beaker className="h-4 w-4 text-primary" />
            Formula Composer
          </h2>
          <Badge variant="secondary" className="text-[10px]">{ingredients.length} ingredients</Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" disabled={!canUndo} onClick={handleUndo}>
              <ArrowUpDown className="h-3 w-3 rotate-90" />
            </Button>
            <span className="text-[10px] font-mono">{historyIndex + 1}/{history.length}</span>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" disabled={!canRedo} onClick={handleRedo}>
              <ArrowUpDown className="h-3 w-3 -rotate-90" />
            </Button>
          </div>
        </div>
      </div>

      {/* Live summary bar */}
      <div className="flex items-center gap-4 px-4 py-1.5 border-b bg-muted/30">
        <div className="flex items-center gap-1.5 text-xs">
          <BarChart3 className="h-3 w-3 text-muted-foreground" />
          <span className={cn('font-semibold', totalBalance === 0 ? 'text-green-600' : 'text-red-600')}>
            {totalPercent.toFixed(1)}%
          </span>
          <span className="text-muted-foreground">/ 100%</span>
          {totalBalance !== 0 && (
            <span className="text-red-500 text-[10px]">({totalBalance > 0 ? '+' : ''}{totalBalance.toFixed(1)}%)</span>
          )}
        </div>
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-1.5 text-xs">
          <DollarSign className="h-3 w-3 text-muted-foreground" />
          <span className="font-semibold">${demoFormula.costPerKg.toFixed(2)}</span>
          <span className="text-muted-foreground">/kg</span>
        </div>
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-1.5 text-xs">
          <CheckCircle2 className="h-3 w-3 text-green-600" />
          <span className="font-semibold text-green-600">{demoFormula.ifraScore}%</span>
          <span className="text-muted-foreground">IFRA</span>
        </div>
        <div className="flex-1" />
        <span className="text-[10px] text-muted-foreground">
          {isDirty ? 'Unsaved' : `Saved ${new Date(lastSaved).toLocaleTimeString()}`}
        </span>
      </div>

      {/* Accord Pyramid */}
      <div className="border-b">
        <AccordPyramid topPercent={topPercent} heartPercent={heartPercent} basePercent={basePercent} />
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[24px_1fr_100px_80px_80px_60px_60px_60px_28px] gap-1 px-4 py-1.5 border-b bg-muted/20 text-[10px] font-medium text-muted-foreground uppercase">
        <span />
        <span>Ingredient</span>
        <span>CAS</span>
        <span className="text-right">%</span>
        <span className="text-right">g</span>
        <span className="text-right">Cost</span>
        <span>IFRA</span>
        <span />
        <span />
      </div>

      {/* Ingredient rows */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <Reorder.Group axis="y" values={ingredients} onReorder={(vals) => { setIngredients(vals); pushHistory(vals) }} className="divide-y">
          <AnimatePresence initial={false}>
            {ingredients.map((ing, idx) => (
              <IngredientRow
                key={ing.id}
                ingredient={ing}
                index={idx}
                isExpanded={expandedRows.has(ing.id)}
                onToggle={() => toggleRow(ing.id)}
                onUpdatePercent={(p) => updatePercentage(ing.id, p)}
                onRemove={() => removeIngredient(ing.id)}
              />
            ))}
          </AnimatePresence>
        </Reorder.Group>
        {ingredients.length === 0 && (
          <div className="flex flex-col items-center py-16 text-muted-foreground">
            <Beaker className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-sm font-medium">Empty formula</p>
            <p className="text-xs mt-1">Drag materials from the library to start building</p>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/30">
        <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
          <Plus className="h-3 w-3" />
          Add Ingredient
        </Button>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500" /> IFRA Pass
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> Caution
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-red-500" /> Restricted
          </span>
        </div>
      </div>
    </div>
  )
}

function IngredientRow({
  ingredient: ing, index, isExpanded, onToggle, onUpdatePercent, onRemove,
}: {
  ingredient: Ingredient
  index: number
  isExpanded: boolean
  onToggle: () => void
  onUpdatePercent: (p: number) => void
  onRemove: () => void
}) {
  const ifraIcon = ing.ifraStatus === 'pass'
    ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
    : ing.ifraStatus === 'caution'
      ? <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
      : <XCircle className="h-3.5 w-3.5 text-red-600" />

  const costDisplay = (ing.percentage * 10 / 1000 * ing.costPerGram * 1000).toFixed(2)

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      layout
    >
      <Reorder.Item
        value={ing}
        className={cn(
          'grid grid-cols-[24px_1fr_100px_80px_80px_60px_60px_60px_28px] gap-1 px-4 py-1.5 items-center text-xs hover:bg-muted/40 transition-colors group',
          categoryColors[ing.category]?.split(' ')[0]?.replace('bg-', 'bg-opacity-5 bg-') || ''
        )}
        whileDrag={{ scale: 1.02, zIndex: 50, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
      >
        <div className="flex items-center cursor-grab active:cursor-grabbing">
          <GripVertical className="h-3.5 w-3.5 text-muted-foreground opacity-30 group-hover:opacity-100" />
        </div>
        <div className="flex items-center gap-2 min-w-0" onClick={onToggle}>
          <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', {
            'bg-amber-500': ing.category === 'top',
            'bg-pink-500': ing.category === 'heart',
            'bg-emerald-500': ing.category === 'base',
            'bg-purple-500': ing.category === 'modifier',
            'bg-blue-500': ing.category === 'fixative',
            'bg-gray-50 dark:bg-gray-9500': ing.category === 'solvent',
          })} />
          <span className="font-medium truncate">{ing.name}</span>
          {ing.natural && <Leaf className="h-3 w-3 text-green-600 shrink-0" />}
          <Badge variant="outline" className="text-[9px] h-4 px-1 hidden lg:inline-flex">
            {categoryLabels[ing.category]}
          </Badge>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground truncate">{ing.cas}</span>
        <div className="flex items-center justify-end">
          <input
            className="w-16 h-6 rounded border border-input bg-background px-1.5 text-xs font-mono text-right focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            type="number"
            min={0}
            max={100}
            step={0.1}
            value={ing.percentage}
            onChange={(e) => onUpdatePercent(parseFloat(e.target.value) || 0)}
          />
        </div>
        <span className="text-right font-mono text-muted-foreground">{ing.grams.toFixed(1)}</span>
        <span className="text-right font-mono">${costDisplay}</span>
        <div className="flex justify-center">{ifraIcon}</div>
        <div className="flex justify-center">
          <button
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onRemove}
          >
            <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
          </button>
        </div>
        <button onClick={onToggle}>
          <ChevronDown className={cn('h-3.5 w-3.5 text-muted-foreground transition-transform', isExpanded && 'rotate-180')} />
        </button>
      </Reorder.Item>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-3 gap-3 px-4 py-2 bg-muted/20 border-t border-b text-xs ml-12">
              <div>
                <span className="text-muted-foreground">Odor Profile:</span>
                <span className="ml-1 font-medium">{ing.odorProfile}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Cost/g:</span>
                <span className="ml-1 font-medium">${ing.costPerGram.toFixed(4)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Notes:</span>
                <span className="ml-1 font-medium capitalize">{ing.volatility || 'N/A'}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
