"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ShieldCheck, AlertTriangle, XCircle, HelpCircle } from "lucide-react"

type ComplianceStatus = "pass" | "warning" | "error" | "unknown"

interface ComplianceBadgeProps {
  status: ComplianceStatus
  label?: string
  tooltip?: string
  className?: string
}

const statusConfig: Record<
  ComplianceStatus,
  { icon: React.ElementType; color: string; bg: string }
> = {
  pass: {
    icon: ShieldCheck,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  error: {
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-900/30",
  },
  unknown: {
    icon: HelpCircle,
    color: "text-muted-foreground",
    bg: "bg-muted",
  },
}

function ComplianceBadge({
  status,
  label,
  tooltip,
  className,
}: ComplianceBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon
  const showPulse = status === "warning" || status === "error"

  const badge = (
    <motion.span
      animate={
        showPulse
          ? {
              opacity: [1, 0.7, 1],
              scale: [1, 1.05, 1],
            }
          : undefined
      }
      transition={
        showPulse
          ? {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }
          : undefined
      }
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.bg,
        config.color,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label && <span>{label}</span>}
    </motion.span>
  )

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>{badge}</TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs text-xs">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return badge
}

export { ComplianceBadge, type ComplianceStatus }
