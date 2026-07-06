'use client'

import { AlphaConfig } from './config'

const DEMO_WORKSPACE_ID = 'alpha-demo-workspace'
const CACHE_KEY = 'vito_alpha_dataset'
const CACHE_TTL_MS = 60 * 60 * 1000

function createRNG(seed: number): () => number {
  let s = seed | 0
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function pick<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)]
}

function pickN<T>(arr: readonly T[], n: number, rng: () => number): T[] {
  const shuffled = [...arr].sort(() => rng() - 0.5)
  return shuffled.slice(0, n)
}

function intBetween(min: number, max: number, rng: () => number): number {
  return Math.floor(rng() * (max - min + 1)) + min
}

function floatBetween(min: number, max: number, rng: () => number, decimals = 2): number {
  const val = rng() * (max - min) + min
  return parseFloat(val.toFixed(decimals))
}

function biasHigh(rng: () => number, skew = 0.6): number {
  const raw = rng()
  return Math.pow(raw, skew)
}

function biasLow(rng: () => number, skew = 1.6): number {
  return 1 - Math.pow(1 - rng(), 1 / skew)
}

function uuidFromIndex(prefix: string, index: number): string {
  const hex = (index + 1).toString(16).padStart(8, '0')
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? `${prefix}-${hex}-${crypto.randomUUID().slice(9)}`
    : `${prefix}-${hex}-${Math.floor(Math.random() * 1e16).toString(16)}`
}

export interface Material {
  id: string
  name: string
  cas_number: string
  family: string
  note: 'top' | 'middle' | 'base'
  volatility: 'high' | 'medium' | 'low'
  tenacity: number
  ifra_limit: number
  reach_limit: number
  price_per_kg: number
  supplier: string
  description: string
  quality_grade: 'A' | 'B' | 'C' | 'Premium'
  demoWorkspaceId: string
}

export interface FormulaMaterial {
  materialId: string
  percentage: number
}

export interface Formula {
  id: string
  name: string
  materials: FormulaMaterial[]
  stability_score: number
  performance_score: number
  balance_score: number
  status: 'Draft' | 'In Review' | 'Approved' | 'Rejected'
  perfumer: string
  created_at: string
  demoWorkspaceId: string
}

export interface Supplier {
  id: string
  name: string
  country: string
  reliability_score: number
  contact_email: string
  materials_supplied: string[]
  demoWorkspaceId: string
}

export interface Experiment {
  id: string
  hypothesis: string
  result: 'success' | 'partial' | 'failure'
  success_score: number
  ai_predicted_score: number
  learnings: string[]
  demoWorkspaceId: string
}

export interface Prediction {
  id: string
  market_fit: number
  longevity_score: number
  appeal_score: number
  risk_factors: string[]
  demoWorkspaceId: string
}

export interface ComplianceCheck {
  id: string
  substance: string
  ifra_status: 'compliant' | 'restricted' | 'prohibited'
  reach_status: 'registered' | 'restricted' | 'authorised' | 'pending'
  regulatory_body: string
  notes: string
  demoWorkspaceId: string
}

export interface MaterialAlert {
  id: string
  materialName: string
  type: 'price_surge' | 'shortage' | 'quality_issue'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  date: string
  demoWorkspaceId: string
}

export interface KnowledgeEntry {
  id: string
  title: string
  content: string
  category: string
  author: string
  created_at: string
  tags: string[]
  demoWorkspaceId: string
}

export interface AIInsight {
  id: string
  title: string
  content: string
  model: string
  confidence: number
  category: string
  generated_at: string
  demoWorkspaceId: string
}

export interface AlphaDataset {
  materials: Material[]
  formulas: Formula[]
  suppliers: Supplier[]
  experiments: Experiment[]
  predictions: Prediction[]
  checks: ComplianceCheck[]
  alerts: MaterialAlert[]
  dashboardStats: Record<string, number>
  knowledgeEntries: KnowledgeEntry[]
  insights: AIInsight[]
  generatedAt: string
  version: string
  complianceStatus?: {
    ifraCompliant?: boolean
    reachCompliant?: boolean
    pendingReviews?: number
    nextAuditDate?: string
  }
  aiInsights?: Array<Record<string, any>>
}

const MATERIAL_TEMPLATES = [
  { name: 'Ambroxan', cas: '6790-58-5', family: 'Ambery', note: 'base' as const, volatility: 'low' as const, tenacity: 400, ifra: 15, reach: 100, price: 280, quality: 'Premium' as const, desc: 'Synthetic ambergris note. Dry, woody, slightly marine with exceptional diffusion and longevity.' },
  { name: 'Bergamot Essential Oil', cas: '8000-27-9', family: 'Citrus', note: 'top' as const, volatility: 'high' as const, tenacity: 4, ifra: 1.7, reach: 100, price: 85, quality: 'A' as const, desc: 'Cold-pressed from Calabrian bergamot peel. Fresh, green-citrus with a slight floral-spicy undertone.' },
  { name: 'Hedione', cas: '24851-98-7', family: 'Floral', note: 'middle' as const, volatility: 'medium' as const, tenacity: 24, ifra: 100, reach: 100, price: 45, quality: 'A' as const, desc: 'Methyl dihydrojasmonate. Transparent jasmine nuance with remarkable radiance and lifting effect.' },
  { name: 'Iso E Super', cas: '54464-57-2', family: 'Woody', note: 'base' as const, volatility: 'low' as const, tenacity: 168, ifra: 21.4, reach: 100, price: 32, quality: 'A' as const, desc: 'Smooth, velvety cedarwood-amber with a distinctive aura effect. Provides fullness without weight.' },
  { name: 'Vanillin', cas: '121-33-5', family: 'Gourmand', note: 'base' as const, volatility: 'low' as const, tenacity: 280, ifra: 100, reach: 100, price: 18, quality: 'B' as const, desc: 'Sweet, creamy vanilla note. Ubiquitous in perfumery for warmth and comfort.' },
  { name: 'Linalool', cas: '78-70-6', family: 'Floral', note: 'top' as const, volatility: 'high' as const, tenacity: 6, ifra: 100, reach: 100, price: 22, quality: 'A' as const, desc: 'Natural-occurring terpene alcohol. Fresh, light floral with a hint of citrus and lavender.' },
  { name: 'Coumarin', cas: '91-64-5', family: 'Gourmand', note: 'base' as const, volatility: 'low' as const, tenacity: 200, ifra: 1.6, reach: 100, price: 60, quality: 'A' as const, desc: 'Sweet hay, almond, and tonka bean aroma. Classic fougère backbone material.' },
  { name: 'Citral', cas: '5392-40-5', family: 'Citrus', note: 'top' as const, volatility: 'high' as const, tenacity: 3, ifra: 100, reach: 100, price: 35, quality: 'B' as const, desc: 'Bright, intense lemon character. Primary constituent of lemongrass and lemon myrtle oils.' },
  { name: 'Geraniol', cas: '106-24-1', family: 'Floral', note: 'middle' as const, volatility: 'medium' as const, tenacity: 12, ifra: 100, reach: 100, price: 28, quality: 'A' as const, desc: 'Sweet rose-geranium with fruity undertones. Key component of rose and palmarosa oils.' },
  { name: 'Eugenol', cas: '97-53-0', family: 'Spicy', note: 'middle' as const, volatility: 'medium' as const, tenacity: 24, ifra: 2.5, reach: 100, price: 40, quality: 'A' as const, desc: 'Warm, spicy clove character. Found naturally in clove bud, cinnamon leaf, and basil oils.' },
  { name: 'Limonene d-', cas: '5989-27-5', family: 'Citrus', note: 'top' as const, volatility: 'high' as const, tenacity: 2, ifra: 100, reach: 100, price: 12, quality: 'B' as const, desc: 'Fresh orange-peel citrus. The most abundant terpene in nature and key citrus signature.' },
  { name: 'Alpha-Pinene', cas: '80-56-8', family: 'Herbal', note: 'top' as const, volatility: 'high' as const, tenacity: 4, ifra: 100, reach: 100, price: 20, quality: 'A' as const, desc: 'Pine-needle, woody-coniferous freshness. Found abundantly in pine, rosemary, and juniper oils.' },
  { name: 'Benzyl Acetate', cas: '140-11-4', family: 'Floral', note: 'top' as const, volatility: 'high' as const, tenacity: 6, ifra: 100, reach: 100, price: 15, quality: 'B' as const, desc: 'Sweet, fruity jasmine character. Naturally present in ylang ylang and gardenia.' },
  { name: 'Ethyl Vanillin', cas: '121-32-4', family: 'Gourmand', note: 'base' as const, volatility: 'low' as const, tenacity: 300, ifra: 100, reach: 100, price: 55, quality: 'A' as const, desc: '3-4x stronger than vanillin. Rich, creamy, chocolate-vanilla with exceptional warmth.' },
  { name: 'Galaxolide 50%', cas: '1222-05-5', family: 'Musk', note: 'base' as const, volatility: 'low' as const, tenacity: 420, ifra: 100, reach: 100, price: 25, quality: 'A' as const, desc: 'Clean, sweet, powdery musk. The most widely used synthetic musk in fine fragrance.' },
  { name: 'Cashmeran', cas: '33704-61-9', family: 'Woody', note: 'base' as const, volatility: 'low' as const, tenacity: 360, ifra: 3.8, reach: 100, price: 120, quality: 'Premium' as const, desc: 'Warm, spicy, musky-woody with a velvety cashmere texture. Adds sophisticated diffusion.' },
  { name: 'Calone 1951', cas: '28940-11-6', family: 'Marine', note: 'middle' as const, volatility: 'medium' as const, tenacity: 48, ifra: 100, reach: 100, price: 340, quality: 'Premium' as const, desc: 'Watery, ozonic, melon-marine note. The signature material behind the oceanic fragrance wave.' },
  { name: 'Ethylene Brassylate', cas: '105-95-3', family: 'Musk', note: 'base' as const, volatility: 'low' as const, tenacity: 350, ifra: 100, reach: 100, price: 22, quality: 'A' as const, desc: 'Sweet, powdery macrocyclic musk. Excellent fixative with a delicate floral-musk profile.' },
  { name: 'Dihydromyrcenol', cas: '18479-58-8', family: 'Citrus', note: 'top' as const, volatility: 'high' as const, tenacity: 8, ifra: 100, reach: 100, price: 14, quality: 'B' as const, desc: 'Fresh, lime-citrus with a clean lavender facet. Backbone of modern masculine fragrances.' },
  { name: 'Rose Absolute (Turkish)', cas: '8007-01-0', family: 'Floral', note: 'middle' as const, volatility: 'medium' as const, tenacity: 72, ifra: 100, reach: 100, price: 5800, quality: 'Premium' as const, desc: 'Solvent-extracted from Rosa damascena. Rich, honeyed, spicy-rose with exceptional depth.' },
  { name: 'Jasmine Absolute (Egyptian)', cas: '8022-96-6', family: 'Floral', note: 'middle' as const, volatility: 'medium' as const, tenacity: 80, ifra: 100, reach: 100, price: 4200, quality: 'Premium' as const, desc: 'Grandiflorum absolute. Intensely floral, indolic, warm and narcotic. The queen of white florals.' },
  { name: 'Patchouli Essential Oil', cas: '8014-09-3', family: 'Woody', note: 'base' as const, volatility: 'low' as const, tenacity: 260, ifra: 100, reach: 100, price: 95, quality: 'A' as const, desc: 'Indonesian patchouli. Earthy, woody, camphoraceous with a subtle chocolate undertone.' },
  { name: 'Sandalwood (Australian)', cas: '8006-87-9', family: 'Woody', note: 'base' as const, volatility: 'low' as const, tenacity: 280, ifra: 100, reach: 100, price: 1200, quality: 'Premium' as const, desc: 'Santalum spicatum. Creamy, soft, milky wood. Sustainable alternative to Indian sandalwood.' },
  { name: 'Cedarwood (Virginian)', cas: '8000-27-9', family: 'Woody', note: 'base' as const, volatility: 'medium' as const, tenacity: 120, ifra: 100, reach: 100, price: 30, quality: 'A' as const, desc: 'Juniperus virginiana oil. Pencil-shaving, dry woody note. Classic masculine backbone.' },
  { name: 'Vetiver (Haitian)', cas: '8016-96-4', family: 'Woody', note: 'base' as const, volatility: 'low' as const, tenacity: 300, ifra: 100, reach: 100, price: 280, quality: 'A' as const, desc: 'Smoky, earthy, rooty with a subtle grapefruit nuance. Complex and elegant.' },
  { name: 'Neroli Essential Oil', cas: '8016-38-4', family: 'Floral', note: 'top' as const, volatility: 'high' as const, tenacity: 12, ifra: 100, reach: 100, price: 2400, quality: 'Premium' as const, desc: 'Bitter orange blossom distillate. Fresh, green-floral, honeyed with remarkable radiance.' },
  { name: 'Ylang Ylang Extra', cas: '8006-81-3', family: 'Floral', note: 'middle' as const, volatility: 'medium' as const, tenacity: 48, ifra: 100, reach: 100, price: 320, quality: 'A' as const, desc: 'First fraction distillate. Rich, sweet, narcotic floral with banana-custard undertones.' },
  { name: 'Geranium (Bourbon)', cas: '8000-46-2', family: 'Floral', note: 'middle' as const, volatility: 'medium' as const, tenacity: 36, ifra: 100, reach: 100, price: 180, quality: 'A' as const, desc: 'Pelargonium graveolens. Minty-rose with a green leaf aspect. Indispensable in masculine florals.' },
  { name: 'Lavender (Bulgarian)', cas: '8000-28-0', family: 'Herbal', note: 'top' as const, volatility: 'high' as const, tenacity: 16, ifra: 100, reach: 100, price: 75, quality: 'A' as const, desc: 'High-altitude lavender. Sweet, herbaceous, mildly camphoraceous. Classic fougère essential.' },
  { name: 'Pink Pepper CO2', cas: '284829-24-1', family: 'Spicy', note: 'top' as const, volatility: 'high' as const, tenacity: 20, ifra: 100, reach: 100, price: 220, quality: 'A' as const, desc: 'Schinus molle extract. Sparkling, rosy-spicy with a vibrant, effervescent opening.' },
  { name: 'Cardamom Essential Oil', cas: '8000-66-6', family: 'Spicy', note: 'top' as const, volatility: 'high' as const, tenacity: 10, ifra: 100, reach: 100, price: 380, quality: 'A' as const, desc: 'Elettaria cardamomum. Fresh, spicy-eucalyptus with a warm, aromatic sweetness.' },
  { name: 'Cinnamon Bark Oil', cas: '8015-91-6', family: 'Spicy', note: 'middle' as const, volatility: 'medium' as const, tenacity: 60, ifra: 0.5, reach: 100, price: 65, quality: 'B' as const, desc: 'Cinnamomum zeylanicum. Warm, sweet-spicy with clove undertones. Powerful and diffusive.' },
  { name: 'Nutmeg Essential Oil', cas: '8008-45-5', family: 'Spicy', note: 'top' as const, volatility: 'high' as const, tenacity: 18, ifra: 100, reach: 100, price: 55, quality: 'B' as const, desc: 'Myristica fragrans. Warm, spicy-terpenic with a woody, slightly sweet character.' },
  { name: 'Clove Bud Oil', cas: '8000-34-8', family: 'Spicy', note: 'middle' as const, volatility: 'medium' as const, tenacity: 72, ifra: 0.5, reach: 100, price: 45, quality: 'B' as const, desc: 'Syzygium aromaticum. Powerful, warm, sweet-spicy. High eugenol content.' },
  { name: 'Iris Pallida Butter', cas: '8002-73-1', family: 'Floral', note: 'base' as const, volatility: 'low' as const, tenacity: 500, ifra: 100, reach: 100, price: 15000, quality: 'Premium' as const, desc: 'Aged orris rhizome extract. Powdery, violet, woody, suede. One of the most precious materials.' },
  { name: 'Labdanum Absolute', cas: '8016-26-0', family: 'Ambery', note: 'base' as const, volatility: 'low' as const, tenacity: 350, ifra: 100, reach: 100, price: 240, quality: 'A' as const, desc: 'Cistus ladaniferus resinoid. Rich, balsamic, leathery-amber with animalic undertones.' },
  { name: 'Benzoin Siam Resinoid', cas: '9000-05-9', family: 'Balsamic', note: 'base' as const, volatility: 'low' as const, tenacity: 300, ifra: 100, reach: 100, price: 70, quality: 'A' as const, desc: 'Styrax tonkinensis resin. Sweet, warm vanilla-caramel with a soft balsamic character.' },
  { name: 'Oakmoss Absolute', cas: '9000-50-4', family: 'Woody', note: 'base' as const, volatility: 'low' as const, tenacity: 320, ifra: 0.1, reach: 100, price: 340, quality: 'A' as const, desc: 'Evernia prunastri extract. Earthy, woody, leathery. The soul of classic chypre fragrances.' },
  { name: 'Tonka Bean Absolute', cas: '8046-22-8', family: 'Gourmand', note: 'base' as const, volatility: 'low' as const, tenacity: 280, ifra: 1.6, reach: 100, price: 180, quality: 'A' as const, desc: 'Dipteryx odorata extract. Almond, cherry, hay, vanilla. Warm and comforting.' },
  { name: 'Agarwood (Oud) Oil', cas: '94201-64-2', family: 'Woody', note: 'base' as const, volatility: 'low' as const, tenacity: 500, ifra: 100, reach: 100, price: 8500, quality: 'Premium' as const, desc: 'Aquilaria malaccensis. Smoky, animalic, woody, leathery. The liquid gold of perfumery.' },
  { name: 'Heliotropin', cas: '120-57-0', family: 'Gourmand', note: 'middle' as const, volatility: 'medium' as const, tenacity: 100, ifra: 100, reach: 100, price: 110, quality: 'A' as const, desc: 'Piperonal. Sweet, cherry-almond, vanilla-helotrope. Floral confectionery warmth.' },
  { name: 'Methyl Ionone (Alpha)', cas: '1335-46-2', family: 'Floral', note: 'middle' as const, volatility: 'medium' as const, tenacity: 96, ifra: 100, reach: 100, price: 38, quality: 'A' as const, desc: 'Powdery, violet-orris with a woody raspberry nuance. Classic violet accord backbone.' },
  { name: 'Aldehyde C-12 MNA', cas: '110-41-8', family: 'Aldehydic', note: 'top' as const, volatility: 'high' as const, tenacity: 12, ifra: 100, reach: 100, price: 90, quality: 'A' as const, desc: 'Waxy, soapy-citrus with an orange-peel character. The Chanel No. 5 signature.' },
  { name: 'Ethyl Linalool', cas: '10339-55-6', family: 'Floral', note: 'top' as const, volatility: 'high' as const, tenacity: 14, ifra: 100, reach: 100, price: 20, quality: 'B' as const, desc: 'Fresh, floral-bergamot with a lavender nuance. More stable than linalool.' },
  { name: 'Cis-3-Hexenol', cas: '928-96-1', family: 'Green', note: 'top' as const, volatility: 'high' as const, tenacity: 2, ifra: 100, reach: 100, price: 160, quality: 'A' as const, desc: 'Intensely green, grassy, freshly cut leaf. The quintessential green note.' },
  { name: 'Amyl Salicylate', cas: '2050-08-0', family: 'Floral', note: 'middle' as const, volatility: 'medium' as const, tenacity: 36, ifra: 100, reach: 100, price: 18, quality: 'B' as const, desc: 'Sweet, herbaceous-floral with a clover-trefoil character. Sunlight in a bottle.' },
]

const FAMILIES = ['Citrus', 'Floral', 'Woody', 'Ambery', 'Gourmand', 'Spicy', 'Herbal', 'Musk', 'Marine', 'Green', 'Aldehydic', 'Balsamic', 'Fruity', 'Leather', 'Oud']

const NOTES = ['top', 'middle', 'base'] as const

const VOLATILITY = ['high', 'medium', 'low'] as const

const QUALITY_GRADES = ['A', 'B', 'C', 'Premium'] as const

const STATUSES = ['Draft', 'In Review', 'Approved', 'Rejected'] as const

const PERFUMERS = ['Elena Voss', 'Marco Ricci', 'Amir Al-Farsi', 'Sophie Laurent', 'Yuki Tanaka', 'Camille Dubois', 'Ravi Patel']

const FORMULA_NAME_PARTS_A = [
  'Velvet', 'Oud', 'Citrus', 'Ambre', 'Fleur', 'Rose', 'Cuir', 'Bois', 'Santal',
  'Vanille', 'Jasmin', 'Nuit', 'Lune', 'Soleil', 'Musk', 'Fougère', 'Orchidée',
  'Cèdre', 'Tabac', 'Iris', 'Miel', 'Vétiver', 'Encens', 'Patchouli', 'Néroli',
  'Safran', 'Myrrhe', 'Thé', 'Benjoin', 'Labdanum', 'Héliotrope', 'Osmanthus',
  'Tubéreuse', 'Magnolia', 'Bergamote', 'Lavande', 'Géranium', 'Ylang',
  'Cardamome', 'Poivre', 'Gingembre', 'Cannelle', 'Muscade', 'Anis',
  'Coriandre', 'Basilic', 'Romarin', 'Verveine', 'Menthe', 'Eucalyptus',
  'Pamplemousse', 'Citron', 'Mandarine', 'Orange', 'Pêche', 'Framboise',
  'Cassis', 'Figue', 'Noix', 'Amande', 'Fève', 'Cacao', 'Caramel', 'Rhum',
  'Whisky', 'Cuir', 'Fumée', 'Cendre', 'Pierre', 'Sel', 'Algue', 'Corail',
]

const FORMULA_NAME_PARTS_B = [
  'Noir', 'Solaris', 'Mystique', 'Lune', 'Royal', 'Céleste', 'Sauvage',
  'Impérial', 'Éternel', 'Sacré', 'Intense', 'Suave', 'Doré', 'd\'Or',
  'd\'Argent', 'Blanc', 'Bleu', 'Vert', 'Rouge', 'Profond', 'Léger',
  'Velours', 'Soie', 'Nacre', 'Cristal', 'Fumé', 'Envol', 'Rêverie',
  'Sérénade', 'Élégance', 'Passion', 'Désir', 'Mémoire', 'Secret',
  'Légende', 'Odyssée', 'Aurore', 'Crépuscule', 'Zénith', 'Azur',
  'Bohème', 'Poème', 'Songe', 'Éclat', 'Flamme', 'Brise', 'Orage',
]

const SUPPLIER_NAMES = [
  'Firmenich SA', 'Givaudan International', 'IFF (International Flavors & Fragrances)',
  'Symrise AG', 'Takasago International', 'Mane SA', 'Robertet Group',
  'Frutarom Industries', 'Sensient Technologies', 'Kerry Group',
  'Aromatech SAS', 'Vigon International', 'Berjé Inc.', 'Ernesto Ventós SA',
  'Phoenix Aromas', 'Eternis Fine Chemicals', 'Privi Organics',
  'Oriental Aromatics', 'S H Kelkar & Co.', 'Aromatic Fragrances International',
]

const COUNTRIES = [
  'France', 'Switzerland', 'USA', 'Germany', 'Japan', 'India', 'Spain',
  'UK', 'Netherlands', 'Italy', 'Singapore', 'China', 'Brazil', 'Indonesia',
  'Egypt', 'Morocco', 'Turkey', 'Bulgaria', 'Australia', 'Mexico',
]

const HYPOTHESES = [
  'Replacing 50% of natural rose with rose Givco improves cost efficiency without impacting perceived luxury',
  'Adding Cashmeran at 2% elevates diffusion of citrus top notes into the dry-down',
  'A 60:40 Hedione:Iso E Super ratio creates an optimal transparent floral-woody aura',
  'Pre-diluting oakmoss absolute in TEC reduces batch-to-batch IFRA compliance variance',
  'Layering Calone with cis-3-hexenol creates a photorealistic marine breeze accord',
  'Increasing ethyl vanillin by 0.5% significantly improves consumer preference scores in gourmand florals',
  'Substituting natural sandalwood with Javanol at 1:10 ratio preserves 90% of olfactory character',
  'Cold-processing the citrus accord reduces aldehyde degradation by 40% versus warm blending',
  'Adding trace alpha-damascone (0.02%) transforms a flat rose accord into a radiant bouquet',
  'Using supercritical CO2 ginger extract instead of steam-distilled improves sparkle by 2x',
  'A macrocyclic musk blend outperforms polycyclic musks in clean-laundry consumer panels',
  'Deliberate overdosing of ambroxan creates an addictive skin-scent dry-down at 8%',
  'Incorporating saffron absolute at 0.1% transforms a simple oud accord into a complex leather-tobacco',
  'Macerating the base accord for 2 weeks before blending improves smoothness scores by 15%',
  'Reimagining chypre structure with modern captive molecules eliminates oakmoss dependency entirely',
  'Split-batch testing reveals optimal bergamot freshness when added at final dilution stage',
  'Using Fleur de Cuir Givco reduces formula cost by 30% while maintaining luxury positioning',
  'Adding ethyl maltol at 0.3% bridges the gap between floral heart and gourmand base seamlessly',
  'Micro-encapsulated fragrance boosters increase longevity by 6 hours in EDT formulations',
  'Replacing DEP with IPM as solvent improves initial projection without sacrificing dry-down',
  'Combining three ionone isomers creates a more natural violet effect than any single isomer',
  'Using biosynthesized patchoulol reduces the earthy-camphor edge while retaining woody warmth',
  'Adding black pepper CO2 at 0.8% transforms a generic citrus cologne into a sophisticated eau fraîche',
  'Micro-dosing birch tar (0.01%) adds leather complexity that panels rate as more expensive',
  'The 80:20 rule applied to formula rationalization: cutting 80% of materials at traces loses character',
]

const LEARNINGS_POOL = [
  'Cost reduction of 22% achieved without perceptible change in consumer preference tests',
  'Diffusion improved by 35% measured via headspace analysis at 2-hour mark',
  'IFRA compliance maintained; shelf stability validated at 40C over 90 days',
  'Consumer panel (n=120) showed 18% preference increase over control formula',
  'GC-MS confirmed reduction in degradation products; olfactory panel confirmed freshness retention',
  'Phase separation observed at 5C; reformulation with solubilizer required',
  'Significant batch-to-batch variability traced to raw material sourcing inconsistency',
  'AI prediction underestimated the synergistic effect; human perfumer adjustment improved scores',
  'Accelerated aging test (48C, 2 weeks) showed remarkable stability in the reformulated version',
  'Stolling at low temperature for 72 hours improved clarity and eliminated haze formation',
  'Top note persistence at 30 minutes increased by 40% compared to conventional blending method',
  'Overdosing created an undesirable metallic off-note detected by 30% of trained panelists',
  'Natural variation in the rose absolute lot skewed results; synthetic counterpart validated concept',
  'Material cost curve non-linear: 15% cost reduction yielded only 3% preference decline',
  'Hydro-alcoholic stability test revealed precipitation at 40% ethanol; need co-solvent adjustment',
  'Perfumer feedback: the accord lacks the desired lift in the first 30 seconds of evaporation',
  'The captive molecule provided a competitive advantage not replicable with commodity materials',
  'Reversed the usual top-middle-base construction: starting from the base improved dry-down cohesion',
  'Multi-criteria optimization found Pareto frontier with 18 viable formulations meeting all constraints',
  'Predicted longevity of 8 hours confirmed on blotter; on skin reduced to 5.5 hours per panel',
]

const KNOWLEDGE_CATEGORIES = ['Accord Building', 'Material Science', 'Formulation Strategy', 'Regulatory', 'Market Trends', 'Consumer Psychology', 'Sustainability', 'Extraction Technology', 'Olfactory Training', 'GC-MS Analysis']

const KNOWLEDGE_TITLES: Record<string, string[]> = {
  'Accord Building': [
    'The Modern Fougère: Deconstructing the Classic Framework',
    'Building a Transparent Floral Accord Without Overpowering White Florals',
    'Marine Accords Beyond Calone: The Next Generation of Oceanics',
    'Gourmand Construction: Balancing Sweetness With Sophistication',
    'Chypre Reimagined: 21st Century Alternatives to Oakmoss',
  ],
  'Material Science': [
    'Understanding Captive Molecules: The Competitive Edge in Modern Perfumery',
    'Biosynthesized Materials: Fermentation-Derived Ingredients and Their Promise',
    'The Science of Olfactory Longevity: Tenacity vs. Substantivity',
    'Supercritical CO2 Extraction: Preserving Heat-Labile Aromatics',
    'Upcycling in Perfumery: Valorizing Agro-Industrial Side Streams',
  ],
  'Formulation Strategy': [
    'The 80:20 Principle in Formula Optimization',
    'Overdosing as a Design Tool: When Breaking IFRA Limits Creates Magic',
    'Split-Batch Evaluation: A Systematic Approach to Formula Refinement',
    'Building Fragrance Families: Olfactory DNA and Brand Coherence',
    'The Role of Trace Ingredients: Why 0.01% Matters',
  ],
  'Regulatory': [
    'IFRA 51st Amendment: Key Changes and Strategic Responses',
    'Navigating REACH Registration for Niche Perfumery Materials',
    'Natural vs. Synthetic Labeling: Legal Frameworks Across Markets',
    'Allergen Disclosure Requirements: EU vs. US Regulatory Landscapes',
    'The Future of Animal-Derived Materials: CITES and Ethical Sourcing',
  ],
  'Market Trends': [
    'Post-Pandemic Olfactory Preferences: Comfort, Cleanliness, and Escape',
    'The Rise of Biophilic Fragrances: Nature-Inspired Formulations in Urban Markets',
    'MENA Market Analysis: Oud-Centric Preferences and Olfactory Heritage',
    'Gender-Fluid Fragrance: Market Data and Formulation Approaches',
    'The Indie Niche Boom: What Mass-Market Brands Can Learn',
  ],
}

const INSIGHT_CATEGORIES = ['Market Prediction', 'Formula Optimization', 'Consumer Trend', 'Regulatory Forecast', 'Sustainability Alert']

const INSIGHT_MODELS = ['VITO-OLF-7B', 'VITO-OLF-13B', 'VITO-NOSE-XL', 'VITO-COMPLIANCE-v2', 'VITO-TREND-PRO']

const SUBSTANCES_FOR_CHECKS = [
  'Lilial (Butylphenyl Methylpropional)', 'Lyral (Hydroxyisohexyl 3-Cyclohexene Carboxaldehyde)',
  'Atranol', 'Chloroatranol', 'Methyl Eugenol', 'Estragole', 'Safrole',
  'Methyleugenol', 'Benzyl Alcohol', 'Citral', 'Farnesol', 'Limonene',
  'Linalool', 'Hydroxycitronellal', 'Isoeugenol', 'Coumarin',
  'HICC (Hydroxyisohexyl 3-Cyclohexene Carboxaldehyde)', 'Musk Xylene',
  'Musk Ketone', 'Tonalide', 'Ethyl Cinnamate', 'Cinnamal', 'Benzyl Salicylate',
  'Geraniol', 'Citronellol', 'Amyl Cinnamal',
]

const ALERT_MATERIALS = [
  'Bergamot Essential Oil', 'Patchouli Essential Oil', 'Sandalwood (Australian)',
  'Vetiver (Haitian)', 'Rose Absolute (Turkish)', 'Jasmine Absolute (Egyptian)',
  'Oud Oil', 'Iris Pallida Butter', 'Ylang Ylang Extra', 'Neroli Essential Oil',
  'Vanillin', 'Coumarin', 'Oakmoss Absolute', 'Lavender (Bulgarian)',
  'Hedione', 'Ambroxan', 'Cashmeran', 'Galaxolide', 'Calone', 'Iso E Super',
]

const ALERT_TYPES = ['price_surge', 'shortage', 'quality_issue'] as const
const ALERT_SEVERITIES = ['low', 'medium', 'high', 'critical'] as const

const ALERT_MESSAGES = {
  price_surge: [
    'Price increased by 22% due to harvest shortfall in primary growing region',
    'Spot market price spiked 35% following export restriction announcement',
    'Contract price renegotiation: 15% increase driven by energy cost inflation',
    'Supply chain disruption caused 28% temporary price surge',
    'Currency fluctuation resulted in 12% effective price increase for imported material',
  ],
  shortage: [
    'Global supply constrained by 40% due to adverse weather in growing regions',
    'Production halt at major manufacturing facility; 8-week lead time expected',
    'Shipping container shortage delaying deliveries by 3-4 weeks',
    'Natural disaster impacted harvest; 60% yield reduction reported',
    'Export ban in producing country causing immediate shortage',
    'Fire at extraction facility reduced capacity by 50% for estimated 6 months',
  ],
  quality_issue: [
    'Batch QC failure: linalool content 18% below specification minimum',
    'Adulteration detected in recent shipment; supplier investigation underway',
    'Oxidation markers exceed acceptable threshold; shelf life reduced by 40%',
    'Pesticide residue detected above EU MRL standards; batch quarantined',
    'Color deviation indicates improper storage; olfactory assessment pending',
    'GC-MS reveals unexpected isomer distribution suggesting process deviation',
  ],
}

export class SyntheticDatasetProvider {
  private rng: () => number
  private seedValue: number

  constructor(seed?: number) {
    this.seedValue = seed ?? 42
    this.rng = createRNG(this.seedValue)
  }

  seedAll(seed?: number): AlphaDataset {
    if (seed !== undefined) {
      this.seedValue = seed
    }
    this.rng = createRNG(this.seedValue)

    const materials = this.generateMaterials(100)
    const formulas = this.generateFormulas(50, materials)
    const suppliers = this.generateSuppliers(20)
    const experiments = this.generateExperiments(30)
    const predictions = this.generatePredictions(15)
    const checks = this.generateChecks(25)
    const alerts = this.generateAlerts(20)
    const dashboardStats = this.generateDashboardStats()
    const knowledgeEntries = this.generateKnowledgeEntries(20)
    const insights = this.generateInsights(10)

    return {
      materials,
      formulas,
      suppliers,
      experiments,
      predictions,
      checks,
      alerts,
      dashboardStats,
      knowledgeEntries,
      insights,
      generatedAt: new Date().toISOString(),
      version: '1.0.0-alpha',
    }
  }

  generateMaterials(count: number = 100): Material[] {
    const materials: Material[] = []

    for (let i = 0; i < Math.min(count, MATERIAL_TEMPLATES.length); i++) {
      const t = MATERIAL_TEMPLATES[i]
      materials.push({
        id: `mat-${String(i + 1).padStart(4, '0')}`,
        name: t.name,
        cas_number: t.cas,
        family: t.family,
        note: t.note,
        volatility: t.volatility,
        tenacity: t.tenacity,
        ifra_limit: t.ifra,
        reach_limit: t.reach,
        price_per_kg: t.price,
        supplier: pick(SUPPLIER_NAMES, this.rng),
        description: t.desc,
        quality_grade: t.quality,
        demoWorkspaceId: DEMO_WORKSPACE_ID,
      })
    }

    const remaining = count - MATERIAL_TEMPLATES.length
    for (let i = 0; i < Math.max(0, remaining); i++) {
      const family = pick(FAMILIES, this.rng)
      const note = pick(NOTES, this.rng)
      const volatility: 'high' | 'medium' | 'low' = note === 'top' ? 'high' : note === 'middle' ? (pick(['high', 'medium'], this.rng) as 'high' | 'medium') : (pick(['medium', 'low'], this.rng) as 'medium' | 'low')
      const idx = MATERIAL_TEMPLATES.length + i
      const generatedName = this.generateMaterialName(family, note)

      materials.push({
        id: `mat-${String(idx + 1).padStart(4, '0')}`,
        name: generatedName,
        cas_number: `${intBetween(1000, 9999, this.rng)}-${intBetween(10, 99, this.rng)}-${intBetween(0, 9, this.rng)}`,
        family,
        note,
        volatility,
        tenacity: note === 'base' ? intBetween(100, 500, this.rng) : note === 'middle' ? intBetween(12, 200, this.rng) : intBetween(1, 20, this.rng),
        ifra_limit: floatBetween(0.1, 100, this.rng, 1),
        reach_limit: floatBetween(50, 100, this.rng, 0),
        price_per_kg: floatBetween(8, 800, this.rng, 2),
        supplier: pick(SUPPLIER_NAMES, this.rng),
        description: `Synthetic ${family.toLowerCase()} material with ${note} note character. Generated for demo purposes.`,
        quality_grade: pick(QUALITY_GRADES, this.rng),
        demoWorkspaceId: DEMO_WORKSPACE_ID,
      })
    }

    return materials
  }

  private generateMaterialName(family: string, note: string): string {
    const prefixes: Record<string, string[]> = {
      Citrus: ['Citron', 'Mandarine', 'Limette', 'Agrume', 'Pamplemousse'],
      Floral: ['Floral', 'Rosée', 'Pétale', 'Bouton', 'Corolle'],
      Woody: ['Bois', 'Chêne', 'Acajou', 'Ébène', 'Teck'],
      Ambery: ['Ambre', 'Résine', 'Baume', 'Oliban', 'Copal'],
      Gourmand: ['Sucre', 'Caramel', 'Choco', 'Praline', 'Miel'],
      Spicy: ['Épice', 'Piment', 'Gingembre', 'Curcuma', 'Massala'],
      Herbal: ['Herbe', 'Verveine', 'Armoise', 'Sauge', 'Thym'],
      Musk: ['Musc', 'Velours', 'Cachemire', 'Blanc', 'Cristal'],
      Marine: ['Marin', 'Océan', 'Embrun', 'Corail', 'Algue'],
      Green: ['Vert', 'Feuille', 'Tige', 'Mousse', 'Lierre'],
      Aldehydic: ['Aldéhyde', 'Cristal', 'Éclat', 'Lumière', 'Pétillant'],
      Balsamic: ['Baume', 'Opopanax', 'Tolu', 'Pérou', 'Storax'],
      Fruity: ['Fruit', 'Baie', 'Pomme', 'Poire', 'Abricot'],
      Leather: ['Cuir', 'Daim', 'Nubuck', 'Suede', 'Gant'],
      Oud: ['Oud', 'Bois', 'Assam', 'Cambodge', 'Kalimantan'],
    }

    const suffixes: Record<string, string[]> = {
      top: ['Frais', 'Éclat', 'Zeste', 'Vif', 'Aérien'],
      middle: ['Harmonie', 'Noyau', 'Coeur', 'Velours', 'Élégance'],
      base: ['Profond', 'Fond', 'Sillage', 'Persistant', 'Ancré'],
    }

    const prefix = pick(prefixes[family] ?? ['Synthé'], this.rng)
    const suffix = pick(suffixes[note] ?? ['Équilibré'], this.rng)
    return `${prefix} ${suffix}`
  }

  generateFormulas(count: number = 50, materials?: Material[]): Formula[] {
    const mats = materials ?? this.generateMaterials(100)
    const formulas: Formula[] = []

    const usedNames = new Set<string>()

    for (let i = 0; i < count; i++) {
      let name: string
      do {
        const a = pick(FORMULA_NAME_PARTS_A, this.rng)
        const b = pick(FORMULA_NAME_PARTS_B, this.rng)
        name = `${a} ${b}`
      } while (usedNames.has(name))
      usedNames.add(name)

      const materialCount = intBetween(5, 18, this.rng)
      const selectedMats = new Set<number>()
      const formulaMaterials: FormulaMaterial[] = []

      let remainingPct = 100
      for (let j = 0; j < materialCount && remainingPct > 0; j++) {
        let matIndex: number
        do {
          matIndex = intBetween(0, mats.length - 1, this.rng)
        } while (selectedMats.has(matIndex))
        selectedMats.add(matIndex)

        const isLast = j === materialCount - 1
        const pct = isLast
          ? parseFloat(remainingPct.toFixed(1))
          : parseFloat((j === 0 ? floatBetween(8, 25, this.rng, 1) : floatBetween(1, Math.min(remainingPct - 1, 15), this.rng, 1)).toFixed(1))

        if (pct <= 0) break
        remainingPct -= pct
        if (remainingPct < 0) remainingPct = 0

        formulaMaterials.push({
          materialId: mats[matIndex].id,
          percentage: Math.min(pct, 100),
        })
      }

      const stability = floatBetween(55, 98, this.rng, 1)
      const performance = floatBetween(50, 99, this.rng, 1)
      const balance = floatBetween(50, 99, this.rng, 1)
      const status = pick(STATUSES, this.rng)
      const perfumer = pick(PERFUMERS, this.rng)

      const year = 2026
      const month = intBetween(1, 6, this.rng)
      const day = intBetween(1, 28, this.rng)
      const createdAt = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(intBetween(8, 18, this.rng)).padStart(2, '0')}:${String(intBetween(0, 59, this.rng)).padStart(2, '0')}:00Z`

      formulas.push({
        id: `frm-${String(i + 1).padStart(4, '0')}`,
        name,
        materials: formulaMaterials,
        stability_score: stability,
        performance_score: performance,
        balance_score: balance,
        status: status as Formula['status'],
        perfumer,
        created_at: createdAt,
        demoWorkspaceId: DEMO_WORKSPACE_ID,
      })
    }

    return formulas
  }

  generateSuppliers(count: number = 20): Supplier[] {
    const suppliers: Supplier[] = []

    for (let i = 0; i < count; i++) {
      const name = pick(SUPPLIER_NAMES, this.rng)
      const country = pick(COUNTRIES, this.rng)
      const reliability = floatBetween(65, 99, this.rng, 1)
      const domain = name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15)
      const email = `procurement@${domain}.com`

      const matsCount = intBetween(5, 40, this.rng)
      const materialsSupplied: string[] = []
      const used = new Set<number>()
      for (let j = 0; j < matsCount; j++) {
        let idx: number
        do {
          idx = intBetween(0, MATERIAL_TEMPLATES.length - 1, this.rng)
        } while (used.has(idx))
        used.add(idx)
        materialsSupplied.push(MATERIAL_TEMPLATES[idx].name)
      }

      suppliers.push({
        id: `sup-${String(i + 1).padStart(4, '0')}`,
        name,
        country,
        reliability_score: reliability,
        contact_email: email,
        materials_supplied: materialsSupplied,
        demoWorkspaceId: DEMO_WORKSPACE_ID,
      })
    }

    return suppliers
  }

  generateExperiments(count: number = 30): Experiment[] {
    const experiments: Experiment[] = []
    const results = ['success', 'partial', 'failure'] as const

    for (let i = 0; i < count; i++) {
      const hypothesis = pick(HYPOTHESES, this.rng)
      const result = pick(results, this.rng)
      const successScore = result === 'success' ? floatBetween(75, 98, this.rng, 1) : result === 'partial' ? floatBetween(45, 74, this.rng, 1) : floatBetween(10, 44, this.rng, 1)
      const aiPredicted = floatBetween(Math.max(10, successScore - 20), Math.min(98, successScore + 20), this.rng, 1)
      const learningCount = intBetween(2, 4, this.rng)
      const learnings = pickN(LEARNINGS_POOL, learningCount, this.rng)

      experiments.push({
        id: `exp-${String(i + 1).padStart(4, '0')}`,
        hypothesis,
        result,
        success_score: successScore,
        ai_predicted_score: aiPredicted,
        learnings,
        demoWorkspaceId: DEMO_WORKSPACE_ID,
      })
    }

    return experiments
  }

  generatePredictions(count: number = 15): Prediction[] {
    const predictions: Prediction[] = []

    for (let i = 0; i < count; i++) {
      predictions.push({
        id: `prd-${String(i + 1).padStart(4, '0')}`,
        market_fit: floatBetween(55, 97, this.rng, 1),
        longevity_score: floatBetween(4, 16, this.rng, 1),
        appeal_score: floatBetween(50, 99, this.rng, 1),
        risk_factors: pickN([
          'IFRA restriction on key material', 'Raw material price volatility',
          'Seasonal ingredient availability', 'Regulatory change in target market',
          'Supply chain dependency on single source', 'Consumer preference shift',
          'Competing product launch window', 'Production scale-up complexity',
          'Stability issues in tropical climates', 'Allergen labeling requirements',
          'IP infringement risk on captive material', 'Margin pressure from ingredient costs',
        ], intBetween(1, 5, this.rng), this.rng),
        demoWorkspaceId: DEMO_WORKSPACE_ID,
      })
    }

    return predictions
  }

  generateChecks(count: number = 25): ComplianceCheck[] {
    const checks: ComplianceCheck[] = []
    const ifraStatuses = ['compliant', 'restricted', 'prohibited'] as const
    const reachStatuses = ['registered', 'restricted', 'authorised', 'pending'] as const
    const bodies = ['IFRA', 'REACH', 'FDA', 'EU Cosmetics Regulation', 'Health Canada', 'TGA Australia']

    for (let i = 0; i < count; i++) {
      const substance = pick(SUBSTANCES_FOR_CHECKS, this.rng)
      const ifra = pick(ifraStatuses, this.rng)
      const reach = pick(reachStatuses, this.rng)
      const body = pick(bodies, this.rng)

      const notesMap: Record<string, string> = {
        compliant: 'Current usage within all specified limits. No action required.',
        restricted: `${substance} is restricted to ${floatBetween(0.01, 5, this.rng, 2)}% in leave-on products under ${body} 51st Amendment.`,
        prohibited: `${substance} prohibited from use in fine fragrance under ${body} regulations.`,
      }

      checks.push({
        id: `chk-${String(i + 1).padStart(4, '0')}`,
        substance,
        ifra_status: ifra,
        reach_status: reach,
        regulatory_body: body,
        notes: ifra === 'compliant' ? notesMap.compliant : ifra === 'restricted' ? notesMap.restricted : notesMap.prohibited,
        demoWorkspaceId: DEMO_WORKSPACE_ID,
      })
    }

    return checks
  }

  generateAlerts(count: number = 20): MaterialAlert[] {
    const alerts: MaterialAlert[] = []

    for (let i = 0; i < count; i++) {
      const material = pick(ALERT_MATERIALS, this.rng)
      const type = pick(ALERT_TYPES, this.rng)
      const severity = pick(ALERT_SEVERITIES, this.rng)
      const message = pick(ALERT_MESSAGES[type], this.rng)

      const day = intBetween(1, 28, this.rng)
      const date = `2026-0${intBetween(1, 6, this.rng)}-${String(day).padStart(2, '0')}T${String(intBetween(8, 18, this.rng)).padStart(2, '0')}:00:00Z`

      alerts.push({
        id: `alt-${String(i + 1).padStart(4, '0')}`,
        materialName: material,
        type,
        severity,
        message,
        date,
        demoWorkspaceId: DEMO_WORKSPACE_ID,
      })
    }

    return alerts
  }

  generateDashboardStats(): Record<string, number> {
    const totalFormulas = intBetween(45, 55, this.rng)
    const active = intBetween(8, 15, this.rng)
    return {
      total_formulas: totalFormulas,
      active_experiments: active,
      compliance_rate: floatBetween(87, 98, this.rng, 1),
      avg_stability: floatBetween(75, 94, this.rng, 1),
      formulas_this_month: intBetween(3, 12, this.rng),
      total_materials: 100,
      suppliers_active: 20,
      insights_generated: 10,
      alerts_unresolved: intBetween(2, 8, this.rng),
      experiments_completed: intBetween(25, 30, this.rng),
      approval_rate: floatBetween(60, 85, this.rng, 1),
    }
  }

  generateKnowledgeEntries(count: number = 20): KnowledgeEntry[] {
    const entries: KnowledgeEntry[] = []
    const authors = PERFUMERS
    const allCategories = Object.keys(KNOWLEDGE_TITLES)

    for (let i = 0; i < count; i++) {
      const category = pick(allCategories, this.rng)
      const titles = KNOWLEDGE_TITLES[category] ?? ['Untitled']
      const title = pick(titles, this.rng)
      const month = intBetween(1, 6, this.rng)
      const day = intBetween(1, 28, this.rng)
      const createdAt = `2026-0${month}-${String(day).padStart(2, '0')}`

      entries.push({
        id: `kno-${String(i + 1).padStart(4, '0')}`,
        title,
        content: `In-depth exploration of ${title.toLowerCase()}. This entry covers theoretical foundations, practical applications, and case studies from recent formulation work. Key takeaways include optimization strategies, material selection criteria, and regulatory considerations relevant to contemporary perfumery practice.`,
        category,
        author: pick(authors, this.rng),
        created_at: createdAt,
        tags: [category, pick(FAMILIES, this.rng), pick(NOTES, this.rng)],
        demoWorkspaceId: DEMO_WORKSPACE_ID,
      })
    }

    return entries
  }

  generateInsights(count: number = 10): AIInsight[] {
    const insights: AIInsight[] = []

    for (let i = 0; i < count; i++) {
      const category = pick(INSIGHT_CATEGORIES, this.rng)
      const model = pick(INSIGHT_MODELS, this.rng)
      const confidence = floatBetween(72, 98, this.rng, 1)
      const month = intBetween(1, 6, this.rng)
      const day = intBetween(1, 28, this.rng)
      const generatedAt = `2026-0${month}-${String(day).padStart(2, '0')}T${String(intBetween(0, 23, this.rng)).padStart(2, '0')}:00:00Z`

      const titlesByCategory: Record<string, string[]> = {
        'Market Prediction': [
          'Gourmand-woody hybrids to dominate Q4 2026 launches',
          'Citrus-aromatic revival predicted for spring 2027 collections',
          'Oud-rose combinations show 34% growth trend in APAC markets',
          'Clean fragrance segment projected to reach 28% market share by 2027',
        ],
        'Formula Optimization': [
          'Hedione:Iso E Super ratio optimization yields 12% performance gain',
          'Micro-dosing analysis suggests 0.05% damascone threshold for radiance',
          'Solvent swap from DEP to TEC improves stability scores by 18%',
          'Base accord pre-blending identified as key differentiator in panel tests',
        ],
        'Consumer Trend': [
          'Gen Z consumers show 2.3x preference for gender-neutral fragrance marketing',
          'Skin scent category growing at 22% CAGR; intimate sillage preferred',
          'Nostalgia-driven fragrance purchases up 41% year-over-year',
          'Sustainability claims influence 67% of premium fragrance purchases',
        ],
        'Regulatory Forecast': [
          'EU Commission reviewing additional 56 fragrance allergens for labeling',
          'IFRA 52nd Amendment expected to add restrictions on 12 common materials',
          'California Prop 65 expansion may impact 8 widely used fragrance ingredients',
          'UK REACH divergence from EU creates dual compliance burden for exporters',
        ],
        'Sustainability Alert': [
          'Biosynthetic sandalwood alternatives reach price parity with natural by 2027',
          'Circular extraction technology reduces solvent waste by 73%',
          'Regenerative farming practices for vetiver increase yield while sequestering carbon',
          'Upcycled citrus peel extracts match virgin material quality at 40% cost reduction',
        ],
      }

      const titles = titlesByCategory[category] ?? ['AI generated insight']
      const title = pick(titles, this.rng)

      insights.push({
        id: `ins-${String(i + 1).padStart(4, '0')}`,
        title,
        content: `VITO AI analysis based on ${intBetween(5000, 50000, this.rng)} data points from market trends, formulation databases, and regulatory feeds. The model identifies this pattern with ${confidence}% confidence. Cross-referenced against historical fragrance cycles and validated with internal expert review. Recommended action: incorporate findings into Q${intBetween(3, 4, this.rng)} planning cycle.`,
        model,
        confidence,
        category,
        generated_at: generatedAt,
        demoWorkspaceId: DEMO_WORKSPACE_ID,
      })
    }

    return insights
  }
}

export class AlphaDataProvider {
  private static _instance: AlphaDataProvider
  private _dataset: AlphaDataset | null = null
  private _provider: SyntheticDatasetProvider

  private constructor() {
    this._provider = new SyntheticDatasetProvider()
  }

  static getInstance(): AlphaDataProvider {
    if (!AlphaDataProvider._instance) {
      AlphaDataProvider._instance = new AlphaDataProvider()
    }
    return AlphaDataProvider._instance
  }

  getDatasets(): AlphaDataset {
    if (this._dataset) return this._dataset

    const cached = this.loadFromCache()
    if (cached) {
      this._dataset = cached
      return cached
    }

    this._dataset = this._provider.seedAll()
    this.saveToCache(this._dataset)
    return this._dataset
  }

  getMaterials(): Material[] {
    return this.getDatasets().materials
  }

  getFormulas(): Formula[] {
    return this.getDatasets().formulas
  }

  getSuppliers(): Supplier[] {
    return this.getDatasets().suppliers
  }

  getExperiments(): Experiment[] {
    return this.getDatasets().experiments
  }

  getPredictions(): Prediction[] {
    return this.getDatasets().predictions
  }

  getChecks(): ComplianceCheck[] {
    return this.getDatasets().checks
  }

  getAlerts(): MaterialAlert[] {
    return this.getDatasets().alerts
  }

  getDashboardStats(): Record<string, number> {
    return this.getDatasets().dashboardStats
  }

  getKnowledgeEntries(): KnowledgeEntry[] {
    return this.getDatasets().knowledgeEntries
  }

  getInsights(): AIInsight[] {
    return this.getDatasets().insights
  }

  refresh(): AlphaDataset {
    this._dataset = null
    this.clearCache()
    return this.getDatasets()
  }

  searchMaterials(query: string): Material[] {
    const q = query.toLowerCase()
    return this.getMaterials().filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.family.toLowerCase().includes(q) ||
        m.note.toLowerCase().includes(q) ||
        m.cas_number.includes(q)
    )
  }

  searchFormulas(query: string): Formula[] {
    const q = query.toLowerCase()
    return this.getFormulas().filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.perfumer.toLowerCase().includes(q) ||
        f.status.toLowerCase().includes(q)
    )
  }

  getFormulaById(id: string): Formula | null {
    return this.getFormulas().find((f) => f.id === id) ?? null
  }

  getMaterialById(id: string): Material | null {
    return this.getMaterials().find((m) => m.id === id) ?? null
  }

  getComplianceReport(): Record<string, unknown> {
    const checks = this.getChecks()
    const compliant = checks.filter((c) => c.ifra_status === 'compliant').length
    const restricted = checks.filter((c) => c.ifra_status === 'restricted').length
    const prohibited = checks.filter((c) => c.ifra_status === 'prohibited').length
    return {
      totalSubstances: checks.length,
      compliantCount: compliant,
      restrictedCount: restricted,
      prohibitedCount: prohibited,
      complianceRate: checks.length > 0 ? parseFloat(((compliant / checks.length) * 100).toFixed(1)) : 100,
      riskLevel: prohibited > 2 ? 'high' : restricted > 5 ? 'medium' : 'low',
      generatedAt: new Date().toISOString(),
    }
  }

  getPerformanceReport(): Record<string, unknown> {
    const formulas = this.getFormulas()
    if (formulas.length === 0) return { averageStability: 0, averagePerformance: 0, averageBalance: 0 }

    const avgStability = formulas.reduce((sum, f) => sum + f.stability_score, 0) / formulas.length
    const avgPerformance = formulas.reduce((sum, f) => sum + f.performance_score, 0) / formulas.length
    const avgBalance = formulas.reduce((sum, f) => sum + f.balance_score, 0) / formulas.length
    const topPerformers = [...formulas]
      .sort((a, b) => (b.performance_score + b.stability_score) - (a.performance_score + a.stability_score))
      .slice(0, 5)
      .map((f) => ({ id: f.id, name: f.name, compositeScore: parseFloat(((f.performance_score + f.stability_score + f.balance_score) / 3).toFixed(1)) }))

    return {
      averageStability: parseFloat(avgStability.toFixed(1)),
      averagePerformance: parseFloat(avgPerformance.toFixed(1)),
      averageBalance: parseFloat(avgBalance.toFixed(1)),
      totalFormulas: formulas.length,
      topPerformers,
      generatedAt: new Date().toISOString(),
    }
  }

  private loadFromCache(): AlphaDataset | null {
    try {
      if (typeof localStorage === 'undefined') return null

      if (!AlphaConfig.enabled) return null

      const raw = localStorage.getItem(CACHE_KEY)
      if (!raw) return null

      const parsed = JSON.parse(raw) as AlphaDataset
      if (!parsed.generatedAt || !parsed.version) return null

      const generatedAt = new Date(parsed.generatedAt).getTime()
      const now = Date.now()
      if (now - generatedAt > CACHE_TTL_MS) return null

      return parsed
    } catch {
      return null
    }
  }

  private saveToCache(dataset: AlphaDataset): void {
    try {
      if (typeof localStorage === 'undefined') return
      localStorage.setItem(CACHE_KEY, JSON.stringify(dataset))
    } catch {
      // localStorage full or unavailable — non-critical in alpha mode
    }
  }

  private clearCache(): void {
    try {
      if (typeof localStorage === 'undefined') return
      localStorage.removeItem(CACHE_KEY)
    } catch {
      // non-critical
    }
  }
}
