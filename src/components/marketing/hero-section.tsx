'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, PlayCircle } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/5 to-background" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="flex flex-col items-center text-center pt-20 md:pt-32 pb-16 md:pb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-muted/50 text-xs font-medium text-muted-foreground mb-8">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Now in public beta
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight max-w-4xl">
            The Operating System for{' '}
            <span className="text-primary">Fragrance R&amp;D</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl">
            From concept to compliant formulation in hours, not months. AI-powered tools for perfumers,
            R&amp;D teams, and fragrance enterprises.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <Link href="/pricing">
              <Button size="lg" className="text-base h-12 px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-base h-12 px-8">
              <PlayCircle className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            No credit card required &middot; Free for 14 days &middot; Cancel anytime
          </p>
        </div>
      </div>
    </section>
  )
}
