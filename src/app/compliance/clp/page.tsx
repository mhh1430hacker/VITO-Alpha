'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import {
  AlertCircle,
  Loader2,
  FileWarning,
  RefreshCw,
  AlertTriangle,
  Skull,
  Flame,
  Heart,
  Leaf,
  Radiation,
  Bomb,
} from 'lucide-react'

interface CLPSubstance {
  id: number
  substance: string
  cas: string
  hazardStatements: string[]
  precautionaryStatements: string[]
  pictogram: 'health' | 'flame' | 'corrosive' | 'environment' | 'toxic' | 'explosive' | 'gas'
  signalWord: 'Danger' | 'Warning' | 'None'
}

const PICTOGRAM_MAP: Record<string, { icon: React.ElementType; label: string }> = {
  health: { icon: Heart, label: 'Health Hazard' },
  flame: { icon: Flame, label: 'Flammable' },
  corrosive: { icon: AlertTriangle, label: 'Corrosive' },
  environment: { icon: Leaf, label: 'Environment' },
  toxic: { icon: Skull, label: 'Acute Toxicity' },
  explosive: { icon: Bomb, label: 'Explosive' },
  gas: { icon: Radiation, label: 'Gas Under Pressure' },
}

const MOCK_DATA: CLPSubstance[] = [
  {
    id: 1, substance: 'Benzyl Acetate', cas: '140-11-4',
    hazardStatements: ['H302: Harmful if swallowed', 'H315: Causes skin irritation'],
    precautionaryStatements: ['P264: Wash thoroughly after handling', 'P301+P312: IF SWALLOWED call a POISON CENTER'],
    pictogram: 'health', signalWord: 'Warning',
  },
  {
    id: 2, substance: 'Linalool', cas: '78-70-6',
    hazardStatements: ['H317: May cause allergic skin reaction'],
    precautionaryStatements: ['P261: Avoid breathing dust/fume/gas/mist', 'P280: Wear protective gloves'],
    pictogram: 'health', signalWord: 'Warning',
  },
  {
    id: 3, substance: 'Coumarin', cas: '91-64-5',
    hazardStatements: ['H302: Harmful if swallowed', 'H373: May cause damage to organs'],
    precautionaryStatements: ['P260: Do not breathe dust', 'P301+P312: IF SWALLOWED call a POISON CENTER'],
    pictogram: 'toxic', signalWord: 'Danger',
  },
  {
    id: 4, substance: 'Limonene', cas: '5989-27-5',
    hazardStatements: ['H226: Flammable liquid and vapour', 'H315: Causes skin irritation', 'H317: May cause allergic skin reaction'],
    precautionaryStatements: ['P210: Keep away from heat/sparks/open flames', 'P280: Wear protective gloves'],
    pictogram: 'flame', signalWord: 'Danger',
  },
  {
    id: 5, substance: 'Ethanol', cas: '64-17-5',
    hazardStatements: ['H225: Highly flammable liquid and vapour'],
    precautionaryStatements: ['P210: Keep away from heat/sparks/open flames', 'P233: Keep container tightly closed'],
    pictogram: 'flame', signalWord: 'Danger',
  },
]

const SIGNAL_COLOR: Record<string, 'destructive' | 'warning' | 'secondary'> = {
  Danger: 'destructive',
  Warning: 'warning',
  None: 'secondary',
}

type PageState = 'loading' | 'ready' | 'empty' | 'error'

export default function CLPPage() {
  const [data, setData] = useState<CLPSubstance[]>([])
  const [pageState, setPageState] = useState<PageState>('loading')

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(MOCK_DATA)
      setPageState('ready')
    }, 900)
    return () => clearTimeout(timer)
  }, [])

  if (pageState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">CLP Hazard Classification</h1>
            <p className="text-sm text-muted-foreground">GHS/CLP hazard labeling information</p>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Loading Classifications</CardTitle>
              <CardDescription>Fetching CLP hazard data...</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-14 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (pageState === 'empty') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">CLP Hazard Classification</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <FileWarning className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No CLP classifications found. Add substances to generate classifications.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (pageState === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold">CLP Hazard Classification</h1>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <p className="text-red-600 mb-2 font-semibold">Failed to Load Classifications</p>
              <p className="text-muted-foreground mb-6">An error occurred while fetching CLP data.</p>
              <Button onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
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
          <h1 className="text-2xl font-bold">CLP Hazard Classification</h1>
          <p className="text-sm text-muted-foreground">GHS/CLP hazard labeling information</p>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Substance</TableHead>
                  <TableHead>CAS#</TableHead>
                  <TableHead>Hazard Statements</TableHead>
                  <TableHead>Precautionary Statements</TableHead>
                  <TableHead>Pictogram</TableHead>
                  <TableHead>Signal Word</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map(s => {
                  const picto = PICTOGRAM_MAP[s.pictogram]
                  const PictoIcon = picto.icon
                  return (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.substance}</TableCell>
                      <TableCell className="font-mono text-xs">{s.cas}</TableCell>
                      <TableCell>
                        <ul className="list-disc list-inside text-xs space-y-1">
                          {s.hazardStatements.map((h, i) => (
                            <li key={i}>{h}</li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell>
                        <ul className="list-disc list-inside text-xs space-y-1">
                          {s.precautionaryStatements.map((p, i) => (
                            <li key={i}>{p}</li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <PictoIcon className="h-5 w-5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{picto.label}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={SIGNAL_COLOR[s.signalWord]}>
                          {s.signalWord}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
