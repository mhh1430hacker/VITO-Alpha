'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FORM_URL = 'https://forms.zoho.sa/mahdialhajjizoho1/form/VitoAlphaform'

export function AlphaBanner() {
  const [showExitPopup, setShowExitPopup] = useState(false)
  const blocked = useRef(false)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (blocked.current) return
      if (e.clientY <= 5 && e.movementY < 0) {
        blocked.current = true
        setShowExitPopup(true)
      }
    }
    document.addEventListener('mouseleave', handler)
    return () => document.removeEventListener('mouseleave', handler)
  }, [])

  return (
    <>
      <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-4 py-2.5 shadow-md">
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

      <AnimatePresence>
        {showExitPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="relative w-full max-w-md rounded-2xl border border-amber-500/30 bg-[#0A0D12] p-8 shadow-2xl shadow-amber-500/10"
            >
              <div className="text-center space-y-5">
                <span className="text-4xl">&#9888;&#65039;</span>

                <h2 className="text-xl font-bold text-white">
                  Leaving already?
                </h2>

                <p className="text-sm text-white/60 leading-relaxed">
                  This is an alpha version for testing and feedback.
                  Your input helps us improve VITO.
                </p>

                <div className="flex flex-col gap-3 pt-2">
                  <a
                    href={FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-orange-500 transition-all"
                  >
                    Give Feedback (FORM HERE)
                  </a>

                  <button
                    onClick={() => setShowExitPopup(false)}
                    className="rounded-xl border border-white/10 px-6 py-3 text-sm text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
                  >
                    Continue browsing
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
