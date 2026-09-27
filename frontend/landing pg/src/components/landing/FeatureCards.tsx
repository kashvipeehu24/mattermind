import React from 'react';
import {
  BarChart3,
  Timer,
  BadgeCheck,
  Wallet,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { featureCardsData } from '../../data/mockData';
import { Card } from '../ui/Card';

export const FeatureCards: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'BarChart3':
        return <BarChart3 className="w-6 h-6" />;
      case 'Timer':
        return <Timer className="w-6 h-6" />;
      case 'BadgeCheck':
        return <BadgeCheck className="w-6 h-6" />;
      case 'Wallet':
        return <Wallet className="w-6 h-6" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-6 h-6" />;
      case 'RefreshCw':
        return <RefreshCw className="w-6 h-6" />;
      default:
        return <BarChart3 className="w-6 h-6" />;
    }
  };

  return (
    <section id="platform" className="py-24 px-6 md:px-10 bg-[#f8fafc]">
      <div className="max-w-[1440px] mx-auto">
        <div className="max-w-3xl mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-[#0f172a] mb-6 tracking-tight">
            Industrial AI Capabilities
          </h2>
          <p className="text-lg md:text-xl text-[#45464d] leading-relaxed">
            Moving beyond predictive maintenance to autonomous material intelligence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureCardsData.map((feature) => (
            <Card key={feature.id} className="group cursor-pointer">
              <div className="w-12 h-12 bg-[#316bf3]/10 rounded-xl flex items-center justify-center text-[#316bf3] mb-6 group-hover:bg-[#316bf3] group-hover:text-white transition-all duration-300">
                {getIcon(feature.iconName)}
              </div>
              <h3 className="text-xl font-bold text-[#0f172a] mb-3 group-hover:text-[#316bf3] transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-[#45464d] leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
