import React from 'react';
import { Cpu, Building2, Car, Rocket, Recycle, ArrowRight } from 'lucide-react';
import { industryCards } from '../../data/mockData';

export const IndustriesSection: React.FC = () => {
  const getIndustryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-8 h-8 mb-6 text-[#316bf3] group-hover:text-white transition-colors" />;
      case 'Building2':
        return <Building2 className="w-8 h-8 mb-6 text-[#316bf3] group-hover:text-white transition-colors" />;
      case 'Car':
        return <Car className="w-8 h-8 mb-6 text-[#316bf3] group-hover:text-white transition-colors" />;
      case 'Rocket':
        return <Rocket className="w-8 h-8 mb-6 text-[#316bf3] group-hover:text-white transition-colors" />;
      case 'Recycle':
        return <Recycle className="w-8 h-8 mb-6 text-[#316bf3] group-hover:text-white transition-colors" />;
      default:
        return <Cpu className="w-8 h-8 mb-6 text-[#316bf3] group-hover:text-white transition-colors" />;
    }
  };

  return (
    <section id="industries" className="py-24 px-6 md:px-10 bg-white border-b border-slate-100">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-[#0f172a] tracking-tight">
            Built for High-Stakes Industries
          </h2>
          <a
            href="#all-sectors"
            className="text-[#316bf3] font-bold text-base hover:underline flex items-center gap-1.5 shrink-0"
          >
            View all sectors <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
          {industryCards.map((industry) => (
            <div
              key={industry.id}
              className="p-8 border border-[#e2e8f0] rounded-3xl hover:bg-[#0f172a] hover:text-white hover:border-[#0f172a] hover:shadow-2xl transition-all duration-300 cursor-pointer group"
            >
              {getIndustryIcon(industry.iconName)}
              <h3 className="text-lg font-bold text-[#0f172a] group-hover:text-white transition-colors">
                {industry.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
