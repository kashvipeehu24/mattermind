import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { pricingTiers } from '../../data/mockData';
import { Button } from '../ui/Button';

export const PricingSection: React.FC = () => {
  return (
    <section className="py-24 px-6 md:px-10 bg-white border-t border-slate-100">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-[#0f172a] mb-4 tracking-tight">
            Enterprise Grade Tiers
          </h2>
          <p className="text-lg md:text-xl text-[#45464d]">
            Predictable pricing for global organizations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingTiers.map((tier) => {
            const isRecommended = tier.isRecommended;
            return (
              <div
                key={tier.id}
                className={`p-8 sm:p-10 rounded-3xl transition-all duration-300 relative flex flex-col justify-between ${
                  isRecommended
                    ? 'bg-[#0f172a] text-white shadow-2xl scale-[1.02]'
                    : 'bg-white text-[#0f172a] border border-[#e2e8f0] hover:border-[#316bf3]'
                }`}
              >
                {isRecommended && (
                  <div className="absolute top-6 right-6 bg-[#316bf3] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                    Recommended
                  </div>
                )}

                <div>
                  <h3 className={`text-2xl font-bold mb-2 ${isRecommended ? 'text-white' : 'text-[#0f172a]'}`}>
                    {tier.name}
                  </h3>
                  <p className={`text-sm mb-6 ${isRecommended ? 'text-slate-400' : 'text-[#45464d]'}`}>
                    {tier.subtitle}
                  </p>

                  <div className="text-4xl sm:text-5xl font-black mb-8 tracking-tight">
                    {tier.price}
                    {tier.pricePeriod && (
                      <span className={`text-lg font-medium ${isRecommended ? 'text-slate-400' : 'text-slate-400'}`}>
                        {tier.pricePeriod}
                      </span>
                    )}
                  </div>

                  <ul className="space-y-4 mb-10">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm md:text-base font-medium">
                        <CheckCircle2
                          className={`w-5 h-5 shrink-0 ${
                            isRecommended ? 'text-[#316bf3]' : 'text-emerald-500'
                          }`}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant={tier.buttonVariant === 'primary' ? 'blue' : 'outline'}
                  size="lg"
                  className="w-full text-center"
                >
                  {tier.buttonText}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
