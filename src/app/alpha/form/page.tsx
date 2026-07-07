'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function AlphaFormPage() {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="min-h-screen bg-[#0A0D12]">
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="sticky top-0 z-50 w-full"
      >
        <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-6 py-3 shadow-lg shadow-amber-500/20">
          <span className="text-base">⚠️</span>
          <p className="text-sm font-semibold text-white">
            This is an alpha version for testing and feedback
          </p>
          <span className="text-base">⚠️</span>
        </div>
      </motion.div>

      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">VITO Alpha — Feedback Form</h1>
          <p className="text-sm text-white/50">
            Help us improve the platform. All fields are optional.
          </p>
        </div>

        <div className="relative rounded-2xl border border-white/10 overflow-hidden" style={{ background: 'rgba(23,28,36,0.6)' }}>
          {!loaded && (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
            </div>
          )}
          <iframe
            src="https://forms.zoho.sa/mahdialhajjizoho1/form/VitoAlphaform"
            width="100%"
            height="800"
            frameBorder="0"
            onLoad={() => setLoaded(true)}
            className={loaded ? '' : 'invisible absolute'}
            style={{ background: 'transparent' }}
            title="VITO Alpha Feedback Form"
          />
        </div>
      </div>
    </div>
  )
}
