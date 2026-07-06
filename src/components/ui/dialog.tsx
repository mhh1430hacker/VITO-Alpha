"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  Loader2,
} from "lucide-react"

const Dialog = AlertDialogPrimitive.Root
const DialogTrigger = AlertDialogPrimitive.Trigger

const DialogPortal = AlertDialogPrimitive.Portal

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
DialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    />
  </DialogPortal>
))
DialogContent.displayName = AlertDialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
DialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = AlertDialogPrimitive.Description.displayName

const DialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants({ variant: "primary" }), className)}
    {...props}
  />
))
DialogAction.displayName = AlertDialogPrimitive.Action.displayName

const DialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "ghost" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
))
DialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

type DialogVariant = "alert" | "confirm" | "prompt" | "info"

const variantConfig: Record<
  DialogVariant,
  { icon: React.ElementType; iconClass: string; defaultLabel: string }
> = {
  alert: {
    icon: AlertTriangle,
    iconClass: "text-destructive",
    defaultLabel: "Alert",
  },
  confirm: {
    icon: AlertCircle,
    iconClass: "text-primary",
    defaultLabel: "Confirm",
  },
  prompt: {
    icon: Info,
    iconClass: "text-primary",
    defaultLabel: "Prompt",
  },
  info: {
    icon: CheckCircle2,
    iconClass: "text-emerald-500",
    defaultLabel: "Info",
  },
}

interface DialogWrapperProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  variant?: DialogVariant
  title: string
  description?: string
  children?: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void
  onCancel?: () => void
  loading?: boolean
}

function DialogWrapper({
  open,
  onOpenChange,
  variant = "info",
  title,
  description,
  children,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  loading,
}: DialogWrapperProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "rounded-full p-2 shrink-0",
                variant === "alert" && "bg-destructive/10",
                variant === "confirm" && "bg-primary/10",
                variant === "info" && "bg-emerald-500/10",
                variant === "prompt" && "bg-primary/10"
              )}
            >
              <Icon className={cn("h-5 w-5", config.iconClass)} />
            </div>
            <div className="space-y-1">
              <DialogTitle>{title}</DialogTitle>
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>
        {children}
        {(onConfirm || onCancel) && (
          <DialogFooter>
            {onCancel && (
              <DialogCancel onClick={onCancel} disabled={loading}>
                {cancelLabel || "Cancel"}
              </DialogCancel>
            )}
            {onConfirm && (
              <DialogAction onClick={onConfirm} disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {confirmLabel || config.defaultLabel}
              </DialogAction>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogAction,
  DialogCancel,
  DialogWrapper,
}
