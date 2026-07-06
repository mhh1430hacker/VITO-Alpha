'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
  color: string
  rotation: number
  scale: number
  shape: 'circle' | 'square' | 'triangle'
}

interface Props {
  trigger: boolean
  duration?: number
}

const COLORS = ['#a855f7', '#8b5cf6', '#f59e0b', '#22c55e', '#06b6d4', '#f97316', '#ec4899']

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -10 - Math.random() * 20,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: Math.random() * 720 - 360,
    scale: 0.3 + Math.random() * 0.7,
    shape: (['circle', 'square', 'triangle'] as const)[Math.floor(Math.random() * 3)],
  }))
}

export function Confetti({ trigger, duration = 3000 }: Props) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (trigger) {
      setParticles(createParticles(40))
      const timer = setTimeout(() => setParticles([]), duration)
      return () => clearTimeout(timer)
    } else {
      setParticles([])
    }
  }, [trigger, duration])

  const renderShape = (p: Particle) => {
    switch (p.shape) {
      case 'circle':
        return <circle r="4" fill={p.color} />
      case 'square':
        return <rect x="-4" y="-4" width="8" height="8" fill={p.color} transform={`rotate(${p.rotation})`} />
      case 'triangle':
        return <polygon points="0,-5 4.3,3.5 -4.3,3.5" fill={p.color} transform={`rotate(${p.rotation})`} />
    }
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute"
            initial={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              opacity: 0,
            }}
            animate={{
              top: ['110%', '110%'],
              left: [
                `${p.x}%`,
                `${p.x + (Math.random() - 0.5) * 30}%`,
              ],
              opacity: [1, 1, 0],
              rotate: [0, p.rotation],
            }}
            transition={{
              duration: duration / 1000,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <svg width="20" height="20" viewBox="-8 -8 16 16">
              {renderShape(p)}
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
