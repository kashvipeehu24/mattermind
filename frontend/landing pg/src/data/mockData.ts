import {
  FeatureCardData,
  WorkflowStep,
  IndustryCard,
  StatisticItem,
  ImpactMetric,
  TestimonialData,
  PricingTier,
  FAQItem,
  NavItem,
  DigitalPassportData
} from '../types';

export const navItems: NavItem[] = [
  { label: 'Platform', href: '#platform' },
  { label: 'Industries', href: '#industries' },
  { label: 'Governance', href: '#governance' },
  { label: 'Case Studies', href: '#casestudies' },
];

export const trustedCompanies = [
  'AEROVANT',
  'STEELCORE',
  'VOLT-X',
  'TITAN.MFG',
  'NEOCIRCLE',
];

export const featureCardsData: FeatureCardData[] = [
  {
    id: 'compatibility',
    title: 'Material Compatibility AI',
    description: 'Predict chemical and structural compatibility across diverse material batches.',
    iconName: 'BarChart3'
  },
  {
    id: 'life-prediction',
    title: 'Remaining Useful Life Prediction',
    description: 'Advanced fatigue modeling to determine exact material expiration dates.',
    iconName: 'Timer'
  },
  {
    id: 'passport',
    title: 'Material Passport',
    description: 'Digital identity for every component, tracking provenance and health.',
    iconName: 'BadgeCheck'
  },
  {
    id: 'blockchain',
    title: 'Blockchain Traceability',
    description: 'Immutable ledger for cross-enterprise verification and compliance.',
    iconName: 'Wallet'
  },
  {
    id: 'risk',
    title: 'Risk Prediction',
    description: 'Identify supply chain and material failure risks before they occur.',
    iconName: 'AlertTriangle'
  },
  {
    id: 'circularity',
    title: 'Circular Manufacturing Intelligence',
    description: 'Optimize reuse and recycling pathways for end-of-life assets.',
    iconName: 'RefreshCw'
  }
];

export const workflowSteps: WorkflowStep[] = [
  {
    stepNumber: '01',
    title: 'Physical',
    description: 'Raw material extraction & IoT tagging'
  },
  {
    stepNumber: '02',
    title: 'Digital',
    description: 'Passport creation & ledger entry'
  },
  {
    stepNumber: '03',
    title: 'AI',
    description: 'Predictive modeling & optimization',
    isHighlighted: true
  },
  {
    stepNumber: '04',
    title: 'Circular',
    description: 'Reuse, recovery & reporting'
  }
];

export const industryCards: IndustryCard[] = [
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    iconName: 'Cpu'
  },
  {
    id: 'construction',
    name: 'Construction',
    iconName: 'Building2'
  },
  {
    id: 'automotive',
    name: 'Automotive',
    iconName: 'Car'
  },
  {
    id: 'aerospace',
    name: 'Aerospace',
    iconName: 'Rocket'
  },
  {
    id: 'recycling',
    name: 'Recycling',
    iconName: 'Recycle'
  }
];

export const statisticsData: StatisticItem[] = [
  {
    id: 'tracked',
    value: '$42B',
    label: 'Materials Tracked'
  },
  {
    id: 'passports',
    value: '300k',
    label: 'Digital Passports'
  },
  {
    id: 'reduction',
    value: '24%',
    label: 'Waste Reduction'
  },
  {
    id: 'compliance',
    value: '99.9%',
    label: 'Audit Compliance'
  }
];

export const impactMetrics: ImpactMetric[] = [
  {
    id: 'accuracy',
    value: '99.9%',
    label: 'Prediction Accuracy'
  },
  {
    id: 'waste',
    value: '34%',
    label: 'Waste Reduction'
  },
  {
    id: 'reuse',
    value: '42%',
    label: 'Material Reuse'
  },
  {
    id: 'verification',
    value: '100%',
    label: 'Blockchain Verification'
  }
];

export const testimonialData: TestimonialData = {
  quote: '"MatterMind has completely transformed how we handle material certifications. What used to take our compliance team 40 hours a week is now automated and verified in real-time. It\'s the infrastructure for the next industrial revolution."',
  authorName: 'Marcus Thorne',
  authorRole: 'Chief Operations Officer',
  company: 'AeroSteel Group',
  rating: 5
};

export const pricingTiers: PricingTier[] = [
  {
    id: 'pro',
    name: 'Professional',
    subtitle: 'For single manufacturing facilities.',
    price: '$2,400',
    pricePeriod: '/mo',
    features: [
      'Up to 5,000 Material Passports',
      'Standard AI Simulations',
      '12-month Data Retention'
    ],
    buttonText: 'Get Started',
    buttonVariant: 'outline'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    subtitle: 'For global supply chains.',
    price: 'Custom',
    pricePeriod: ' Quote',
    features: [
      'Unlimited Material Passports',
      'Priority Compute Access',
      'Full Blockchain Node Access',
      'Dedicated Support Engineer'
    ],
    isRecommended: true,
    buttonText: 'Contact Sales',
    buttonVariant: 'primary'
  }
];

export const faqItems: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How does blockchain integration work?',
    answer: 'We use a permissioned enterprise blockchain (Hyperledger Fabric) to store material state changes. This ensures data cannot be retroactively modified, providing an audit trail that is acceptable for EU Battery Passport and other global regulations.'
  },
  {
    id: 'faq-2',
    question: 'Can it integrate with our existing ERP?',
    answer: 'Yes, MatterMind features an API-first architecture with pre-built connectors for SAP, Oracle, and Microsoft Dynamics 365, allowing for seamless data ingestion without replacing your core systems.'
  },
  {
    id: 'faq-3',
    question: 'What material types are currently supported?',
    answer: 'MatterMind natively supports metallic alloys, aerospace composites, rare earths, polymers, and construction minerals, with custom fatigue curves configurable for proprietary materials.'
  },
  {
    id: 'faq-4',
    question: 'How is data security and IP privacy maintained across supply chain partners?',
    answer: 'Zero-knowledge proofs (ZKPs) and localized encryption allow enterprises to verify material authenticity and ESG scores without exposing proprietary chemical formulas or supplier pricing.'
  }
];

export const passportMock: DigitalPassportData = {
  materialId: 'MT-9842-XQ',
  materialType: 'Titanium Alloy',
  manufacturer: 'AeroSteel Group',
  materialHealth: 98,
  remainingLife: '24 Months',
  riskLevel: 'Low',
  compatibilityScore: 98.4,
  aiConfidence: 99.2,
  carbonSavedKg: '1.2M kg'
};
