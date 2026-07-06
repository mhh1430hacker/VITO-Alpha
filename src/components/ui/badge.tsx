"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        success:
          "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
        warning:
          "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
        info:
          "border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        outline: "text-foreground border-border",
        dot: "border-transparent bg-secondary text-secondary-foreground pl-2",
        count:
          "border-transparent bg-muted text-muted-foreground min-w-[1.25rem] justify-center",
      },
      status: {
        success: "border-transparent bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        warning: "border-transparent bg-amber-500/10 text-amber-600 dark:text-amber-400",
        error: "border-transparent bg-red-500/10 text-red-600 dark:text-red-400",
        info: "border-transparent bg-blue-500/10 text-blue-600 dark:text-blue-400",
        neutral: "border-transparent bg-muted text-muted-foreground",
      },
      tier: {
        starter:
          "border-transparent bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
        pro: "border-transparent bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
        business:
          "border-transparent bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        enterprise:
          "border-transparent bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  removable?: boolean
  onRemove?: () => void
  icon?: React.ReactNode
}

function Badge({
  className,
  variant,
  status,
  tier,
  removable,
  onRemove,
  icon,
  children,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        badgeVariants({ variant, status, tier }),
        (removable || icon) && "gap-1",
        className
      )}
      {...props}
    >
      {variant === "dot" && (
        <span className="h-1.5 w-1.5 rounded-full bg-current mr-1" />
      )}
      {icon}
      {children}
      {removable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.()
          }}
          className="ml-0.5 rounded-full hover:bg-background/20 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}

export { Badge, badgeVariants }
