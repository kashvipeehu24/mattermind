import React from 'react';
import { statisticsData } from '../../data/mockData';

export const StatisticsSection: React.FC = () => {
  return (
    <section className="py-20 md:py-24 px-6 md:px-10 bg-[#0f172a] text-white">
      <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
        {statisticsData.map((stat) => (
          <div key={stat.id} className="space-y-2">
            <div className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
