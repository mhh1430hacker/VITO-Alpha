import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './alpha-init'
import { Providers } from './providers'
import AlphaBannerWrapper from './alpha-banner-wrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VITO Alpha — Olfactory Intelligence Platform',
  description: 'Explore the VITO perfumery intelligence platform with synthetic data. No infrastructure required.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex flex-col h-full`}>
        <AlphaBannerWrapper />
        <div className="flex-1 min-h-0">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  )
}
