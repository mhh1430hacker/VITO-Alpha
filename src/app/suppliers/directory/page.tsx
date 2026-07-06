'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Star, Phone, Mail, Package, Building2, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Supplier {
  id: number
  name: string
  contact: string
  email: string
  status: 'active' | 'inactive' | 'pending'
  rating: number
  materials_count: number
  phone?: string
}

const MOCK_SUPPLIERS: Supplier[] = [
  { id: 1, name: 'Givaudan SA', contact: 'Maria Chen', email: 'maria@givaudan.com', status: 'active', rating: 4.5, materials_count: 23, phone: '+41 22 555 0100' },
  { id: 2, name: 'Firmenich SA', contact: 'Jean-Pierre Dubois', email: 'jp@firmenich.com', status: 'active', rating: 4.8, materials_count: 31 },
  { id: 3, name: 'IFF Inc', contact: 'Sarah Johnson', email: 'sj@iff.com', status: 'active', rating: 4.2, materials_count: 18 },
  { id: 4, name: 'Symrise AG', contact: 'Klaus Mueller', email: 'km@symrise.com', status: 'active', rating: 4.6, materials_count: 27 },
  { id: 5, name: 'Takasago Corp', contact: 'Yuki Tanaka', email: 'yt@takasago.com', status: 'pending', rating: 3.8, materials_count: 5 },
]

const statusVariant = { active: 'success' as const, inactive: 'destructive' as const, pending: 'warning' as const }

export default function SupplierDirectoryPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [filtered, setFiltered] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<number | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuppliers(MOCK_SUPPLIERS)
      setFiltered(MOCK_SUPPLIERS)
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let result = suppliers
    if (search) {
      result = result.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.contact.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (statusFilter !== 'all') {
      result = result.filter(s => s.status === statusFilter)
    }
    setFiltered(result)
  }, [search, statusFilter, suppliers])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading supplier directory...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-lg text-destructive">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Supplier Directory</h1>
          <p className="text-sm text-muted-foreground">Approved and prospective suppliers</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, contact, or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'active', 'inactive', 'pending'].map(s => (
              <Button
                key={s}
                variant={statusFilter === s ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(s)}
                className="capitalize"
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No suppliers match your criteria</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(supplier => (
              <Card key={supplier.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{supplier.name}</CardTitle>
                    <Badge variant={statusVariant[supplier.status]}>
                      {supplier.status}
                    </Badge>
                  </div>
                  <CardDescription>{supplier.contact}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-4 w-4',
                          i < Math.round(supplier.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        )}
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-1">{supplier.rating}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Package className="h-4 w-4" />
                    <span>{supplier.materials_count} materials supplied</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Mail className="h-4 w-4" />
                    <span>{supplier.email}</span>
                  </div>
                  {supplier.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{supplier.phone}</span>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => setExpandedId(expandedId === supplier.id ? null : supplier.id)}
                  >
                    {expandedId === supplier.id ? (
                      <ChevronUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ChevronDown className="h-4 w-4 mr-1" />
                    )}
                    {expandedId === supplier.id ? 'Less' : 'More details'}
                  </Button>
                  {expandedId === supplier.id && (
                    <div className="mt-3 pt-3 border-t space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Contact</span>
                        <span>{supplier.contact}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email</span>
                        <span>{supplier.email}</span>
                      </div>
                      {supplier.phone && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phone</span>
                          <span>{supplier.phone}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Materials</span>
                        <span>{supplier.materials_count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rating</span>
                        <span>{supplier.rating} / 5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <span className="capitalize">{supplier.status}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
