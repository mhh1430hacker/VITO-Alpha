'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FlaskConical, Linkedin, Twitter, Github, Mail, ArrowRight, CheckCircle } from 'lucide-react'

const FOOTER_LINKS = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Enterprise', href: '/enterprise' },
    { label: 'ROI Calculator', href: '/roi-calculator' },
    { label: 'Integrations', href: '#' },
    { label: 'Changelog', href: '#' },
  ],
  Resources: [
    { label: 'Documentation', href: '/docs' },
    { label: 'API Reference', href: '/api' },
    { label: 'Help Center', href: '#' },
    { label: 'Community', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Webinars', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '/enterprise' },
    { label: 'Partners', href: '#' },
    { label: 'Press Kit', href: '#' },
    { label: 'Status', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'GDPR', href: '#' },
    { label: 'SOC 2', href: '#' },
    { label: 'DPA', href: '#' },
  ],
}

export function MarketingFooter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <FlaskConical className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">VITO</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              The operating system for fragrance R&amp;D. AI-powered formulation, material intelligence, and compliance automation.
            </p>
            <div className="flex items-center gap-3">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold mb-3">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-sm">
              <h4 className="text-sm font-semibold mb-1">Stay updated</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Get the latest on fragrance AI, industry insights, and product updates.
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Thanks for subscribing!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-9 text-sm max-w-[240px]"
                    required
                  />
                  <Button type="submit" size="sm" className="h-9">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} VITO Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
