import React from 'react';
import { PlayCircle } from 'lucide-react';
import { Button } from '../ui/Button';

export interface CTAButtonsProps {
  onStartDemo?: () => void;
  onWatchDemo?: () => void;
  className?: string;
}

export const CTAButtons: React.FC<CTAButtonsProps> = ({
  onStartDemo,
  onWatchDemo,
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      <Button
        variant="primary"
        size="lg"
        onClick={onStartDemo}
        className="shadow-xl shadow-slate-900/10"
      >
        Start Free Demo
      </Button>
      <button
        type="button"
        onClick={onWatchDemo}
        className="flex items-center gap-2.5 bg-white border border-[#e2e8f0] px-8 py-4 rounded-full font-bold text-base md:text-lg text-[#0f172a] hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
      >
        <PlayCircle className="w-5 h-5 text-[#316bf3]" />
        Watch Platform Demo
      </button>
    </div>
  );
};
