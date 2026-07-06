'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface AccordPyramidProps {
  topPercent: number
  heartPercent: number
  basePercent: number
}

export function AccordPyramid({ topPercent, heartPercent, basePercent }: AccordPyramidProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  const total = topPercent + heartPercent + basePercent
  const topRatio = topPercent / total
  const heartRatio = heartPercent / total
  const baseRatio = basePercent / total

  const layers = [
    { id: 'top', label: 'Top Notes', percent: topPercent, ratio: topRatio, color: 'bg-amber-400', hoverColor: 'bg-amber-300', textColor: 'text-amber-900', borderColor: 'border-amber-500' },
    { id: 'heart', label: 'Heart Notes', percent: heartPercent, ratio: heartRatio, color: 'bg-pink-400', hoverColor: 'bg-pink-300', textColor: 'text-pink-900', borderColor: 'border-pink-500' },
    { id: 'base', label: 'Base Notes', percent: basePercent, ratio: baseRatio, color: 'bg-emerald-400', hoverColor: 'bg-emerald-300', textColor: 'text-emerald-900', borderColor: 'border-emerald-500' },
  ]

  const maxWidth = 240

  return (
    <div className="flex flex-col items-center py-4">
      <div className="flex flex-col items-center gap-0.5">
        {layers.map((layer, i) => {
          const width = Math.max(layer.ratio * maxWidth, 60)
          const isHovered = hovered === layer.id
          return (
            <motion.div
              key={layer.id}
              className={cn(
                'flex items-center justify-between px-3 py-1.5 rounded-sm border cursor-pointer transition-colors',
                isHovered ? layer.hoverColor : layer.color,
                layer.borderColor,
              )}
              style={{ width }}
              onMouseEnter={() => setHovered(layer.id)}
              onMouseLeave={() => setHovered(null)}
              whileHover={{ scale: 1.02 }}
              layout
            >
              <span className={cn('text-[10px] font-semibold', layer.textColor)}>
                {layer.label}
              </span>
              <span className={cn('text-[10px] font-mono font-bold', layer.textColor)}>
                {layer.percent}%
              </span>
            </motion.div>
          )
        })}
      </div>
      <div className="flex gap-3 mt-3">
        {layers.map(layer => (
          <Badge
            key={layer.id}
            variant="outline"
            className={cn(
              'text-[10px] cursor-pointer transition-all',
              hovered === layer.id && 'ring-2 ring-offset-1',
            )}
            onMouseEnter={() => setHovered(layer.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className={cn('h-2 w-2 rounded-full mr-1', layer.color)} />
            {layer.percent}%
          </Badge>
        ))}
      </div>
    </div>
  )
}
