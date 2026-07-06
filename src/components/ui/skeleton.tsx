"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "card" | "table" | "chart" | "avatar" | "custom"
}

function Skeleton({ className, variant = "text", ...props }: SkeletonProps) {
  const variantClasses = {
    text: "h-4 w-full rounded",
    card: "h-48 w-full rounded-lg",
    table: "h-10 w-full rounded",
    chart: "h-64 w-full rounded-lg",
    avatar: "h-10 w-10 rounded-full",
    custom: "",
  }

  return (
    <div
      className={cn(
        "animate-pulse bg-muted/60 relative overflow-hidden",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  )
}

export { Skeleton }
