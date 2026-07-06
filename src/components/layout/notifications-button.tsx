'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useNotificationStore, AppNotification } from '@/lib/store'
import { cn } from '@/lib/utils'
import {
  Bell,
  X,
  CheckCheck,
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  ExternalLink,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'

function NotificationIcon({ type }: { type: AppNotification['type'] }) {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-500" />
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-amber-500" />
    case 'info':
      return <Info className="h-4 w-4 text-blue-500" />
  }
}

export function NotificationsButton() {
  const router = useRouter()
  const { notifications, unreadCount, panelOpen, setPanelOpen, markRead, markAllRead } =
    useNotificationStore()

  const handleAction = (n: AppNotification) => {
    markRead(n.id)
    setPanelOpen(false)
    if (n.actionUrl) router.push(n.actionUrl)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setPanelOpen(!panelOpen)}
        className="relative flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        title="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[14px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {panelOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setPanelOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.96 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute right-0 top-full z-50 mt-1 w-80 sm:w-96 origin-top-right"
            >
              <div className="overflow-hidden rounded-xl border bg-card shadow-xl">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <h3 className="text-sm font-semibold">Notifications</h3>
                  <div className="flex items-center gap-1">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                      >
                        <CheckCheck className="h-3.5 w-3.5" />
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={() => setPanelOpen(false)}
                      className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-accent transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center py-8 text-sm text-muted-foreground">
                      <Bell className="mb-2 h-8 w-8" />
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {notifications.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => handleAction(n)}
                          className={cn(
                            'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/50',
                            !n.read && 'bg-accent/30'
                          )}
                        >
                          <div className="mt-0.5 shrink-0">
                            <NotificationIcon type={n.type} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={cn('text-sm', !n.read && 'font-medium')}>{n.title}</p>
                              {!n.read && (
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                              )}
                            </div>
                            {n.message && (
                              <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                                {n.message}
                              </p>
                            )}
                            <p className="mt-1 text-[10px] text-muted-foreground">
                              {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                          <ExternalLink className="mt-1 h-3 w-3 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
