import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Hero } from '../../components/landing/Hero';
import { TrustedCompanies } from '../../components/landing/TrustedCompanies';
import { FeatureCards } from '../../components/landing/FeatureCards';
import { MaterialPassportSection } from '../../components/landing/MaterialPassportSection';
import { WorkflowSection } from '../../components/landing/WorkflowSection';
import { IndustriesSection } from '../../components/landing/IndustriesSection';
import { StatisticsSection } from '../../components/landing/StatisticsSection';
import { TestimonialsSection } from '../../components/landing/TestimonialsSection';
import { PricingSection } from '../../components/landing/PricingSection';
import { FAQSection } from '../../components/landing/FAQSection';

export const Landing: React.FC = () => {
  const handleStartDemo = () => {
    const element = document.getElementById('platform');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWatchDemo = () => {
    const element = document.getElementById('casestudies');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0f172a] flex flex-col selection:bg-[#316bf3]/20">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section with Headline & Illustration */}
        <Hero onStartDemo={handleStartDemo} onWatchDemo={handleWatchDemo} />

        {/* Trusted Logos Cloud */}
        <TrustedCompanies />

        {/* Feature Cards Grid */}
        <FeatureCards />

        {/* Digital Material Passport Deep-Dive */}
        <MaterialPassportSection />

        {/* Circular Lifecycle Steps Pipeline */}
        <WorkflowSection />

        {/* Industry Cards */}
        <IndustriesSection />

        {/* Enterprise Statistics Banner */}
        <StatisticsSection />

        {/* Customer Testimonials Quote */}
        <TestimonialsSection />

        {/* Pricing Tiers Preview */}
        <PricingSection />

        {/* FAQ Accordion & Impact Metrics */}
        <FAQSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
