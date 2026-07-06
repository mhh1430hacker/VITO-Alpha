export interface DemoStep {
  title: string
  instruction: string
}

export interface DemoScenario {
  id: string
  title: string
  description: string
  targetRoute: string
  expectedAction: string
  steps: DemoStep[]
}

export const demosScenarios: DemoScenario[] = [
  {
    id: 'scenario-1',
    title: 'AI-Powered Formulation',
    description: 'See how AI accelerates fragrance formulation from brief to compliance-ready formula',
    targetRoute: '/formulation-studio',
    expectedAction: 'AI generates a complete formula based on a brief',
    steps: [
      { title: 'Open Formula Studio', instruction: 'Navigate to the Formula Studio' },
      { title: 'Start with a brief', instruction: 'Click "Generate from brief" in the AI panel' },
      { title: 'AI generates formula', instruction: 'Watch as VITO AI creates a complete formula' },
      { title: 'Review and refine', instruction: 'Explore the AI suggestions and apply improvements' },
      { title: 'Compliance check', instruction: 'Verify IFRA compliance is automatically validated' },
    ],
  },
  {
    id: 'scenario-2',
    title: 'Real-Time Compliance',
    description: 'Experience instant IFRA compliance checking as you formulate',
    targetRoute: '/formulation-studio',
    expectedAction: 'AI flags IFRA restrictions in real-time',
    steps: [
      { title: 'Open a formulation', instruction: 'Navigate to an existing formula in the studio' },
      { title: 'Add a restricted material', instruction: 'Try adding a material that exceeds IFRA limits' },
      { title: 'Watch the alert', instruction: 'See VITO instantly flag the compliance issue' },
      { title: 'Get alternatives', instruction: 'Review AI-suggested compliant alternatives' },
    ],
  },
  {
    id: 'scenario-3',
    title: 'Team Collaboration',
    description: 'See how your team can work together on formulations in real-time',
    targetRoute: '/formulation-studio',
    expectedAction: 'Multiple users collaborate on the same formula',
    steps: [
      { title: 'Open shared formula', instruction: 'Navigate to a formula that is in review' },
      { title: 'View comments', instruction: 'See team feedback and suggestions on the formula' },
      { title: 'Make a revision', instruction: 'Apply a suggested change from a team member' },
      { title: 'Submit for approval', instruction: 'Send the updated formula for final review' },
    ],
  },
  {
    id: 'scenario-4',
    title: 'Business Intelligence',
    description: 'Executive dashboard showing real-time business and AI metrics',
    targetRoute: '/dashboard/executive',
    expectedAction: 'View comprehensive business analytics',
    steps: [
      { title: 'Open Executive Dashboard', instruction: 'Navigate to the executive dashboard' },
      { title: 'Review KPIs', instruction: 'Scan key metrics: ARR, MRR, customers, accuracy' },
      { title: 'Explore revenue chart', instruction: 'Hover over data points to see monthly breakdown' },
      { title: 'View model health', instruction: 'Check AI model performance and latency stats' },
      { title: 'Review activities', instruction: 'See the latest team activity feed' },
    ],
  },
  {
    id: 'scenario-5',
    title: 'Enterprise Readiness',
    description: 'Security, compliance, and enterprise features for global deployment',
    targetRoute: '/settings',
    expectedAction: 'Explore enterprise configuration options',
    steps: [
      { title: 'Open Settings', instruction: 'Navigate to the settings page' },
      { title: 'View security', instruction: 'Review SSO, MFA, and audit log configurations' },
      { title: 'View compliance', instruction: 'See IFRA, REACH, and CLP compliance tools' },
      { title: 'View team management', instruction: 'Explore role-based access controls' },
    ],
  },
]
