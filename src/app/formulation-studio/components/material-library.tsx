'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Search, Filter, GripVertical, History, Bookmark,
  ChevronDown, ChevronRight, FlaskConical, Star, AlertTriangle,
  CheckCircle2, X, SlidersHorizontal, Leaf, Droplets,
} from 'lucide-react'
import {
  demoFormula, recentMaterials, savedAccords,
  categoryLabels, categoryColors, type FormulaIngredient,
} from '@/lib/demo-formula'

const categories = ['Bases', 'Accord', 'Top Notes', 'Heart Notes', 'Base Notes', 'Modifiers', 'Fixatives', 'Solvents']

const allMaterials: FormulaIngredient[] = demoFormula.ingredients

export function MaterialLibrary({ className }: { className?: string }) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filterNatural, setFilterNatural] = useState<boolean | null>(null)
  const [filterIfra, setFilterIfra] = useState<string | null>(null)

  const filtered = allMaterials.filter(m => {
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.cas.includes(search)) return false
    if (selectedCategory) {
      const catMap: Record<string, string> = {
        'Top Notes': 'top', 'Heart Notes': 'heart', 'Base Notes': 'base',
        'Modifiers': 'modifier', 'Fixatives': 'fixative', 'Solvents': 'solvent',
      }
      if (catMap[selectedCategory] !== m.category) return false
    }
    if (filterNatural !== null && m.natural !== filterNatural) return false
    if (filterIfra === 'pass' && m.ifraStatus !== 'pass') return false
    if (filterIfra === 'caution' && m.ifraStatus !== 'caution') return false
    if (filterIfra === 'restricted' && m.ifraStatus !== 'restricted') return false
    return true
  })

  return (
    <div className={cn('flex flex-col bg-background', className)}>
      <div className="p-3 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold flex items-center gap-1.5">
            <FlaskConical className="h-4 w-4 text-primary" />
            Material Library
          </h2>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            className="h-8 pl-8 text-xs"
            placeholder="Search materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setSearch('')}>
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b"
          >
            <div className="p-3 space-y-2">
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase mb-1">Source</p>
                <div className="flex gap-1">
                  <Button
                    variant={filterNatural === null ? 'secondary' : 'ghost'} size="sm" className="h-7 text-[11px] px-2"
                    onClick={() => setFilterNatural(null)}
                  >All</Button>
                  <Button
                    variant={filterNatural === true ? 'secondary' : 'ghost'} size="sm" className="h-7 text-[11px] px-2"
                    onClick={() => setFilterNatural(true)}
                  ><Leaf className="h-3 w-3 mr-1" />Natural</Button>
                  <Button
                    variant={filterNatural === false ? 'secondary' : 'ghost'} size="sm" className="h-7 text-[11px] px-2"
                    onClick={() => setFilterNatural(false)}
                  ><Droplets className="h-3 w-3 mr-1" />Synthetic</Button>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase mb-1">IFRA Status</p>
                <div className="flex gap-1">
                  <Button variant={filterIfra === null ? 'secondary' : 'ghost'} size="sm" className="h-7 text-[11px] px-2" onClick={() => setFilterIfra(null)}>All</Button>
                  <Button variant={filterIfra === 'pass' ? 'secondary' : 'ghost'} size="sm" className="h-7 text-[11px] px-2" onClick={() => setFilterIfra('pass')}><CheckCircle2 className="h-3 w-3 mr-1 text-green-600" />Pass</Button>
                  <Button variant={filterIfra === 'caution' ? 'secondary' : 'ghost'} size="sm" className="h-7 text-[11px] px-2" onClick={() => setFilterIfra('caution')}><AlertTriangle className="h-3 w-3 mr-1 text-amber-600" />Caution</Button>
                  <Button variant={filterIfra === 'restricted' ? 'secondary' : 'ghost'} size="sm" className="h-7 text-[11px] px-2" onClick={() => setFilterIfra('restricted')}><X className="h-3 w-3 mr-1 text-red-600" />Restricted</Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category tabs */}
      <div className="flex gap-1 p-2 border-b overflow-x-auto scrollbar-thin">
        <Button
          variant={selectedCategory === null ? 'default' : 'ghost'} size="sm"
          className="h-7 text-[11px] shrink-0 px-2"
          onClick={() => setSelectedCategory(null)}
        >All</Button>
        {categories.map(cat => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? 'default' : 'ghost'} size="sm"
            className="h-7 text-[11px] shrink-0 px-2"
            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
          >{cat}</Button>
        ))}
      </div>

      {/* Saved Accords */}
      <div className="border-b">
        <button className="flex items-center justify-between w-full p-2 hover:bg-muted/50 text-xs font-medium text-muted-foreground">
          <span className="flex items-center gap-1"><Bookmark className="h-3 w-3" /> Saved Accords</span>
          <ChevronDown className="h-3 w-3" />
        </button>
        <div className="px-2 pb-2 space-y-1">
          {savedAccords.map(accord => (
            <motion.div
              key={accord.id}
              whileHover={{ x: 2 }}
              className="flex items-center justify-between rounded-md border px-2 py-1.5 cursor-pointer hover:bg-muted/50 group"
            >
              <div className="flex items-center gap-2">
                <GripVertical className="h-3 w-3 text-muted-foreground opacity-30 group-hover:opacity-100" />
                <span className="text-xs font-medium">{accord.name}</span>
              </div>
              <Badge variant="secondary" className="text-[10px] h-4">{accord.ingredients.length} ingredients</Badge>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent */}
      <div className="border-b">
        <button className="flex items-center justify-between w-full p-2 text-xs font-medium text-muted-foreground">
          <span className="flex items-center gap-1"><History className="h-3 w-3" /> Recent</span>
        </button>
        <div className="px-2 pb-2 space-y-1">
          {recentMaterials.slice(0, 4).map(mat => (
            <MaterialCard key={mat.id} material={mat} />
          ))}
        </div>
      </div>

      {/* Material list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="p-2 space-y-1">
          <p className="text-[10px] font-medium text-muted-foreground uppercase px-1 mb-1">
            {filtered.length} material{filtered.length !== 1 ? 's' : ''}
          </p>
          {filtered.map(mat => (
            <MaterialCard key={mat.id} material={mat} />
          ))}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-8 text-muted-foreground">
              <Search className="h-8 w-8 mb-2 opacity-40" />
              <p className="text-xs">No materials found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MaterialCard({ material }: { material: typeof allMaterials[0] }) {
  const ifraColor = material.ifraStatus === 'pass' ? 'text-green-600' : material.ifraStatus === 'caution' ? 'text-amber-600' : 'text-red-600'

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="group flex items-start gap-2 rounded-md border px-2 py-1.5 cursor-pointer hover:bg-muted/50 relative"
    >
      <div className="mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium truncate">{material.name}</span>
          {material.natural && <Leaf className="h-2.5 w-2.5 text-green-600 shrink-0" />}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="font-mono">{material.cas}</span>
          <span>·</span>
          <span>{material.odorProfile}</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <Badge variant="outline" className="text-[9px] h-4 px-1 font-mono">${material.costPerGram.toFixed(2)}/g</Badge>
          <span className={cn('text-[10px]', ifraColor)}>
            {material.ifraStatus === 'pass' ? '✓ IFRA' : material.ifraStatus === 'caution' ? '⚠ IFRA' : '✗ IFRA'}
          </span>
          {material.volatility && (
            <span className="text-[10px] text-muted-foreground">
              {material.volatility === 'high' ? '↑' : material.volatility === 'medium' ? '→' : '↓'} {material.volatility}
            </span>
          )}
        </div>
      </div>
      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5">
        <Star className="h-3 w-3" />
      </Button>
    </motion.div>
  )
}
