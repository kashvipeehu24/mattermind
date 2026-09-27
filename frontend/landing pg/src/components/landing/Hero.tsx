import React from 'react';
import { Badge } from '../ui/Badge';
import { CTAButtons } from './CTAButtons';
import { HeroIllustration } from './HeroIllustration';

export interface HeroProps {
  onStartDemo?: () => void;
  onWatchDemo?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartDemo, onWatchDemo }) => {
  return (
    <section className="hero-radial-bg pt-36 md:pt-40 pb-20 md:pb-24 px-6 md:px-10 overflow-hidden bg-gradient-to-b from-slate-50/80 to-white border-b border-slate-100">
      <div className="max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Column: Headline & Action */}
        <div className="relative z-10">
          <Badge variant="secondary" dot className="mb-6">
            Version 4.0 Now Live
          </Badge>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.98] text-[#0f172a] mb-8">
            Every Material <br className="hidden sm:inline" />
            Has a Story. <br />
            <span className="text-[#316bf3]">MatterMind</span> <br className="hidden sm:inline" />
            Makes It Intelligent.
          </h1>

          <p className="text-lg md:text-xl text-[#45464d] leading-relaxed max-w-xl mb-10">
            Track every industrial material throughout its lifecycle using AI, Blockchain, and Digital Material Passports. Predict compatibility, remaining useful life, and reuse potential before costly failures occur.
          </p>

          <CTAButtons onStartDemo={onStartDemo} onWatchDemo={onWatchDemo} />
        </div>

        {/* Right Column: Hero Graphic Illustration */}
        <div className="relative pt-6 lg:pt-0">
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
};
