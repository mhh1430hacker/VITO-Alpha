'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function AlphaFormPage() {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="min-h-screen bg-[#0A0D12]">
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
            src="https://docs.google.com/forms/d/e/1FAIpQLSe5LwmJ_ctfCrA7EzOIAeDJhSvWJlA1ZREbPt4FrSLn4DTdCA/viewform?embedded=true"
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
