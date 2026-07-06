'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastContextType {
  toast: (type: ToastType, title: string, message?: string, duration?: number) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

const icons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const styles: Record<ToastType, string> = {
  success: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-200',
  error: 'border-red-500/20 bg-red-500/5 text-red-200',
  warning: 'border-amber-500/20 bg-amber-500/5 text-amber-200',
  info: 'border-blue-500/20 bg-blue-500/5 text-blue-200',
}

const iconColors: Record<ToastType, string> = {
  success: 'text-emerald-400',
  error: 'text-red-400',
  warning: 'text-amber-400',
  info: 'text-blue-400',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((type: ToastType, title: string, message?: string, duration = 4000) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    setToasts(prev => [...prev.slice(-4), { id, type, title, message, duration }])
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, duration)
    }
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const context: ToastContextType = {
    toast: addToast,
    success: (t, m) => addToast('success', t, m),
    error: (t, m) => addToast('error', t, m),
    warning: (t, m) => addToast('warning', t, m),
    info: (t, m) => addToast('info', t, m),
  }

  return (
    <ToastContext.Provider value={context}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col-reverse gap-2 w-80 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => {
            const Icon = icons[toast.type]
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 80, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={cn(
                  'pointer-events-auto rounded-xl border backdrop-blur-xl p-4 shadow-2xl shadow-black/20',
                  styles[toast.type]
                )}
              >
                <div className="flex items-start gap-3">
                  <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', iconColors[toast.type])} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{toast.title}</p>
                    {toast.message && (
                      <p className="text-xs opacity-70 mt-0.5">{toast.message}</p>
                    )}
                  </div>
                  <button
                    onClick={() => dismiss(toast.id)}
                    className="shrink-0 opacity-40 hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
