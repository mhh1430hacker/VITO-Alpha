'use client'

import { AppShell } from '@/components/layout/app-shell'
import { ThemeProvider } from '@/lib/design/theme'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ToastProvider } from '@/components/ui/toast'
import { IntelligenceProvider } from '@/lib/intelligence'
import { AlphaProvider } from '@/lib/alpha/provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AlphaProvider>
          <IntelligenceProvider>
            <TooltipProvider delayDuration={300}>
              <AppShell>{children}</AppShell>
            </TooltipProvider>
          </IntelligenceProvider>
        </AlphaProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
