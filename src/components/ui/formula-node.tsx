"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ComplianceBadge, type ComplianceStatus } from "@/components/ui/compliance-badge"
import { GripVertical, X, AlertTriangle, FlaskConical } from "lucide-react"

interface IngredientData {
  id: string
  name: string
  cas?: string
  percentage: number
  grams?: number
  cost?: number
  category?: string
  ifraStatus?: ComplianceStatus
}

interface FormulaNodeProps {
  ingredient: IngredientData
  onUpdate?: (id: string, data: Partial<IngredientData>) => void
  onRemove?: (id: string) => void
  onDragStart?: () => void
  onDragEnd?: () => void
  isReadOnly?: boolean
  complianceIssues?: string[]
  className?: string
}

const categoryColors: Record<string, string> = {
  "essential-oil": "border-l-blue-400",
  "aroma-chemical": "border-l-amber-400",
  "base": "border-l-emerald-400",
  "fixative": "border-l-purple-400",
  "solvent": "border-l-slate-400",
  "natural-extract": "border-l-green-400",
  default: "border-l-muted-foreground",
}

function FormulaNode({
  ingredient,
  onUpdate,
  onRemove,
  onDragStart,
  onDragEnd,
  isReadOnly,
  complianceIssues,
  className,
}: FormulaNodeProps) {
  const categoryColor = categoryColors[ingredient.category || "default"]
  const hasWarning = complianceIssues && complianceIssues.length > 0
  const hasError = ingredient.ifraStatus === "error"

  return (
    <motion.div
      layout
      initial={false}
      whileDrag={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
      className={cn(
        "relative flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors border-l-4",
        categoryColor,
        hasError && "border-destructive/30 bg-destructive/5",
        hasWarning && "border-amber-500/30 bg-amber-500/5",
        isReadOnly && "opacity-75",
        "hover:bg-accent/30",
        className
      )}
    >
      {!isReadOnly && (
        <button
          type="button"
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground shrink-0"
          onMouseDown={onDragStart}
          onMouseUp={onDragEnd}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      )}

      <div className="flex items-center gap-2 min-w-0 flex-1">
        <div className="rounded-md bg-primary/10 p-1.5 shrink-0">
          <FlaskConical className="h-4 w-4 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium truncate">
              {ingredient.name}
            </span>
            {hasError && (
              <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            {ingredient.cas && <span>CAS: {ingredient.cas}</span>}
            {ingredient.grams && (
              <>
                <span>·</span>
                <span>{ingredient.grams}g</span>
              </>
            )}
            {ingredient.cost !== undefined && (
              <>
                <span>·</span>
                <span>${ingredient.cost.toFixed(2)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right">
          <div className="text-sm font-semibold tabular-nums">
            {ingredient.percentage}%
          </div>
          {ingredient.ifraStatus && (
            <ComplianceBadge
              status={ingredient.ifraStatus}
              className="mt-0.5"
            />
          )}
        </div>

        {!isReadOnly && onRemove && (
          <button
            type="button"
            onClick={() => onRemove(ingredient.id)}
            className="rounded-full p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {complianceIssues && complianceIssues.length > 0 && (
        <div className="absolute -bottom-1 left-4 right-4 translate-y-full">
          {complianceIssues.map((issue, i) => (
            <p key={i} className="text-[10px] text-destructive flex items-center gap-1 mt-0.5">
              <AlertTriangle className="h-3 w-3" />
              {issue}
            </p>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export { FormulaNode, type IngredientData, type FormulaNodeProps }
