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
