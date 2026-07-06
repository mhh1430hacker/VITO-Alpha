'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface Action {
  label: string
  href: string
}

interface Props {
  icon: string
  title: string
  description: string
  action?: Action
  secondaryAction?: Action
  category?: string
}

const categoryGradients: Record<string, string> = {
  explore: 'from-violet-500/20 via-fuchsia-500/10 to-transparent',
  create: 'from-emerald-500/20 via-teal-500/10 to-transparent',
  analyze: 'from-blue-500/20 via-cyan-500/10 to-transparent',
  learn: 'from-amber-500/20 via-orange-500/10 to-transparent',
  collaborate: 'from-rose-500/20 via-pink-500/10 to-transparent',
}

export function EmptyState({ icon, title, description, action, secondaryAction, category }: Props) {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-white/5 p-8 text-center"
      style={{ background: 'rgba(23,28,36,0.6)' }}
    >
      {category && (
        <div className={`absolute inset-0 bg-gradient-to-br ${categoryGradients[category] || ''} pointer-events-none`} />
      )}

      <div className="relative">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, -5, 5, 0] }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
          className="text-5xl mb-5 inline-block"
        >
          {icon}
        </motion.div>

        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-white/50 max-w-md mx-auto mb-6 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-center gap-3">
          {action && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push(action.href)}
              className="px-5 py-2.5 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/15 border border-white/10 transition-all"
            >
              {action.label} →
            </motion.button>
          )}
          {secondaryAction && (
            <button
              onClick={() => router.push(secondaryAction.href)}
              className="px-5 py-2.5 rounded-xl text-white/50 text-sm font-medium hover:text-white/70 transition-colors"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
