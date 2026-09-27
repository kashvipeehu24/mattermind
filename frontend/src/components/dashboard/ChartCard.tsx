import React from 'react';
import { Download, Sparkles, SlidersHorizontal, RefreshCw } from 'lucide-react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  badgeText?: string;
  actionButtonText?: string;
  onAction?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  badgeText,
  actionButtonText = 'Export Data',
  onAction,
  children,
  className = ''
}) => {
  return (
    <div className={`p-5 bg-white border border-slate-200 rounded-xl shadow-2xs flex flex-col justify-between ${className}`}>
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            {badgeText && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                <Sparkles className="w-2.5 h-2.5" />
                {badgeText}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onAction && (
            <button
              onClick={onAction}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>{actionButtonText}</span>
            </button>
          )}
        </div>
      </div>

      {/* Chart Content Area */}
      <div className="w-full flex-1 min-h-[220px]">
        {children}
      </div>
    </div>
  );
};
