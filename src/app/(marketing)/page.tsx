import { HeroSection } from '@/components/marketing/hero-section'
import { TrustBar } from '@/components/marketing/trust-bar'
import { CapabilitiesGrid } from '@/components/marketing/capabilities-grid'
import { StatsSection } from '@/components/marketing/stats-section'
import { TestimonialCarousel } from '@/components/marketing/testimonial-carousel'
import { FinalCTA } from '@/components/marketing/final-cta'

export default function MarketingLandingPage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <CapabilitiesGrid />
      <StatsSection />
      <TestimonialCarousel />
      <FinalCTA />
    </>
  )
}
