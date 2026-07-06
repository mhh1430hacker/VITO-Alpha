'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Building2,
  Search,
  ChevronDown,
  ChevronUp,
  Star,
  Phone,
  Mail,
  AlertCircle,
  Package,
} from 'lucide-react'

interface Supplier {
  id: number
  name: string
  materialsSupplied: number
  contact: string
  email: string
  phone: string
  status: 'active' | 'inactive' | 'pending'
  rating: number
  materials: string[]
}

const MOCK_SUPPLIERS: Supplier[] = [
  { id: 1, name: 'Givaudan', materialsSupplied: 12, contact: 'Marie Dubois', email: 'marie@givaudan.com', phone: '+41 22 780 9111', status: 'active', rating: 4.8, materials: ['Benzyl Acetate', 'Methyl Ionone', 'Iso E Super', 'Ambroxan'] },
  { id: 2, name: 'Firmenich', materialsSupplied: 18, contact: 'Klaus Weber', email: 'klaus@firmenich.com', phone: '+41 22 780 8312', status: 'active', rating: 4.9, materials: ['Linalool', 'Limonene', 'Hedione'] },
  { id: 3, name: 'Symrise', materialsSupplied: 14, contact: 'Yuki Tanaka', email: 'yuki@symrise.com', phone: '+49 40 355 460', status: 'active', rating: 4.6, materials: ['Vanillin', 'Ethyl Vanillin', 'Galaxolide'] },
  { id: 4, name: 'IFF', materialsSupplied: 9, contact: 'James Mitchell', email: 'james@iff.com', phone: '+1 212 765 5500', status: 'active', rating: 4.4, materials: ['Coumarin', 'Musk Ketone'] },
  { id: 5, name: 'Takasago', materialsSupplied: 6, contact: 'Satoshi Nakamura', email: 'satoshi@takasago.com', phone: '+81 3 5744 0600', status: 'active', rating: 4.3, materials: ['Geraniol'] },
  { id: 6, name: 'Mane', materialsSupplied: 5, contact: 'Sophie Laurent', email: 'sophie@mane.com', phone: '+33 4 93 39 94 00', status: 'pending', rating: 3.8, materials: ['Bergamot Oil', 'Lavender Oil'] },
  { id: 7, name: 'Robertet', materialsSupplied: 4, contact: 'Pierre Moreau', email: 'pierre@robertet.com', phone: '+33 4 93 39 1010', status: 'active', rating: 4.5, materials: ['Rose Absolute', 'Jasmine Absolute'] },
  { id: 8, name: 'Mane Fils (Inactive)', materialsSupplied: 0, contact: 'N/A', email: '', phone: '', status: 'inactive', rating: 0, materials: [] },
]

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuppliers(MOCK_SUPPLIERS)
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const filtered = suppliers.filter(s => {
    const q = search.toLowerCase()
    return s.name.toLowerCase().includes(q) || s.contact.toLowerCase().includes(q)
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">Material Suppliers</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">Material Suppliers</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Material Suppliers</h1>
          <p className="text-sm text-muted-foreground">Manage supplier relationships and material sourcing</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search suppliers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                {search ? 'No suppliers match your search' : 'No suppliers found'}
              </p>
              {search && (
                <Button variant="outline" onClick={() => setSearch('')}>Clear Search</Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8" />
                    <TableHead>Supplier Name</TableHead>
                    <TableHead>Materials Supplied</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(s => (
                    <>
                      <TableRow
                        key={s.id}
                        className="cursor-pointer"
                        onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                      >
                        <TableCell>
                          {expanded === s.id
                            ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            {s.name}
                          </div>
                        </TableCell>
                        <TableCell>{s.materialsSupplied} materials</TableCell>
                        <TableCell>{s.contact}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              s.status === 'active' ? 'success' :
                              s.status === 'inactive' ? 'destructive' : 'warning'
                            }
                          >
                            {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {s.rating > 0 ? (
                            <div className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                              <span>{s.rating.toFixed(1)}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs">N/A</span>
                          )}
                        </TableCell>
                      </TableRow>
                      {expanded === s.id && (
                        <TableRow key={`${s.id}-detail`}>
                          <TableCell colSpan={6} className="bg-gray-50 dark:bg-gray-950 p-4">
                            <div className="grid grid-cols-2 gap-6 text-sm">
                              <div className="space-y-3">
                                <div>
                                  <span className="font-medium">Contact:</span>
                                  <div className="flex items-center gap-1 mt-1">
                                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                    <a href={`mailto:${s.email}`} className="text-blue-600 hover:underline">{s.email}</a>
                                  </div>
                                  <div className="flex items-center gap-1 mt-1">
                                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span>{s.phone}</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <span className="font-medium">Materials Supplied:</span>
                                {s.materials.length > 0 ? (
                                  <div className="flex flex-wrap gap-1.5 mt-1">
                                    {s.materials.map(m => (
                                      <Badge key={m} variant="secondary" className="text-xs">{m}</Badge>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-muted-foreground text-xs mt-1">No materials currently supplied</p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
