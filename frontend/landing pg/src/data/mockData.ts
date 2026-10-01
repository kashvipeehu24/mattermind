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
  DigitalPassportData,
  MaterialItem,
  AIAlert,
  ActivityLog,
  SustainabilityMetric,
  CompatibilityPair
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

export const MOCK_MATERIALS: MaterialItem[] = [
  {
    id: 'mat-001',
    code: 'Ti-6Al-4V-ELI',
    name: 'Titanium Grade 23 (Extra Low Interstitial)',
    category: 'Aerospace Alloy',
    composition: 'Ti 90%, Al 6%, V 4%, Fe 0.25%, O 0.13%',
    healthIndex: 96.4,
    remainingUsefulLifeYears: 18.5,
    compatibilityScore: 94,
    passportStatus: 'compliant',
    passportId: 'DPP-EU-2026-88192',
    blockchainHash: '0x7f8a92b3c4d5e6f1a2b3c4d5e6f7a8b9c0d1e2f3',
    blockchainVerified: true,
    carbonSavingsKg: 1420,
    recyclabilityGrade: 'A+',
    supplier: 'ThyssenKrupp Aerospace Corp',
    batchNo: 'TK-8820-2026A',
    location: 'Munich Cleanroom Vault 4',
    lastTestedDate: '2026-07-22',
    alertLevel: 'optimal',
    status: 'Active Spec',
    densityGcm3: 4.43,
    tensileStrengthMpa: 860,
    thermalConductivity: 6.7,
    embodiedCarbonKgCo2: 12.4,
    notes: 'Approved for Boeing 787 turbine housing blades and high-stress cryogenic valves.'
  },
  {
    id: 'mat-002',
    code: 'Inconel-718-AM',
    name: 'Additive Nickel Superalloy 718',
    category: 'Aerospace Alloy',
    composition: 'Ni 52.5%, Cr 19%, Fe 18%, Nb 5.1%, Mo 3.0%',
    healthIndex: 88.2,
    remainingUsefulLifeYears: 12.3,
    compatibilityScore: 89,
    passportStatus: 'certified',
    passportId: 'DPP-EU-2026-90211',
    blockchainHash: '0x3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b',
    blockchainVerified: true,
    carbonSavingsKg: 980,
    recyclabilityGrade: 'A',
    supplier: 'VDM Metals Precision Solutions',
    batchNo: 'VDM-718-9902',
    location: 'Hamburg Advanced Metallurgy Hub',
    lastTestedDate: '2026-07-20',
    alertLevel: 'optimal',
    status: 'Active Spec',
    densityGcm3: 8.19,
    tensileStrengthMpa: 1375,
    thermalConductivity: 11.4,
    embodiedCarbonKgCo2: 18.2,
    notes: 'Laser powder bed fusion verified. Micro-grain alignment validated via CT X-Ray.'
  },
  {
    id: 'mat-003',
    code: 'HEA-CoCrFeNiMo',
    name: 'Cantor High-Entropy Alloy Spec-4',
    category: 'High-Entropy Metal',
    composition: 'Co 20%, Cr 20%, Fe 20%, Ni 20%, Mo 20%',
    healthIndex: 74.8,
    remainingUsefulLifeYears: 8.7,
    compatibilityScore: 82,
    passportStatus: 'in_review',
    passportId: 'DPP-EU-2026-44012',
    blockchainHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    blockchainVerified: false,
    carbonSavingsKg: 2150,
    recyclabilityGrade: 'B',
    supplier: 'GKN Powder Metallurgy',
    batchNo: 'GKN-HEA-0041',
    location: 'Stuttgart R&D Pilot Line',
    lastTestedDate: '2026-07-23',
    alertLevel: 'warning',
    status: 'Testing Phase',
    densityGcm3: 8.05,
    tensileStrengthMpa: 1120,
    thermalConductivity: 14.2,
    embodiedCarbonKgCo2: 15.8,
    notes: 'AI detected minor lattice dislocation under 600°C thermal cycles. Re-testing required.'
  },
  {
    id: 'mat-004',
    code: 'CFRP-Toray-T1100G',
    name: 'Recycled Poly-Acrylonitrile Carbon Matrix',
    category: 'Carbon Fiber Composite',
    composition: 'Torayca T1100G Fiber 65%, Epoxy Resin Matrix 35%',
    healthIndex: 98.1,
    remainingUsefulLifeYears: 24.0,
    compatibilityScore: 97,
    passportStatus: 'compliant',
    passportId: 'DPP-EU-2026-11823',
    blockchainHash: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e',
    blockchainVerified: true,
    carbonSavingsKg: 3840,
    recyclabilityGrade: 'A+',
    supplier: 'Toray Composite Materials Europe',
    batchNo: 'TRY-CF-7712',
    location: 'Toulouse Composite Assembly Plant',
    lastTestedDate: '2026-07-21',
    alertLevel: 'optimal',
    status: 'Active Spec',
    densityGcm3: 1.58,
    tensileStrengthMpa: 3020,
    thermalConductivity: 4.8,
    embodiedCarbonKgCo2: 6.2,
    notes: 'Zero void fraction confirmed. 64% CO2 reduction compared to virgin carbon fiber.'
  },
  {
    id: 'mat-005',
    code: 'UHTC-ZrB2-SiC',
    name: 'Zirconium Diboride - Silicon Carbide Composite',
    category: 'Ultra-Ceramic',
    composition: 'ZrB2 80%, SiC 20%',
    healthIndex: 61.3,
    remainingUsefulLifeYears: 4.2,
    compatibilityScore: 68,
    passportStatus: 'non_compliant',
    passportId: 'DPP-EU-2026-00912',
    blockchainHash: '0x8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b',
    blockchainVerified: false,
    carbonSavingsKg: 420,
    recyclabilityGrade: 'D',
    supplier: 'Kyocera Advanced Ceramics',
    batchNo: 'KYO-CER-4091',
    location: 'Zurich High-Temp Testing Lab',
    lastTestedDate: '2026-07-24',
    alertLevel: 'critical',
    status: 'Quarantined',
    densityGcm3: 5.52,
    tensileStrengthMpa: 480,
    thermalConductivity: 62.0,
    embodiedCarbonKgCo2: 24.1,
    notes: 'Quarantined due to micro-cracking at 2200°C hypersonic atmospheric re-entry conditions.'
  },
  {
    id: 'mat-006',
    code: 'Bio-PLA-PEEK-Hy',
    name: 'Bio-Sourced PEEK Hybrid Polymer',
    category: 'Bio-Polymer',
    composition: 'Bio-derived PEEK 75%, Nanocellulose Fillers 25%',
    healthIndex: 92.0,
    remainingUsefulLifeYears: 15.0,
    compatibilityScore: 91,
    passportStatus: 'compliant',
    passportId: 'DPP-EU-2026-77301',
    blockchainHash: '0x5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c',
    blockchainVerified: true,
    carbonSavingsKg: 2890,
    recyclabilityGrade: 'A+',
    supplier: 'Evonik Industries AG',
    batchNo: 'EVK-BIO-9022',
    location: 'Essen Polymer Research Facility',
    lastTestedDate: '2026-07-19',
    alertLevel: 'optimal',
    status: 'Active Spec',
    densityGcm3: 1.31,
    tensileStrengthMpa: 110,
    thermalConductivity: 0.25,
    embodiedCarbonKgCo2: 3.1,
    notes: '100% circular economy bio-content certified under ISCC PLUS standard.'
  },
  {
    id: 'mat-007',
    code: 'Si-Wafer-300mm-EUV',
    name: 'Quantum Silicon Single Crystal 300mm Substrate',
    category: 'Semiconductor Silicon',
    composition: 'Pure Si 99.9999999% (9N Purity)',
    healthIndex: 99.5,
    remainingUsefulLifeYears: 30.0,
    compatibilityScore: 99,
    passportStatus: 'certified',
    passportId: 'DPP-EU-2026-55421',
    blockchainHash: '0x4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a',
    blockchainVerified: true,
    carbonSavingsKg: 1850,
    recyclabilityGrade: 'A',
    supplier: 'Shin-Etsu Handotai Europe',
    batchNo: 'SEH-SI-3001',
    location: 'Dresden Silicon Wafer Fab 2',
    lastTestedDate: '2026-07-23',
    alertLevel: 'optimal',
    status: 'Active Spec',
    densityGcm3: 2.33,
    tensileStrengthMpa: 7000,
    thermalConductivity: 149.0,
    embodiedCarbonKgCo2: 8.7,
    notes: 'Dislocation density <0.01 cm⁻². Optimized for 2nm gate-all-around sub-nanometer chips.'
  },
  {
    id: 'mat-008',
    code: 'Al-Si10Mg-DieCast',
    name: 'Recycled Automotive Aluminum Silicide',
    category: 'Aerospace Alloy',
    composition: 'Al 89%, Si 10%, Mg 0.45%, Fe 0.15%',
    healthIndex: 84.5,
    remainingUsefulLifeYears: 10.2,
    compatibilityScore: 86,
    passportStatus: 'in_review',
    passportId: 'DPP-EU-2026-33920',
    blockchainHash: '0x2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d',
    blockchainVerified: true,
    carbonSavingsKg: 4210,
    recyclabilityGrade: 'A+',
    supplier: 'Hydro Aluminium AS',
    batchNo: 'HYD-AL-6610',
    location: 'Oslo Recycled Metal Foundry',
    lastTestedDate: '2026-07-18',
    alertLevel: 'info',
    status: 'Active Spec',
    densityGcm3: 2.67,
    tensileStrengthMpa: 350,
    thermalConductivity: 130.0,
    embodiedCarbonKgCo2: 2.8,
    notes: 'Produced using 100% hydro-electric power with 92% post-consumer recycled content.'
  }
];

export const MOCK_ALERTS: AIAlert[] = [
  {
    id: 'alt-101',
    title: 'Micro-Fracture Anomaly Detected',
    description: 'AI Acoustic Emission analysis identified localized lattice shear in UHTC ZrB2-SiC under hypersonic thermal stress exceeding 2,150°C.',
    materialId: 'mat-005',
    materialName: 'Zirconium Diboride - Silicon Carbide Composite',
    severity: 'critical',
    timestamp: '14 minutes ago',
    status: 'unresolved',
    category: 'Micro-Fracture Risk',
    actionRecommendation: 'Quarantine Batch KYO-CER-4091 and route to Zurich Synchrotron CT scanning for micro-void mapping.'
  },
  {
    id: 'alt-102',
    title: 'Thermal Cycles Fatigue Deviation',
    description: 'Cantor High-Entropy Alloy exhibits 4.2% faster yield strength decay during rapid thermal shock testing (20°C to 600°C).',
    materialId: 'mat-003',
    materialName: 'Cantor High-Entropy Alloy Spec-4',
    severity: 'warning',
    timestamp: '1 hour ago',
    status: 'investigating',
    category: 'Thermal Degradation',
    actionRecommendation: 'Adjust additive sintering furnace hold time by +12 minutes and re-evaluate grain boundary stabilization.'
  },
  {
    id: 'alt-103',
    title: 'EU DPP Verification Pending Audit',
    description: 'Supplier origin certificate for Al-Si10Mg-DieCast batch HYD-AL-6610 requires secondary validation for Scope 3 emissions.',
    materialId: 'mat-008',
    materialName: 'Recycled Automotive Aluminum Silicide',
    severity: 'info',
    timestamp: '3 hours ago',
    status: 'unresolved',
    category: 'EU DPP Non-Compliance',
    actionRecommendation: 'Request automated ISO 14040 Lifecycle Assessment verification document from Hydro Aluminium AS.'
  },
  {
    id: 'alt-104',
    title: 'Optimal Lifecycle Milestone Reached',
    description: 'Toray T1100G Carbon Fiber composite achieved 24-year zero-degradation benchmark across 10,000 simulated flight cycles.',
    materialId: 'mat-004',
    materialName: 'Recycled Poly-Acrylonitrile Carbon Matrix',
    severity: 'optimal',
    timestamp: '5 hours ago',
    status: 'resolved',
    category: 'Stress Fatigue',
    actionRecommendation: 'Issue Certificate of Material Excellence and promote batch to Tier-1 Flight Critical Specification.'
  }
];

export const MOCK_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act-001',
    timestamp: '2026-07-24 06:42 UTC',
    user: 'Dr. Helena Vance',
    role: 'Chief Material Scientist',
    action: 'Triggered Synchrotron CT Micro-Structural Audit',
    targetMaterial: 'Titanium Grade 23 (Ti-6Al-4V)',
    status: 'Verified',
    hash: '0x8f2a...91e4'
  },
  {
    id: 'act-002',
    timestamp: '2026-07-24 05:15 UTC',
    user: 'AI Engine (MatterMind-v4.8)',
    role: 'Automated Neural Intelligence',
    action: 'Updated Remaining Useful Life (RUL) Prognosis',
    targetMaterial: 'Inconel-718-AM Superalloy',
    status: 'Success',
    hash: '0x3c2b...5c4b'
  },
  {
    id: 'act-003',
    timestamp: '2026-07-24 03:30 UTC',
    user: 'Marcus Thorne',
    role: 'EU Compliance Auditor',
    action: 'Validated Digital Product Passport (DPP-EU-2026-11823)',
    targetMaterial: 'Toray T1100G CFRP Matrix',
    status: 'Verified',
    hash: '0x9f8e...1f0e'
  },
  {
    id: 'act-004',
    timestamp: '2026-07-24 03:30 UTC',
    user: 'Automated Blockchain Validator',
    role: 'Consensus Ledger Node',
    action: 'Recorded Supply Chain Cryptographic Block #4,910,229',
    targetMaterial: 'Bio-Sourced PEEK Hybrid Polymer',
    status: 'Success',
    hash: '0x5d4c...7d6c'
  },
  {
    id: 'act-005',
    timestamp: '2026-07-23 18:05 UTC',
    user: 'Dr. Aris Thorne',
    role: 'R&D Director - Metallurgy',
    action: 'Placed Batch KYO-CER-4091 into Safety Isolation',
    targetMaterial: 'Zirconium Diboride - SiC Ultra-Ceramic',
    status: 'Audit Flagged',
    hash: '0x8a7b...0a9b'
  }
];

export const MOCK_SUSTAINABILITY: SustainabilityMetric[] = [
  {
    id: 'sust-01',
    title: 'Total CO₂e Carbon Savings',
    value: '17,810 Metric Tons',
    change: '+18.4% YoY',
    isPositive: true,
    subtitle: 'Calculated against legacy virgin raw material baselines across 82 R&D projects.',
    iconName: 'eco'
  },
  {
    id: 'sust-02',
    title: 'Circular Material Rate',
    value: '84.6%',
    change: '+6.2% vs target',
    isPositive: true,
    subtitle: 'Percentage of alloy and composite batches sourced from certified circular feedstocks.',
    iconName: 'autorenew'
  },
  {
    id: 'sust-03',
    title: 'EU Digital Passport Compliance',
    value: '92.5%',
    change: 'On Track',
    isPositive: true,
    subtitle: '7 out of 8 core enterprise materials fully registered with cryptographically signed DPPs.',
    iconName: 'verified'
  },
  {
    id: 'sust-04',
    title: 'Hazardous Waste Index',
    value: '0.04 kg / ton',
    change: '-32.1% Reduction',
    isPositive: true,
    subtitle: 'Reduced toxic chemical byproduct generation via AI bio-solvent substitution.',
    iconName: 'clean_hands'
  }
];

export const MOCK_COMPATIBILITY_PAIRS: CompatibilityPair[] = [
  {
    id: 'comp-01',
    baseMaterial: 'Titanium Grade 23 (Ti-6Al-4V)',
    targetMaterial: 'Toray T1100G Carbon Fiber Composite',
    compatibilityScore: 98,
    chemicalCompatibility: 99,
    thermalExpansionMatch: 97,
    galvanicCorrosionRisk: 'Low',
    recommendedInterface: 'Anodized Ti oxide layer + epoxy barrier film',
    verdict: 'Optimal Combination'
  },
  {
    id: 'comp-02',
    baseMaterial: 'Inconel-718-AM Nickel Superalloy',
    targetMaterial: 'Zirconium Diboride - SiC Ultra-Ceramic',
    compatibilityScore: 71,
    chemicalCompatibility: 75,
    thermalExpansionMatch: 64,
    galvanicCorrosionRisk: 'Moderate',
    recommendedInterface: 'Platinum-aluminide braze transition joint (0.5mm)',
    verdict: 'Conditional Use'
  },
  {
    id: 'comp-03',
    baseMaterial: 'Recycled Aluminum Silicide (Al-Si10Mg)',
    targetMaterial: 'Cantor High-Entropy Alloy Spec-4',
    compatibilityScore: 48,
    chemicalCompatibility: 52,
    thermalExpansionMatch: 42,
    galvanicCorrosionRisk: 'Severe',
    recommendedInterface: 'Not Recommended (Intermetallic brittleness risk)',
    verdict: 'High Risk'
  },
  {
    id: 'comp-04',
    baseMaterial: 'Bio-Sourced PEEK Hybrid Polymer',
    targetMaterial: 'Quantum Silicon Wafer Substrate',
    compatibilityScore: 92,
    chemicalCompatibility: 95,
    thermalExpansionMatch: 89,
    galvanicCorrosionRisk: 'Low',
    recommendedInterface: 'Plasma activated zero-outgas elastomer interface',
    verdict: 'Optimal Combination'
  }
];

export const MOCK_CHART_DEGRADATION = [
  { cycle: '0 Hrs', ti64: 100, inconel: 100, hea: 100, uhtc: 100 },
  { cycle: '2,500 Hrs', ti64: 99.2, inconel: 98.5, hea: 95.1, uhtc: 88.0 },
  { cycle: '5,000 Hrs', ti64: 98.5, inconel: 96.8, hea: 90.2, uhtc: 78.4 },
  { cycle: '7,500 Hrs', ti64: 97.8, inconel: 94.2, hea: 84.8, uhtc: 69.1 },
  { cycle: '10,000 Hrs', ti64: 96.4, inconel: 88.2, hea: 74.8, uhtc: 61.3 },
];

export const MOCK_CHART_CATEGORIES = [
  { name: 'Aerospace Alloy', count: 3, percentage: 37.5, fill: '#316bf3' },
  { name: 'Carbon Fiber', count: 1, percentage: 12.5, fill: '#10b981' },
  { name: 'High-Entropy Metal', count: 1, percentage: 12.5, fill: '#f59e0b' },
  { name: 'Bio-Polymer', count: 1, percentage: 12.5, fill: '#8b5cf6' },
  { name: 'Semiconductor Si', count: 1, percentage: 12.5, fill: '#06b6d4' },
  { name: 'Ultra-Ceramic', count: 1, percentage: 12.5, fill: '#f43f5e' },
];

export const MOCK_CHART_COMPATIBILITY_DISTRIBUTION = [
  { range: '90-100% Optimal', count: 4, fill: '#10b981' },
  { range: '80-89% Certified', count: 2, fill: '#316bf3' },
  { range: '70-79% Conditional', count: 1, fill: '#f59e0b' },
  { range: '<70% High Risk', count: 1, fill: '#f43f5e' },
];

export const MOCK_CHART_CARBON_TREND = [
  { month: 'Jan', savings: 1120, target: 1000 },
  { month: 'Feb', savings: 1280, target: 1100 },
  { month: 'Mar', savings: 1450, target: 1200 },
  { month: 'Apr', savings: 1390, target: 1300 },
  { month: 'May', savings: 1620, target: 1400 },
  { month: 'Jun', savings: 1780, target: 1500 },
  { month: 'Jul', savings: 1950, target: 1600 }
];

