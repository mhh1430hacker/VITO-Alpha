'use client'

import { motion } from 'framer-motion'
import { investorData } from '@/lib/investor-data'

const avatarColors = ['#6C3BF5', '#14B8A6', '#F5A623', '#F43F5E', '#8B5CF6', '#34D399']

export function Team() {
  return (
    <motion.section
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
      }}
      className="mb-32"
    >
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-white">Team</h2>
        <p className="mt-2 text-gray-400">World-class team from fragrance, AI, and enterprise SaaS</p>
      </div>

      <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {investorData.team.map((member, i) => (
          <div key={member.name} className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm">
            <div className="mb-3 flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: avatarColors[i % avatarColors.length] }}
              >
                {member.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{member.name}</p>
                <p className="text-xs text-gray-500">{member.title}</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-gray-400">{member.bio}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <h3 className="mb-4 text-sm font-semibold text-gray-300">Advisory Board</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {investorData.advisors.map((advisor) => (
            <div key={advisor.name} className="rounded-lg border border-gray-800 bg-gray-900/30 p-4">
              <p className="text-sm font-medium text-white">{advisor.name}</p>
              <p className="text-xs text-gray-500">{advisor.title}</p>
              <span className="mt-1 inline-block rounded bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-400">
                {advisor.expertise}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
