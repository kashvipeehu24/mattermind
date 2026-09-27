import React from 'react';
import { workflowSteps } from '../../data/mockData';

export const WorkflowSection: React.FC = () => {
  return (
    <section className="py-24 px-6 md:px-10 bg-[#f8fafc] border-b border-slate-100">
      <div className="max-w-[1440px] mx-auto text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-[#0f172a] mb-4 tracking-tight">
          Circular Intelligence Lifecycle
        </h2>
        <p className="text-[#45464d] text-lg md:text-xl">
          A standard for modern industrial operations.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative">
        {workflowSteps.map((step, index) => {
          const isHighlight = step.isHighlighted;
          return (
            <div
              key={step.stepNumber}
              className={`relative text-center group ${
                index < workflowSteps.length - 1 ? 'step-line' : ''
              }`}
            >
              {/* Circle Badge */}
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 z-10 relative ${
                  isHighlight
                    ? 'bg-[#316bf3] text-white shadow-lg shadow-blue-500/20 scale-105'
                    : 'bg-white border border-[#e2e8f0] text-slate-400 group-hover:border-[#316bf3] group-hover:text-[#316bf3]'
                }`}
              >
                <span className="text-xl font-black">{step.stepNumber}</span>
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-bold text-[#0f172a] mb-2">
                {step.title}
              </h3>
              <p className="text-xs text-[#45464d] px-2 leading-relaxed">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
