'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Plus,
  FlaskConical,
  Package,
  FolderKanban,
  UserPlus,
  Search,
  Sparkles,
  X,
} from 'lucide-react'

interface QuickAction {
  id: string
  label: string
  icon: React.ElementType
  href: string
  color: string
}

const defaultActions: QuickAction[] = [
  { id: 'formula', label: 'New Formula', icon: FlaskConical, href: '/formulations/wizard', color: 'from-violet-500 to-purple-600' },
  { id: 'material', label: 'New Material', icon: Package, href: '/materials/catalog', color: 'from-blue-500 to-cyan-600' },
  { id: 'project', label: 'New Project', icon: FolderKanban, href: '/projects/active', color: 'from-emerald-500 to-teal-600' },
  { id: 'invite', label: 'Invite', icon: UserPlus, href: '/admin/users', color: 'from-amber-500 to-orange-600' },
  { id: 'search', label: 'Search', icon: Search, href: '#search', color: 'from-pink-500 to-rose-600' },
  { id: 'ai', label: 'AI Lab', icon: Sparkles, href: '/ai-lab/predictions', color: 'from-indigo-500 to-violet-600' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.03, staggerDirection: -1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.5, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 20 },
  },
  exit: {
    opacity: 0,
    scale: 0.5,
    y: 20,
    transition: { duration: 0.15 },
  },
}

export function QuickActions() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleAction = (action: QuickAction) => {
    setOpen(false)
    if (action.id === 'search') {
      document.dispatchEvent(new KeyboardEvent('keydown', { metaKey: true, key: 'k' }))
      return
    }
    router.push(action.href)
  }

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute bottom-20 left-1/2 z-50 -translate-x-1/2"
            >
              <div className="flex items-center gap-3">
                {defaultActions.map((action) => (
                  <motion.button
                    key={action.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.1, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAction(action)}
                    className="group relative flex flex-col items-center gap-1"
                    title={action.label}
                  >
                    <div
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg transition-shadow group-hover:shadow-xl',
                        action.color
                      )}
                    >
                      <action.icon className="h-5 w-5" />
                    </div>
                    <span className="whitespace-nowrap rounded-md bg-popover px-2 py-0.5 text-[10px] font-medium text-popover-foreground shadow-sm">
                      {action.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className={cn(
          'relative z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all',
          open
            ? 'bg-muted text-foreground'
            : 'bg-primary text-primary-foreground'
        )}
      >
        {open ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
      </motion.button>
    </div>
  )
}
