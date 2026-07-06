"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  children: React.ReactNode
  side?: "right" | "bottom"
  size?: "sm" | "md" | "lg" | "full"
  className?: string
}

const sizeMap = {
  right: { sm: "w-80", md: "w-96", lg: "w-[480px]", full: "w-screen" },
  bottom: { sm: "h-1/4", md: "h-1/3", lg: "h-1/2", full: "h-screen" },
}

function Drawer({
  open,
  onClose,
  title,
  children,
  side = "right",
  size = "md",
  className,
}: DrawerProps) {
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (open) {
      document.addEventListener("keydown", handleEsc)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  const isRight = side === "right"
  const panelVariants = {
    visible: isRight
      ? { x: 0 }
      : { y: 0 },
    hidden: isRight
      ? { x: "100%" }
      : { y: "100%" },
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={panelVariants.hidden}
            animate={panelVariants.visible}
            exit={panelVariants.hidden}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className={cn(
              "fixed z-50 bg-background border shadow-xl flex flex-col",
              isRight
                ? "top-0 right-0 bottom-0"
                : "bottom-0 left-0 right-0 rounded-t-xl",
              isRight ? sizeMap.right[size] : sizeMap.bottom[size],
              className
            )}
          >
            {!isRight && (
              <div className="w-10 h-1 bg-muted-foreground/20 rounded-full mx-auto mt-2 mb-1" />
            )}
            {title && (
              <div
                className={cn(
                  "flex items-center justify-between px-4 h-14 border-b shrink-0",
                  !isRight && "px-6"
                )}
              >
                <h2 className="text-lg font-semibold">{title}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-1.5 hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto p-4">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export { Drawer }
