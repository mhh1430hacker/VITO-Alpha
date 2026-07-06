'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Save, Share2, Download, Undo2, Redo2, History,
  CheckCircle2, Clock, AlertTriangle, Edit3, MoreHorizontal,
} from 'lucide-react'

interface TopBarProps {
  formulaName: string
  onNameChange: (name: string) => void
  status: string
  onSave: () => void
  onShare: () => void
  onExport: () => void
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  lastSaved: string | null
  isDirty: boolean
}

const statusConfig: Record<string, { variant: 'success' | 'warning' | 'secondary' | 'outline'; icon: typeof Clock; label: string }> = {
  'In Review': { variant: 'warning', icon: Clock, label: 'In Review' },
  Approved: { variant: 'success', icon: CheckCircle2, label: 'Approved' },
  Draft: { variant: 'secondary', icon: Edit3, label: 'Draft' },
  Restricted: { variant: 'outline', icon: AlertTriangle, label: 'Restricted' },
}

export function TopBar({
  formulaName, onNameChange, status, onSave, onShare, onExport,
  canUndo, canRedo, onUndo, onRedo, lastSaved, isDirty,
}: TopBarProps) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(formulaName)
  const cfg = statusConfig[status] || statusConfig.Draft
  const StatusIcon = cfg.icon

  return (
    <div className="flex h-14 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {editing ? (
            <motion.input
              initial={{ width: 200 }}
              animate={{ width: 320 }}
              className="h-8 rounded-md border border-input bg-background px-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => { setEditing(false); onNameChange(name) }}
              onKeyDown={(e) => { if (e.key === 'Enter') { setEditing(false); onNameChange(name) } }}
              autoFocus
            />
          ) : (
            <h1
              className="text-lg font-semibold cursor-pointer hover:text-primary transition-colors flex items-center gap-2"
              onClick={() => setEditing(true)}
            >
              {formulaName}
              <Edit3 className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100" />
            </h1>
          )}
          <Badge variant={cfg.variant} className="gap-1">
            <StatusIcon className="h-3 w-3" />
            {cfg.label}
          </Badge>
        </div>
        {isDirty && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-xs text-muted-foreground flex items-center gap-1"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Unsaved changes
          </motion.span>
        )}
        {lastSaved && !isDirty && (
          <span className="text-xs text-muted-foreground">
            Saved {new Date(lastSaved).toLocaleTimeString()}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <div className="flex items-center rounded-md border mr-2">
          <Button variant="ghost" size="sm" className="h-8 rounded-r-none border-r" disabled={!canUndo} onClick={onUndo}>
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 rounded-l-none" disabled={!canRedo} onClick={onRedo}>
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="h-8" onClick={onSave}>
          <Save className="h-4 w-4 mr-1.5" />
          Save
        </Button>
        <Button variant="ghost" size="sm" className="h-8" onClick={onShare}>
          <Share2 className="h-4 w-4 mr-1.5" />
          Share
        </Button>
        <Button variant="ghost" size="sm" className="h-8" onClick={onExport}>
          <Download className="h-4 w-4 mr-1.5" />
          Export
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
