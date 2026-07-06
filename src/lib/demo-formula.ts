export interface FormulaIngredient {
  id: string
  name: string
  cas: string
  category: 'top' | 'heart' | 'base' | 'modifier' | 'fixative' | 'solvent'
  percentage: number
  grams: number
  costPerGram: number
  ifraStatus: 'pass' | 'caution' | 'restricted'
  odorProfile: string
  natural?: boolean
  volatility?: 'high' | 'medium' | 'low'
}

export interface FormulaVersion {
  id: string
  version: number
  timestamp: string
  author: string
  change: string
}

export interface AISuggestion {
  id: string
  title: string
  description: string
  impact: string
  confidence: number
  status: 'pending' | 'applied' | 'dismissed'
}

export interface DemoFormula {
  id: string
  name: string
  status: string
  costPerKg: number
  ifraScore: number
  performanceScore: number
  ingredients: FormulaIngredient[]
  versions: FormulaVersion[]
  predictions: Record<string, number>
  aiSuggestions: AISuggestion[]
}

function ing(
  id: string, name: string, cas: string, category: FormulaIngredient['category'],
  percentage: number, costPerGram: number, ifraStatus: FormulaIngredient['ifraStatus'],
  odorProfile: string, natural?: boolean, volatility?: 'high' | 'medium' | 'low'
): FormulaIngredient {
  return {
    id, name, cas, category, percentage,
    grams: percentage * 10,
    costPerGram, ifraStatus, odorProfile,
    natural, volatility,
  }
}

export const demoFormula: DemoFormula = {
  id: 'f-001',
  name: 'Solaire de Nuit',
  status: 'In Review',
  costPerKg: 52.40,
  ifraScore: 94,
  performanceScore: 87,
  ingredients: [
    ing('i-1', 'Bergamot', '8000-27-9', 'top', 15, 0.12, 'pass', 'Citrus, Fresh', true, 'high'),
    ing('i-2', 'Grapefruit', '8016-20-4', 'top', 8, 0.09, 'pass', 'Citrus, Bitter', true, 'high'),
    ing('i-3', 'Mandarin', '8008-31-9', 'top', 6, 0.11, 'pass', 'Citrus, Sweet', true, 'high'),
    ing('i-4', 'Lemon', '84929-31-7', 'top', 5, 0.08, 'pass', 'Citrus, Sharp', true, 'high'),
    ing('i-5', 'Orange Blossom', '8016-38-4', 'top', 4, 0.45, 'pass', 'Floral, Sweet', true, 'high'),
    ing('i-6', 'Aldehyde C-12', '112-54-9', 'top', 2, 0.18, 'pass', 'Waxy, Citrus', false, 'high'),
    ing('i-7', 'Pink Pepper', '284829-24-1', 'top', 3, 0.22, 'pass', 'Spicy, Floral', true, 'high'),
    ing('i-8', 'Blackcurrant', '68606-82-6', 'top', 2, 0.35, 'pass', 'Fruity, Green', false, 'high'),
    ing('i-9', 'Davana', '8016-03-3', 'heart', 3, 2.10, 'pass', 'Fruity, Herbal', true, 'medium'),
    ing('i-10', 'Rose Absolute', '8007-01-0', 'heart', 6, 4.50, 'caution', 'Floral, Rich', true, 'medium'),
    ing('i-11', 'Jasmine Grandiflorum', '8022-96-6', 'heart', 5, 5.20, 'pass', 'Floral, Warm', true, 'medium'),
    ing('i-12', 'Ylang Ylang', '8006-81-3', 'heart', 4, 1.80, 'pass', 'Floral, Sweet', true, 'medium'),
    ing('i-13', 'Iris Pallida', '8002-73-1', 'heart', 2, 12.00, 'pass', 'Powdery, Violet', true, 'medium'),
    ing('i-14', 'Heliotropin', '120-57-0', 'heart', 3, 0.95, 'caution', 'Vanillic, Cherry', false, 'medium'),
    ing('i-15', 'Methyl Ionone', '1335-46-2', 'heart', 4, 0.28, 'pass', 'Woody, Violet', false, 'medium'),
    ing('i-16', 'Cinnamon Bark', '8015-91-6', 'heart', 1.5, 1.10, 'restricted', 'Spicy, Warm', true, 'medium'),
    ing('i-17', 'Clove Bud', '8000-34-8', 'heart', 1, 0.65, 'caution', 'Spicy, Clove', true, 'medium'),
    ing('i-18', 'Neroli', '8016-38-4', 'heart', 2, 8.50, 'pass', 'Floral, Citrus', true, 'medium'),
    ing('i-19', 'Sandalwood', '8006-87-9', 'base', 8, 3.80, 'caution', 'Woody, Creamy', true, 'low'),
    ing('i-20', 'Cedarwood Virginia', '8000-27-0', 'base', 6, 0.45, 'pass', 'Woody, Dry', true, 'low'),
    ing('i-21', 'Patchouli', '8014-09-3', 'base', 5, 0.85, 'pass', 'Earthy, Woody', true, 'low'),
    ing('i-22', 'Vetiver', '8016-96-4', 'base', 4, 1.20, 'pass', 'Earthy, Green', true, 'low'),
    ing('i-23', 'Amberwood', '121903-95-2', 'base', 3, 0.32, 'pass', 'Amber, Woody', false, 'low'),
    ing('i-24', 'Musk Ketone', '81-14-1', 'base', 2.5, 0.18, 'pass', 'Musk, Powdery', false, 'low'),
    ing('i-25', 'Ethylene Brassylate', '105-95-3', 'base', 2, 0.22, 'pass', 'Musk, Fruity', false, 'low'),
    ing('i-26', 'Vanillin', '121-33-5', 'base', 3, 0.35, 'pass', 'Vanilla, Sweet', false, 'low'),
    ing('i-27', 'Tobacco Absolute', '8037-19-2', 'base', 1.5, 6.50, 'pass', 'Smoky, Sweet', true, 'low'),
    ing('i-28', 'Leather Base', '84961-58-0', 'base', 1, 0.90, 'pass', 'Leather, Smoky', false, 'low'),
    ing('i-29', 'Oakmoss', '9000-50-4', 'base', 0.5, 2.40, 'restricted', 'Mossy, Earthy', true, 'low'),
    ing('i-30', 'Coumarin', '91-64-5', 'base', 2, 0.30, 'caution', 'Hay, Sweet', false, 'low'),
    ing('i-31', 'Labdanum', '8016-26-0', 'base', 1, 1.75, 'pass', 'Amber, Resinous', true, 'low'),
    ing('i-32', 'Benzoin Siam', '9000-72-0', 'base', 2, 2.20, 'pass', 'Vanillic, Balsamic', true, 'low'),
    ing('i-33', 'Iso E Super', '54464-57-2', 'modifier', 5, 0.15, 'pass', 'Woody, Velvety', false, 'low'),
    ing('i-34', 'Ambroxan', '3738-00-9', 'modifier', 3, 0.55, 'pass', 'Amber, Woody', false, 'low'),
    ing('i-35', 'Hedione', '24851-98-7', 'modifier', 4, 0.20, 'pass', 'Jasmin, Fresh', false, 'medium'),
    ing('i-36', 'Cashmeran', '33704-61-9', 'modifier', 2, 0.42, 'pass', 'Musk, Woody', false, 'low'),
    ing('i-37', 'Ethyl Maltol', '4940-11-8', 'modifier', 1, 0.38, 'pass', 'Caramelized Sugar', false, 'medium'),
    ing('i-38', 'Methyl Laitone', '39212-23-2', 'modifier', 0.5, 1.60, 'pass', 'Creamy, Coconut', false, 'medium'),
    ing('i-39', 'Galaxolide 50', '1222-05-5', 'fixative', 3, 0.25, 'pass', 'Musk, Clean', false, 'low'),
    ing('i-40', 'Fixolide', '1506-02-1', 'fixative', 2, 0.33, 'pass', 'Musk, Sweet', false, 'low'),
    ing('i-41', 'DPG', '25265-71-8', 'solvent', 5, 0.04, 'pass', 'Odorless', false, 'low'),
    ing('i-42', 'Triethyl Citrate', '77-93-0', 'solvent', 4, 0.06, 'pass', 'Odorless', false, 'low'),
  ],
  versions: [
    { id: 'v-1', version: 1, timestamp: '2026-06-15T10:00:00Z', author: 'Sarah Chen', change: 'Initial creation from brief' },
    { id: 'v-2', version: 2, timestamp: '2026-06-16T14:30:00Z', author: 'Sarah Chen', change: 'Adjusted top notes ratio' },
    { id: 'v-3', version: 3, timestamp: '2026-06-18T09:15:00Z', author: 'Marcus Webb', change: 'Reduced cinnamon to 1.5% (IFRA)' },
    { id: 'v-4', version: 4, timestamp: '2026-06-20T16:45:00Z', author: 'Sarah Chen', change: 'Added hedione for diffusion' },
    { id: 'v-5', version: 5, timestamp: '2026-06-22T11:00:00Z', author: 'AI Optimizer', change: 'AI cost optimization (-12%)' },
    { id: 'v-6', version: 6, timestamp: '2026-06-24T08:30:00Z', author: 'Sarah Chen', change: 'Fine-tuned base accord' },
    { id: 'v-7', version: 7, timestamp: '2026-06-26T13:20:00Z', author: 'Marcus Webb', change: 'Replaced oakmoss with alternative' },
    { id: 'v-8', version: 8, timestamp: '2026-06-28T10:00:00Z', author: 'Sarah Chen', change: 'Final adjustments for submission' },
  ],
  predictions: {
    longevity: 82,
    sillage: 76,
    diffusion: 88,
    stability: 94,
    projection: 79,
    freshness: 85,
    sweetness: 62,
    woodiness: 71,
    floral_intensity: 68,
    spiciness: 45,
    citrus_impact: 78,
    amber_warmth: 73,
    powder_softness: 55,
    green_accord: 42,
    aquatic_freshness: 30,
    gourmand_quality: 48,
    animalic_edge: 35,
    balsamic_depth: 60,
    vintage_character: 52,
    modern_appeal: 88,
    natural_fidelity: 76,
    regulatory_risk: 12,
    cost_efficiency: 84,
    raw_material_availability: 91,
  },
  aiSuggestions: [
    {
      id: 'a-1',
      title: 'Reduce cost by 15%',
      description: 'Replace Rose Absolute with a synthetic alternative (Phenylethyl Alcohol blend) to reduce cost while maintaining floral character.',
      impact: 'Saves $7.80/kg',
      confidence: 92,
      status: 'pending',
    },
    {
      id: 'a-2',
      title: 'Improve longevity to 90+',
      description: 'Increase Fixolide from 2% to 3.5% and reduce DPG accordingly. Projected longevity increase of +8 points.',
      impact: '+8 longevity',
      confidence: 87,
      status: 'pending',
    },
    {
      id: 'a-3',
      title: 'Optimize for natural ingredients',
      description: 'Replace Galaxolide with natural musky ambrettolide and replace Methyl Ionone with orris concrete. Increases natural ratio from 52% to 68%.',
      impact: '68% natural (+16%)',
      confidence: 78,
      status: 'dismissed',
    },
    {
      id: 'a-4',
      title: 'IFRA compliance improvement',
      description: 'Clove bud is near max allowed limit. Reduce to 0.6% and boost with cinnamon leaf (not restricted).',
      impact: 'Improves IFRA to 97',
      confidence: 95,
      status: 'pending',
    },
    {
      id: 'a-5',
      title: 'Suggest alternative for Cinnamon Bark',
      description: 'Cinnamon Bark is IFRA restricted. Replace with Cinnamon Leaf (safe up to 3%) for similar spicy warmth.',
      impact: 'Resolves restriction',
      confidence: 96,
      status: 'applied',
    },
  ],
}

export const recentMaterials: FormulaIngredient[] = [
  ing('m-1', 'Ambroxan', '3738-00-9', 'modifier', 0, 0.55, 'pass', 'Amber, Woody', false, 'low'),
  ing('m-2', 'Bergamot', '8000-27-9', 'top', 0, 0.12, 'pass', 'Citrus, Fresh', true, 'high'),
  ing('m-3', 'Rose Absolute', '8007-01-0', 'heart', 0, 4.50, 'caution', 'Floral, Rich', true, 'medium'),
  ing('m-4', 'Sandalwood', '8006-87-9', 'base', 0, 3.80, 'caution', 'Woody, Creamy', true, 'low'),
  ing('m-5', 'Vanillin', '121-33-5', 'base', 0, 0.35, 'pass', 'Vanilla, Sweet', false, 'low'),
]

export const savedAccords = [
  { id: 'acc-1', name: 'Citrus Burst', ingredients: ['Bergamot', 'Grapefruit', 'Mandarin'], usage: 3 },
  { id: 'acc-2', name: 'Floral Bouquet', ingredients: ['Rose', 'Jasmine', 'Ylang Ylang'], usage: 5 },
  { id: 'acc-3', name: 'Woody Base', ingredients: ['Sandalwood', 'Cedarwood', 'Patchouli'], usage: 7 },
]

export const categoryColors: Record<string, string> = {
  top: 'bg-amber-100 text-amber-800 border-amber-300',
  heart: 'bg-pink-100 text-pink-800 border-pink-300',
  base: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  modifier: 'bg-purple-100 text-purple-800 border-purple-300',
  fixative: 'bg-blue-100 text-blue-800 border-blue-300',
  solvent: 'bg-gray-100 text-gray-800 border-gray-300',
}

export const categoryLabels: Record<string, string> = {
  top: 'Top Note',
  heart: 'Heart Note',
  base: 'Base Note',
  modifier: 'Modifier',
  fixative: 'Fixative',
  solvent: 'Solvent',
}
