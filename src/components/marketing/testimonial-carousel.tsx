'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const TESTIMONIALS = [
  {
    quote: "VITO has fundamentally changed how we approach fragrance development. What used to take three weeks of iteration now takes two days. The AI formulation engine understands our brand's olfactory DNA.",
    author: 'Dr. Sophie Laurent',
    role: 'Head of R&D',
    company: 'Maison de Parfum',
    rating: 5,
  },
  {
    quote: "The compliance automation alone saves us hundreds of hours per year. Every formulation is automatically checked against IFRA 51st Amendment and REACH regulations before it reaches the evaluator's desk.",
    author: 'Marcus Chen',
    role: 'VP of Product Development',
    company: 'AromaTech International',
    rating: 5,
  },
  {
    quote: "We evaluated every fragrance AI platform on the market. VITO's material intelligence database is unmatched — 50,000+ materials with full olfactory profiles, regulatory data, and substitution recommendations.",
    author: 'Isabella Rossi',
    role: 'Senior Perfumer',
    company: 'Profumi di Firenze',
    rating: 5,
  },
  {
    quote: "The predictive analytics let us forecast consumer preference with 89% accuracy before we spend a single dollar on manufacturing. That's a game-changer for a business our size.",
    author: 'James Okonkwo',
    role: 'CEO',
    company: 'Lagos Fragrance Lab',
    rating: 5,
  },
]

export function TestimonialCarousel() {
  const [current, setCurrent] = useState(0)
  const total = TESTIMONIALS.length

  const prev = () => setCurrent((c) => (c - 1 + total) % total)
  const next = () => setCurrent((c) => (c + 1) % total)

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Trusted by fragrance innovators
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See how leading fragrance houses are transforming their R&amp;D with VITO.
          </p>
        </div>

        <div className="max-w-3xl mx-auto relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="w-full shrink-0 px-2">
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-8 md:p-10">
                      <div className="flex gap-1 mb-6">
                        {Array.from({ length: t.rating }).map((_, j) => (
                          <Star key={j} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <blockquote className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
                        &ldquo;{t.quote}&rdquo;
                      </blockquote>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                          {t.author.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold">{t.author}</div>
                          <div className="text-sm text-muted-foreground">
                            {t.role}, {t.company}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <Button variant="outline" size="icon" onClick={prev} className="rounded-full">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex gap-2">
              {Array.from({ length: total }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={cn(
                    'h-2 w-2 rounded-full transition-all',
                    i === current ? 'bg-primary w-6' : 'bg-muted-foreground/30'
                  )}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={next} className="rounded-full">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
