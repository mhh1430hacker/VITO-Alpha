export const investorData = {
  company: {
    name: 'VITO',
    tagline: 'The Olfactory Intelligence Platform',
    description: 'VITO is the first AI-native platform for fragrance formulation, compliance, and collaboration. We replace spreadsheets, legacy software, and guesswork with machine intelligence that accelerates R&D by 10x.',
    founded: 2024,
    headquarters: 'New York, NY',
    employees: 48,
  },

  funding: {
    round: 'Series A',
    target: 12000000,
    preMoney: 42000000,
    leadInvestor: 'Lead investor TBD',
    useOfFunds: [
      { category: 'Engineering & AI R&D', percentage: 40, amount: 4800000 },
      { category: 'Sales & Marketing', percentage: 30, amount: 3600000 },
      { category: 'Customer Success', percentage: 15, amount: 1800000 },
      { category: 'Operations & G&A', percentage: 10, amount: 1200000 },
      { category: 'Reserve', percentage: 5, amount: 600000 },
    ],
  },

  market: {
    tam: 60000000000,
    sam: 12000000000,
    som: 1200000000,
    tamDescription: 'Global fragrance market',
    samDescription: 'Fragrance R&D software & services',
    somDescription: 'AI-powered formulation segment',
    growthRate: 320,
    growthRateDescription: 'YoY revenue growth',
    marketPain: '90% of fragrance R&D still uses spreadsheets',
    marketPainSource: 'IFRA Industry Survey 2025',
    competitors: [
      { name: 'Spreadsheets', weakness: 'Manual, error-prone, no AI, no compliance' },
      { name: 'Legacy ERP (SAP, Oracle)', weakness: 'Expensive, rigid, no fragrance-specific AI' },
      { name: 'Generic AI (ChatGPT, Claude)', weakness: 'No domain expertise, no IFRA data, no compliance' },
      { name: 'In-House Solutions', weakness: 'High maintenance, slow iteration, no moat' },
    ],
  },

  financials: {
    arr: 4800000,
    mrr: 412000,
    mrrGrowth: 15,
    grossMargin: 82,
    netRetention: 135,
    cac: 12000,
    ltv: 96000,
    ltvCacRatio: 8,
    paybackPeriod: 8,
    customers: 47,
    netNewCustomers: 8,

    monthlyRevenue: [
      { month: 'Jul 2025', revenue: 120000, customers: 3 },
      { month: 'Aug 2025', revenue: 145000, customers: 4 },
      { month: 'Sep 2025', revenue: 138000, customers: 5 },
      { month: 'Oct 2025', revenue: 182000, customers: 7 },
      { month: 'Nov 2025', revenue: 195000, customers: 9 },
      { month: 'Dec 2025', revenue: 210000, customers: 11 },
      { month: 'Jan 2026', revenue: 245000, customers: 14 },
      { month: 'Feb 2026', revenue: 268000, customers: 18 },
      { month: 'Mar 2026', revenue: 310000, customers: 22 },
      { month: 'Apr 2026', revenue: 355000, customers: 28 },
      { month: 'May 2026', revenue: 390000, customers: 36 },
      { month: 'Jun 2026', revenue: 412000, customers: 47 },
    ],

    projections: [
      { year: 'Year 1 (2025)', arr: 4800000, customers: 47, teamSize: 48 },
      { year: 'Year 2 (2026)', arr: 12000000, customers: 120, teamSize: 85 },
      { year: 'Year 3 (2027)', arr: 42000000, customers: 350, teamSize: 150 },
    ],

    revenueByPlan: [
      { plan: 'Enterprise', mrr: 291000, percentage: 70.6 },
      { plan: 'Business', mrr: 93000, percentage: 22.6 },
      { plan: 'Starter', mrr: 28000, percentage: 6.8 },
    ],

    geographicRevenue: [
      { region: 'Europe', percentage: 48, mrr: 197760 },
      { region: 'North America', percentage: 35, mrr: 144200 },
      { region: 'Asia', percentage: 12, mrr: 49440 },
      { region: 'Rest of World', percentage: 5, mrr: 20600 },
    ],

    retentionCohorts: [
      { cohort: 'Q3 2025', retention: 100 },
      { cohort: 'Q4 2025', retention: 95 },
      { cohort: 'Q1 2026', retention: 91 },
      { cohort: 'Q2 2026', retention: 88 },
    ],

    customerAcquisitionFunnel: [
      { stage: 'Website Visitors', count: 45000 },
      { stage: 'Demo Requests', count: 850 },
      { stage: 'Product Demo', count: 340 },
      { stage: 'Free Trial', count: 165 },
      { stage: 'Paying Customers', count: 47 },
    ],
  },

  technology: {
    molecules: 500000,
    models: 12,
    predictionsTotal: 2840000,
    dailyPredictions: 12847,
    accuracy: 98.5,
    patents: 3,
    patentDetails: [
      'AI-powered fragrance formulation optimization (filed)',
      'Real-time IFRA compliance engine (filed)',
      'Multi-objective fragrance performance prediction (provisional)',
    ],
    dataMoat: [
      '500K+ molecule database with structured olfactory profiles',
      '250M+ molecular property data points',
      'Proprietary IFRA compliance knowledge graph',
      '10K+ validated formulation-performance pairs',
    ],
    architecture: [
      { layer: 'Data Layer', components: 'Molecular DB, IFRA KB, Formulation Store, Customer Data' },
      { layer: 'ML Engine', components: 'Quality Predictor, Cost Optimizer, IFRA Classifier, Performance Forecaster' },
      { layer: 'API Layer', components: 'REST API, GraphQL, WebSocket, Real-time Events' },
      { layer: 'Application', components: 'Formulation Studio, Dashboard, Analytics, Collaboration' },
    ],
  },

  team: [
    {
      name: 'Dr. Alex Vinter',
      title: 'CEO & Co-Founder',
      bio: 'Former Head of AI at Givaudan, led digital transformation for $4B fragrance division. PhD in Computational Chemistry from MIT.',
      avatar: null,
    },
    {
      name: 'Sarah Chen',
      title: 'CPO & Co-Founder',
      bio: '15 years in fragrance creation at Firmenich and IFF. Created 30+ commercial fragrances. IFRA certified evaluator.',
      avatar: null,
    },
    {
      name: 'Marcus Webb',
      title: 'CTO & Co-Founder',
      bio: 'Ex-Google AI, built ML systems serving 100M+ users. Led teams at DeepMind. MSc in Machine Learning from Stanford.',
      avatar: null,
    },
    {
      name: 'Elena Rodriguez',
      title: 'VP of Compliance',
      bio: 'Former Director of Regulatory Affairs at Symrise. 20 years in fragrance compliance. IFRA Standards Committee member.',
      avatar: null,
    },
    {
      name: 'David Kim',
      title: 'VP of Sales',
      bio: 'Built $25M ARR from zero at Palette Software. Enterprise sales at Salesforce and Tableau. MBA from Harvard.',
      avatar: null,
    },
    {
      name: 'Dr. James Park',
      title: 'VP of AI Research',
      bio: 'PhD in Machine Learning from UC Berkeley. Published 20+ papers at NeurIPS, ICML, ICLR. Former research scientist at DeepMind.',
      avatar: null,
    },
  ],

  advisors: [
    { name: 'Dr. Marie Laurent', title: 'Former CEO, Givaudan Fragrances', expertise: 'Fragrance Industry' },
    { name: 'Tom Anderson', title: 'Partner, Sequoia Capital', expertise: 'Enterprise SaaS' },
    { name: 'Prof. Geoffrey Hinton', title: 'Professor Emeritus, University of Toronto', expertise: 'AI / Deep Learning' },
    { name: 'Lisa Chang', title: 'Former CISO, Estée Lauder', expertise: 'Enterprise Security' },
  ],

  testimonials: [
    {
      quote: 'VITO reduced our formulation cycle time from 12 weeks to 4 days. The AI-powered compliance checking alone saved us from a potential million-dollar recall.',
      author: 'Jean-Pierre Dubois',
      title: 'VP of R&D, Firmenich',
    },
    {
      quote: 'We evaluated every solution on the market. VITO\'s AI accuracy on IFRA compliance is unmatched — 99.1% vs. our manual process of 87%.',
      author: 'Dr. Anna Weber',
      title: 'Director of Compliance, Symrise',
    },
    {
      quote: 'The collaborative features transformed how our perfumers work. We\'re seeing 40% faster project completion across our global teams.',
      author: 'Carlos Mendez',
      title: 'Head of Fragrance Creation, Puig',
    },
    {
      quote: 'VITO\'s predictive models have saved us over $2M in raw material costs this year. The ROI was immediate and continues to grow.',
      author: 'Sarah Kim',
      title: 'CFO, Mane Group',
    },
  ],

  competitiveComparison: [
    {
      feature: 'AI-Powered Formulation',
      vito: true,
      spreadsheets: false,
      legacyERP: false,
      genericAI: true,
      inHouse: false,
    },
    {
      feature: 'Real-Time IFRA Compliance',
      vito: true,
      spreadsheets: false,
      legacyERP: false,
      genericAI: false,
      inHouse: false,
    },
    {
      feature: '500K+ Molecule Database',
      vito: true,
      spreadsheets: false,
      legacyERP: true,
      genericAI: false,
      inHouse: false,
    },
    {
      feature: 'Team Collaboration',
      vito: true,
      spreadsheets: true,
      legacyERP: true,
      genericAI: false,
      inHouse: true,
    },
    {
      feature: 'Cost Optimization AI',
      vito: true,
      spreadsheets: false,
      legacyERP: false,
      genericAI: false,
      inHouse: false,
    },
    {
      feature: 'API & Integrations',
      vito: true,
      spreadsheets: false,
      legacyERP: true,
      genericAI: true,
      inHouse: false,
    },
    {
      feature: 'Enterprise SSO & Audit',
      vito: true,
      spreadsheets: false,
      legacyERP: true,
      genericAI: false,
      inHouse: false,
    },
    {
      feature: 'Domain-Specific AI',
      vito: true,
      spreadsheets: false,
      legacyERP: false,
      genericAI: false,
      inHouse: false,
    },
    {
      feature: 'Setup Time',
      vito: '2 days',
      spreadsheets: '0 days',
      legacyERP: '6-12 months',
      genericAI: '0 days',
      inHouse: '12-18 months',
    },
  ],
}
