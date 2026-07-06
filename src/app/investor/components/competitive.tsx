'use client'

import { motion } from 'framer-motion'
import { Check, X, Minus } from 'lucide-react'
import { investorData } from '@/lib/investor-data'

const comparisons = [
  { feature: 'AI-Powered Formulation', vito: true, sheets: false, legacy: false, generic: true, inhouse: false },
  { feature: 'Real-Time IFRA Compliance', vito: true, sheets: false, legacy: false, generic: false, inhouse: false },
  { feature: '500K+ Molecule Database', vito: true, sheets: false, legacy: true, generic: false, inhouse: false },
  { feature: 'Team Collaboration', vito: true, sheets: true, legacy: true, generic: false, inhouse: true },
  { feature: 'Cost Optimization AI', vito: true, sheets: false, legacy: false, generic: false, inhouse: false },
  { feature: 'API & Integrations', vito: true, sheets: false, legacy: true, generic: true, inhouse: false },
  { feature: 'Enterprise SSO & Audit', vito: true, sheets: false, legacy: true, generic: false, inhouse: false },
  { feature: 'Domain-Specific AI', vito: true, sheets: false, legacy: false, generic: false, inhouse: false },
]

export function CompetitiveLandscape() {
  return (
    <motion.section
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
      }}
      className="mb-32"
    >
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-white">Competitive Landscape</h2>
        <p className="mt-2 text-gray-400">VITO is the only platform combining domain-specific AI with real-time compliance</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900/80">
              <th className="px-6 py-4 text-left font-semibold text-gray-300">Feature</th>
              <th className="px-4 py-4 text-center font-semibold text-violet-400">VITO</th>
              <th className="px-4 py-4 text-center font-semibold text-gray-500">Spreadsheets</th>
              <th className="px-4 py-4 text-center font-semibold text-gray-500">Legacy ERP</th>
              <th className="px-4 py-4 text-center font-semibold text-gray-500">Generic AI</th>
              <th className="px-4 py-4 text-center font-semibold text-gray-500">In-House</th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((row, i) => (
              <tr key={i} className="border-b border-gray-800/50 transition-colors hover:bg-gray-900/30">
                <td className="px-6 py-3.5 text-gray-300">{row.feature}</td>
                <td className="px-4 py-3.5 text-center">
                  {row.vito ? <Check className="mx-auto h-4 w-4 text-violet-400" /> : <X className="mx-auto h-4 w-4 text-gray-600" />}
                </td>
                <td className="px-4 py-3.5 text-center">
                  {row.sheets ? <Check className="mx-auto h-4 w-4 text-gray-500" /> : <X className="mx-auto h-4 w-4 text-gray-600" />}
                </td>
                <td className="px-4 py-3.5 text-center">
                  {row.legacy ? <Check className="mx-auto h-4 w-4 text-gray-500" /> : <X className="mx-auto h-4 w-4 text-gray-600" />}
                </td>
                <td className="px-4 py-3.5 text-center">
                  {row.generic ? <Check className="mx-auto h-4 w-4 text-gray-500" /> : <X className="mx-auto h-4 w-4 text-gray-600" />}
                </td>
                <td className="px-4 py-3.5 text-center">
                  {row.inhouse ? <Check className="mx-auto h-4 w-4 text-gray-500" /> : <X className="mx-auto h-4 w-4 text-gray-600" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center text-xs text-gray-500">
        Only VITO offers domain-specific AI trained on fragrance data with real-time IFRA compliance
      </div>
    </motion.section>
  )
}
