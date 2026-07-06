import type {
  FormulaVersion, AcceleratorSuggestion, RegulatoryCheck, KnowledgeEntry,
  MaterialAlert, ExperimentResult, SuccessPrediction, ReportTemplate, IngestedRecord, AIInsight,
} from './types'

const STORAGE_KEY = 'vito_intelligence_data'

interface ModuleStore {
  formulas: FormulaVersion[]
  suggestions: AcceleratorSuggestion[]
  checks: RegulatoryCheck[]
  knowledge: KnowledgeEntry[]
  alerts: MaterialAlert[]
  experiments: ExperimentResult[]
  predictions: SuccessPrediction[]
  templates: ReportTemplate[]
  ingestions: IngestedRecord[]
  insights: AIInsight[]
}

function defaultStore(): ModuleStore {
  return {
    formulas: [
      { id: 'f1', name: 'Amber Rush', version: 3, createdAt: '2025-11-15', stabilityScore: 87, performanceScore: 82, notes: 'Increased ambroxan to 12% — improved longevity significantly' },
      { id: 'f2', name: 'Citrus Wave', version: 1, createdAt: '2026-01-20', stabilityScore: 74, performanceScore: 68, notes: 'Initial formulation, needs base note reinforcement' },
      { id: 'f3', name: 'Oud Mystique', version: 7, createdAt: '2025-06-03', stabilityScore: 93, performanceScore: 91, notes: 'Final version — excellent aging characteristics' },
      { id: 'f4', name: 'Floral Whisper', version: 2, createdAt: '2026-02-10', stabilityScore: 71, performanceScore: 76, notes: 'Jasmine overdose — considering reduction' },
      { id: 'f5', name: 'Woody Depths', version: 5, createdAt: '2025-09-22', stabilityScore: 89, performanceScore: 85, notes: 'Balanced cedar and vetiver profile' },
    ],
    suggestions: [
      { id: 's1', type: 'accord', title: 'Bergamot + Ambroxan Synergy', description: 'Adding 3% bergamot to Amber Rush could increase freshness without compromising longevity', expectedImprovement: '+12% longevity, +8% appeal', confidence: 87 },
      { id: 's2', type: 'substitution', title: 'Replace Hedione with Methyl Laitone', description: 'Methyl Laitone provides similar transparency with 2x longer lasting power', expectedImprovement: '+23% longevity', confidence: 91 },
      { id: 's3', type: 'concentration', title: 'Optimize Musk Concentration', description: 'Current musk level at 8% — optimal range for this profile is 5-7%', expectedImprovement: '+15% diffusion', confidence: 78 },
      { id: 's4', type: 'modifier', title: 'Add Ionone Beta for Iris Effect', description: '0.5% Ionone Beta would introduce a sophisticated orris note to Floral Whisper', expectedImprovement: '+18% complexity score', confidence: 84 },
    ],
    checks: [
      { id: 'c1', formulaId: 'f2', formulaName: 'Citrus Wave', substance: 'Limonene', regulation: 'IFRA', currentLimit: 12, currentConcentration: 8, status: 'compliant', impactScore: 0, affectedFormulas: 0 },
      { id: 'c2', formulaId: 'f1', formulaName: 'Amber Rush', substance: 'Ambroxan', regulation: 'REACH', currentLimit: 15, currentConcentration: 12, status: 'compliant', impactScore: 0, affectedFormulas: 0 },
      { id: 'c3', formulaId: 'f4', formulaName: 'Floral Whisper', substance: 'Methyl Anthranilate', regulation: 'IFRA', currentLimit: 5, currentConcentration: 4.2, status: 'warning', daysUntilChange: 45, newLimit: 3.5, impactScore: 78, affectedFormulas: 12, aiRecommendation: 'Reduce to 3.2% or substitute with Dimethyl Anthranilate' },
      { id: 'c4', formulaId: 'f3', formulaName: 'Oud Mystique', substance: 'Styrax Extract', regulation: 'CLP', currentLimit: 4, currentConcentration: 4.5, status: 'violation', impactScore: 92, affectedFormulas: 8, aiRecommendation: 'Immediate reformulation required — replace 50% with Labdanum' },
      { id: 'c5', formulaId: 'f5', formulaName: 'Woody Depths', substance: 'Cedarwood Oil', regulation: 'REACH', currentLimit: 20, currentConcentration: 15, status: 'compliant', impactScore: 0, affectedFormulas: 0 },
    ],
    knowledge: [
      { id: 'k1', title: 'Ambroxan sweet spot', content: 'After 200+ trials, 10-14% ambroxan in woody-amber bases gives optimal performance without drowning other notes.', author: 'Elena Voss', category: 'technique', tags: ['ambroxan', 'woody', 'amber', 'performance'], createdAt: '2025-03-12', lastUsed: '2026-06-28', aiExtracted: false, relatedFormulas: 34, usageCount: 89 },
      { id: 'k2', title: 'Citrus top note preservation', content: 'Adding 0.3% citral and 0.1% BHT extends citrus top note life by 40%. Store finished formula at 15-18°C.', author: 'Marco Ricci', category: 'material_note', tags: ['citrus', 'preservation', 'top-notes', 'stability'], createdAt: '2024-11-05', lastUsed: '2026-07-01', aiExtracted: false, relatedFormulas: 18, usageCount: 156 },
      { id: 'k3', title: 'Oud maturing accelerator', content: 'Aged oud at 40°C for 3 months equals 24 months natural aging. Add 0.2% vanillin to accelerate maturation.', author: 'Amir Al-Farsi', category: 'formula_secret', tags: ['oud', 'aging', 'maturation', 'vanillin'], createdAt: '2025-07-18', lastUsed: '2026-06-15', aiExtracted: true, relatedFormulas: 12, usageCount: 234 },
      { id: 'k4', title: 'When to use Hedione vs Helional', content: 'Hedione for transparent floral lift (use in white florals), Helional for ocean-fresh diffusion (use in aquatic fougères). Never exceed 8% combined.', author: 'Elena Voss', category: 'rule_of_thumb', tags: ['hedione', 'helional', 'floral', 'aquatic', 'dosage'], createdAt: '2025-01-28', lastUsed: '2026-06-30', aiExtracted: false, relatedFormulas: 45, usageCount: 312 },
      { id: 'k5', title: 'Elena\'s iris accord', content: 'My personal accord: 3 parts Ionone Beta, 1 part Orris Concrete, 0.5 parts Raspberry Ketone. Aged 1 month before use.', author: 'Elena Voss', category: 'formula_secret', tags: ['iris', 'accord', 'orris', 'ionone'], createdAt: '2025-05-09', lastUsed: '2026-06-22', aiExtracted: true, relatedFormulas: 8, usageCount: 67 },
    ],
    alerts: [
      { id: 'a1', material: 'Sandalwood Oil (Mysore)', type: 'shortage', severity: 'critical', description: 'Supply dropping — current stock covers 45 days. AI suggests 3 alternatives.', priceChange: -1, alternativeId: 'alt1', alternativeName: 'Sandalwood (Australian)' },
      { id: 'a2', material: 'Bergamot Oil', type: 'price_surge', severity: 'high', description: 'Price increased 23% in Q2 due to poor harvest. Substitute with Bergamot FCF.', priceChange: 23, alternativeId: 'alt2', alternativeName: 'Bergamot FCF' },
      { id: 'a3', material: 'Vanillin (Natural)', type: 'quality_issue', severity: 'medium', description: 'Batch #2304 shows 12% lower purity. Batch #2305 confirmed within spec.', priceChange: -1, alternativeId: 'alt3', alternativeName: 'Vanillin (Nature-identical)' },
      { id: 'a4', material: 'Iso E Super', type: 'alternative_available', severity: 'low', description: 'New supplier offers 15% discount with comparable quality profile.', priceChange: -15, alternativeId: 'alt4', alternativeName: 'Timbersilk (IFF)' },
      { id: 'a5', material: 'Cedarwood Oil (Texas)', type: 'shortage', severity: 'medium', description: 'Seasonal shortage expected Aug-Oct. Stock up or use Virginian Cedarwood.', priceChange: -1, alternativeId: 'alt5', alternativeName: 'Cedarwood (Virginian)' },
    ],
    experiments: [
      { id: 'e1', experimentName: 'Amber Rush v2', hypothesis: 'Increasing ambroxan from 8% to 12% improves longevity', result: 'success', successScore: 87, aiPredictedScore: 83, learnings: ['Ambroxan ceiling at 14% — beyond causes flatness', 'Pair with 2% ethyl-maltol for warmth'], date: '2025-11-10' },
      { id: 'e2', experimentName: 'Citrus Top Note Fix', hypothesis: 'Adding 0.3% citral extends top note life', result: 'success', successScore: 92, aiPredictedScore: 88, learnings: ['BHT at 0.1% is critical for oxidation prevention', 'Citral alone not enough — needs antioxidant synergy'], date: '2026-01-15' },
      { id: 'e3', experimentName: 'Oud Alternative Test', hypothesis: 'Labdanum can replace 40% of Oud without profile loss', result: 'partial', successScore: 65, aiPredictedScore: 71, learnings: ['Works for base but loses leathery facet', 'Add 0.5% castoreum to compensate'], date: '2026-02-28' },
      { id: 'e4', experimentName: 'Jasmine Overdose Test', hypothesis: '15% jasmine absolute creates a photorealistic jasmine', result: 'failure', successScore: 23, aiPredictedScore: 35, learnings: ['Jasmine absolute above 10% becomes indolic and sharp', 'Use jasmine accord instead of absolute for realism'], date: '2026-03-05' },
      { id: 'e5', experimentName: 'Woody Base Optimization', hypothesis: 'Cedar + Vetiver at 2:1 ratio gives best sillage', result: 'success', successScore: 88, aiPredictedScore: 85, learnings: ['2:1 cedar:vetiver confirmed optimal', 'Add 5% patchouli for depth'], date: '2025-09-18' },
    ],
    predictions: [
      { id: 'p1', formulaName: 'Amber Rush', predictedSuccess: 82, confidence: 88, marketFit: 79, longevityScore: 91, appealScore: 85, comparableHits: ['Ambre Narguilé (75M)', 'Grand Soir (62M)'], riskFactors: ['Ambroxan-heavy market is competitive', 'Premium pricing required for margin'], recommendation: 'Launch in niche segment with storytelling around synthetic sustainability' },
      { id: 'p2', formulaName: 'Citrus Wave', predictedSuccess: 61, confidence: 74, marketFit: 73, longevityScore: 45, appealScore: 68, comparableHits: ['Acqua di Gio (120M)', 'Dior Homme Cologne (45M)'], riskFactors: ['Short longevity typical of citrus', 'Mass-market segment saturated'], recommendation: 'Target premium fresh category with unique mineralic twist — not another aquatic' },
      { id: 'p3', formulaName: 'Oud Mystique', predictedSuccess: 93, confidence: 91, marketFit: 88, longevityScore: 97, appealScore: 94, comparableHits: ['Oud Wood (85M)', 'Black Afgano (42M)'], riskFactors: ['Niche audience only', 'Raw material cost volatility'], recommendation: 'Flagship product — limited edition strategy maximizes margin' },
      { id: 'p4', formulaName: 'Floral Whisper', predictedSuccess: 43, confidence: 69, marketFit: 56, longevityScore: 38, appealScore: 52, comparableHits: ['Flowerbomb (95M)', 'La Vie Est Belle (80M)'], riskFactors: ['Jasmine overdose risks negative reviews', 'No distinctive character yet'], recommendation: 'Reformulate with 30% less jasmine, add 10% orange blossom for lift' },
    ],
    templates: [
      { id: 't1', name: 'Perfumer\'s Workbench', targetRole: 'perfumer', metrics: ['formula_details', 'raw_materials', 'stability', 'versions'], format: 'dashboard', aiGenerated: true },
      { id: 't2', name: 'Executive Summary', targetRole: 'management', metrics: ['project_status', 'cost_analysis', 'timeline', 'risk'], format: 'pdf', aiGenerated: true },
      { id: 't3', name: 'Compliance Report', targetRole: 'compliance', metrics: ['regulatory_status', 'substance_limits', 'certificates', 'alerts'], format: 'dashboard', aiGenerated: true },
      { id: 't4', name: 'Procurement Brief', targetRole: 'procurement', metrics: ['material_prices', 'suppliers', 'lead_times', 'alternatives'], format: 'email', aiGenerated: true },
      { id: 't5', name: 'Marketing Dossier', targetRole: 'marketing', metrics: ['notes_pyramid', 'success_prediction', 'comparable_products', 'story'], format: 'pdf', aiGenerated: true },
    ],
    ingestions: [
      { id: 'i1', source: 'excel', fileName: '2024_formula_library.xlsx', recordCount: 342, aiProcessed: true, importedAt: '2026-06-15T10:30:00Z', status: 'completed' },
      { id: 'i2', source: 'pdf', fileName: 'IFRA_51_amendments.pdf', recordCount: 12, aiProcessed: true, importedAt: '2026-06-20T14:15:00Z', status: 'completed' },
      { id: 'i3', source: 'csv', fileName: 'supplier_base_2026.csv', recordCount: 89, aiProcessed: false, importedAt: '2026-06-25T09:00:00Z', status: 'processing' },
      { id: 'i4', source: 'excel', fileName: 'batch_records_Q1.xlsx', recordCount: 523, aiProcessed: true, importedAt: '2026-04-02T11:45:00Z', status: 'completed' },
      { id: 'i5', source: 'pdf', fileName: 'stability_reports_2025.pdf', recordCount: 47, aiProcessed: false, importedAt: '2026-07-01T08:00:00Z', status: 'pending' },
    ],
    insights: [
      { id: 'ins1', type: 'discovery', title: 'Unexpected synergy: Ambroxan + Hedione', description: 'Analysis of 47 formulas shows ambroxan-hedione blends outperform individual components by 23% in longevity tests.', confidence: 91, source: { model: 'Accord Predictor v2.4', confidence: 91, trainedOn: '12,487 formulas', lastUpdated: '2026-06-28' }, timestamp: '2026-07-01T06:00:00Z', actionable: true, actionLabel: 'View Formulas', actionHref: '/intelligence/accelerator' },
      { id: 'ins2', type: 'warning', title: 'Regulatory change imminent: Methyl Anthranilate', description: 'IFRA is reducing the limit from 5% to 3.5% effective in 45 days. 12 formulas affected.', confidence: 98, source: { model: 'Regulatory Monitor v1.8', confidence: 98, trainedOn: '14 regulatory bodies', lastUpdated: '2026-06-30' }, timestamp: '2026-07-01T02:00:00Z', actionable: true, actionLabel: 'Review Formulas', actionHref: '/intelligence/compliance' },
      { id: 'ins3', type: 'pattern', title: 'Elena\'s iris formula outperforms standard by 34%', description: 'The personal iris accord created by Elena Voss shows consistently higher performance scores across 8 derivative formulas.', confidence: 87, source: { model: 'Knowledge Miner v3.1', confidence: 87, trainedOn: '847 knowledge entries', lastUpdated: '2026-06-29' }, timestamp: '2026-06-30T14:00:00Z', actionable: true, actionLabel: 'View Knowledge', actionHref: '/intelligence/knowledge-vault' },
      { id: 'ins4', type: 'suggestion', title: 'Substitute Bergamot with Bergamot FCF', description: 'With Bergamot prices up 23%, Bergamot FCF offers 95% similar profile at 18% lower cost with better photostability.', confidence: 86, source: { model: 'Material Optimizer v2.0', confidence: 86, trainedOn: '640 materials, 89 substitutions', lastUpdated: '2026-06-30' }, timestamp: '2026-07-01T05:00:00Z', actionable: true, actionLabel: 'View Alternatives', actionHref: '/intelligence/materials' },
      { id: 'ins5', type: 'prediction', title: 'Oud Mystique predicted 93% success', description: 'AI analysis suggests Oud Mystique could outperform 85% of niche launches this year. Recommendation: limited edition flagship.', confidence: 91, source: { model: 'Success Predictor v4.0', confidence: 91, trainedOn: '200+ product launches', lastUpdated: '2026-06-28' }, timestamp: '2026-07-01T00:00:00Z', actionable: true, actionLabel: 'View Prediction', actionHref: '/intelligence/success-predictor' },
    ],
  }
}

export function loadModuleData(): ModuleStore {
  if (typeof window === 'undefined') return defaultStore()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const def = defaultStore()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(def))
      return def
    }
    return { ...defaultStore(), ...JSON.parse(raw) }
  } catch { return defaultStore() }
}

export function saveModuleData(data: ModuleStore): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }
}

export function getInsights(): AIInsight[] {
  return loadModuleData().insights
}

export function getChecks(): RegulatoryCheck[] {
  return loadModuleData().checks
}

export function getFormulas() { return loadModuleData().formulas }
export function getSuggestions() { return loadModuleData().suggestions }
export function getKnowledge() { return loadModuleData().knowledge }
export function getAlerts() { return loadModuleData().alerts }
export function getExperiments() { return loadModuleData().experiments }
export function getPredictions() { return loadModuleData().predictions }
export function getTemplates() { return loadModuleData().templates }
export function getIngestions() { return loadModuleData().ingestions }
