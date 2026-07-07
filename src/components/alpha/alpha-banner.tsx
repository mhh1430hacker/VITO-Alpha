'use client'

import { motion } from 'framer-motion'

const FORM_URL = 'https://forms.zoho.sa/mahdialhajjizoho1/form/VitoAlphaform'

export function AlphaBanner() {
  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="fixed top-0 left-0 right-0 z-60"
    >
      <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-4 py-2.5 shadow-lg shadow-amber-500/20">
        <span className="text-base shrink-0">&#9888;&#65039;</span>
        <p className="text-sm font-semibold text-white text-center">
          This is an alpha version for testing and feedback{' '}
          <a
            href={FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 decoration-white/60 hover:decoration-white transition-colors font-bold"
          >
            (FORM HERE)
          </a>
        </p>
        <span className="text-base shrink-0">&#9888;&#65039;</span>
      </div>
    </motion.div>
  )
}
