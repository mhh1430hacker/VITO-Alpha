import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, MessageSquare } from 'lucide-react'

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            Ready to transform your fragrance R&amp;D?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
            Join hundreds of fragrance professionals using VITO to create better formulas, faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing">
              <Button size="lg" className="text-base h-12 px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/enterprise">
              <Button size="lg" variant="outline" className="text-base h-12 px-8">
                <MessageSquare className="mr-2 h-5 w-5" />
                Talk to Sales
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Free 14-day trial &middot; No credit card required &middot; Enterprise-grade security
          </p>
        </div>
      </div>
    </section>
  )
}
