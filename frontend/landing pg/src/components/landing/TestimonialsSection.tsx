import React from 'react';
import { Star, Quote } from 'lucide-react';
import { testimonialData } from '../../data/mockData';

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="casestudies" className="py-24 px-6 md:px-10 bg-white">
      <div className="max-w-[1440px] mx-auto">
        <div className="bg-[#f8fafc] rounded-[40px] md:rounded-[48px] p-8 sm:p-12 md:p-20 relative overflow-hidden border border-[#e2e8f0]">
          {/* Subtle Quote Background Decor */}
          <Quote className="w-32 h-32 md:w-48 md:h-48 text-slate-200/60 absolute -top-8 -right-8 pointer-events-none select-none" />

          <div className="max-w-3xl relative z-10">
            {/* Rating Stars */}
            <div className="flex items-center gap-1 mb-8">
              {[...Array(testimonialData.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-6 h-6 fill-[#316bf3] text-[#316bf3]"
                />
              ))}
            </div>

            {/* Testimonial Quote */}
            <p className="text-2xl sm:text-3xl md:text-4xl font-medium text-[#0f172a] leading-relaxed mb-10 tracking-tight">
              {testimonialData.quote}
            </p>

            {/* Author Profile */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-300 flex items-center justify-center text-slate-700 font-bold text-xl shrink-0 border-2 border-white shadow-sm">
                MT
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold text-[#0f172a]">
                  {testimonialData.authorName}
                </div>
                <div className="text-sm sm:text-base text-[#45464d]">
                  {testimonialData.authorRole}, {testimonialData.company}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
