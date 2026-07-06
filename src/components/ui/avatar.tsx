"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const avatarVariants = cva(
  "relative inline-flex items-center justify-center rounded-full bg-muted text-muted-foreground font-medium shrink-0 overflow-hidden",
  {
    variants: {
      size: {
        sm: "h-7 w-7 text-xs",
        md: "h-9 w-9 text-sm",
        lg: "h-11 w-11 text-base",
        xl: "h-14 w-14 text-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

interface AvatarProps extends VariantProps<typeof avatarVariants> {
  src?: string
  alt?: string
  fallback?: string
  className?: string
}

function getColorFromName(name: string): string {
  const colors = [
    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ src, alt = "", fallback, size, className }, ref) => {
    const [imgError, setImgError] = React.useState(false)

    return (
      <span ref={ref} className={cn(avatarVariants({ size }), className)}>
        {src && !imgError ? (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className={cn(avatarVariants({ size }), getColorFromName(fallback || alt || ""), "border-0")}>
            {fallback || getInitials(alt || "U")}
          </span>
        )}
      </span>
    )
  }
)
Avatar.displayName = "Avatar"

interface AvatarGroupProps {
  users: { src?: string; alt: string; fallback?: string }[]
  size?: "sm" | "md" | "lg" | "xl"
  max?: number
  className?: string
}

function AvatarGroup({ users, size = "md", max = 4, className }: AvatarGroupProps) {
  const visible = users.slice(0, max)
  const remaining = users.length - max

  return (
    <div className={cn("flex -space-x-2", className)}>
      {visible.map((user, i) => (
        <Avatar
          key={i}
          src={user.src}
          alt={user.alt}
          fallback={user.fallback}
          size={size}
          className="ring-2 ring-background"
        />
      ))}
      {remaining > 0 && (
        <span
          className={cn(
            avatarVariants({ size }),
            "ring-2 ring-background bg-muted text-muted-foreground"
          )}
        >
          +{remaining}
        </span>
      )}
    </div>
  )
}

interface AvatarWithBadgeProps extends AvatarProps {
  badge?: React.ReactNode
  status?: "online" | "offline" | "away" | "busy"
}

function AvatarWithBadge({
  src,
  alt,
  fallback,
  size = "md",
  badge,
  status,
  className,
  ...props
}: AvatarWithBadgeProps) {
  const statusColors = {
    online: "bg-emerald-500",
    offline: "bg-muted-foreground",
    away: "bg-amber-500",
    busy: "bg-destructive",
  }

  return (
    <span className={cn("relative inline-flex", className)}>
      <Avatar src={src} alt={alt} fallback={fallback} size={size} {...props} />
      {status && (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background",
            statusColors[status]
          )}
        />
      )}
      {badge && (
        <span className="absolute -top-1 -right-1">{badge}</span>
      )}
    </span>
  )
}

export { Avatar, AvatarGroup, AvatarWithBadge }
