import React from 'react';
import { faqItems, impactMetrics } from '../../data/mockData';
import { Accordion } from '../ui/Accordion';

export const FAQSection: React.FC = () => {
  return (
    <div id="governance">
      {/* FAQ Accordion Section */}
      <section className="py-24 px-6 md:px-10 bg-[#f8fafc] border-t border-slate-100">
        <div className="max-w-[1440px] mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-black text-[#0f172a] mb-12 text-center tracking-tight">
            Frequently Asked Questions
          </h2>
          <Accordion items={faqItems} defaultOpenId="faq-1" />
        </div>
      </section>

      {/* Secondary Impact Metrics Bar */}
      <section className="py-20 md:py-24 px-6 md:px-10 bg-[#f8fafc] border-t border-[#e2e8f0]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {impactMetrics.map((metric) => (
            <div key={metric.id}>
              <div className="text-4xl md:text-5xl font-black text-[#0f172a] mb-2 tracking-tight">
                {metric.value}
              </div>
              <div className="text-xs uppercase tracking-widest text-[#45464d] font-bold">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
