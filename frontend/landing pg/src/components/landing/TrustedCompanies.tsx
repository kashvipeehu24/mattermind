import React from 'react';
import { trustedCompanies } from '../../data/mockData';

export const TrustedCompanies: React.FC = () => {
  return (
    <section className="py-16 border-y border-[#e2e8f0] bg-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-10">
          Trusted by Global Manufacturing Leaders
        </p>

        <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-16 md:gap-24 opacity-60 hover:opacity-100 transition-opacity duration-300">
          {trustedCompanies.map((company) => (
            <span
              key={company}
              className="text-2xl sm:text-3xl font-black italic tracking-tighter text-slate-700 hover:text-[#316bf3] transition-colors cursor-default select-none"
            >
              {company}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
