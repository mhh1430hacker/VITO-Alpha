import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './alpha-init'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VITO Alpha — Olfactory Intelligence Platform',
  description: 'Explore the VITO perfumery intelligence platform with synthetic data. No infrastructure required.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
