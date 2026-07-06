"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Eye, EyeOff, Search, X } from "lucide-react"

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: "default" | "search" | "password" | "number"
  inputSize?: "md" | "lg"
  iconPrefix?: React.ReactNode
  iconSuffix?: React.ReactNode
  validation?: "default" | "error" | "success"
  showCharCount?: boolean
  maxLength?: number
  clearable?: boolean
  onClear?: () => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      variant = "default",
      inputSize = "md",
      iconPrefix,
      iconSuffix,
      validation = "default",
      showCharCount,
      maxLength,
      clearable,
      onClear,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [charCount, setCharCount] = React.useState(
      typeof value === "string" ? value.length : 0
    )
    const inputRef = React.useRef<HTMLInputElement>(null)
    React.useImperativeHandle(ref, () => inputRef.current!)

    const isPassword = variant === "password" || type === "password"
    const resolvedType = isPassword ? (showPassword ? "text" : "password") : type
    const isSearch = variant === "search"
    const isNumber = variant === "number"

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCharCount(e.target.value.length)
      onChange?.(e)
    }

    const handleClear = () => {
      if (onClear) {
        onClear()
      } else {
        const nativeEvent = new Event("input", { bubbles: true })
        const input = inputRef.current
        if (input) {
          const setter = Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            "value"
          )?.set
          setter?.call(input, "")
          input.dispatchEvent(nativeEvent)
        }
      }
      inputRef.current?.focus()
    }

    const validationBorder = {
      default: "border-input",
      error:
        "border-destructive focus-visible:ring-destructive",
      success:
        "border-emerald-500 focus-visible:ring-emerald-500",
    }

    const sizeClass = {
      md: "h-10 text-sm",
      lg: "h-12 text-base",
    }

    const hasLeftIcon = iconPrefix || isSearch
    const hasRightIcon = iconSuffix || isPassword || clearable || showCharCount

    return (
      <div className="relative w-full">
        {hasLeftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {iconPrefix || (isSearch && <Search className="h-4 w-4" />)}
          </div>
        )}
        <input
          ref={inputRef}
          type={isNumber ? "number" : resolvedType}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          className={cn(
            "flex w-full rounded-md border bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
            sizeClass[inputSize],
            validationBorder[validation],
            hasLeftIcon && (inputSize === "lg" ? "pl-11" : "pl-10"),
            hasRightIcon && (inputSize === "lg" ? "pr-20" : "pr-16"),
            className
          )}
          {...props}
        />
        {hasRightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-muted-foreground">
            {isPassword && (
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}
            {clearable && value && (
              <button
                type="button"
                tabIndex={-1}
                onClick={handleClear}
                className="hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {showCharCount && maxLength && (
              <span
                className={cn(
                  "text-xs tabular-nums",
                  charCount >= maxLength
                    ? "text-destructive"
                    : "text-muted-foreground"
                )}
              >
                {charCount}/{maxLength}
              </span>
            )}
            {iconSuffix}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
