import { FlaskConical, Leaf, Microscope, ShieldCheck, Building2, Globe } from 'lucide-react'

const LOGOS = [
  { name: 'Firmenich', Icon: Leaf },
  { name: 'Givaudan', Icon: FlaskConical },
  { name: 'IFF', Icon: Microscope },
  { name: 'Symrise', Icon: ShieldCheck },
  { name: 'Takasago', Icon: Building2 },
  { name: 'Mane', Icon: Globe },
]

export function TrustBar() {
  return (
    <section className="border-y bg-muted/20">
      <div className="container mx-auto px-4 md:px-6 py-10 md:py-14">
        <p className="text-center text-sm font-medium text-muted-foreground mb-8">
          Trusted by leading fragrance houses worldwide
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {LOGOS.map(({ name, Icon }) => (
            <div key={name} className="flex items-center gap-2 text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors">
              <Icon className="h-6 w-6" />
              <span className="text-base font-semibold tracking-tight">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
