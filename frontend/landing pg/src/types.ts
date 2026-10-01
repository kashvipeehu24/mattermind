export interface NavItem {
  label: string;
  href: string;
}

export interface FeatureCardData {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface WorkflowStep {
  stepNumber: string;
  title: string;
  description: string;
  isHighlighted?: boolean;
}

export interface IndustryCard {
  id: string;
  name: string;
  iconName: string;
}

export interface StatisticItem {
  id: string;
  value: string;
  label: string;
}

export interface ImpactMetric {
  id: string;
  value: string;
  label: string;
}

export interface TestimonialData {
  quote: string;
  authorName: string;
  authorRole: string;
  company: string;
  rating: number;
}

export interface PricingTier {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  pricePeriod?: string;
  features: string[];
  isRecommended?: boolean;
  buttonText: string;
  buttonVariant: 'primary' | 'secondary' | 'outline';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface DigitalPassportData {
  materialId: string;
  materialType: string;
  manufacturer: string;
  materialHealth: number;
  remainingLife: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  compatibilityScore: number;
  aiConfidence: number;
  carbonSavedKg: string;
}

export type AlertSeverity = 'critical' | 'warning' | 'info' | 'optimal';
export type PassportStatus = 'compliant' | 'certified' | 'in_review' | 'non_compliant';

export interface MaterialItem {
  id: string;
  code: string;
  name: string;
  category: string;
  composition: string;
  healthIndex: number;
  remainingUsefulLifeYears: number;
  compatibilityScore: number;
  passportStatus: PassportStatus;
  passportId: string;
  blockchainHash: string;
  blockchainVerified: boolean;
  carbonSavingsKg: number;
  recyclabilityGrade: string;
  supplier: string;
  batchNo: string;
  location: string;
  lastTestedDate: string;
  alertLevel: AlertSeverity;
  status: string;
  densityGcm3: number;
  tensileStrengthMpa: number;
  thermalConductivity: number;
  embodiedCarbonKgCo2: number;
  notes: string;
}

export interface AIAlert {
  id: string;
  title: string;
  description: string;
  materialId: string;
  materialName: string;
  severity: 'critical' | 'warning' | 'info' | 'optimal';
  timestamp: string;
  status: 'unresolved' | 'investigating' | 'resolved';
  category: string;
  actionRecommendation: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  targetMaterial: string;
  status: string;
  hash: string;
}

export interface SustainabilityMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtitle: string;
  iconName: string;
}

export interface CompatibilityPair {
  id: string;
  baseMaterial: string;
  targetMaterial: string;
  compatibilityScore: number;
  chemicalCompatibility: number;
  thermalExpansionMatch: number;
  galvanicCorrosionRisk: 'Low' | 'Moderate' | 'Severe';
  recommendedInterface: string;
  verdict: 'Optimal Combination' | 'Conditional Use' | 'High Risk';
}

